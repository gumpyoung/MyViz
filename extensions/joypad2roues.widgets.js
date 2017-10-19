window.joypad2rouesID = 0;
(function() {    
    var joypad2rouesWidget = function (settings) {
        var self = this;
        var thisjoypad2rouesID = window.joypad2rouesID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var joypad2rouesElement = $('<div id="joypad2roues-' + thisjoypad2rouesID + '" style="margin-left: 50px;"></div>' +
        							'<span id="value1_legend-' + thisjoypad2rouesID + '">Consigne vitesse longitudinale (cm/s): </span>' +
        							'<span id="value1-' + thisjoypad2rouesID + '">0</span><br />' +
        							'<span id="value2_legend-' + thisjoypad2rouesID + '">Consigne vitesse de rotation (deg/s): </span>' +
        							'<span id="value2-' + thisjoypad2rouesID + '">0</span><br />');

        var joypad2rouesObject;
        var rendered = false;

		var joypad2roues;
        var currentSettings = settings;
        var vxref = 0;
        var xiref = 0;
        
        // var socket;
        // var event;

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
        	// Send data
			// console.log("vxref: ", vxref);
			// console.log("xiref: ", xiref);
			toSend = {};
			toSend[currentSettings.variablevxref] = parseInt(vxref.toFixed(0));
			//socket.emit(event, JSON.stringify(toSend));
			sessionStorage.setItem(currentSettings.variablevxref, toSend[currentSettings.variablevxref]);
			toSend = {};
			toSend[currentSettings.variablexiref] = parseInt(xiref.toFixed(0));
			//socket.emit(event, JSON.stringify(toSend));
			sessionStorage.setItem(currentSettings.variablexiref, toSend[currentSettings.variablexiref]);
		}
        
        function createjoypad2roues(mySettings) {
            if (!rendered) {
                return;
            }

            //connectToServer(mySettings);
            
            //joypad2rouesElement.empty();
            
            gain_longi = (_.isUndefined(mySettings.gain_longi) ? 1 : mySettings.gain_longi);
            gain_rot = (_.isUndefined(mySettings.gain_rot) ? 1 : mySettings.gain_rot);
            
            // In case the Raphael paper already exists, we remove it
			try{
			    joypad2roues.remove();
			}
			catch (error) {
			    console.log(error);
			    console.log("It seems that the paper doesn't exist yet...");
			}
			
            joypad2roues = Raphael('joypad2roues-' + thisjoypad2rouesID, 170, 170);
			joypad2roues.image("./img/joypad_fond.png", 5, 5, 160, 160);
			joypad2roues.image("./img/joypad_exclusion.png", 0, 0, 170, 170);
			var joypad2roues_manette = joypad2roues.image("./img/joypad_centre.png", 0, 0, 170, 170);
			
			// Send data at the creation
			sendData();
			
			cart2pol = function(x,y) {
				var r, theta;
				r = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
				theta = -Math.atan2(y,x);
				return {r: r, theta: theta};
			};
      
			pol2cart = function (r,theta) {
				var x, y;
				x = r*Math.cos(-theta);
				y = r*Math.sin(-theta);
				return {x: x, y: y};
			};

			dragger = function () {
				this.ox = this.attr("x");
				this.oy = this.attr("y");
			};
      
			move = function (dx, dy) {
				var att, pol, r, theta, cart;
				pol = cart2pol(this.ox + dx,this.oy + dy);
				if (pol.r < 65) {
					att = {x: this.ox + dx, y: this.oy + dy};
					this.attr(att);
				}
				else {
					cart = pol2cart(65, pol.theta);
					att = {x: cart.x, y:  cart.y};
					this.attr(att);
				}
				 	
				vxref_calc = pol.r;
				vxref_calc = Math.min(vxref_calc,70);
				vxref_calc = Math.max(vxref_calc-30,0);
				vxref_calc = vxref_calc*0.5/40;
				xiref_calc = (pol.theta*180/Math.PI);
				if (xiref_calc<0) {
					xiref_calc = 90;
					vxref_calc = -vxref_calc;
				}
				vxref = gain_longi * 100*(vxref_calc.toFixed(2));
				$("#value1-" + thisjoypad2rouesID).html(vxref.toFixed(0));
				
				xiref = gain_rot * (-(180. - 2. * xiref_calc));
				$("#value2-" + thisjoypad2rouesID).html(xiref.toFixed(0));
				sendData();
				
			};
			 
			up = function () {
				att = {x: 0, y: 0};
				this.animate(att,1000,"backOut");
				vxref = 0;
				xiref = 0;
				$("#value1-" + thisjoypad2rouesID).html(vxref.toFixed(0));
				$("#value2-" + thisjoypad2rouesID).html(xiref.toFixed(0));
				sendData();
				
			};

			joypad2roues_manette.drag(move, dragger, up);
	        
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(joypad2rouesElement);
            createjoypad2roues(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            // if (newSettings.datasourcename != currentSettings.datasourcename) {
                // discardSocket();
                // connectToServer(newSettings);
            // }
            
			currentSettings = newSettings;
			createjoypad2roues(currentSettings);
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
        };

        this.onDispose = function () {
			//socket.close();
        };

        this.getHeight = function () {
            return 4;
        };

        this.onSettingsChanged(settings);        
    };

    freeboard.loadWidgetPlugin({
        type_name: "joypad2roues",
        display_name: "Joypad 2 roues",
		"external_scripts": [
			"extensions/thirdparty/raphael.2.1.0.min.js"
			//"extensions/thirdparty/socket.io-1.3.5.js"
		],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
			// {
				// name: "datasourcename",
				// display_name: _t("Datasource"),
                // type: "text",
				// description: _t("You *must* create first a datasource with the same name")
			// },
            {
                name: "variablevxref",
                display_name: _t("Variable vxref"),
                type: "calculated",
				description: _t("Variable correspondant à la consigne de vitesse longitudinale")
            },
            {
                name: "gain_longi",
                display_name: _t("Gain en longitudinal"),
                type: "text",
                default_value: 1,
				description: _t("Facteur de multiplication sur la consigne longitudinale. Celle-ci vaut 0.5 m/s au maximum quand le gain est égal à 1")
            },
            {
                name: "variablexiref",
                display_name: _t("Variable xiref"),
                type: "calculated",
				description: _t("Variable correspondant à la consigne de vitesse de rotation")
            },
            {
                name: "gain_rot",
                display_name: _t("Gain en rotation"),
                type: "text",
                default_value: 1,
				description: _t("Facteur de multiplication sur la consigne de rotation. Celle-ci est comprise entre -180 et 180 deg/s quand le gain est égal à 1")
            }
       ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new joypad2rouesWidget(settings));
        }
    });
    
}());

