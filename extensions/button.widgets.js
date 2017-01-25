window.buttonID = 0;
(function() {    
    var buttonWidget = function (settings) {
        var thisbuttonID = window.buttonID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var buttonElement = $('<br /><button id="button-' + thisbuttonID + '" class="btn-class"></button>');

        var buttonObject;
        var rendered = false;

		var button;
        var currentSettings = settings;
        // var socket;
        // var event;
        var buttonValue = currentSettings.offvalue;
        
		// function discardSocket() {
			// // Disconnect datasource websocket
			// if (socket) {
				// socket.disconnect();
			// }
		// }
		
		// function connectToServer(mySettings) {
	        // // If the communication is on serial port, the event name is the serial port name,
	        // // otherwise it is 'message'
// 	        
        	// // Get the type (serial port or socket) and the settings
        	// var hostDatasourceType = freeboard.getDatasourceType(mySettings.datasourcename);
        	// var hostDatasourceSettings = freeboard.getDatasourceSettings(mySettings.datasourcename);
// 	        	
	        // if (hostDatasourceType == "serialport") {
	        	// // Get the name of serial port (on Linux based OS, take the name after the last /)
	        	// event = (hostDatasourceSettings.port).split("/").pop();
	        	// var host = "http://127.0.0.1:9091/";
	        // }
	        // else if (hostDatasourceType == "websocket") {
	        	// event = 'message';
	        	// var host = "http://127.0.0.1:9092/";
	        // }
	        // else if (hostDatasourceType == "pahomqtt") {
	        	// event = 'message';
	        	// var host = "http://127.0.0.1:9093/";
	        // }
	        // else {
	        	// alert(_t("Datasource type not supported by this widget"));
	        // }
// 	        
            // socket = io.connect(host,{'forceNew':true});
// 	        			
			// // Events
			// socket.on('connect', function() {
				// console.info("Connecting to server at: %s", host);
			// });
// 			
			// socket.on('connect_error', function(object) {
				// console.error("It was not possible to connect to server at: %s", host);
			// });
// 			
			// socket.on('reconnect_error', function(object) {
				// console.error("Still was not possible to re-connect to server at: %s", host);
			// });
// 			
			// socket.on('reconnect_failed', function(object) {
				// console.error("Re-connection to server failed at: %s", host);
				// discardSocket();
			// });
// 			
		// }

 		function sendData() {
			// Store message in session storage
			toSend = {};
			toSend[currentSettings.variable] = buttonValue;
			//socket.emit(event, JSON.stringify(toSend));
			sessionStorage.setItem(currentSettings.variable, toSend[currentSettings.variable]);
 		};
 		        
        function createButton(mySettings) {
            if (!rendered) {
                return;
            }
            
            //connectToServer(mySettings);
            
            buttonElement.empty();
        
            button = document.getElementById('button-' + thisbuttonID);
            
			button.innerHTML = mySettings.caption;
			
			// Send data at the creation,...
			buttonValue = (_.isUndefined(mySettings.offvalue) ? 0 : mySettings.offvalue);
			sendData();
			// ...at mousedown events,...
			button.addEventListener('mousedown', function(){
				buttonValue = (_.isUndefined(mySettings.onvalue) ? 1 : mySettings.onvalue);
				sendData();
			});
			// ... and at mouseup events
			button.addEventListener('mouseup', function(){
				buttonValue = (_.isUndefined(mySettings.offvalue) ? 0 : mySettings.offvalue);
				sendData();
			});
			
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(buttonElement);
            createButton(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            // if (newSettings.datasourcename != currentSettings.datasourcename) {
                // discardSocket();
                // connectToServer(newSettings);
            // }

            if (newSettings.initialvalue != currentSettings.initialvalue 
            	|| newSettings.onvalue != currentSettings.onvalue 
            	|| newSettings.offvalue != currentSettings.offvalue 
            	|| newSettings.caption != currentSettings.caption) {
            		
                
                if (!_.isUndefined(button)) {
                	button.noUiButton.destroy();
                }
                createButton(newSettings);
            }
            
			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
        };

        this.onDispose = function () {
			//socket.close();
        };

        this.getHeight = function () {
            return 1;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "button",
        display_name: _t("Button"),
		description : _t("A Button widget for serial or socket communications."),
		// external_scripts: [
			// "extensions/thirdparty/socket.io-1.3.5.js"
		// ],
        settings: [
            {
                name: "title",
                display_name: _t("Title"),
                type: "text"
            },
			// {
				// name: "datasourcename",
				// display_name: _t("Datasource"),
                // type: "text",
				// description: _t("You *must* create first a datasource with the same name")
			// },
            {
                name: "variable",
                display_name: _t("Variable"),
                type: "calculated",
            },
            {
                name: "offvalue",
                display_name: _t("Off value"),
                type: "number",
                default_value: 0
            },
            {
                name: "onvalue",
                display_name: _t("On value"),
                type: "number",
                default_value: 1
            },
            {
                name: "caption",
                display_name: _t("Caption on button"),
                type: "text",
                default_value: _t("Switch on")
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new buttonWidget(settings));
        }
    });
    
}());

