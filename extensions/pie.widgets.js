window.pieID = 0;
(function() {    
    var pieWidget = function (settings) {
        var self = this;
        var thispieID = "pie-" + window.pieID++;
		
        var titleElement = $('<h2 class="section-title"></h2>');
        var pieElement = $('<div id="' + thispieID + '" style="width: 100%; height:350px"></div>');
		//var legendElement = $('<div id="chartLegend"></div>');

        var pieObject;
        var opts;
        var options;
        var rendered = false;
        var pieCreated = false;
	    var piedata = [];
	    var newValue;
	    
	    var initialDate = new Date();

        var currentSettings = settings;
	    var legendArray = (_.isUndefined(currentSettings.legendStr) ? [] : (currentSettings.legendStr).split(","));
        
        function createPie(mySettings) {
            if (!rendered) {
                return;
            }
            
            pieElement.empty();
		
        	options = {
	            series: {
	                pie: {
	                    show: true,
						label: {
			                show: mySettings.include_label,
			            }
	                }
	            },
			    legend: {
			        show: mySettings.include_legend
			    }
	        };
	        	        
			pieCreated = true;
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(pieElement);
            createPie(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.value != currentSettings.value
            	|| newSettings.height != currentSettings.height
				) {
            	pieCreated = false;
            	piedata = [];
                createPie(newSettings);
            }
            if (newSettings.legendStr != currentSettings.legendStr
            	|| newSettings.include_legend != currentSettings.include_legend
            	|| newSettings.include_label != currentSettings.include_label
            	) {
            	pieCreated = false;
                legendArray = (_.isUndefined(newSettings.legendStr) ? [] : (newSettings.legendStr).split(","));
                //rendered = false;
                piedata = [];
                createPie(newSettings);
            }
            
			currentSettings = newSettings;

            titleElement.html(newSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
			// currentSettings.value = [datasources["datasourcename"]["variablename1"], datasources["datasourcename"]["variablename2"]]
			piedata = [];
			for (var i=0; i<(currentSettings.value).length; i++) {
				elems = currentSettings.value[i].split('"');
				// Use legend array if the size is enough, otherwise use CSV header
				if (i < legendArray.length) {
					piedata.push({ label: legendArray[i],  data: newValue[i]});
				}
				else {
					piedata.push({ label: elems[3],  data: newValue[i]});
				}
			}
	        pieObject = $.plot("#" + thispieID, piedata, options);
        };

        this.onDispose = function () {
        };

        this.getHeight = function () {
        	H = Number(currentSettings.height);
        	pieElement.height(H * 60 - 42);
            return H;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "pie",
        display_name: _t("Pie Graph"),
        "external_scripts" : [
            "extensions/thirdparty/flot/jquery.flot.js",
            "extensions/thirdparty/flot/jquery.flot.pie.js",
        ],
        settings: [
            {
                name: "title",
                display_name: _t("Title"),
                type: "text"
            },
            {
                name: "value",
                display_name: _t("Variables"),
                type: "calculated",
                multi_input: "true",
                required: "true"
            },
			{
				name: "include_label",
				display_name: _t("Include Label"),
				type: "boolean",
                default_value: true
			},
			{
				name: "include_legend",
				display_name: _t("Include Legend"),
				type: "boolean",
                default_value: false
			},
			{
				name: "legendStr",
				display_name: _t("Legend / Labels"),
				type: "text",
				description: _t("Comma-separated texts")
			},
            {
                name: "height",
                display_name: _t("Height Blocks"),
                type: "number",
                default_value: 3,
                description: _t("A height block is around 60 pixels")
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new pieWidget(settings));
        }
    });
    
}());

