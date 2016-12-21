window.colorwheelID = 0;
(function() {    
    var ColorwheelWidget = function (settings) {
        var self = this;
        var thiscolorwheelID = window.colorwheelID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var ColorwheelElement = $('<div id="colorwheel-' + thiscolorwheelID + '" style="width:90%; margin-left:auto; margin-right:auto"></div>');

        var rendered = false;

		var colorwheel;
		var colorwheelValue = "";
        var currentSettings = settings;
        var socket;
        var event;

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
			toSend = {};
			toSend[currentSettings.variableRGB] = colorwheelValue;
			socket.emit(event, JSON.stringify(toSend));
		}

        function createColorwheel(mySettings) {
            if (!rendered) {
                return;
            }

            connectToServer(mySettings);
            
            ColorwheelElement.empty();
        	
        	// Create colorwheel
            colorwheel = document.getElementById('colorwheel-' + thiscolorwheelID);
            
			var cw = Raphael.colorwheel(colorwheel, 140, 200);
			cw.color("#" + mySettings.initialvalue);
				
			function start() {
				//console.log("Debut drag");
			};
			function stop() {
				//console.log("Fin drag");
				sendData();
  			};
			
			cw.ondrag(start, stop);
			
			cw.onchange(function(color)
				{
					colorwheelValue = color.hex;
					//console.log(colorwheelValue);
					sendData(colorwheelValue);
				}
			);
            
			
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(ColorwheelElement);
            createColorwheel(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.datasourcename != currentSettings.datasourcename) {
                discardSocket();
                connectToServer(newSettings);
            }
            
			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
        };

        this.onDispose = function () {
			socket.close();
        };

        this.getHeight = function () {
            return 3;
        };

        this.onSettingsChanged(settings);
        
        
    };

    freeboard.loadWidgetPlugin({
        type_name: "colorwheel",
        display_name: "Color Wheel",
		external_scripts: [
			"extensions/thirdparty/raphael.2.1.0.min.js",
			"extensions/thirdparty/colorwheel.js",
			"extensions/thirdparty/socket.io-1.3.5.js"
		],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
			{
				name: "datasourcename",
				display_name: _t("Datasource"),
                type: "text",
				description: _t("You *must* create first a datasource with the same name")
			},
            {
                name: "variableRGB",
                display_name: _t("Variable"),
                type: "calculated",
				description: _t("Variable correspondant à la couleur (en hexadécimal)")
            },
            {
                name: "initialvalue",
                display_name: _t("Valeur initiale de la couleur"),
                type: "text"
            },
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new ColorwheelWidget(settings));
        }
    });
    
}());

