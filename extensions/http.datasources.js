(function () {
	var httpDatasource = function (settings, updateCallback) {
		var self = this;
		var updateTimer = null;
		var currentSettings = settings;
		sessionStorage.clear();
		var readSessionStorage = undefined;

		var updateTimerRefresh = undefined;
		var firstTime = 1;
		var sendRequest = false;
		var prevURL = currentSettings.url;
		var prevBody= currentSettings.body;
		
		var listVariablesToSend = (_.isUndefined(currentSettings.variables_to_send) ? "" : currentSettings.variables_to_send).split(",");
		// Object with keys from list of variables to send, each value is 0
		var newData = _.object(listVariablesToSend, _.range(listVariablesToSend.length).map(function () { return 0; }));
        
        myName = updateCallback(newData);

		this.updateNow = function () {
			var requestURL = currentSettings.url;

			var body = currentSettings.body;

			// Replace placeholders by variables to send in the URL
        	for (var i=0; i<listVariablesToSend.length; i++) {
    			item = 'datasources["' + myName + '"]["' + listVariablesToSend[i] + '"]';
    			var sessionStorageVar = sessionStorage.getItem(item);
				requestURL = requestURL.replace(listVariablesToSend[i], sessionStorageVar);
			}
			console.log("requestURL: ", requestURL);

			// Can the body be converted to JSON?
			if (body) {
				try {
					body = JSON.parse(body);
				}
				catch (e) {
					console.log(e);
				}
			}

			// Determine if request you be sent or not
			sendRequest = false;
			if (requestURL != prevURL) {
				sendRequest = true;
			}
			else {
				if (currentSettings.send_if_equal || (currentSettings.refresh == -1)) {
					sendRequest = true;
				}
				else {
					if (body != prevBody) {
						sendRequest = true;
					}
				}
			}
			prevURL = requestURL;
			prevBody = body;
			
			if (!firstTime && sendRequest) {
				$.ajax({
					url: requestURL,
					dataType: "HTML",
					type: currentSettings.method || "GET",
					data: body,
					beforeSend: function (xhr) {
						try {
							_.each(currentSettings.headers, function (header) {
								var name = header.name;
								var value = header.value;
	
								if (!_.isUndefined(name) && !_.isUndefined(value)) {
									xhr.setRequestHeader(name, value);
								}
							});
						}
						catch (e) {
							console.log(e);
						}
					},
					success: function (data) {
						console.log(data);
						//updateCallback(data);
						var dataToSend = {response: data};
						$.extend(newData, dataToSend);
						updateCallback(newData);
					},
					error: function (xhr, status, error) {
						console.log(error);
					}
				});
			}
			else {
				firstTime = 0;
			}
		};

		function updateRefresh(refreshTime) {
			if (updateTimer) {
				clearInterval(updateTimer);
			}

			if (refreshTime != -1) {
				updateTimer = setInterval(function () {
					self.updateNow();
				}, refreshTime);
			}
		}

		updateRefresh(currentSettings.refresh);

		this.onDispose = function () {
			if (!_.isUndefined(updateTimerRefresh)) {
				clearInterval(updateTimerRefresh);
			}
			clearInterval(updateTimer);
			updateTimer = null;
		};

		function checkButton(refreshTime) {
			updateTimerRefresh = setInterval(function () {
				if (tabButtonRefresh[myName] == 1) {
					tabButtonRefresh[myName] = 0;
					self.updateNow();
				}
			}, refreshTime);
		}
		checkButton(100);
		
		this.onSettingsChanged = function (newSettings) {

            if (newSettings.refresh != currentSettings.refresh) {
            	updateRefresh(newSettings.refresh);
            }
            
            if (newSettings.variables_to_send != currentSettings.variables_to_send) {
				listVariablesToSend = (_.isUndefined(newSettings.variables_to_send) ? "" : newSettings.variables_to_send).split(",");
            }
            
			currentSettings = newSettings;
			
		};
	};

	freeboard.loadDatasourcePlugin({
		type_name: "HTTP",
		settings: [
			{
				name: "url",
				display_name: "URL",
				type: "text"
			},
			{
				name: "variables_to_send",
				display_name: _t("Variables"),
				type: "text",
				"required" : false,
				description: _t("Variables (if any) used in the URL above, separated by comma")
			},
			{
				name: "refresh",
				display_name: _t("Refresh Every"),
				type: "number",
				suffix: _t("milliseconds"),
				default_value: 5000,
				description: _t('Put -1 for a one-shot request.')
			},
			{
				name: "send_if_equal",
				display_name: _t("Send if request has not changed"),
				type: "boolean",
				default_value: false,
				description: _t('Whether or not the request must be sent if the "refresh" parameter above is > 0 and if the request has not changed.')
			},
			{
				name: "method",
				display_name: _t("Method"),
				type: "option",
				options: [
					{
						name: "GET",
						value: "GET"
					},
					{
						name: "POST",
						value: "POST"
					},
					{
						name: "PUT",
						value: "PUT"
					},
					{
						name: "DELETE",
						value: "DELETE"
					}
				]
			},
			{
				name: "body",
				display_name: _t("Body"),
				type: "text",
				description: _t("The body of the request. Normally only used if method is POST")
			},
			{
				name: "headers",
				display_name: _t("Headers"),
				type: "array",
				settings: [
					{
						name: "name",
						display_name: _t("Name"),
						type: "text"
					},
					{
						name: "value",
						display_name: _t("Value"),
						type: "text"
					}
				]
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new httpDatasource(settings, updateCallback));
		}
	});

}());
