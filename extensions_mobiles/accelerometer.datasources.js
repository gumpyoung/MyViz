(function () {
	var accelerometerDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;

 		function sendData(e) {
			// Store message in session storage
			if (!!e.accelerationIncludingGravity) {
			    var ax = e.accelerationIncludingGravity.x;
			    var ay = e.accelerationIncludingGravity.y;
			    var az = e.accelerationIncludingGravity.z;
			    // Send to MyViz widgets
			    var data = {
					"ax": ax.toFixed(3),
					"ay": ay.toFixed(3),
					"az": az.toFixed(3)
				};
				updateCallback(data);
				// Store for websocket (for example)
				var ax_formula = (_.isUndefined(currentSettings.ax_formula) ? "ax" : currentSettings.ax_formula);
				var ay_formula = (_.isUndefined(currentSettings.ay_formula) ? "ay" : currentSettings.ay_formula);
				var az_formula = (_.isUndefined(currentSettings.az_formula) ? "az" : currentSettings.az_formula);
				sessionStorage.setItem(currentSettings.ax_variable, eval(ax_formula.replace("ax", ax.toFixed(3))));
				sessionStorage.setItem(currentSettings.ay_variable, eval(ay_formula.replace("ay", ay.toFixed(3))));
				sessionStorage.setItem(currentSettings.az_variable, eval(az_formula.replace("az", az.toFixed(3))));
			}
 		};
 		        
		function initializeDataSource() {
			window.addEventListener("devicemotion", sendData, true);
		}
		
		this.updateNow = function () {
			initializeDataSource();
		};
		
		this.stop = function() {
		};

		this.onDispose = function () {
		};

		this.onSettingsChanged = function (newSettings) {
			currentSettings = newSettings;
		};

		initializeDataSource();
	};

	freeboard.loadDatasourcePlugin({
		"type_name": "accelerometer",
		"display_name": _t("Accelerometer"),
		"settings": [
            {
                name: "ax_variable",
                display_name: _t("Ax variable"),
                type: "calculated",
                description: _t('Variable to send to other datasource (websocket, for example)')
            },
            {
                name: "ax_formula",
                display_name: _t("Formula for ax"),
                type: "text",
                description: _t('The value really sent will be computed from the ax value. <br />Use "ax" as value in the formula')
            },
            {
                name: "ay_variable",
                display_name: _t("Ay variable"),
                type: "calculated",
                description: _t('Variable to send to other datasource (websocket, for example)')
            },
            {
                name: "ay_formula",
                display_name: _t("Formula for ay"),
                type: "text",
                description: _t('The value really sent will be computed from the ay value. <br />Use "ay" as value in the formula')
            },
            {
                name: "az_variable",
                display_name: _t("Az variable"),
                type: "calculated",
                description: _t('Variable to send to other datasource (websocket, for example)')
            },
            {
                name: "az_formula",
                display_name: _t("Formula for az"),
                type: "text",
                description: _t('The value really sent will be computed from the az value. <br />Use "az" as value in the formula')
            },
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new accelerometerDatasource(settings, updateCallback));
		}
	});
	

}());
