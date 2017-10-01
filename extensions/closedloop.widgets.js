window.closedloopID = 0;
(function() {    
    var closedloopWidget = function (settings) {
        var self = this;
        var thisclosedloopID = window.closedloopID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var closedloopElement = $('<div id="closedloop-' + thisclosedloopID + '"  style="position:relative"><img src="./img/ClosedLoop_1.jpg" style="margin-top: 25px;margin-left: 30px;"></div>' +
        							'<div id="closedloop-ref-' + thisclosedloopID + '"  style="position:absolute;left: 70px;top: 90px; font-weight:bold; color:rgb(255, 153, 0);">0</div><br />' +
        							'<div id="closedloop-error-' + thisclosedloopID + '"  style="position:absolute;left: 190px;top: 90px; font-weight:bold; color:rgb(255, 153, 0);">0</div><br />' +
        							'<div id="closedloop-command-' + thisclosedloopID + '"  style="position:absolute;left: 315px;top: 90px; font-weight:bold; color:rgb(255, 153, 0);">0</div><br />' +
        							'<div id="closedloop-output1-' + thisclosedloopID + '"  style="position:absolute;left: 450px;top: 90px; font-weight:bold; color:rgb(255, 153, 0);">0</div><br />' +
        							'<div id="closedloop-output2-' + thisclosedloopID + '"  style="position:absolute;left: 180px;top: 140px; font-weight:bold; color:rgb(255, 153, 0);">0</div><br />');

        var rendered = false;

        var currentSettings = settings;
                
        this.render = function (element) {
            rendered = true;
            $(element).empty();
            $(element).append(titleElement).append(closedloopElement);
        };

        this.onSettingsChanged = function (newSettings) {
			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
        	if (settingName == "ref") {
        		$("#closedloop-ref-" + thisclosedloopID).html(newValue);
        	}
        	else if (settingName == "error") {
        		$("#closedloop-error-" + thisclosedloopID).html(newValue);
        	}
        	else if (settingName == "command") {
        		$("#closedloop-command-" + thisclosedloopID).html(newValue);
        	}
        	else if (settingName == "output") {
        		$("#closedloop-output1-" + thisclosedloopID).html(newValue);
         		$("#closedloop-output2-" + thisclosedloopID).html(newValue);
       	}
        	else {
        		console.log("Error: received", settingName);
        	}
        };

        this.onDispose = function () {
        };

        this.getHeight = function () {
            return 4;
        };

        this.onSettingsChanged(settings);        
    };

    freeboard.loadWidgetPlugin({
        type_name: "closedloop",
        display_name: _t("Display closed loop"),
        settings: [
            {
                name: "title",
                display_name: _t("Title"),
                type: "text"
            },
            {
                name: "ref",
                display_name: _t("Reference"),
                type: "calculated",
				description: _t("Variable corresponding to control reference")
            },
            {
                name: "error",
                display_name: _t("Error"),
                type: "calculated",
				description: _t("Variable corresponding to the error between the reference and the output")
            },
            {
                name: "command",
                display_name: _t("Command"),
                type: "calculated",
				description: _t("Variable corresponding to the output of the controller")
            },
            {
                name: "output",
                display_name: _t("Output"),
                type: "calculated",
				description: _t("Variable corresponding to the output of the closed loop")
            }
       ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new closedloopWidget(settings));
        }
    });
    
}());

