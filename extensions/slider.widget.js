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
        
        // If the communication is on serial port, the event name is the serial port name,
        // otherwise it is 'message'
        if (currentSettings.type == "serialcom") {
        	// Get the name of serial port (on Linux based OS, take the name after the last /)
        	event = (currentSettings.host).split("/").pop();
        }
        else {
        	event = 'mesage';
        }

		function discardSocket() {
			// Disconnect datasource websocket
			if (socket) {
				socket.disconnect();
			}
		}
		
		function connectToServer() {
            if (currentSettings.type == "serialcom") {
            	// Connect to the local server
				var host = "http://127.0.0.1:9091/";
            }
            else {
            	// Connect to the network host
            	var host = currentSettings.host;
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
 		        
        function createSlider(mysettings) {
            if (!rendered) {
                return;
            }
            
            connectToServer();
            
            sliderElement.empty();
        
            slider = document.getElementById('slider-' + thissliderID);
			noUiSlider.create(slider, {
				start: [ (_.isUndefined(mysettings.initialvalue) ? 0 : mysettings.initialvalue) ],
				step: 1,
				range: {
					'min': [ (_.isUndefined(mysettings.min) ? -10 * Math.pow(10, parseInt(mysettings.resolution)) : mysettings.min * Math.pow(10, parseInt(mysettings.resolution))) ],
					'max': [ (_.isUndefined(mysettings.max) ? 10 * Math.pow(10, parseInt(mysettings.resolution)) : mysettings.max * Math.pow(10, parseInt(mysettings.resolution))) ]
				},
				pips: {
					mode: 'positions',
					values: [0,25,50,75,100],
					density: 4,
					stepped: true,
					format: wNumb({
					decimals: mysettings.resolution,
					encoder: 	function( value ){
									return value / Math.pow(10, parseInt(mysettings.resolution));
							}
					})
				},
				format: wNumb({
				decimals: mysettings.resolution,
				encoder: 	function( value ){
								return value / Math.pow(10, parseInt(mysettings.resolution));
							},
				decoder: 	function( value ){
								return value * Math.pow(10, parseInt(mysettings.resolution));
							}
				})
			});
			var sliderPips = document.getElementById('slider-pips-' + thissliderID);
			var sliderInput = document.getElementById('slider-input-' + thissliderID);
			var sliderReset = document.getElementById('slider-reset-' + thissliderID);
			sliderReset.innerHTML = mysettings.resetcaption;
			
			sliderReset.addEventListener('click', function(){
				slider.noUiSlider.set([(_.isUndefined(mysettings.resetvalue) ? 0 : mysettings.resetvalue)]);
			});
			
			slider.noUiSlider.on('update', function( values, handle ) {
				sliderInput.value = values[handle];
				sliderValue = values[handle];
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
            if (newSettings.host != currentSettings.host) {
                discardSocket();
                connectToServer();
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
            
	        if (newSettings.type != currentSettings.type) {
		        if (newSettings.type == "serialcom") {
		        	// Get the name of serial port (on Linux based OS, take the name after the last /)
		        	event = (newSettings.host).split("/").pop();
		        }
		        else {
		        	event = 'mesage';
		        }
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
        display_name: "Slider",
		description : "A Slider widget for serial or socket communications.",
		external_scripts: [
			"extensions/thirdparty/nouislider.min.js",
			"extensions/thirdparty/wNumb.min.js",
			"extensions/thirdparty/socket.io-1.3.5.js"
		],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
			{
				name: "type",
				display_name: "COMMUNICATION TYPE",
                type: "option",
                options: [
                    {
                        name: "Serial",
                        value: "serialcom"
                    },
                    {
                        name: "Socket",
                        value: "socketcom"
                    }
                ]
			},
			{
				name: "host",
				display_name: "HOST",
				type: "text",
				required : true,
				description: "Serial port or network host. <br />" +
					"If serial port, you *must* create first a datasource with the same port. <br />" +
					"If network host, include ws:// or http:// ,...)."
			},
            {
                name: "variable",
                display_name: "Variable",
                type: "calculated",
            },
            {
                name: "formula",
                display_name: "Formula",
                type: "text",
                description: 'The value rreally sent will be computed from the slider value. <br />' +
                	'Use "x" as slider value'
            },
            {
                name: "initialvalue",
                display_name: "Initial value",
                type: "number",
                default_value: 0
            },
            {
                name: "min",
                display_name: "Min",
                type: "number",
                default_value: -10
            },
            {
                name: "max",
                display_name: "Max",
                type: "number",
                default_value: 10
            },
            {
                name: "resolution",
                display_name: "Number of decimals",
                type: "number",
                default_value: 2
            },
            {
                name: "resetvalue",
                display_name: "Reset value",
                type: "number",
                default_value: 0
            },
            {
                name: "resetcaption",
                display_name: "Caption on reset button",
                type: "text",
                default_value: "Reset"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new sliderWidget(settings));
        }
    });
    
}());

