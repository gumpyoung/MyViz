// # A Freeboard Plugin that uses the Eclipse Paho javascript client to read MQTT messages
(function() {
	var dataObj = {};
	var pahomqttDatasource = function(settings, updateCallback) {
 		var self = this;
		var data = {};
		var lastData = {};
		var item;
		var currentSettings = settings;
		var myName;

		var lastSentTime = 0;
		var currentTime = new Date();
		
		var newData = {};
		var listVariablesToRead = (currentSettings.topics_to_subscribe).split(",");
		var listVariablesToSend = (currentSettings.topics_to_publish).split(",");
		for (var i=0; i<(listVariablesToSend).length; i++) {
			item = 'datasources["' + currentSettings.name + '"]["' + listVariablesToSend[i] + '"]';
			lastData[item] = null;
		}
		// Object with keys from list of variables to send, each value is 0
		var newDataToSend = _.object(listVariablesToSend, _.range(listVariablesToSend.length).map(function () { return 0; }));
		// Object with keys from list of variables to read, each value is 0
		newData = _.object(listVariablesToRead, _.range(listVariablesToRead.length).map(function () { return 0; }));
        // Add the variables to send
        $.extend(newData, newDataToSend);
		// Make variables visible to other widgets
		myName = updateCallback(newData);
		
		// Will receive message from control widget through socket.io
        // var socket;
        // var event = "message";
        // var io = require('socket.io')(9093);
        
 		// function sendData(data) {
 			// console.log("Objet data: ", JSON.stringify(data));
        	// // Send data
	        // if (client.isConnected()) {
	        	// for (var i=0; i<(Object.keys(data)).length; i++) {
	        		// console.log("Topic: ", listVariablesToSend[i]);
	 				// console.log("Contenu data: ", data[listVariablesToSend[i]]);
	        		// if (!_.isUndefined(data[listVariablesToSend[i]])) {
	        			// console.log("Envoi " + data[listVariablesToSend[i]] + " a " + listVariablesToSend[i]);
				        // var message = new Paho.MQTT.Message(String(data[listVariablesToSend[i]]));
				        // message.destinationName = listVariablesToSend[i];
			        	// client.send(message);
			        // }
		        // }
		    // }
		// }
		
		// io.on('connection', function (socket) {
			// console.log("Mqtt internal socket connected");
// 			
			// socket.on(event, function (msg) {
				// console.log(msg);
				// // Extract variable name from, for example,
				// // currentSettings.value = [datasources["datasourcename"]["variablename1"], datasources["datasourcename"]["variablename2"]]
				// var variableName = (_.keys(JSON.parse(msg))[0]).split('"')[3];
				// var currentObj = {};
				// currentObj[variableName] = _.values(JSON.parse(msg))[0];
// 			
				// // Merge messages to send using jQuery
				// $.extend(dataObj, currentObj);
// 				
				// // Create CRC data
				// crcValue = 0;
				// for (var d in dataObj) {
					// if (d != '_crc') {
						// if (currentSettings.checksum == "sum") {
							// crcValue += Number(dataObj[d]);
						// }
						// else if (currentSettings.checksum == "concat") {
							// crcValue += dataObj[d];
						// }
					// }
				// }
				// $.extend(dataObj, {'_crc':crcValue});
// 				
				// // When data arrives (from a slider, for example), send it
				// // "immediately" (not faster than every 100 ms)
				// currentTime = new Date();
				// if ((currentTime - lastSentTime) > 100) {
					// lastSentTime = currentTime;
					// sendData(dataObj);
				// }
			// });
// 			
			// socket.on('disconnect', function () {
				// console.log("Mqtt internal socket disconnected");
			// });
			// socket.on('error', function (error) {
				// console.log("Socket error: ", error);
			// });
		// });
		
		function onConnect() {
			console.log("Connected");
			for (var i=0; i<listVariablesToRead.length; i++) {
				client.subscribe(listVariablesToRead[i]);
			}
	        //var message = new Paho.MQTT.Message("Hello CloudMQTT from MyViz");
	        //message.destinationName = listVariablesToSend[0];
	        //client.send(message); 
		};
		
		function onConnectionLost(responseObject) {
			if (responseObject.errorCode !== 0)
				console.log("onConnectionLost:" + responseObject.errorMessage);
		};

		function onMessageArrived(message) {
			//console.log(message);
			var value;
			if (currentSettings.json_data) {
				value = JSON.parse(message.payloadString);
			} else {
				value = message.payloadString;
			}
			
			newData[message.destinationName] = value;
			//console.log(newData);
						        
			updateCallback(newData);
		};

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings) {
			client.disconnect();
			data = {};
			currentSettings = newSettings;
			client.connect({onSuccess:onConnect,
							userName: currentSettings.username,
							password: currentSettings.password,
							useSSL: currentSettings.use_ssl});
		};

		// **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datasource
		self.updateNow = function() {
			// Don't need to do anything here, can't pull an update from MQTT.
		};

		// **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
		self.onDispose = function() {
			if (client.isConnected()) {
				client.disconnect();
			}
			client = {};
		};

		var client = new Paho.MQTT.Client(currentSettings.server,
										currentSettings.port, 
										currentSettings.client_id);
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;
		client.connect({onSuccess:onConnect, 
						
						userName: currentSettings.username,
						password: currentSettings.password,
						useSSL: currentSettings.use_ssl});
						
						
		function readSessionStorage() {
			//console.log("Read session storage from ", myName);
	        if (client.isConnected()) {
	        	for (var i=0; i<(listVariablesToSend).length; i++) {
	    			item = 'datasources["' + myName + '"]["' + listVariablesToSend[i] + '"]';
	    			var sessionStorageVar = sessionStorage.getItem(item);
	    			if (sessionStorageVar !== lastData[item]) {
	    				//console.log(sessionStorageVar);
	    				lastData[item] = sessionStorageVar;
				        var message = new Paho.MQTT.Message(String(sessionStorageVar));
				        message.destinationName = listVariablesToSend[i];
			        	client.send(message);
	    			}
		        }
		    }
			setTimeout(function() {
					readSessionStorage();
				},
				100
			);		
		}
		readSessionStorage();
		
	};

	// ### Datasource Definition
	//
	// -------------------
	freeboard.loadDatasourcePlugin({
		"type_name"   : "pahomqtt",
		"display_name": "Paho MQTT",
        "description" : "Exchange data with an MQTT server.",
		"external_scripts" : [
			"extensions/thirdparty/mqttws31.js",
			"extensions/thirdparty/socket.io-1.3.5.js"
		],
		"settings"    : [
			{
				"name"         : "server",
				"display_name" : "MQTT Server",
				"type"         : "text",
				"description"  : "Hostname for your MQTT Server",
                "required" : true
			},
			{
				"name"        : "port",
				"display_name": "Port",
				"type"        : "number", 
				"description" : "The port to connect to the MQTT Server on",
				"required"    : true
			},
			{
				"name"        : "use_ssl",
				"display_name": "Use SSL",
				"type"        : "boolean",
				"description" : "Use SSL/TLS to connect to the MQTT Server",
				"default_value": true
			},
            {
            	"name"        : "client_id",
            	"display_name": "Client Id",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "username",
            	"display_name": "Username",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "password",
            	"display_name": "Password",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "topics_to_subscribe",
            	"display_name": "Topics to subscribe to",
            	"type"        : "text",
            	"description" : "The topic(s) to subscribe to, separated by commas",
            	"required"    : true
            },
            {
            	"name"        : "topics_to_publish",
            	"display_name": "Topics to publish",
            	"type"        : "text",
            	"description" : "The topic(s) to publish, separated by commas",
            	"required"    : true
            },
            {
            	"name"        : "json_data",
            	"display_name": "JSON messages?",
            	"type"        : "boolean",
            	"description" : "If the messages on your topic are in JSON format they will be parsed so the individual fields can be used in freeboard widgets",
            	"default_value": false
            }
		],
		newInstance: function(settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new pahomqttDatasource(settings, updateCallback));
		}
	});


}());
