window.sshcommandID = 0;
(function() {    
    var sshcommandWidget = function (settings) {
        var thissshcommandID = window.sshcommandID++;
        var titleElement = $('<h2 class="section-title" style="padding-bottom:7px;"></h2>');
        var sshcommandElement = $('<div id="sshcommand-' + thissshcommandID + '" class="onoffswitch"></div>');

		var exec = require('ssh-exec');
		
        var sshcommandObject;
        var rendered = false;

		var sshcommand;
        var currentSettings = settings;
        
        
        function createSSHCommand(mySettings) {
            if (!rendered) {
                return;
            }
            
            //sshcommandElement.empty();
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
			
			/*var input = $('<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="' + thissshcommandID + '-onoff">').prependTo(sshcommandElement).change(function() {
				newSettings.settings[thissshcommandID] = this.checked;
			});*/
	
			/*if (thissshcommandID in currentSettingsValues) {
				input.prop("checked", currentSettingsValues[thissshcommandID]);
			}*/
							        
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(sshcommandElement);
            createSSHCommand(currentSettings);
        };

        this.onSettingsChanged = function (newSettings) {
            if ((newSettings.ontext != currentSettings.ontext)
            	|| (newSettings.offtext != currentSettings.offtext)) {
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
                default_value: "ON",
                description: _t("Corresponding numeric value is 1")
            },
            {
                name: "offtext",
                display_name: _t('"OFF" text'),
                type: "text",
                default_value: "OFF",
                description: _t("Corresponding numeric value is 0")
            },
            {
                name: "initialstate",
                display_name: _t("Initial state"),
                type: "boolean",
                default_value: false
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new sshcommandWidget(settings));
        }
    });
    
}());

