(function () {
	var dataObj = {};
	var dataToSend = "";
	var isOpen = false; // Problems with native methods
	var serialPort;
	var serialportDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;
		var com = require('serialport');
		var refreshInterval;
		var lastSentTime = 0;
		var currentTime = new Date();
		var newData = {};
		var listVariablesToRead = (currentSettings.variables_to_read).split(currentSettings.separator);
		listVariablesToRead.push('_rawdata');
		var listVariablesToSend = (_.isUndefined(currentSettings.variables_to_send) ? "" : currentSettings.variables_to_send).split(currentSettings.separator);
		// Object with keys from list of variables to send, each value is 0
		var newDataToSend = _.object(listVariablesToSend, _.range(listVariablesToSend.length).map(function () { return 0; }));
		var listVariables = _.union(listVariablesToRead, listVariablesToSend);

		
		// Will receive message from control widget through socket.io
        var socket;
        // The event is the name of serial port (on Linux based OS, take the name after the last /)
        var event = (currentSettings.port).split("/").pop();
        var io = require('socket.io')(9091);
        
		io.on('connection', function (socket) {
			console.log("Serial port socket connected");
			
			socket.on(event, function (msg) {
				console.log("msg: ", msg);
				console.log("JSON.parse(msg): ", JSON.parse(msg));
				// Extract variable name from, for example,
				// currentSettings.value = [datasources["datasourcename"]["variablename1"], datasources["datasourcename"]["variablename2"]]
				var variableName = (_.keys(JSON.parse(msg))[0]).split('"')[3];
				var currentObj = {};
				currentObj[variableName] = _.values(JSON.parse(msg))[0];
			
				// Merge messages to send using jQuery
				$.extend(dataObj, currentObj);
				
				// Create CRC data
				crcValue = 0;
				for (var d in dataObj) {
					if (d != '_crc') {
						if (currentSettings.checksum = "sum") {
							crcValue += Number(dataObj[d]);
						}
						else if (currentSettings.checksum = "concat") {
							crcValue += dataObj[d];
						}
					}
				}
				
				// Convert into a string of values
				dataToSend = "";
				for (var i = 0; i < listVariablesToSend.length; i++) {
					dataToSend += _.isUndefined(dataObj[listVariablesToSend[i]]) ? "0" + currentSettings.separator : dataObj[listVariablesToSend[i]] + currentSettings.separator;
				}
				dataToSend += crcValue;
				
				// Very important ! Don't forget
				dataToSend += "\r";
				
				// When data arrives (from a slider, for example), send it
				// "immediately" (not faster than every 100 ms)
				currentTime = new Date();
				if ((currentTime - lastSentTime) > 100) {
					lastSentTime = currentTime;
					if (isOpen) {
						serialPort.write(dataToSend, function (error) {
							if (error) {
						    	console.log("Error writing to the serial port immediate: ", error);
						    }
						});
					}
				}
			});
			
			socket.on('disconnect', function () {
				console.log("Serial port socket disconnected");
			});
			socket.on('error', function (error) {
				console.log("Socket error: ", error);
			});
		});
		        
		function discardSerialport() {
			// Disconnect datasource serial port
			if (serialPort) {
				serialPort.close(function (error) {
					if ( error ) {
						console.log('failed to close: ', error);
					} 
					else {
						isOpen = false;
					}
				});			
			}
		}
		
		function connectToSerialport(port, baudrate) {
		    serialPort = new com.SerialPort(port, {
		        baudrate: baudrate,
		        parser: com.parsers.readline('\r\n')
		    });
						
		}

		function initializeDataSource() {
			
			for (r in refreshIntervals) {
			    clearInterval(refreshIntervals[r]);
			}
			refreshIntervals = [];
			
			// When not data is received (slider is not moved, for example),
			// send it every second: the receiving program may have a safety timeout
			// in case it doesn't receive data
	        refreshInterval = setInterval(
	        	function(){
					// Write data to the serial port
					currentTime = new Date();
					if ((isOpen) && ((currentTime - lastSentTime) > 100)) {
						console.log("dataToSend serialPort: ", dataToSend);
						serialPort.write(dataToSend, function (error) {
							if (error) {
						    	console.log("Error writing to the serial port: ", error);
						    }
						});
					}
	        	},
	        	(_.isUndefined(currentSettings.refresh_rate) ? 1000 : currentSettings.refresh_rate)
	        );
	        refreshIntervals.push(refreshInterval);
			
			// Reset connection to Serial port
			discardSerialport();
			
			console.log("Open port");
			isOpen = true; // Needed to avoid a double open by updateNow
			connectToSerialport(currentSettings.port, currentSettings.baudrate);
			
		    serialPort.on('open',function() {
		    	isOpen = true;
		        console.log('Port open');
		    });
		
		    serialPort.on('data', function(data) {
			    try {
			    	// Create list [var1, var2,...] from data like var1, var2,...
			    	
			    	var arrData = "[" + data + "]";
			    	var listData = JSON.parse(arrData);
			    	
			    	// Add raw data to the object
			    	listData.push(data);
			        
			        // Create JSON object from the list of variables to read
			        newData = _.object(listVariablesToRead, listData);
			        
			        // Add the variables to send
			        $.extend(newData, newDataToSend);
			        
			        updateCallback(newData);
			    }
			    catch(e) {
			        console.log("Parse error: ", e); //error in the above string
			    }
	        		            
		    });

		    serialPort.on('close',function() {
		        console.log('Port closed');
		        isOpen = false;
		    });
		
		    serialPort.on('error',function(err) {
		        console.log('Error: ', err.message);
		        alert('Error: ' + err.message);
		        isOpen = false;
		    });
		
		}

		this.updateNow = function () {
			if (!isOpen) {
				initializeDataSource();
			}
			return;
		};

		this.stop = function() {
			discardSerialport();
		};

		this.onDispose = function () {
			// Stop responding to messages
		    serialPort.on('data', function(data) {
		        // We do nothing 
		    });
			discardSerialport();
		};

		this.onSettingsChanged = function (newSettings) {
            if ((newSettings.port != currentSettings.port)
            	|| (newSettings.baudrate != currentSettings.baudrate)) {
            	initializeDataSource();
            }
            else if (newSettings.variables_to_read != currentSettings.variables_to_read) {
            	listVariablesToRead = (newSettings.variables_to_read).split(currentSettings.separator);
            	listVariablesToRead.push('_rawdata');
            	listVariables = _.union(listVariablesToRead, listVariablesToSend);
            }
            else if (newSettings.variables_to_send != currentSettings.variables_to_send) {
            	listVariablesToSend = (_.isUndefined(newSettings.variables_to_send) ? "" : newSettings.variables_to_send).split(currentSettings.separator);
            	listVariables = _.union(listVariablesToRead, listVariablesToSend);
            }
            else if (newSettings.separator != currentSettings.separator) {
            	listVariablesToRead = (newSettings.variables_to_read).split(currentSettings.separator);
            	listVariablesToRead.push('_rawdata');
            	listVariablesToSend = (_.isUndefined(newSettings.variables_to_send) ? "" : newSettings.variables_to_send).split(currentSettings.separator);
            	listVariables = _.union(listVariablesToRead, listVariablesToSend);
            }
            currentSettings = newSettings;
		};
		
		initializeDataSource();
	};

	freeboard.loadDatasourcePlugin({
		type_name: "serialport",
		display_name: "Serialport",
		description : "A real-time stream datasource from Serial port. Variables to read and to send must be comma-separated.",
		external_scripts : [
		    "extensions/thirdparty/socket.io-1.3.5.js"
 		],
		settings: [
			{
				name: "port",
				display_name: "PORT",
				type: "text",
				"required" : true,
				description: ""
			},
			{
				name: "baudrate",
				display_name: "BAUDRATE",
				type: "number",
				"required" : true,
				description: ""
			},
			{
				name: "variables_to_read",
				display_name: "Variables to read",
				type: "text",
				"required" : true,
				description: "Name of the variables to read, separated by comma"
			},
			{
				name: "variables_to_send",
				display_name: "Variables to send",
				type: "text",
				"required" : false,
				description: "Name of the variables to send, separated by comma"
			},
			{
				name: "separator",
				display_name: "Separator",
				type: "text",
				"required" : true,
				description: "Separator character for received and (optionally) sent values"
			},
			{
				name: "checksum",
				display_name: "Checksum method",
                type: "option",
                description: "If values are sent, a checksum will be automatically added in variable '_crc', computed from the other values.",
                options: [
                    {
                        name: "Sum",
                        value: "sum"
                    },
                    {
                        name: "String concatenation",
                        value: "concat"
                    }
                ]
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new serialportDatasource(settings, updateCallback));
		}
	});


}());
