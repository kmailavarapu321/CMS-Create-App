/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/fmgl/ZHR_CMS_VND_REQ/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});