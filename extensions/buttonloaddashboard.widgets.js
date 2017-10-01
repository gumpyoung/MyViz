window.buttonLoadDashboardID = 0;
(function() {    
    var buttonLoadDashboardWidget = function (settings) {
        var thisbuttonLoadDashboardID = window.buttonLoadDashboardID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var buttonLoadDashboardElement = $('<br /><button id="buttonLoadDashboard-' + thisbuttonLoadDashboardID + '" class="btn-class"></button>');

        var buttonLoadDashboardObject;
        var rendered = false;

		var buttonLoadDashboard;
        var currentSettings = settings;
        
        
 		function loadDashboard() {
			const fs = require('fs');
			var jsonText = fs.readFileSync(currentSettings.dashboard);
			var jsonObject = JSON.parse(jsonText);
			freeboard.loadDashboard(jsonObject);
			freeboard.setEditing(false);
 		};
 		        
        function createButtonLoadDashboard(mySettings) {
            if (!rendered) {
                return;
            }
            
            
            buttonLoadDashboardElement.empty();
        
            buttonLoadDashboard = document.getElementById('buttonLoadDashboard-' + thisbuttonLoadDashboardID);
            
			buttonLoadDashboard.innerHTML = mySettings.caption;
			
			buttonLoadDashboard.addEventListener('click', function(){
				loadDashboard();
			});
			
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(buttonLoadDashboardElement);
            createButtonLoadDashboard(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {

            if (newSettings.dashboard != currentSettings.dashboard 
            	|| newSettings.caption != currentSettings.caption) {
            		
                createButtonLoadDashboard(newSettings);
            }
            
			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
        };

        this.onDispose = function () {
        };

        this.getHeight = function () {
            return Number(currentSettings.height);
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "buttonLoadDashboard",
        display_name: _t("Button Load Dashboard"),
		description : _t("A Button widget that loads a dashboard when clicked."),
		// external_scripts: [
			// "extensions/thirdparty/socket.io-1.3.5.js"
		// ],
        settings: [
            {
                name: "title",
                display_name: _t("Title"),
                type: "text"
            },
            {
                name: "dashboard",
                display_name: _t("Dashboard"),
                type: "text",
            },
            {
                name: "height",
                display_name: _t("Height"),
                type: "text",
                default_value: 1
            },
            {
                name: "caption",
                display_name: _t("Caption on button"),
                type: "text",
                default_value: _t("Load")
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new buttonLoadDashboardWidget(settings));
        }
    });
    
}());

