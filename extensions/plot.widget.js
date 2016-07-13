window.plotID = 0;
(function() {    
        var plotWidget = function (settings) {
        var self = this;
        var thisplotID = "plot-" + window.plotID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var plotElement = $('<div id="' + thisplotID + '" style="width: 100%; height:150px"></div>');
		//var legendElement = $('<div id="chartLegend"></div>');

        var plotObject;
        var opts;
        var options;
        var rendered = false;
	    var plotdata = [];
	    
	    var initialDate = new Date();
	    var xData, yData;
	    var yDataArray = [];
	    var ymin, ymax;
	    var last_ymin, last_ymax, center;
	    var lastDate = initialDate;
	    var lastPlot = -1000000;

        var currentSettings = settings;
	    var legendArray = (_.isUndefined(currentSettings.legendStr) || !currentSettings.include_legend ? [] : (currentSettings.legendStr).split(","));
        
        function setYaxisRange() {
            if ((_.isUndefined(currentSettings.y_axis_min_range)) || ((currentSettings.y_axis_min_range).indexOf(",") === -1)) {
            	y_axis_min_range_array = [-10,10];
            }
            else {
            	y_axis_min_range_array = ((currentSettings.y_axis_min_range).split(",")).map(parseFloat);
           	}
        	ymin = Math.min.apply(null, y_axis_min_range_array);
        	last_ymin = ymin;
        	ymax = Math.max.apply(null, y_axis_min_range_array);
        	last_ymax = ymax;
        	center = (ymin + ymax)/2;
        }

        function createPlot() {
            if (!rendered) {
                return;
            }

            plotElement.empty();

	        plotdata.push({ label: "", data: [] });
	        
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
	                max: (_.isUndefined(currentSettings.time_window) ? 10 : currentSettings.time_window)
	            },
	            xaxis: {
					show: true
				},
	            yaxis: { 
	                min: ymin,
	                max: ymax
	            },
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
	
				// do the zooming
	
				plotObject = $.plot("#" + thisplotID, plotdata,
					$.extend(true, {}, options, {
						xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
						yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
					})
				);
	
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
	                
	                $("#tooltip").html(item.series.label + " = " + y)
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
				plotObject = $.plot("#" + thisplotID, plotdata,
					$.extend(true, {}, options, {
						//xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
						yaxis: { min: opts.yaxes[0].min, max: opts.yaxes[0].max }
					})
				);
			});
        }

        this.render = function (element) {
            rendered = true;
            //$(element).append(titleElement).append(plotElement).append(legendElement);
            $(element).append(titleElement).append(plotElement);
            setYaxisRange();
            createPlot();
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.time_window != currentSettings.time_window 
            	|| newSettings.xaxis != currentSettings.xaxis
            	|| newSettings.time != currentSettings.time
            	|| newSettings.value != currentSettings.value
            	|| newSettings.y_axis_min_range != currentSettings.y_axis_min_range) {
                setYaxisRange();
                createPlot();
            }
            else if (newSettings.legendStr != currentSettings.legendStr
            		|| newSettings.include_legend != currentSettings.include_legend) {
                legendArray = (_.isUndefined(newSettings.legendStr) || !newSettings.include_legend ? [] : (newSettings.legendStr).split(","));
                rendered = false;
                plotdata = [];
                yDataArray = [];
                createPlot();
            }
			currentSettings = newSettings;

            titleElement.html(newSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (!_.isUndefined(plotObject)) {
	        	
            	if (settingName == "time") {
            		xData = Number(newValue);
            	}
	        	
	        	// If multiple values, extends plotdata
	        	for (var i=plotdata.length; i<newValue.length; i++) {
	        		plotdata.push({ label: legendArray[i], data: [] });
	        	}
	        	
	        	for (var i=0; i<newValue.length; i++) {
	        		
	                if (currentSettings.xaxis == "seconds_from_start") {
	                	yData = Number(newValue[i]);
	                	yDataArray.push(yData);
	                	xData = (new Date() - initialDate)/1000;
	                }
	                else {
	                	if (settingName == "value") {
		                	yData = Number(newValue[i]);
		                	yDataArray.push(yData);		                		
	                	}
	                }
	                
	                // First point of a new serie
		            if ((!_.isUndefined(xData)) && (!_.isUndefined(yData))) {
		            	if (xData < lastDate) {
		            		if (i===0) {
		            			plotdata = [{ label: legendArray[i], data: [] }];
		           			}
		           			else {
		           				plotdata.push({ label: legendArray[i], data: [] });
		           			}
		            		yDataArray = [];
		            		lastPlot = -1000000;
		            	}
		            	lastDate = xData;
			            (plotdata[i].data).push([xData, yData]);
			            
			            // Remove old data out of time window
			            while ((xData - ((plotdata[i].data)[0])[0]) > Number(currentSettings.time_window)) {
			            	(plotdata[i].data).shift();
			            	yDataArray.shift();
			            }
			            last_ymin = Math.min.apply(null, yDataArray);
			            last_ymax = Math.max.apply(null, yDataArray);
			            
		                plotObject.setData(plotdata);	                
		                
		                opts = plotObject.getOptions();
		                var nbData = (plotdata[i].data).length;
		                opts.xaxes[0].max = ((plotdata[i].data)[nbData-1])[0];
		                opts.xaxes[0].min = Math.max(0, opts.xaxes[0].max - Number(currentSettings.time_window));
		                
		                if (last_ymin < opts.yaxes[0].min) {
		                	opts.yaxes[0].min = center - 2 * (center - last_ymin);
		                }
		                else if (last_ymin > (opts.yaxes[0].min / 2)) {
		                	opts.yaxes[0].min = Math.min(last_ymin, ymin);
		                }
		                
		                if (last_ymax > opts.yaxes[0].max) {
		                	opts.yaxes[0].max = center + 2 * (last_ymax - center);
		                }
		                else if (last_ymax < (opts.yaxes[0].max / 2)) {
		                	opts.yaxes[0].max = Math.max(last_ymax, ymax);
		                }
		                // Max plot frequency: 100 ms
		                if ((lastDate - lastPlot) > 0.1) {
			                plotObject.setupGrid();
			                plotObject.draw();
			                lastPlot = lastDate;
			            }
		            }
			    }
            }
        };

        this.onDispose = function () {
        };

        this.getHeight = function () {
            return 3;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "plot",
        display_name: "Plot",
        "external_scripts" : [
            "extensions/thirdparty/flot/jquery.flot.js",
            "extensions/thirdparty/flot/jquery.flot.time.js",
            "extensions/thirdparty/flot/jquery.flot.resize.js",
            "extensions/thirdparty/flot/jquery.flot.selection.js"
        ],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "xaxis",
                display_name: "X axis",
                type: "option",
                options: [
                    {
                        name: "Seconds from start",
                        value: "seconds_from_start"
                    },
                    {
                        name: "Column of datasource",
                        value: "datasource_column"
                    }
                ],
                description: 'When choosing "Seconds from start", the data are timestamped when they are received'
            },
            {
                name: "time",
                display_name: "Time (X axis)",
                type: "calculated",
                description: 'Fill only if you chose "Column of datasource" above.'
            },
            {
                name: "time_window",
                display_name: "Time Window",
                type: "text",
                default_value: 10,
                description: "Length (in seconds) of sliding time window"
            },
            {
                name: "value",
                display_name: "Value",
                type: "calculated",
                multi_input: "true"
            },
            {
                name: "y_axis_min_range",
                display_name: "Y axis minimum range",
                type: "text",
                default_value: "-10,10",
                description: "Two values separated by a comma. This range will be automatically extended if necessary, but it will not be reduced."
            },
			{
				name: "include_legend",
				display_name: "Include Legend",
				type: "boolean"
			},
			{
				name: "legendStr",
				display_name: "Legend",
				type: "text",
				description: "Comma-separated for multiple plots"
			}
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new plotWidget(settings));
        }
    });
    
}());

