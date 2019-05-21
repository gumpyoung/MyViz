window.buttonURLRequestID = 0;
(function() {    
    var buttonURLRequestWidget = function (settings) {
        var thisbuttonURLRequestID = window.buttonURLRequestID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var buttonURLRequestElement = $('<br /><button id="buttonURLRequest-' + thisbuttonURLRequestID + '" class="btn-class"></button>');

        var buttonURLRequestObject;
        var rendered = false;

		var buttonURLRequest;
        var currentSettings = settings;
        
        
        function urlRequest(){
                $.getJSON(currentSettings.URL, function(data) {
                                                });            
        }
 		        
        function createButtonURLRequest(mySettings) {
            if (!rendered) {
                return;
            }
            
            
            buttonURLRequestElement.empty();
        
            buttonURLRequest = document.getElementById('buttonURLRequest-' + thisbuttonURLRequestID);
            
			buttonURLRequest.innerHTML = mySettings.caption;
			
			buttonURLRequest.addEventListener('click', function(){
				urlRequest();
			});
			
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(buttonURLRequestElement);
            createButtonURLRequest(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {

            if (newSettings.requestURL != currentSettings.requestURL 
            	|| newSettings.caption != currentSettings.caption) {
            		
                createButtonURLRequest(newSettings);
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
        type_name: "buttonURLRequest",
        display_name: _t("Button URL Request"),
		description : _t("A Button widget that issue a URL request when clicked."),
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
                name: "url",
                display_name: _t("URL"),
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
                default_value: _t("Request")
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new buttonURLRequestWidget(settings));
        }
    });
    
}());

