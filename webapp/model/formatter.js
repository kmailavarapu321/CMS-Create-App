var datformat1 = sap.ui.core.format.DateFormat.getDateInstance({
	pattern: "dd.MM.yyyy"
});
sap.ui.define([], function () {
	"use strict";
	//	var that = this;
	return {

		availableColor: function (Status) {

			if (Status === "NEW") {
				return "Information";
			} else if (Status === "INPROGRESS") {

				return "Warning";
			} else {

				return "Error";
			}

		},
		Filterformater: function (Filter, flag) {
			var value;
			if (flag === "filter") {
				value = "Filtered By: " + Filter;
			} else if (flag === "Sort") {
				value = "Sort By: " + Filter;
			} else if (flag === "Search") {
				value = "Search By: " + Filter;
			} 
			return value;
		},
		DUPSFound: function (DupsFound) {
			switch (DupsFound) {
			case "X":
				return 'YES';
			case "":
				return 'NO';

			default:
				return DupsFound;
			};
		},
		staticColor: function (DupsFound) {
			if (DupsFound === "X") {
				return "Error";
			} else if (DupsFound === "") {

				return "Success";
			}
		},
		// ErdatFormater: function (Endda) {
		// 	var Endda = datformat1.format(Endda);
		// 	return Endda;
		// },
		// BegdaFormatter:function(Begda){
		// 		var Begda = datformat1.format(Begda);
		// 	return Begda;
		// },
		// 	DOBFormatter:function(Dats){
		// 		 Dats = datformat1.format(Dats);
		// 	return Dats;
		// },
		VNameformatter: function (VName) {
			var value;
			if (VName) {
				value = "- " + VName;
			} else {
				value = "";
			}
			return value;
		},
		// Positionid : function (OrgPosid) {
		// 	var LeaderName;
		// 	if(OrgPosid){
		// 			var oModel = this.getOwnerComponent().getModel();
		// 		oModel.read("/CMSOrgValidateSet(Pernr='',OrgPosid='" + OrgPosid + "')", {
		// 			success: function (oData) {
		// 				var data = oData;
		// 				this.leader = oData.Leader;
		// 				 LeaderName = oData.LeaderName;
		// 				var Location = oData.Location;
		// 				var postext = oData.SupPosText;
		// 				this.suspose = oData.SupPosStxt;
		// 				this.loc_id = oData.Loc_id;

		// 				var ValComments = oData.ValComments.split(":")[0];
		// 				var SupPosText = {
		// 					SupPos: postext
		// 				};
		// 			}
		// 		});
			
				
		// 	}
		// 	return LeaderName;
		// 	console.log(LeaderName);
		// }
		

	};
});