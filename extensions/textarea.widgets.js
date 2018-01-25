window.textareaID = 0;
(function() {    
    var textAreaWidget = function (settings) {
	    var textdata = [];
	    var pausedata = [];
	    var pause = false;
	    var resume = false;
        var currentSettings = settings;
        var thistextareaID = "textarea-" + window.textareaID++;
        var nbLines = 0;
        var numLines = 0;
        var currentFirstLineNumber = 1;
	    
		saveText = function(_thisref, event)
		{
			var contentType = 'application/octet-stream';
			var a = document.createElement('a');
			
			// Save data with header
			// Extract variable name from, for example,
			// currentSettings.value = [datasources["datasourcename"]["variablename1"], datasources["datasourcename"]["variablename2"]]
			var savedata = [];
			for (var i=0; i<(currentSettings.value).length; i++) {
				// If _rawdata and serialport, "explode" _rawdata names
				elems = currentSettings.value[i].split('"');
				if ((elems[3] == "_rawdata") && (freeboard.getDatasourceType(elems[1]) == "serialport")) {
					savedata.push((freeboard.getDatasourceSettings(elems[1])).variables_to_read);
				}
				else {
					savedata.push(elems[3]);
				}
			}
			
			var blob = new Blob([savedata.join(",") + "\n" + textdata.join("\n")], {'type': contentType});

			document.body.appendChild(a);
			a.href = window.URL.createObjectURL(blob);
			a.download = "savefile.csv";
			a.target="_self";
			a.click();
		};
	
		pauseText = function()
		{
			if (!pause) {
				pause = true;
				$("#pauseresume-" + thistextareaID).removeClass("icon-pause");
				$("#pauseresume-" + thistextareaID).addClass("icon-play");
				$("#labelpauseresume-" + thistextareaID).html(_t("Play"));
			}
			else {
				pause = false;
				resume = true;
				$("#pauseresume-" + thistextareaID).removeClass("icon-play");
				$("#pauseresume-" + thistextareaID).addClass("icon-pause");
				$("#labelpauseresume-" + thistextareaID).html(_t("Pause"));
			}
		};
		
		clearText = function()
		{
			textdata = [];
			textAreaElement.empty();
		};
	
        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var textAreaElement = $('<div id="' + thistextareaID + '" style="margin-top:10px; width: 100%; height:110px; overflow:auto"></div>');
        var saveElements = $('<ul style="margin-top:10px" class="board-toolbar horizontal"><li><i id="pauseresume-' + thistextareaID + '" class="icon-pause icon-white"></i>&nbsp;<label id="labelpauseresume-' + thistextareaID + '" data-bind="click: pauseText" style="color: #B88F51; margin-top:1px">' + _t("Pause") + '</label></li><li><i class="icon-download-alt icon-white"></i>&nbsp;<label data-bind="click: saveText" style="color: #B88F51; margin-top:1px">' + _t("Save ") + '</label></li><li><i class="icon-trash icon-white"></i>&nbsp;<label data-bind="click: clearText" style="color: #B88F51; margin-top:1px">' + _t("Clear") + '</label></li></ul>');
		

        var rendered = false;

        function createTextArea() {
            if (!rendered) {
                return;
            }

            textAreaElement.empty();
        }

        this.render = function (element) {
            rendered = true;
            $(element).append(titleElement).append(textAreaElement).append(saveElements);
            createTextArea();
        };

        this.onSettingsChanged = function (newSettings) {
            if (newSettings.nblines_window != currentSettings.nblines_window 
            	|| newSettings.value != currentSettings.value) {
                createTextArea();
            }

			currentSettings = newSettings;
            titleElement.html(newSettings.title);
        };

        this.onCalculatedValueChanged = function (settingName, newValue) {
			//console.log(newValue);
			//console.log(Number(newValue));
						
			if (pause) {
				pausedata.push(newValue);
			}
			else if (resume) {
				resume = false;
				textdata = textdata.concat(pausedata);
				textdata.push(newValue);
				
				for (var i = 0; i < pausedata.length; i++) {
					nbLines++;
					numLines++;
					if (nbLines > Number(currentSettings.nblines_window)) {
						// Remove first line in case there are more lines than specified
						$("#line" + currentFirstLineNumber).remove();
						currentFirstLineNumber++;
						nbLines--;
					}
					textAreaElement.append('<span id="line' + numLines + '"><br />' + pausedata[i] + '</span>');
				}
				/*textAreaElement.append("<br />");
				textAreaElement.append(pausedata.join("<br />"));
				textAreaElement.append("<br />" + newValue);
				textAreaElement[0].scrollTop = textAreaElement[0].scrollHeight;*/
				
				nbLines++;
				numLines++;
				if (nbLines > Number(currentSettings.nblines_window)) {
					// Remove first line in case there are more lines than specified
					$("#line" + currentFirstLineNumber).remove();
					currentFirstLineNumber++;
					nbLines--;
				}
				textAreaElement.append('<span id="line' + numLines + '"><br />' + newValue + '</span>');
				textAreaElement[0].scrollTop = textAreaElement[0].scrollHeight;
				
				pausedata = [];
			}
			else {
				textdata.push(newValue);
				nbLines++;
				numLines++;
				if (nbLines > Number(currentSettings.nblines_window)) {
					// Remove first line in case there are more lines than specified
					$("#line" + currentFirstLineNumber).remove();
					currentFirstLineNumber++;
					nbLines--;
				}
				textAreaElement.append('<span id="line' + numLines + '"><br />' + newValue + '</span>');
				textAreaElement[0].scrollTop = textAreaElement[0].scrollHeight;
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
        type_name: "textarea",
        display_name: _t("Text Area"),
        settings: [
            {
                name: "title",
                display_name: _t("Title"),
                type: "text"
            },
            {
                name: "nblines_window",
                display_name: _t("Number of lines to keep"),
                type: "text",
                default_value: "100",
                description: _t("Empty for unlimited")
            },
            {
                name: "value",
                display_name: _t("Value"),
                type: "calculated",
                multi_input: "true"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new textAreaWidget(settings));
        }
    });
    
}());

