window.selectID = 0;
(function() {    
    var selectWidget = function (settings) {
        var thisselectID = window.selectID++;
        var titleElement = $('<h2 class="section-title" style="padding-bottom:7px;"></h2>');
        var selectElement = $('<div id="divselect-' + thisselectID + '"><select id="select-' + thisselectID + '"></select></div>');

        var selectObject;
        var rendered = false;

		var select;
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
			toSend[currentSettings.variable] = $( "#select-" + thisselectID ).val();
			socket.emit(event, JSON.stringify(toSend));
 		};
 		        
        function createSelect(mysettings) {
            if (!rendered) {
                return;
            }

	        connectToServer();
	        
	        //selectElement.empty();
	        
	        arrayCaptions = mysettings.listcaptions.split(",");
	        arrayValues = mysettings.listvalues.split(",");
		
			selectElementStr = '';
			for (var i=0; i<Math.min(arrayCaptions.length, arrayValues.length); i++) {
				selectElementStr += '<option value="' + arrayValues[i]  + '">' + arrayCaptions[i] + '</option>';
			}
            document.getElementById('select-' + thisselectID).innerHTML = selectElementStr;
        
			$( "#select-" + thisselectID ).change(function() {
				sendData();
			});
		}

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(selectElement);
            createSelect(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.host != currentSettings.host) {
                discardSocket();
                connectToServer();
            }

            if (newSettings.listcaptions != currentSettings.listcaptions 
            	|| newSettings.listvalues != currentSettings.listvalues) {
                createSelect(newSettings);
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
            titleElement.html(newSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (!_.isUndefined(selectObject)) {
			    $( "#select_value-" + thisselectID ).html( newValue/Math.pow(10, parseInt(currentSettings.resolution)) );
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
        type_name: "select",
        display_name: "Select",
		"external_scripts": [
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
                name: "listcaptions",
                display_name: "List of captions",
                type: "text",
				"required" : true,
                description: "Use the comma as separator"
            },
            {
                name: "listvalues",
                display_name: "List of values",
                type: "text",
				"required" : true,
                description: "Use the comma as separator"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new selectWidget(settings));
        }
    });
    
}());

