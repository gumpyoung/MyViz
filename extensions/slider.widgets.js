window.sliderID = 0;
(function() {    
    var sliderWidget = function (settings) {
        var thissliderID = window.sliderID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var sliderElement = $('<br /><div id="slider-' + thissliderID + '" style="width:90%; margin-left:auto; margin-right:auto"></div>' +
        	'<input id="slider-input-' + thissliderID + '" style="margin-top:45px; width:100px"></input>' + 
        	'<button id="slider-reset-' + thissliderID + '" style="margin-top:45px; margin-left:5px;"></button>');

        var sliderObject;
        var rendered = false;

		var slider;
        var currentSettings = settings;
        var socket;
        var event;
        var sliderValue = currentSettings.resetvalue;
        
		function discardSocket() {
			// Disconnect datasource websocket
			if (socket) {
				socket.disconnect();
			}
		}
		
		function connectToServer(mySettings) {
	        // If the communication is on serial port, the event name is the serial port name,
	        // otherwise it is 'message'
	        
        	// Get the type (serial port or socket) and the settings
        	var hostDatasourceType = freeboard.getDatasourceType(mySettings.datasourcename);
        	var hostDatasourceSettings = freeboard.getDatasourceSettings(mySettings.datasourcename);
	        	
	        if (hostDatasourceType == "serialport") {
	        	// Get the name of serial port (on Linux based OS, take the name after the last /)
	        	event = (hostDatasourceSettings.port).split("/").pop();
	        	var host = "http://127.0.0.1:9091/";
	        }
	        else if (hostDatasourceType == "websocket") {
	        	// Type = socket
	        	event = 'message';
	        	var host = "http://127.0.0.1:9092/";
	        }
	        else {
	        	alert(_t("Datasource type not supported by this widget"));
	        }
	        
            socket = io.connect(host,{'forceNew':true});
	        			
			// Events
			socket.on('connect', function() {
				console.info("Connecting to server at: %s", host);
			});
			
			socket.on('connect_error', function(object) {
				console.error("It was not possible to connect to server at: %s", host);
			});
			
			socket.on('reconnect_error', function(object) {
				console.error("Still was not possible to re-connect to server at: %s", host);
			});
			
			socket.on('reconnect_failed', function(object) {
				console.error("Re-connection to server failed at: %s", host);
				discardSocket();
			});
			
		}

 		function sendData() {
			// Send message to socket
			toSend = {};
			var formula = (_.isUndefined(currentSettings.formula) ? "x" : currentSettings.formula);
			toSend[currentSettings.variable] = eval(formula.replace("x", sliderValue));
			socket.emit(event, JSON.stringify(toSend));
 		};
 		        
        function createSlider(mySettings) {
            if (!rendered) {
                return;
            }
            
            connectToServer(mySettings);
            
            sliderElement.empty();
        
            slider = document.getElementById('slider-' + thissliderID);
			noUiSlider.create(slider, {
				start: [ (_.isUndefined(mySettings.initialvalue) ? 0 : mySettings.initialvalue) ],
				step: 1,
				range: {
					'min': [ (_.isUndefined(mySettings.min) ? -10 * Math.pow(10, parseInt(mySettings.resolution)) : mySettings.min * Math.pow(10, parseInt(mySettings.resolution))) ],
					'max': [ (_.isUndefined(mySettings.max) ? 10 * Math.pow(10, parseInt(mySettings.resolution)) : mySettings.max * Math.pow(10, parseInt(mySettings.resolution))) ]
				},
				pips: {
					mode: 'positions',
					values: [0,25,50,75,100],
					density: 4,
					stepped: true,
					format: wNumb({
					decimals: mySettings.resolution,
					encoder: 	function( value ){
									return value / Math.pow(10, parseInt(mySettings.resolution));
							}
					})
				},
				format: wNumb({
				decimals: mySettings.resolution,
				encoder: 	function( value ){
								return value / Math.pow(10, parseInt(mySettings.resolution));
							},
				decoder: 	function( value ){
								return value * Math.pow(10, parseInt(mySettings.resolution));
							}
				})
			});
			var sliderPips = document.getElementById('slider-pips-' + thissliderID);
			var sliderInput = document.getElementById('slider-input-' + thissliderID);
			var sliderReset = document.getElementById('slider-reset-' + thissliderID);
			sliderReset.innerHTML = mySettings.resetcaption;
			
			sliderReset.addEventListener('click', function(){
				slider.noUiSlider.set([(_.isUndefined(mySettings.resetvalue) ? 0 : mySettings.resetvalue)]);
			});
			
			slider.noUiSlider.on('update', function( values, handle ) {
				var value = (Number(values[handle])).toFixed(currentSettings.resolution);
				sliderInput.value = value;
				sliderValue = value;
				sendData();
			});
			
			sliderInput.addEventListener('change', function(){
				slider.noUiSlider.set(this.value);
			});
	        
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(sliderElement);
            createSlider(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.datasourcename != currentSettings.datasourcename) {
                discardSocket();
                connectToServer(newSettings);
            }

            if (newSettings.initialvalue != currentSettings.initialvalue 
            	|| newSettings.min != currentSettings.min 
            	|| newSettings.max != currentSettings.max 
            	|| newSettings.resolution != currentSettings.resolution 
            	|| newSettings.resetcaption != currentSettings.resetcaption 
            	|| newSettings.resetvalue != currentSettings.resetvalue) {
            		
                
                if (!_.isUndefined(slider)) {
                	slider.noUiSlider.destroy();
                }
                createSlider(newSettings);
            }
            
			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (!_.isUndefined(sliderObject)) {
			    $( "#slider_value-" + thissliderID ).html( newValue/Math.pow(10, parseInt(currentSettings.resolution)) );
            }
        };

        this.onDispose = function () {
			socket.close();
        };

        this.getHeight = function () {
            return 2;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "slider",
        display_name: _t("Slider"),
		description : _t("A Slider widget for serial or socket communications."),
		external_scripts: [
			"extensions/thirdparty/nouislider.min.js",
			"extensions/thirdparty/wNumb.min.js",
			"extensions/thirdparty/socket.io-1.3.5.js"
		],
        settings: [
            {
                name: "title",
                display_name: _t("Title"),
                type: "text"
            },
			{
				name: "datasourcename",
				display_name: _t("Datasource"),
                type: "text",
				description: _t("You *must* create first a datasource with the same name")
			},
            {
                name: "variable",
                display_name: _t("Variable"),
                type: "calculated",
            },
            {
                name: "formula",
                display_name: _t("Formula"),
                type: "text",
                description: _t('The value really sent will be computed from the slider value. <br />Use "x" as slider value')
            },
            {
                name: "initialvalue",
                display_name: _t("Initial value"),
                type: "number",
                default_value: 0
            },
            {
                name: "min",
                display_name: _t("Min"),
                type: "number",
                default_value: -10
            },
            {
                name: "max",
                display_name: _t("Max"),
                type: "number",
                default_value: 10
            },
            {
                name: "resolution",
                display_name: _t("Number of decimals"),
                type: "number",
                default_value: 2
            },
            {
                name: "resetvalue",
                display_name: _t("Reset value"),
                type: "number",
                default_value: 0
            },
            {
                name: "resetcaption",
                display_name: _t("Caption on reset button"),
                type: "text",
                default_value: _t("Reset")
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new sliderWidget(settings));
        }
    });
    
}());

