window.iframeID = 0;
(function() {    
        var iFrameWidget = function (settings) {
        var self = this;
        if (window.iframeID == 0) {
        	refreshIframe = Array();
        }
        var thisiframeID = "iframe-" + window.iframeID++;

		refreshIframe.push( function() {
			$('#' + thisiframeID).attr("src", $('#' + thisiframeID).attr("src"));
		});

        var titleElement = $('<h2 class="section-title"></h2>');
        var refreshElement = $('<ul style="margin-top:-5px" class="board-toolbar horizontal"><li><i id="refresh-' + thisiframeID + '" class="icon-refresh icon-white"></i>&nbsp;<label id="labelrefresh-' + thisiframeID + '" data-bind="click: refreshIframe[' + (window.iframeID - 1) +']" style="color: #B88F51; margin-top:1px">' + _t("Recharger") + '</label></li></ul><br /><br />');
        var iFrameElement = $('<iframe id="' + thisiframeID + '" frameborder="0" width="100%" height="4800px"></iframe>');

        var iFrameObject;
        var rendered = false;
	    
        var currentSettings = settings;
        
        function createIFrame() {
            if (!rendered) {
                return;
            }

            iFrameElement.empty();
			$('#' + thisiframeID).attr('src', currentSettings.host);
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(refreshElement).append(iFrameElement);
            createIFrame();
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.host != currentSettings.host) {
                currentSettings = newSettings;

                createIFrame();
            }
            else {
                currentSettings = newSettings;
            }

            titleElement.html(newSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (!_.isUndefined(iFrameObject)) {
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
        type_name: "iframewidget",
        display_name: "Iframe",
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
			{
				name: "host",
				display_name: "HOST",
				type: "text",
				"required" : true,
				description: "Include http://..."
			}
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new iFrameWidget(settings));
        }
    });
    
}());

