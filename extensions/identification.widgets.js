window.identificationID = 0;
(function() {    
        var identificationWidget = function (settings) {
        var self = this;
        
        var bs = require('binarysearch');
        
        var thisidentificationID1 = "identification1-" + window.identificationID;
        var thisidentificationID2 = "identification2-" + window.identificationID;
        var resistanceID = "resistance-" + window.identificationID;
        var inductanceID = "inductance-" + window.identificationID;
        var constanteCoupleID = "constantecouple-" + window.identificationID;
        var inertieID = "inertie-" + window.identificationID;
        var frottementID = "frottement-" + window.identificationID++;
        var titleElement1 = $('<h2 class="section-title"><strong>' + _t("Identification of electrical parameters") + '</strong></h2>');
        var titleElement2 = $('<h2 class="section-title"><strong>' + _t("Identification of mechanical parameters") + '</strong></h2>');
		var resistanceElement = $('<span id="' + resistanceID + '"></span><br />');
		var inductanceElement = $('<span id="' + inductanceID + '"></span><br /><br />');
		var constanteCoupleElement = $('<span id="' + constanteCoupleID + '"></span><br />');
        var inertieElement = $('<span id="' + inertieID + '"></span><br />');
        var frottementElement = $('<span id="' + frottementID + '"></span><br />');
        var identificationElement1 = $('<div id="' + thisidentificationID1 + '" style="width: 100%; height:200px"></div>');
        var identificationElement2 = $('<div id="' + thisidentificationID2 + '" style="width: 100%; height:200px"></div>');

        var options;
        var rendered = false;
        var identificationCreated = false;
	    var identificationdata = [];
	    var resistance;
	    
	    var xData, yData;
	    var xDataIdentArray = [];
	    var yDataIdentArray = [];
	    var dataIdentArray = [];
	    var yDataArray = [];
	    var yIdentMean = 0;
	    var meanCurrent = 0;
	    var meanOmega = 0;
	    var iMeanCurrent = 1;
	    var iMeanOmega = 1;
	    var yIdentMax = -1000;
	    var windowStarted1;
	    var windowStopped1;
	    var windowStarted2;
	    var windowStopped2;
	    var identCurrentDone = false;
	    var lastDate = 1000;
    	var trueX0 = 0.;

        var currentSettings = settings;
        
        function createIdentification(mySettings) {
            if (!rendered) {
                return;
            }
	        	        	        			
			identificationCreated = true;
        }

        this.render = function (element) {
            rendered = true;
            //$(element).append(titleElement).append(identificationElement).append(legendElement);
            $(element).append(titleElement1).append(identificationElement1).append(resistanceElement).append(inductanceElement).append(titleElement2).append(identificationElement2).append(constanteCoupleElement).append(inertieElement).append(frottementElement);
            createIdentification(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.xaxis != currentSettings.xaxis
            	|| newSettings.time != currentSettings.time
            	|| newSettings.current != currentSettings.current
            	|| newSettings.omega != currentSettings.omega
            	|| newSettings.current_window != currentSettings.current_window
            	|| newSettings.steady_state_omega != currentSettings.steady_state_omega
            	|| newSettings.voltage_current != currentSettings.voltage_current
            	|| newSettings.voltage_speed != currentSettings.voltage_speed
            	|| newSettings.ratio != currentSettings.ratio) {
            	identificationCreated = false;
                createIdentification(newSettings);
            }
            
			currentSettings = newSettings;

        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (identificationCreated) {
            	if (settingName == "time") {
            		xData = Number(newValue);
            	}
	        	else {		        	
		        		
                	if ((settingName == "current") && (!identCurrentDone) && (xData < 100)) {
	                	yData = Number(newValue);
	                	yDataArray.push(yData);		                		
	                
		                // First point of a new serie
			            if ((!_.isUndefined(xData)) && (!_.isUndefined(yData))) {
			            	if (xData < lastDate) {
	
			            		identificationdata = [];
			            		windowStarted1 = false;
			            		windowStopped1 = false;
	
			            		yDataArray = [];
			            		yIdentMean = 0;
							    meanCurrent = 0;
							    meanOmega = 0;
							    iMeanCurrent = 1;
							    iMeanOmega = 1;
			            	}
			            	
			            	lastDate = xData;
				            identificationdata.push({x:xData, y:yData});
			            	
			                // var nbData = identificationdata.length;
			                
			                // Waiting for an identification window
			                if (!windowStarted1) {
			                	if (yData > 0.1) {
			                		// We "open" an identification windows
			                		windowStarted1 = true;
				                	// xDataIdentArray.push(xData);
				                	// yDataIdentArray.push(yData);
				                	// yIdentMax = Math.max.apply(null, yDataIdentArray);
			                		xDataIdentArray.push(xData);
			                		yDataIdentArray.push(yData);
			                	}
			                	else {
			                		// Initialize the identification array with 0
			                		xDataIdentArray[0] = 0.;
			                		yDataIdentArray[0] = 0.;
			                	}
			                }
			                // Store data when the window is open
			                else if (!windowStopped1) {
			                	xDataIdentArray.push(xData);
			                	yDataIdentArray.push(yData);
			                	// At the third point, we shift x to its real value
			                	var nbPoints = xDataIdentArray.length;
			                	if (nbPoints == 3) {
			                		// On applique le théorème de Thalès... comme quoi ça sert !
			                		trueX0 = (yDataIdentArray[1] * xDataIdentArray[2] - yDataIdentArray[2] * xDataIdentArray[1]) / (yDataIdentArray[1] - yDataIdentArray[2]);
			                		xDataIdentArray[1] -= trueX0;
			                		xDataIdentArray[2] -= trueX0;
			                	}
			                	else if (nbPoints > 3) {
			                		xDataIdentArray[nbPoints - 1] -= trueX0;
			                	}
			                	
			                	// Compute the mean of the steady state from half the window
							    if (xData > (parseFloat(currentSettings.current_window) / 2)) {
							    	// Compute mean of current during steadystate
							    	yIdentMean = yIdentMean * (iMeanCurrent - 1) / iMeanCurrent + yData / iMeanCurrent;
				                	iMeanCurrent++;
								}
								
			                	//yIdentMax = Math.max.apply(null, yDataIdentArray);
			                }
			                if ((xData > parseFloat(currentSettings.current_window)) && (windowStarted1) && (!windowStopped1)) {
			                	windowStopped1 = true;
			                	// We keep 90% of the window
			                	var nbData = xDataIdentArray.length;
			                	var lastIndex = Math.floor(nbData*0.9);
			                	// We extract the subarrays
			                	var xDataIdentArray2 = xDataIdentArray.slice(0,lastIndex);
			                	var yDataIdentArray2 = yDataIdentArray.slice(0,lastIndex);
			                	
			                	// Shift the X vector so that it starts at 0
			                	var xmin = Math.min.apply(null, xDataIdentArray2);
			                	var xDataIdentArray3 = _.map(xDataIdentArray2, function(num){ return num - xmin + 0.001; });
			                	
			                	// Modify the data: a-b*exp(-x*t) --> b*exp(-x*t). a is equal to yIdentMean
			                	// We put a threshold at 0.001 in order to avoid 0
			                	var yDataIdentArray3 = _.map(yDataIdentArray2, function(num){ return Math.max(-(num - yIdentMean),0.001); });
			                	
			                	// Identify the data
			                	dataIdentArray = _.zip(xDataIdentArray3,yDataIdentArray3);
			                	var yTau1 = 0.632 * yIdentMean;
			                	var indexYTau1 = bs.closest(yDataIdentArray2,yTau1);
			                	var tau1 = xDataIdentArray3[indexYTau1] + (xDataIdentArray3[indexYTau1+1]-xDataIdentArray3[indexYTau1]) * (yTau1 - yDataIdentArray2[indexYTau1])/(yDataIdentArray2[indexYTau1+1]-yDataIdentArray2[indexYTau1]);
			                	
			                	// Plot the results
			                	var physicalPoints = _.zip(xDataIdentArray3,yDataIdentArray2);
			                	
								// Print the results out
								var voltage = Number(currentSettings.voltage_current);
								resistance = voltage / yIdentMean;
								var inductance = tau1 * resistance;
								$("#" + resistanceID).text(_t("Resistance: ") + resistance.toFixed(1) + " Ohms");
								$("#" + inductanceID).text(_t("Inductance: ") + inductance.toFixed(1) + " mH");
								
			                	var yResults2 = Array();
			                	for (var i=0; i<xDataIdentArray3.length; i++) {
			                		yResults2.push(yIdentMean * (1 - Math.exp(-0.001 * resistance * xDataIdentArray3[i]/(0.001 * inductance))));
			                	}
			                	
								$.plot($("#" + thisidentificationID1), [
									{data: physicalPoints, lines: { show: false }, label: _t('Measured current'), points: { show: true, radius: 1 }},
									{data: _.zip(xDataIdentArray3,yResults2), label: _t('Identified current'), color: "#FF0000"},
								], {legend: {position: "se"}});
					
								// Reinitialize for next identification
							    identificationdata = [];
							    xDataIdentArray = [];
							    yDataIdentArray = [];
							    dataIdentArray = [];
							    yDataArray = [];
							    lastDate = 1000;
							    yIdentMax = -1000;
							    identCurrentDone = true;
							    iMeanCurrent = 1;
							    meanCurrent = 0;
			                }
			                
				        }
				    }
				    else if ((settingName == "current") && (xData > (parseFloat(currentSettings.steady_state_omega)))) {
				    	// Compute mean of current during steadystate
				    	meanCurrent = meanCurrent * (iMeanCurrent - 1) / iMeanCurrent + Number(newValue) / iMeanCurrent;
	                	iMeanCurrent++;
					}
			        else if ((settingName == "omega") && (xData > 100)) {
			        	windowStarted1 = false;
			        	windowStopped1 = false;
			        	identCurrentDone = false;
			        	
	                	yData = Number(newValue);
	                	yDataArray.push(yData);	
	                		                		
			            if ((!_.isUndefined(xData)) && (!_.isUndefined(yData))) {
			            	if (xData < lastDate) {
	
			            		identificationdata = [];
					        	windowStarted2 = false;
					        	windowStopped2 = false;
	
			            		yDataArray = [];
			            	}
			            	lastDate = xData;
				            identificationdata.push({x:xData, y:yData});
			            
			                // var nbData = identificationdata.length;
			                
			                // Waiting for an identification window
			                if (!windowStarted2) {
			                	if (yData > 0.01) {
			                		// We "open" an identification windows
			                		windowStarted2 = true;
			                		xDataIdentArray[0] = xData;
			                		yDataIdentArray[0] = yData;
			                	}
			                	else {
			                		// Initialize the identification array with last point
			                		// xDataIdentArray[0] = xData;
			                		// yDataIdentArray[0] = yData;
			                	}
			                }
			                // Store data when the window is open
			                else if (!windowStopped2) {
			                	xDataIdentArray.push(xData);
			                	yDataIdentArray.push(yData);
			                	yIdentMax = Math.max.apply(null, yDataIdentArray);
							    if ((xData > currentSettings.steady_state_omega) && (yData > 0)) {
							    	// Compute mean of omega during steadystate
							    	meanOmega = meanOmega * (iMeanOmega - 1) / iMeanOmega + Number(yData) / iMeanOmega;
				                	iMeanOmega++;
								}
			                }
			                // if yData < 0.5 * yIdentMax, we close the window
			                if ((yData < 0.5 * yIdentMax) && (windowStarted2) && (!windowStopped2)) {
			                	windowStopped2 = true;
			                	// We keep a certain length of the window
			                	var nbData = xDataIdentArray.length;
			                	var lastIndex = Math.floor(nbData*0.90);
			                	// We extract the subarrays
			                	var xDataIdentArray2 = xDataIdentArray.slice(0,lastIndex);
			                	var yDataIdentArray2 = yDataIdentArray.slice(0,lastIndex);
			                	
			                	// Shift the X vector so that it starts at 0
			                	var xmin = Math.min.apply(null, xDataIdentArray2);
			                	var xDataIdentArray3 = _.map(xDataIdentArray2, function(num){ return num - xmin + 0.001; });
			                	
			                	// Modify the data: a-b*exp(-x*t) --> b*exp(-x*t). a is equal to yIdentMax
			                	// We put a threshold at 0.001 in order to avoid 0
			                	var yDataIdentArray3 = _.map(yDataIdentArray2, function(num){ return Math.max(-(num - yIdentMax),0.001); });
			                	
			                	// Identify the data
			                	dataIdentArray = _.zip(xDataIdentArray3,yDataIdentArray3);
			                	var yTau2 = 0.632*meanOmega;
			                	var indexYTau2 = bs.closest(yDataIdentArray2,yTau2);
			                	var tau2 = xDataIdentArray3[indexYTau2] + (xDataIdentArray3[indexYTau2+1]-xDataIdentArray3[indexYTau2]) * (yTau2 - yDataIdentArray2[indexYTau2])/(yDataIdentArray2[indexYTau2+1]-yDataIdentArray2[indexYTau2]);
			                	
			                	// Plot the results
			                	var physicalPoints = _.zip(xDataIdentArray3,yDataIdentArray2);
			                	
								// Print the results out
								var ratio = Number(currentSettings.ratio);
								var frottement = (-resistance * Math.pow(meanCurrent,2) + Number(currentSettings.voltage_speed) * meanCurrent)/(Math.pow(meanOmega,2));
								//var constanteCouple = frottement * meanOmega / (meanCurrent * ratio);
								var constanteCouple = (Number(currentSettings.voltage_speed) - resistance * Math.max(meanCurrent,0)) / (ratio * meanOmega);
								var inertie = 0.001 * Math.pow(constanteCouple,2) * tau2 / resistance;
								$("#" + constanteCoupleID).text(_t("Torque constant: ") + constanteCouple.toFixed(4) + " N.m/A");
								$("#" + inertieID).text(_t("Inertia: ") + inertie.toFixed(10) + " kg.m^2");
								$("#" + frottementID).text(_t("Damping: ") + Math.max(frottement,0).toFixed(6) + " N.m.s/rad");
								
			                	var yResults2 = Array();
			                	for (var i=0; i<xDataIdentArray3.length; i++) {
			                		yResults2.push(meanOmega * (1 - Math.exp(-0.001 * Math.pow(constanteCouple,2) * xDataIdentArray3[i]/(inertie * resistance))));
			                	}
			                	
								$.plot($("#" + thisidentificationID2), [
									{data: physicalPoints, lines: { show: false }, label: _t('Measured speed'), points: { show: true, radius: 1 }},
									{data: _.zip(xDataIdentArray3,yResults2), label: _t('Identified speed'), color: "#FF0000"},
								], {legend: {position: "se"}});					
								
								// Reinitialize for next identification
							    xDataIdentArray = [];
							    yDataIdentArray = [];
							    dataIdentArray = [];
							    yDataArray = [];
							    lastDate = 1000;
							    lastIdentification = -1000000;
							    yIdentMax = -1000;
					        	windowStarted2 = false;
					        	windowStopped2 = false;
			                }
			                
				        }
			        }
				}
            }
        };

        this.onDispose = function () {
        };

        this.getHeight = function () {
            return 9;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "identification",
        display_name: _t("Identification"),
		description : _t("Identification of DC Motor parameters"),
		external_scripts : [
		    "extensions/thirdparty/flot/jquery.flot.js"
 		],
        settings: [
            {
                name: "time",
                display_name: _t("Time (X axis)"),
                type: "calculated",
            },
            {
                name: "current",
                display_name: _t("Current"),
                type: "calculated"
            },
            {
                name: "omega",
                display_name: _t("Angular speed"),
                type: "calculated"
            },
			{
				name: "current_window",
				display_name: _t("Current window (ms)"),
				type: "text",
				"required" : true,
				default_value: "2.0",
				description: _t("Length of identification window for the current")
			},
			{
				name: "steady_state_omega",
				display_name: _t("Steady state start time on speed (ms)"),
				type: "text",
				"required" : true,
				default_value: "800",
				description: _t("Take a margin so that you are sure that the speed has reached the steady state")
			},
			{
				name: "voltage_current",
				display_name: _t("Motor voltage during current try (V)"),
				type: "text",
				"required" : true,
				default_value: "6",
			},
			{
				name: "voltage_speed",
				display_name: _t("Motor voltage during speed try (V)"),
				type: "text",
				"required" : true,
				default_value: "6",
			},
			{
				name: "ratio",
				display_name: _t("Gear ratio"),
				type: "text",
				"required" : true,
				default_value: "100"
			}
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new identificationWidget(settings));
        }
    });
    
}());

