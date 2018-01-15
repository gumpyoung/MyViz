window.buttonrefreshID = 0;
(function() {    
    var buttonrefreshWidget = function (settings) {
        var thisbuttonrefreshID = window.buttonrefreshID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var buttonrefreshElement = $('<br /><button id="buttonrefresh-' + thisbuttonrefreshID + '" class="btn-class"></button>');

        var buttonrefreshObject;
        var rendered = false;

		var buttonrefresh;
        var currentSettings = settings;
 		        
        function createButtonRefresh(mySettings) {
            if (!rendered) {
                return;
            }
            
            
            buttonrefreshElement.empty();
        
            buttonrefresh = document.getElementById('buttonrefresh-' + thisbuttonrefreshID);
            
			buttonrefresh.innerHTML = mySettings.caption;
			
			// ...at mousedown events,...
			buttonrefresh.addEventListener('mousedown', function(){
				tabButtonRefresh[currentSettings.datasourcename] = 1;
			});
						
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(buttonrefreshElement);
            createButtonRefresh(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.datasourcename != currentSettings.datasourcename) {
            }

            if (newSettings.initialvalue != currentSettings.initialvalue 
            	|| newSettings.caption != currentSettings.caption) {
            		
                createButtonRefresh(newSettings);
            }
            
			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
        };

        this.onDispose = function () {
        };

        this.getHeight = function () {
            return 1;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "buttonrefresh",
        display_name: _t("ButtonRefresh"),
		description : _t("A Button widget for refreshing HTTP datasource."),
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
				name: "datasourcename",
				display_name: _t("Datasource"),
                type: "text",
				description: _t("You *must* create first a datasource with the same name")
			},
            {
                name: "caption",
                display_name: _t("Caption on button"),
                type: "text",
                default_value: _t("Switch on")
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new buttonrefreshWidget(settings));
        }
    });
    
}());

