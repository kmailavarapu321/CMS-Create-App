sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/fmgl/ZHR_CMS_VND_REQ/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.fmgl.ZHR_CMS_VND_REQ.Component", {

		metadata: {
			manifest: "json"
		},
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			this.getService("ShellUIService").then(function (oShellService) {
				oShellService.setBackNavigation(function () {
					window.location.hash = "#";
				//window.history.go(-1);
                // history.go(-1);
				});
			});
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();
				var temp = new sap.ui.model.json.JSONModel("model/data.json");
			this.setModel(temp, "displayTblModel");
			
			var globalModel =  new sap.ui.model.json.JSONModel();
			this.setModel(globalModel, "initiateModel");
			
			var tableData =  new sap.ui.model.json.JSONModel();
			this.setModel(tableData, "tableModel");
			
				var Ocompmodel = new sap.ui.model.json.JSONModel();
			var Odmodel = {
				index: ""
			};
			Ocompmodel.setData(Odmodel);
			this.setModel(Ocompmodel, "namedmodel");

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
		}
	});
});