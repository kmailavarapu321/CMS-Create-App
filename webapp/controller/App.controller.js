sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.fmgl.ZHR_CMS_VND_REQ.controller.App", {
			onInit: function () {
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);


				if(this.getMyComponent().getComponentData()){
				if (this.getMyComponent().getComponentData().startupParameters.onBoard) {
			 						this.onnewhire();
			 						// window.location.hash = "#ZHR_CMS-register&/initiateRequest";

			 						return;
			 					}
				}
			// oRouter.navTo("displayTable", {
				
			// }, true);
		},
			getMyComponent: function () {
			"use strict";
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		},
				onnewhire: function (oEvent) {
			var Data ="";
			if(oEvent){
			 Data = oEvent.getSource().mProperties.text;
			}else{
				 Data = "On Board"
			}
			// var oModel = new sap.ui.model.json.JSONModel(Data);
			// 	sap.ui.getCore().setModel(oModel, "DataModel");
			var NewHireData = {
					"Key": "01",
					"TextData": Data

			
				
			};
			
			this.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
			this.getOwnerComponent().getRouter().navTo("initiateRequest");

		}
	});
});