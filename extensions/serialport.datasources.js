(function () {
	var dataObj = {};
	var dataToSend = "";
	var isOpen = false; // Problems with native methods
	var serialPort;
	var com = require('serialport');
	
	var serialportDatasource = function (settings, updateCallback) {
		var self = this;
		var item;
		var currentSettings = settings;
		var myName;
		
		// var refreshInterval;
		// var lastSentTime = 0;
		// var currentTime = new Date();
		var newData = {};
		var listVariablesToRead = (currentSettings.variables_to_read).split(",");
		listVariablesToRead.push('_rawdata');
		var listVariablesToSend = (_.isUndefined(currentSettings.variables_to_send) ? "" : currentSettings.variables_to_send).split(",");
		// Object with keys from list of variables to send, each value is 0
		var newDataToSend = _.object(listVariablesToSend, _.range(listVariablesToSend.length).map(function () { return 0; }));
		// Object with keys from list of variables to read, each value is 0
		newData = _.object(listVariablesToRead, _.range(listVariablesToRead.length).map(function () { return 0; }));
        // Add the variables to send
        $.extend(newData, newDataToSend);
        
        myName = updateCallback(newData);
				
		// // Will receive message from control widget through socket.io
        // var socket;
        // // The event is the name of serial port (on Linux based OS, take the name after the last /)
        // var event = (currentSettings.port).split("/").pop();
        // var io = require('socket.io')(9091);
        
		// io.on('connection', function (socket) {
			// console.log("Serial port socket connected");
// 			
			// socket.on(event, function (msg) {
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
// 				
				// // Convert into a string of values
				// dataToSend = "";
				// for (var i = 0; i < listVariablesToSend.length; i++) {
					// dataToSend += _.isUndefined(dataObj[listVariablesToSend[i]]) ? "0" + currentSettings.separator : dataObj[listVariablesToSend[i]] + currentSettings.separator;
				// }
// 				
				// if (currentSettings.checksum == "none") {
					// // Remove last separator
					// dataToSend = dataToSend.slice(0,-(currentSettings.separator).length);
				// }
				// else {
					// dataToSend += crcValue;
				// }
// 				
				// // Very important ! Don't forget
				// dataToSend += "\r";
// 				
				// // When data arrives (from a slider, for example), send it
				// // "immediately" (but not faster than every 100 ms)
				// currentTime = new Date();
				// if ((currentTime - lastSentTime) > 100) {
					// lastSentTime = currentTime;
					// if (isOpen) {
						// serialPort.write(dataToSend, function (error) {
							// if (error) {
						    	// console.log("Error writing to the serial port immediate: ", error);
						    // }
						// });
					// }
				// }
			// });
// 			
			// socket.on('disconnect', function () {
				// console.log("Serial port socket disconnected");
			// });
			// socket.on('error', function (error) {
				// console.log("Socket error: ", error);
			// });
		// });
		        
		function discardSerialport() {
			// Disconnect datasource serial port
			if (serialPort) {
				serialPort.close(function (error) {
					if ( error ) {
						console.log('Failed to close: ', error);
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

		function initializeDataSource(mySettings) {
			
			// for (r in refreshIntervals) {
			    // clearInterval(refreshIntervals[r]);
			// }
			// refreshIntervals = [];
// 			
			// // When no data is received (slider is not moved, for example),
			// // send it every second: the receiving program may have a safety timeout
			// // in case it doesn't receive data
	        // refreshInterval = setInterval(
	        	// function(){
					// // Write data to the serial port
					// currentTime = new Date();
					// if ((isOpen) && ((currentTime - lastSentTime) > 100)) {
						// lastSentTime = currentTime;
						// serialPort.write(dataToSend, function (error) {
							// if (error) {
						    	// console.log("Error writing to the serial port: ", error);
						    // }
						// });
					// }
	        	// },
	        	// (_.isUndefined(mySettings.refresh_rate) ? 1000 : Math.max(1000, mySettings.refresh_rate))
	        // );
	        // refreshIntervals.push(refreshInterval);
			
			// Reset connection to Serial port
			discardSerialport();
			
			console.log("Open port");
			isOpen = true; // Needed to avoid a double open by updateNow
			connectToSerialport(mySettings.port, mySettings.baudrate);
			
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
				// Allows to design the dashboard even if the is not serial port communication
		        //updateCallback(_.object(listVariablesToRead,Array(4)));
		        alert('Error: ' + err.message);
		        isOpen = false;
		    });
		
		}

		this.updateNow = function () {
			if (!isOpen) {
				initializeDataSource(currentSettings);
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
            	initializeDataSource(newSettings);
            }
            if (newSettings.variables_to_read != currentSettings.variables_to_read) {
            	listVariablesToRead = (newSettings.variables_to_read).split(",");
            	listVariablesToRead.push('_rawdata');
            	initializeDataSource(newSettings);
            }
            if (newSettings.variables_to_send != currentSettings.variables_to_send) {
            	listVariablesToSend = (_.isUndefined(newSettings.variables_to_send) ? "" : newSettings.variables_to_send).split(",");
            	newDataToSend = _.object(listVariablesToSend, _.range(listVariablesToSend.length).map(function () { return 0; }));
            }
            if (newSettings.refresh_rate != currentSettings.refresh_rate) {
            	newSettings.refresh_rate = Math.max(1000, newSettings.refresh_rate);
				// for (r in refreshIntervals) {
				    // clearInterval(refreshIntervals[r]);
				// }
				// refreshIntervals = [];
// 				
				// // When no data is received (slider is not moved, for example),
				// // send it every second: the receiving program may have a safety timeout
				// // in case it doesn't receive data
		        // refreshInterval = setInterval(
		        	// function(){
						// // Write data to the serial port
						// currentTime = new Date();
						// if ((isOpen) && ((currentTime - lastSentTime) > 100)) {
							// lastSentTime = currentTime;
							// serialPort.write(dataToSend, function (error) {
								// if (error) {
							    	// console.log("Error writing to the serial port: ", error);
							    // }
							// });
						// }
		        	// },
		        	// newSettings.refresh_rate
		        // );
		        // refreshIntervals.push(refreshInterval);
            }
            
            currentSettings = newSettings;

		};
		
		initializeDataSource(currentSettings);
		
		
		function readSessionStorage() {
			//console.log("Read session storage from ", myName);
			if (isOpen) {
				var currentObj = {};
	        	for (var i=0; i<listVariablesToSend.length; i++) {
	    			item = 'datasources["' + myName + '"]["' + listVariablesToSend[i] + '"]';
	    			var sessionStorageVar = sessionStorage.getItem(item);
	    			currentObj[listVariablesToSend[i]] = sessionStorageVar;
	    			//console.log(item);
		        }
		        
				// Merge messages to send using jQuery
				$.extend(dataObj, currentObj);
				
				// Create CRC data
				crcValue = 0;
				for (var d in dataObj) {
					if (d != '_crc') {
						if (currentSettings.checksum == "sum") {
							crcValue += Number(dataObj[d]);
						}
						else if (currentSettings.checksum == "concat") {
							crcValue += dataObj[d];
						}
					}
				}
				
				// Convert into a string of values
				dataToSend = "";
				for (var i = 0; i < listVariablesToSend.length; i++) {
					dataToSend += _.isUndefined(dataObj[listVariablesToSend[i]]) ? "0" + currentSettings.separator : dataObj[listVariablesToSend[i]] + currentSettings.separator;
				}
				
				if (currentSettings.checksum == "none") {
					// Remove last separator
					dataToSend = dataToSend.slice(0,-(currentSettings.separator).length);
				}
				else {
					dataToSend += crcValue;
				}
				
				// Very important ! Don't forget
				dataToSend += "\r";
				//console.log(dataToSend);
		        
				serialPort.write(dataToSend, function (error) {
					if (error) {
				    	console.log("Error writing to the serial port immediate: ", error);
				    }
				});
		    }
			setTimeout(function() {
					readSessionStorage();
				},
				currentSettings.refresh_rate
			);		
		}
		readSessionStorage();
		
		
	};

	freeboard.loadDatasourcePlugin({
		type_name: "serialport",
		display_name: _t("Serialport"),
		description : _t("A real-time stream datasource from Serial port."),
		// external_scripts : [
		    // "extensions/thirdparty/socket.io-1.3.5.js"
 		// ],
		settings: [
			{
				name: "port",
				display_name: _t("Port"),
				type: "option",
				"required" : true,
				description: "",
                options: comDescription
			},
			{
				name: "baudrate",
				display_name: _t("Baudrate"),
				type: "number",
				"required" : true,
				description: ""
			},
			{
				name: "variables_to_read",
				display_name: _t("Variables to read"),
				type: "text",
				"required" : true,
				description: _t("Name of the variables to read, separated by comma")
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
				default_value: 2000,
				suffix: _t("milliseconds"),
				description: _t("Refresh rate for sending data ( > 1000 ms). Data will be sent even if control values are not changed")
			},
			{
				name: "separator",
				display_name: _t("Separator"),
				type: "text",
				"required" : true,
				description: _t("Separator character for received and (optionally) sent values")
			},
			{
				name: "checksum",
				display_name: _t("Checksum method"),
                type: "option",
                description: _t("If values are sent, a checksum will be automatically added in variable '_crc', computed from the other values."),
                options: [
                    {
                        name: _t("None"),
                        value: "none"
                    },
                    {
                        name: _t("Sum"),
                        value: "sum"
                    },
                    {
                        name: _t("String concatenation"),
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
