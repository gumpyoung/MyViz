(function () {
	var dataObj = {};
	var websocketDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;
		var ws;
		var newMessageCallback;
		var refreshInterval;
		var lastSentTime = 0;
		var currentTime = new Date();
		        
		var listVariablesToSend = (_.isUndefined(currentSettings.variables_to_send) ? "" : currentSettings.variables_to_send).split(",");
		// Object with keys from list of variables to send, each value is 0
		var newDataToSend = _.object(listVariablesToSend, _.range(listVariablesToSend.length).map(function () { return 0; }));
		
		// Will receive message from control widget through socket.io
        var socket;
        var event = "message";
        var io = require('socket.io')(9091);
        
 		function sendData(data) {
        	// Send data
			if (ws.readyState === 1) {
				ws.send(JSON.stringify(data));
			}
		}
		
		io.on('connection', function (socket) {
			console.log("Websocket internal socket connected");
			
			socket.on(event, function (msg) {
				// Extract variable name from, for example,
				// currentSettings.value = [datasources["datasourcename"]["variablename1"], datasources["datasourcename"]["variablename2"]]
				var variableName = (_.keys(JSON.parse(msg))[0]).split('"')[3];
				var currentObj = {};
				currentObj[variableName] = _.values(JSON.parse(msg))[0];
			
				// Merge messages to send using jQuery
				$.extend(dataObj, currentObj);
				
				// When data arrives (from a slider, for example), send it
				// "immediately" (not faster than every 100 ms)
				currentTime = new Date();
				if ((currentTime - lastSentTime) > 100) {
					lastSentTime = currentTime;
					sendData(dataObj);
				}
			});
			
			socket.on('disconnect', function () {
				console.log("Websocket internal socket disconnected");
			});
			socket.on('error', function (error) {
				console.log("Socket error: ", error);
			});
		});
		
		function onNewMessageHandler(msg) {
        	newData = JSON.parse(msg.data);
			        
	        // Add the variables to send
	        $.extend(newData, newDataToSend);
			        
            updateCallback(newData);
		}

		function discardSocket() {
			// Disconnect datasource websocket
			if (ws) {
				ws.close();
			}
		}
		
		function connectToServer(url) {
			//ws = new WebSocket(url);
	        ws = new ReconnectingWebSocket(url);
	        // See https://github.com/joewalnes/reconnecting-websocket
	        ws.reconnectDecay = 1;
	        ws.timeoutInterval = 15000;
			
			ws.onopen = function() {
				console.info("Connected to server at: %s", url);
			};
			
            ws.onclose = function()
            { 
            	console.info("Connection is closed..."); 
            };
		}

		function initializeDataSource() {
			for (r in refreshIntervals) {
			    clearInterval(refreshIntervals[r]);
			}
			refreshIntervals = [];
			
			// When no data is received (slider is not moved, for example),
			// send it every second: the receiving program may have a safety timeout
			// in case it doesn't receive data
	        refreshInterval = setInterval(
	        	function(){
					// Write data to the serial port
					currentTime = new Date();
					if ((currentTime - lastSentTime) > 100) {
						sendData(dataObj);
					}
	        	},
	        	(_.isUndefined(currentSettings.refresh_rate) ? 1000 : currentSettings.refresh_rate)
	        );
	        refreshIntervals.push(refreshInterval);
	        
			// Reset connection to server
			discardSocket();
			connectToServer(currentSettings.host);

			newMessageCallback = onNewMessageHandler;
			ws.onmessage = newMessageCallback;
		}

		this.updateNow = function () {
			initializeDataSource();
			return;
		};

		this.stop = function() {
			discardSocket();
		};

		this.onDispose = function () {
			// Stop responding to messages
			newMessageCallback = function(msg) {
				return;
			};
			discardSocket();
		};

		this.onSettingsChanged = function (newSettings) {
            if ((newSettings.host != currentSettings.host )) {
            	currentSettings = newSettings;
            	initializeDataSource();
            }
            else if (newSettings.variables_to_send != currentSettings.variables_to_send) {
            	listVariablesToSend = (_.isUndefined(newSettings.variables_to_send) ? "" : newSettings.variables_to_send).split(",");
            	newDataToSend = _.object(listVariablesToSend, _.range(listVariablesToSend.length).map(function () { return 0; }));
            }
            else if (newSettings.refresh_rate != currentSettings.refresh_rate) {
				for (r in refreshIntervals) {
				    clearInterval(refreshIntervals[r]);
				}
				refreshIntervals = [];
				
				// When no data is received (slider is not moved, for example),
				// send it every second: the receiving program may have a safety timeout
				// in case it doesn't receive data
		        refreshInterval = setInterval(
		        	function(){
						// Write data to the serial port
						currentTime = new Date();
						if ((currentTime - lastSentTime) > 100) {
							sendData(dataObj);
						}
		        	},
		        	(_.isUndefined(currentSettings.refresh_rate) ? 1000 : currentSettings.refresh_rate)
		        );
		        refreshIntervals.push(refreshInterval);
            }
            currentSettings = newSettings;
		};
		
		initializeDataSource();
	};

	freeboard.loadDatasourcePlugin({
		type_name: "websocket",
		display_name: "Websocket",
		description : _t("A real-time stream datasource from Websocket servers."),
		external_scripts : [ "extensions/thirdparty/reconnecting-websocket.js" ],
		settings: [
			{
				name: "host",
				display_name: _t("Host"),
				type: "text",
				"required" : true,
				description: _t("Include ws:// or http:// ,...")
			},
			{
				name: "variables_to_send",
				display_name: _t("Variables to send"),
				type: "text",
				"required" : false,
				description: _t("Name of the variables to send, separated by comma")
			},
			{
				name: "refresh_rate",
				display_name: _t("Refresh rate for sending data"),
				type: "text",
				"required" : false,
				default_value: 500,
				suffix: _t("milliseconds"),
				description: _t("Refresh rate for sending data. Data will be sent even if control values are not changed")
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new websocketDatasource(settings, updateCallback));
		}
	});


}());
