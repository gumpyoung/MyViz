window.localcommandID = 0;
(function() {    
    var localcommandWidget = function (settings) {
        var thislocalcommandID = window.localcommandID++;
        var titleElement = $('<h2 class="section-title" style="padding-bottom:7px;"></h2>');
        var switchElement = $('<div id="localcommand-' + thislocalcommandID + '" class="onoffswitch"></div>');
        var buttonElement = $('<br /><button id="localcommandbutton-' + thislocalcommandID + '" class="btn-class"></button>');
        var localcommandElement = switchElement;

		var exec = require('child_process').spawn;
		var child;
		
        var localcommandObject;
        var rendered = false;
        var button;
        var sw;

		var localcommand;
        var currentSettings = settings;
        
        
        function createLocalCommand(mySettings) {
            if (!rendered) {
                return;
            }
            
            localcommandElement.empty();
            
            var style = (_.isUndefined(mySettings.style) ? "switch" : mySettings.style);
            // console.log(style);
            // console.log(style == "switch");
            
            if (style == "switch") {
            	localcommandElement = switchElement;
	        	var checkedStr = '';
	        	if (mySettings.initialstate) {
	        		checkedStr = 'checked="checked"';
	        	}
	
				var localcommandElementStr = '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="' + thislocalcommandID + '-localonoff" ' + checkedStr + '><label class="onoffswitch-label" for="' + thislocalcommandID + '-localonoff"><div class="onoffswitch-inner"><span class="on">' + mySettings.ontext + '</span><span class="off">' + mySettings.offtext + '</span></div><div class="onoffswitch-switch"></div></label>';
	            document.getElementById('localcommand-' + thislocalcommandID).innerHTML = localcommandElementStr;
	            
				$( "#" + thislocalcommandID + "-localonoff" ).change(function() {
					if (($( "#" + thislocalcommandID + "-localonoff" )).prop("checked")) {
						splitCommand = (mySettings.oncommand).split(" ");
						commandToExecute = splitCommand[0];
						args = [];
						for (i=1; i<splitCommand.length; i++) {
							args.push(splitCommand[i]);
						}
						child = exec(commandToExecute, args);
					}
					else {
						process.kill(child.pid);
					}
				});
			}
			else {
				localcommandElement.html(buttonElement);
				
				button = document.getElementById('localcommandbutton-' + thislocalcommandID);
				
				button.innerHTML = mySettings.caption;
				
				button.addEventListener('mousedown', function(){
					child = exec(mySettings.oncommand);
				});
				
				button.addEventListener('mouseup', function(){
				});
			}
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(localcommandElement);
            createLocalCommand(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if ((newSettings.style != currentSettings.style)
            	|| (newSettings.oncommand != currentSettings.oncommand)
            	|| (newSettings.ontext != currentSettings.ontext)
            	|| (newSettings.caption != currentSettings.caption)) {
                createLocalCommand(newSettings);
            }
            
			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
        };

        this.onDispose = function () {
			process.kill(child.pid);
        };

        this.getHeight = function () {
            return 1;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "localcommand",
        display_name: _t("Local command"),
		description : _t("Switch button executing a Local Command."),
        settings: [
            {
                name: "title",
                display_name: _t("Title"),
                type: "text"
            },
            {
                name: "style",
                display_name: _t("Style"),
                type: "option",
                options: [
                    {
                        name: _t("Switch"),
                        value: "switch"
                    },
                    {
                        name: _t("Button"),
                        value: "button"
                    }
                ],
                default_value: "switch"
            },
            {
                name: "oncommand",
                display_name: _t('"ON" command'),
                type: "text",
                description: _t("Command to execute when ON")
            },
            {
                name: "ontext",
                display_name: _t('"ON" text'),
                type: "text",
                description: _t("Only for switch style"),
                default_value: "ON"
            },
            {
                name: "offtext",
                display_name: _t('"OFF" text'),
                type: "text",
                description: _t("Only for switch style"),
                default_value: "OFF"
            },
            {
                name: "initialstate",
                display_name: _t("Initial state"),
                type: "boolean",
                description: _t("Only for switch style"),
                default_value: false
            },
            {
                name: "caption",
                display_name: _t('Caption'),
                type: "text",
                description: _t("Only for button style"),
                default_value: _t("Switch ON")
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new localcommandWidget(settings));
        }
    });
    
}());

