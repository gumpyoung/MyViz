

function _t(toTranslate) {
	if ((typeof translations[toTranslate] == "undefined") && (toTranslate[0] !== "#")) {
		return toTranslate;
	}
	else {
		return translations[toTranslate];
	}
};
