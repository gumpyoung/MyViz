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
        // var socket;
        // var event;

		// function discardSocket() {
			// // Disconnect datasource websocket
			// if (socket) {
				// socket.disconnect();
			// }
		// }
// 		
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
	        	// // Type = socket
	        	// event = 'message';
	        	// var host = "http://127.0.0.1:9092/";
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
        		// sendData();
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
			// Send message to socket
			toSend = {};
			toSend[currentSettings.variable] = $( "#select-" + thisselectID ).val();
			//socket.emit(event, JSON.stringify(toSend));
			sessionStorage.setItem(currentSettings.variable, toSend[currentSettings.variable]);
 		};
 		        
        function createSelect(mySettings) {
            if (!rendered) {
                return;
            }

	        //connectToServer(mySettings);
	        
	        //selectElement.empty();
	        
	        arrayCaptions = mySettings.listcaptions.split(",");
	        arrayValues = mySettings.listvalues.split(",");
		
			selectElementStr = '';
			for (var i=0; i<Math.min(arrayCaptions.length, arrayValues.length); i++) {
				selectElementStr += '<option value="' + arrayValues[i]  + '">' + arrayCaptions[i] + '</option>';
			}
            document.getElementById('select-' + thisselectID).innerHTML = selectElementStr;
        
        	// Send data at the creation...
        	sendData();
        	// ... and on changes
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
            // if (newSettings.datasourcename != currentSettings.datasourcename) {
                // discardSocket();
                // connectToServer(newSettings);
            // }

            if (newSettings.listcaptions != currentSettings.listcaptions 
            	|| newSettings.listvalues != currentSettings.listvalues) {
                createSelect(newSettings);
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
			//socket.close();
        };

        this.getHeight = function () {
            return 1;
        };

        this.onSettingsChanged(settings);
        
    };

    freeboard.loadWidgetPlugin({
        type_name: "select",
        display_name: _t("Select"),
		// "external_scripts": [
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
                name: "listcaptions",
                display_name: _t("List of captions"),
                type: "text",
				"required" : true,
                description: _t("Use the comma as separator")
            },
            {
                name: "listvalues",
                display_name: _t("List of values"),
                type: "text",
				"required" : true,
                description: _t("Use the comma as separator")
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new selectWidget(settings));
        }
    });
    
}());

