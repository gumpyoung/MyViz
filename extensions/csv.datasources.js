(function () {
	var csvDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;
		var csv = require("csvtojson");

		this.updateNow = function () {
			var csvFilePath = currentSettings.datafile;
			csv()
			.fromFile(csvFilePath)
			.on('json',function(jsonObj){
				updateCallback(jsonObj);
			});
		};

		this.onDispose = function () {
		};

		this.onSettingsChanged = function (newSettings) {
			currentSettings = newSettings;
			self.updateNow();
		};
	};

	freeboard.loadDatasourcePlugin({
		"type_name": "csv",
		"display_name": _t("CSV"),
		"settings": [
			{
				"name": "datafile",
				"display_name": _t("CSV File"),
				"type": "file",
				"description": _t("Click into this text input in order to select the file.")
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new csvDatasource(settings, updateCallback));
		}
	});


}());
