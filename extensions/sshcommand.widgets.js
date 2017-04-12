window.sshcommandID = 0;
(function() {    
    var sshcommandWidget = function (settings) {
        var thissshcommandID = window.sshcommandID++;
        var titleElement = $('<h2 class="section-title" style="padding-bottom:7px;"></h2>');
        var switchElement = $('<div id="sshcommand-' + thissshcommandID + '" class="onoffswitch"></div>');
        var buttonElement = $('<br /><button id="sshcommandbutton-' + thissshcommandID + '" class="btn-class"></button>');
        var sshcommandElement = switchElement;

		var exec = require('ssh-exec');
		
        var sshcommandObject;
        var rendered = false;
        var button;
        var sw;

		var sshcommand;
        var currentSettings = settings;
        
        
        function createSSHCommand(mySettings) {
            if (!rendered) {
                return;
            }
            
            sshcommandElement.empty();
            
            var style = (_.isUndefined(mySettings.style) ? "switch" : mySettings.style);
            // console.log(style);
            // console.log(style == "switch");
            
            if (style == "switch") {
            	sshcommandElement = switchElement;
	        	var checkedStr = '';
	        	if (mySettings.initialstate) {
	        		checkedStr = 'checked="checked"';
	        	}
	
				var sshcommandElementStr = '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="' + thissshcommandID + '-sshonoff" ' + checkedStr + '><label class="onoffswitch-label" for="' + thissshcommandID + '-sshonoff"><div class="onoffswitch-inner"><span class="on">' + mySettings.ontext + '</span><span class="off">' + mySettings.offtext + '</span></div><div class="onoffswitch-switch"></div></label>';
	            document.getElementById('sshcommand-' + thissshcommandID).innerHTML = sshcommandElementStr;
	            
				$( "#" + thissshcommandID + "-sshonoff" ).change(function() {
					if (($( "#" + thissshcommandID + "-sshonoff" )).prop("checked")) {
						exec(mySettings.oncommand, {user: mySettings.login, host: mySettings.host, password: mySettings.password}).pipe(process.stdout);
					}
					else {
						exec(mySettings.offcommand, {user: mySettings.login, host: mySettings.host, password: mySettings.password}).pipe(process.stdout);
					}
				});
			}
			else {
				sshcommandElement.html(buttonElement);
				
				button = document.getElementById('sshcommandbutton-' + thissshcommandID);
				
				button.innerHTML = mySettings.caption;
				
				button.addEventListener('mousedown', function(){
					exec(mySettings.oncommand, {user: mySettings.login, host: mySettings.host, password: mySettings.password}).pipe(process.stdout);
				});
				
				button.addEventListener('mouseup', function(){
					exec(mySettings.offcommand, {user: mySettings.login, host: mySettings.host, password: mySettings.password}).pipe(process.stdout);
				});
			}
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(sshcommandElement);
            createSSHCommand(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if ((newSettings.style != currentSettings.style)
            	|| (newSettings.oncommand != currentSettings.oncommand)
            	|| (newSettings.offcommand != currentSettings.offcommand)
            	|| (newSettings.ontext != currentSettings.ontext)
            	|| (newSettings.offtext != currentSettings.offtext)
            	|| (newSettings.caption != currentSettings.caption)) {
                createSSHCommand(newSettings);
            }
            
			currentSettings = newSettings;
            titleElement.html(currentSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
        };

        this.onDispose = function () {
			exec(mySettings.offcommand, {user: mySettings.login, host: mySettings.host, password: mySettings.password}).pipe(process.stdout);
        };

        this.getHeight = function () {
            return 1;
        };

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "sshcommand",
        display_name: _t("SSH command"),
		description : _t("Switch button executing a SSH Command."),
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
				name: "host",
				display_name: _t("Host"),
                type: "text",
				description: _t("SSH Host (without the port)")
			},
			{
				name: "login",
				display_name: _t("Login"),
                type: "text",
				description: _t("SSH Login")
			},
			{
				name: "password",
				display_name: _t("Password"),
                type: "text",
				description: _t("SSH Password")
			},
            {
                name: "oncommand",
                display_name: _t('"ON" command'),
                type: "text",
                description: _t("Command to execute when ON")
            },
            {
                name: "offcommand",
                display_name: _t('"OFF" command'),
                type: "text",
                description: _t("Command to execute when OFF")
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
            newInstanceCallback(new sshcommandWidget(settings));
        }
    });
    
}());

