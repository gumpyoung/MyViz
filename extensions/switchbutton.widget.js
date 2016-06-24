window.switchbuttonID = 0;
(function() {    
    var switchbuttonWidget = function (settings) {
        var thisswitchbuttonID = window.switchbuttonID++;
        var titleElement = $('<h2 class="section-title" style="padding-bottom:7px;"></h2>');
        var switchbuttonElement = $('<div id="switchbutton-' + thisswitchbuttonID + '" class="onoffswitch"></div>');

        var switchbuttonObject;
        var rendered = false;

		var switchbutton;
        var currentSettings = settings;
        var socket;
        var event;
        
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
				sendData();
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
			if (($( "#" + thisswitchbuttonID + "-onoff" )).prop("checked")) {
				toSend[currentSettings.variable] = 1;
			}
			else {
				toSend[currentSettings.variable] = 0;
			}
			socket.emit(event, JSON.stringify(toSend));
 		};
 		
        function createSwitchButton(mysettings) {
            if (!rendered) {
                return;
            }
            
            connectToServer();
            
            //switchbuttonElement.empty();
        	var checkedStr = '';
        	if (mysettings.initialstate) {
        		checkedStr = 'checked="checked"';
        	}

			var switchbuttonElementStr = '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="' + thisswitchbuttonID + '-onoff" ' + checkedStr + '><label class="onoffswitch-label" for="' + thisswitchbuttonID + '-onoff"><div class="onoffswitch-inner"><span class="on">' + mysettings.yestext + '</span><span class="off">' + mysettings.notext + '</span></div><div class="onoffswitch-switch"></div></label>';
            document.getElementById('switchbutton-' + thisswitchbuttonID).innerHTML = switchbuttonElementStr;
            
			$( "#" + thisswitchbuttonID + "-onoff" ).change(function() {
				sendData();
			});
			/*var input = $('<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="' + thisswitchbuttonID + '-onoff">').prependTo(switchbuttonElement).change(function() {
				newSettings.settings[thisswitchbuttonID] = this.checked;
			});*/
	
			/*if (thisswitchbuttonID in currentSettingsValues) {
				input.prop("checked", currentSettingsValues[thisswitchbuttonID]);
			}*/
							        
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(switchbuttonElement);
            createSwitchButton(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.host != currentSettings.host) {
                discardSocket();
                connectToServer();
            }

            if ((newSettings.yestext != currentSettings.yestext)
            	|| (newSettings.notext != currentSettings.notext)) {
                createSwitchButton(newSettings);
            }
            
	        if (newSettings.type != currentSettings.type) {
		        if (newSettings.type == "serialcom") {
		        	// Get the name of serial port (on Linux based OS, take the name after the last /)
		        	event = (newSettings.host).split("/").pop();
		        }
		        else {
		        	event = 'message';
		        }
	        }

			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (!_.isUndefined(switchbuttonObject)) {
			    $( "#switchbutton_value-" + thisswitchbuttonID ).html( newValue/Math.pow(10, parseInt(currentSettings.resolution)) );
            }
        };

        this.onDispose = function () {
			socket.close();
        };

        this.getHeight = function () {
            return 1;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "switchbutton",
        display_name: "Switch button",
		description : "A Switchbutton widget for serial or socket communications.",
		external_scripts: [
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
                name: "yestext",
                display_name: '"YES" text',
                type: "text",
                default_value: "YES",
                description: "Corresponding numeric value is 1"
            },
            {
                name: "notext",
                display_name: '"NO" text',
                type: "text",
                default_value: "NO",
                description: "Corresponding numeric value is 0"
            },
            {
                name: "initialstate",
                display_name: "Initial state",
                type: "boolean",
                default_value: true
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new switchbuttonWidget(settings));
        }
    });
    
}());

