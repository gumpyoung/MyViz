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
 		
        function createSwitchButton(mySettings) {
            if (!rendered) {
                return;
            }
            
            connectToServer(mySettings);
            
            //switchbuttonElement.empty();
        	var checkedStr = '';
        	if (mySettings.initialstate) {
        		checkedStr = 'checked="checked"';
        	}

			var switchbuttonElementStr = '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="' + thisswitchbuttonID + '-onoff" ' + checkedStr + '><label class="onoffswitch-label" for="' + thisswitchbuttonID + '-onoff"><div class="onoffswitch-inner"><span class="on">' + mySettings.yestext + '</span><span class="off">' + mySettings.notext + '</span></div><div class="onoffswitch-switch"></div></label>';
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
            if (newSettings.datasourcename != currentSettings.datasourcename) {
                discardSocket();
                connectToServer(newSettings);
            }

            if ((newSettings.yestext != currentSettings.yestext)
            	|| (newSettings.notext != currentSettings.notext)) {
                createSwitchButton(newSettings);
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
        display_name: _t("Switch button"),
		description : _t("A Switchbutton widget for serial or socket communications."),
		external_scripts: [
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
                name: "yestext",
                display_name: _t('"YES" text'),
                type: "text",
                default_value: "YES",
                description: _t("Corresponding numeric value is 1")
            },
            {
                name: "notext",
                display_name: _t('"NO" text'),
                type: "text",
                default_value: "NO",
                description: _t("Corresponding numeric value is 0")
            },
            {
                name: "initialstate",
                display_name: _t("Initial state"),
                type: "boolean",
                default_value: true
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new switchbuttonWidget(settings));
        }
    });
    
}());

