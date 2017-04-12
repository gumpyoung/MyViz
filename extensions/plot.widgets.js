window.plotID = 0;
(function() {    
    var plotWidget = function (settings) {
        var self = this;
        if (window.plotID == 0) {
        	pausePlot = Array();
        }
        var thisplotID = "plot-" + window.plotID++;
        numberOfPlotWindows++;
	    var pause = false;
	    var resume = false;
	    var yvalueLength = 0;
	    var y2valueLength = 0;
        
		pausePlot.push( function() {
			if (!pause) {
				pause = true;
				$("#pauseresume-" + thisplotID).removeClass("icon-pause");
				$("#pauseresume-" + thisplotID).addClass("icon-play");
				$("#labelpauseresume-" + thisplotID).html(_t("Play"));
			}
			else {
				pause = false;
				resume = true;
				$("#pauseresume-" + thisplotID).removeClass("icon-play");
				$("#pauseresume-" + thisplotID).addClass("icon-pause");
				$("#labelpauseresume-" + thisplotID).html(_t("Pause"));
			}
		});
		
        var titleElement = $('<h2 class="section-title"></h2>');
        var plotElement = $('<div id="' + thisplotID + '" style="width: 100%; height:80%"></div>');
        var pauseElement = $('<ul style="margin-top:-5px" class="board-toolbar horizontal"><li><i id="pauseresume-' + thisplotID + '" class="icon-pause icon-white"></i>&nbsp;<label id="labelpauseresume-' + thisplotID + '" data-bind="click: pausePlot[' + (window.plotID - 1) +']" style="color: #B88F51; margin-top:1px">' + _t("Pause") + '</label></li></ul>');
		//var legendElement = $('<div id="chartLegend"></div>');

        var plotObject;
        var opts;
        var options;
        var rendered = false;
        var plotCreated = false;
	    var plotdata = [];
	    var newValue;
	    
	    var initialDate = new Date();
	    var xData, yData;
	    var yDataArray = [];
	    var yDataArray2 = [];
	    var ymin, ymax;
	    var y2min, y2max;
	    var last_ymin, last_ymax, center;
	    var last_y2min, last_y2max, center2;
	    var lastDate = initialDate;
	    var lastPlot = -1000000;

        var currentSettings = settings;
	    var legendArray = (_.isUndefined(currentSettings.legendStr) || !currentSettings.include_legend ? [] : (currentSettings.legendStr).split(","));
        
        function setYaxisRange(mySettings) {
            if ((_.isUndefined(mySettings.y_axis_min_range)) || ((mySettings.y_axis_min_range).indexOf(",") === -1)) {
            	y_axis_min_range_array = [-10,10];
            }
            else {
            	y_axis_min_range_array = ((mySettings.y_axis_min_range).split(",")).map(parseFloat);
           	}
        	ymin = Math.min.apply(null, y_axis_min_range_array);
        	last_ymin = ymin;
        	ymax = Math.max.apply(null, y_axis_min_range_array);
        	last_ymax = ymax;
        	center = (ymin + ymax)/2;
        }

        function setY2axisRange(mySettings) {
            if ((_.isUndefined(mySettings.y2_axis_min_range)) || ((mySettings.y2_axis_min_range).indexOf(",") === -1)) {
            	y2_axis_min_range_array = [-10,10];
            }
            else {
            	y2_axis_min_range_array = ((mySettings.y2_axis_min_range).split(",")).map(parseFloat);
           	}
        	y2min = Math.min.apply(null, y2_axis_min_range_array);
        	last_y2min = y2min;
        	y2max = Math.max.apply(null, y2_axis_min_range_array);
        	last_y2max = y2max;
        	center2 = (y2min + y2max)/2;
        }

        function createPlot(mySettings) {
            if (!rendered) {
                return;
            }

            plotElement.empty();

	        //plotdata = [{ label: "", yaxis:1, data: [[0,0],[0.2,0.1], [0.4,0.3]] },{ label: "", yaxis:2, data: [[0,0],[0.2,0.2], [0.4,0.1]] }];
	        //plotdata = [{ yaxis:1, data: [] },{ yaxis:2, data: [] }];
	        
        	options = {
	            series: {
	                lines: {
	                    show: true
	                },
	                points: {
	                    show: false
	                }
	            },
	            grid: {
	                hoverable: true,
	                clickable: true
	            },
	            xaxis: { 
	                min: 0,
	                max: (_.isUndefined(mySettings.time_window) ? 10 : mySettings.time_window),
	                show: true
	            },
	            yaxes: [{ 
			                min: ymin,
			                max: ymax,
			                position: "left"
	            		},
	            		{ 
			                min: y2min,
			                max: y2max,
			                position: "right"
	            		}
	            ],
	            legend: {
	                position: "nw",
	                backgroundColor: "#fff",
	                //container: $("#chartLegend"),
	                //noColumns: legendArray.length
	            },
				selection: {
					mode: "xy"
				}
	        };
	        
	        yvalueLength = (_.isUndefined(mySettings.value) ? 0 : mySettings.value.length);
	        y2valueLength = (_.isUndefined(mySettings.y2value) ? 0 : mySettings.y2value.length);
	        
	        plotObject = $.plot("#" + thisplotID, plotdata, options);
            
	        plotObject.resize(function () {
			});
	        
			$("#" + thisplotID).bind("plotselected", function (event, ranges) {
	
				// clamp the zooming to prevent eternal zoom
	
				if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
					ranges.xaxis.to = ranges.xaxis.from + 0.00001;
				}
	
				if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
					ranges.yaxis.to = ranges.yaxis.from + 0.00001;
				}
				if (y2valueLength > 0) {
					if (ranges.y2axis.to - ranges.y2axis.from < 0.00001) {
						ranges.y2axis.to = ranges.y2axis.from + 0.00001;
					}
				}
	
				// do the zooming
	
				if (y2valueLength > 0) {
					plotObject = $.plot("#" + thisplotID, plotdata,
						$.extend(true, {}, options, {
							xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
							yaxes: [
									{ min: ranges.yaxis.from, max: ranges.yaxis.to },
									{ min: ranges.y2axis.from, max: ranges.y2axis.to }
									]
						})
					);
				}
				else {
					plotObject = $.plot("#" + thisplotID, plotdata,
						$.extend(true, {}, options, {
							xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
							yaxes: [
									{ min: ranges.yaxis.from, max: ranges.yaxis.to }
									]
						})
					);
				}
	
			});

	        $("<div id='tooltip'></div>").css({
	            position: "absolute",
	            display: "none",
	            border: "1px solid #fdd",
	            padding: "2px",
	            "background-color": "#fee",
	            opacity: 0.80
	        }).appendTo("body");
	
	        $("#" + thisplotID).bind("plothover", function (event, pos, item) {
	            if (item) {
	                var x = item.datapoint[0].toFixed(2),
	                    y = item.datapoint[1].toFixed(2);
	                
	                $("#tooltip").html("x = " + x + "<br>" + item.series.label + " = " + y)
	                    .css({top: item.pageY+5, left: item.pageX+5})
	                    .fadeIn(200);
	            } else {
	                $("#tooltip").hide();
	            }
	        });
	
	        $("#" + thisplotID).bind("plotclick", function (event, pos, item) {
	            if (item) {
	                plotObject.highlight(item.series, item.datapoint);
	            }
	        });
	        
			$("#" + thisplotID).bind('dblclick', function (event) {
				// Unzoom
				if (y2valueLength > 0) {
					plotObject = $.plot("#" + thisplotID, plotdata,
						$.extend(true, {}, options, {
							xaxis: { min: opts.xaxes[0].min, max: opts.xaxes[0].max },
							//yaxis: { min: opts.yaxes[0].min, max: opts.yaxes[0].max }
							yaxes: [
									{ min: opts.yaxes[0].min, max: opts.yaxes[0].max },
									{ min: opts.yaxes[1].min, max: opts.yaxes[1].max }
									]
						})
					);
				}
				else {
					plotObject = $.plot("#" + thisplotID, plotdata,
						$.extend(true, {}, options, {
							xaxis: { min: opts.xaxes[0].min, max: opts.xaxes[0].max },
							//yaxis: { min: opts.yaxes[0].min, max: opts.yaxes[0].max }
							yaxes: [
									{ min: opts.yaxes[0].min, max: opts.yaxes[0].max }
									]
						})
					);
				}
			});
			
			plotCreated = true;
        }

        this.render = function (element) {
            rendered = true;
            //$(element).append(titleElement).append(plotElement).append(legendElement);
            if (currentSettings.pausable) {
            	$(element).append(titleElement).append(plotElement).append(pauseElement);
           	}
           	else {
           		$(element).append(titleElement).append(plotElement);
           	}
            setYaxisRange(currentSettings);
            setY2axisRange(currentSettings);
            createPlot(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.time_window != currentSettings.time_window 
            	|| newSettings.xaxis != currentSettings.xaxis
            	|| newSettings.time != currentSettings.time
            	|| newSettings.value != currentSettings.value
            	|| newSettings.y2value != currentSettings.y2value
            	|| newSettings.height != currentSettings.height
            	|| newSettings.y_axis_min_range != currentSettings.y_axis_min_range
            	|| newSettings.y2_axis_min_range != currentSettings.y2_axis_min_range
            	|| newSettings.pausable != currentSettings.pausable) {
            	plotCreated = false;
            	plotdata = [];
                setYaxisRange(newSettings);
                setY2axisRange(newSettings);
                createPlot(newSettings);
            }
            if (newSettings.legendStr != currentSettings.legendStr
            		|| newSettings.include_legend != currentSettings.include_legend) {
            	plotCreated = false;
                legendArray = (_.isUndefined(newSettings.legendStr) || !newSettings.include_legend ? [] : (newSettings.legendStr).split(","));
                //rendered = false;
                plotdata = [];
                yDataArray = [];
                yDataArray2 = [];
                createPlot(newSettings);
            }
            
			currentSettings = newSettings;

            titleElement.html(newSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValueArg) {
            if (!_.isUndefined(plotObject) && plotCreated) {
            	if (settingName == "time") {
            		xData = Number(newValueArg);
            		newValue = [];
            	}
	        	else {
	        		// If we receive the left axis value and if there are values to come for the right axis
	        		// we wait for these values
	        		if ((settingName == "value") && (y2valueLength > 0)) {
	        			newValue = newValueArg;
	        		}
	        		else {
	        			// if there is a right axis, we add the new values from this axis
	        			if (y2valueLength > 0) {
	        				newValue = newValue.concat(newValueArg);
	        			}
	        			else {
	        				newValue = newValueArg;
	        			}
	        			
			        	// If multiple values, extends plotdata
			        	for (var i=plotdata.length; i<newValue.length; i++) {
							if (i < yvalueLength) {
			        			plotdata.push({ label: legendArray[i], yaxis:1, data: [] });
			        		}
			        		else {
			        			plotdata.push({ label: legendArray[i] + _t(" (right axis)"), yaxis:2, data: [] });
			        		}
			        	}
			        	
			        	for (var i=0; i<newValue.length; i++) {
			        		
		                	yData = Number(newValue[i]);
		                	if (i < yvalueLength) {
		                		yDataArray.push(yData);
		                	}
		                	else {
		                		yDataArray2.push(yData);
		                	}
			                if (currentSettings.xaxis == "seconds_from_start") {
			                	xData = (new Date() - initialDate)/1000;
			                }
			                
			                // First point of a new serie
				            if ((!_.isUndefined(xData)) && (!_.isUndefined(yData))) {
				            	if (xData < lastDate) {
				            		if (i===0) {
				            			plotdata = [{ label: legendArray[i], yaxis:1, data: [] }];
				           			}
				           			else {
				           				if (i < yvalueLength) {
				           					plotdata.push({ label: legendArray[i], yaxis:1, data: [] });
						        		}
						        		else {
						        			plotdata.push({ label: legendArray[i] + _t(" (right axis)"), yaxis:2, data: [] });
						        		}
				           			}
				            		yDataArray = [];
				            		yDataArray2 = [];
				            		lastPlot = -1000000;
				            	}
				            	lastDate = xData;
					            (plotdata[i].data).push([xData, yData]);
					            
					            // Remove old data out of time window
					            if (!pause) {
						            while ((xData - ((plotdata[i].data)[0])[0]) > Number(currentSettings.time_window)) {
						            	(plotdata[i].data).shift();
				           				if (i < yvalueLength) {
						            		yDataArray.shift();
						            	}
						            	else {
						            		yDataArray2.shift();
						            	}
						            }
						        }
					            last_ymin = Math.min.apply(null, yDataArray);
					            last_ymax = Math.max.apply(null, yDataArray);
					            last_y2min = Math.min.apply(null, yDataArray2);
					            last_y2max = Math.max.apply(null, yDataArray2);
					            
				                plotObject.setData(plotdata);	                
				                
			                	opts = plotObject.getOptions();
				                var nbData = (plotdata[i].data).length;
				                opts.xaxes[0].max = ((plotdata[i].data)[nbData-1])[0];
				                opts.xaxes[0].min = Math.max(0, opts.xaxes[0].max - Number(currentSettings.time_window));
				                
				                if (last_ymin < opts.yaxes[0].min) {
				                	opts.yaxes[0].min = center - 1.5 * (center - last_ymin);
				                }
				                else if (last_ymin > (opts.yaxes[0].min / 2)) {
				                	opts.yaxes[0].min = Math.min(last_ymin, ymin);
				                }
				                
				                if (last_ymax > opts.yaxes[0].max) {
				                	opts.yaxes[0].max = center + 1.5 * (last_ymax - center);
				                }
				                else if (last_ymax < (opts.yaxes[0].max / 2)) {
				                	opts.yaxes[0].max = Math.max(last_ymax, ymax);
				                }
				                
				                if (last_y2min < opts.yaxes[1].min) {
				                	opts.yaxes[1].min = center2 - 1.5 * (center2 - last_y2min);
				                }
				                else if (last_y2min > (opts.yaxes[1].min / 2)) {
				                	opts.yaxes[1].min = Math.min(last_y2min, y2min);
				                }
				                
				                if (last_y2max > opts.yaxes[1].max) {
				                	opts.yaxes[1].max = center2 + 1.5 * (last_y2max - center2);
				                }
				                else if (last_y2max < (opts.yaxes[1].max / 2)) {
				                	opts.yaxes[1].max = Math.max(last_y2max, y2max);
				                }
				                
				                // Max plot frequency: 10 ms * number of plot windows
				                if ((lastDate - lastPlot) > (0.01 * numberOfPlotWindows)) {
				                	if (!pause) {
						                plotObject.setupGrid();
						                plotObject.draw();
						            }
					                lastPlot = lastDate;
					            }
				            }
					    }
					}
				}
            }
        };

        this.onDispose = function () {
        };

        this.getHeight = function () {
            return Number(currentSettings.height);
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "plot",
        display_name: _t("Plot"),
        "external_scripts" : [
            "extensions/thirdparty/flot/jquery.flot.js",
            "extensions/thirdparty/flot/jquery.flot.time.js",
            "extensions/thirdparty/flot/jquery.flot.resize.js",
            "extensions/thirdparty/flot/jquery.flot.selection.js"
        ],
        settings: [
            {
                name: "title",
                display_name: _t("Title"),
                type: "text"
            },
            {
                name: "xaxis",
                display_name: _t("X axis"),
                type: "option",
                options: [
                    {
                        name: _t("Seconds from start"),
                        value: "seconds_from_start"
                    },
                    {
                        name: _t("Column of datasource"),
                        value: "datasource_column"
                    }
                ],
                description: _t('When choosing "Seconds from start", the data are timestamped when they are received')
            },
            {
                name: "time",
                display_name: _t("Time (X axis)"),
                type: "calculated",
                description: _t('Fill only if you chose "Column of datasource" above.')
            },
            {
                name: "time_window",
                display_name: _t("Time Window"),
                type: "text",
                default_value: 10,
                description: _t("Length (in seconds) of sliding time window")
            },
            {
                name: "value",
                display_name: _t("Left Y axis values"),
                type: "calculated",
                multi_input: "true",
                required: "true"
            },
            {
                name: "y_axis_min_range",
                display_name: _t("Left Y axis minimum range"),
                type: "text",
                default_value: "-10,10",
                description: _t("Two values separated by a comma. This range will be automatically extended if necessary, but it will not be reduced.")
            },
            {
                name: "y2value",
                display_name: _t("Right Y axis values"),
                type: "calculated",
                multi_input: "true"
            },
            {
                name: "y2_axis_min_range",
                display_name: _t("Right Y axis minimum range"),
                type: "text",
                default_value: "-10,10",
                description: _t("Two values separated by a comma. This range will be automatically extended if necessary, but it will not be reduced.")
            },
			{
				name: "include_legend",
				display_name: _t("Include Legend"),
				type: "boolean"
			},
			{
				name: "legendStr",
				display_name: _t("Legend"),
				type: "text",
				description: _t("Comma-separated for multiple plots, left variables first, then right variables")
			},
            {
                name: "height",
                display_name: _t("Height Blocks"),
                type: "number",
                default_value: 3,
                description: _t("A height block is around 60 pixels")
            },
            {
                name: "pausable",
                display_name: _t("Pausable"),
				type: "boolean",
                default_value: false
            }

        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new plotWidget(settings));
        }
    });
    
}());

