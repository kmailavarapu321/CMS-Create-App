var that, sQuery, posId;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/Label',
	'sap/ui/model/Filter',
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageBox",
	"com/fmgl/ZHR_CMS_VND_REQ/model/formatter"
], function (Controller, JSONModel, Label, Filter, Export, ExportTypeCSV, MessageBox, formatter) {
	"use strict";

	return Controller.extend("com.fmgl.ZHR_CMS_VND_REQ.controller.displayTable", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.fmgl.ZHR_CMS_VND_REQ_NEWEST.view.displayTable
		 */
		/* 
		                             * Date - 03.08.2020
		                             * Created By - Karteek
		                             * Description -
		                             * -> This function will be called when user launches the application
		                             * -> This function will fetch logged in user details from the server and authenticates whether user 
		                             is accessing the app from FLP or with the BSP URL.
		                             * FMG logo is visible based on the environment that the user is accessing
		                             * Input - Host Name
		                             * Output - User specific records are being fetched to the dashboard
		                             * Calling functions - _onObjectmatched(), onnewhire(), init(), onIconPress()*/
		onInit: function () {
			var that = this;
			//var uri = "/sap/opu/odata/sap/ZHR_CMS_REQ_SRV/";
			// this.oDataModel = new sap.ui.model.odata.ODataModel(uri);

			// this.getView().setModel(this.oDataModel);

			/*
			 * Start of Change 
			 * Changed On - 04.08.2020
			 *Changed By - Rakesh
			 * Change Description - FMG logo is visible if user access the app with BSP URL
			 *-> FMG logo is invisible if user access the app from FLP */
			if (!that.getMyComponent().getComponentData()) {
				this.getView().byId("Fmglogo").setVisible(true);
				this.getView().byId("idBar").setVisible(true);
				this.getView().byId("master").setVisible(false);
			}
			if (that.getMyComponent().getComponentData()) {
				this.getView().byId("Fmglogo").setVisible(false);
					this.getView().byId("idBar").setVisible(false);
					this.getView().byId("master").setVisible(true);
			}
			/*End of Change*/
			// var loc = "https://" + window.location.hostname;

			// var oModel = new sap.ui.model.json.JSONModel();
			// var data = oModel.loadData(loc + "/sap/bc/ui2/start_up", null, false, "GET", null, true, null);
			// var oUserData = oModel.getData();
			that.vUser = sap.ushell.Container.getService("UserInfo").getId();
		    that.vUser = "FIORI_HR1";
			// 	var Filters1 = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, that.vUser);
			// var oTable = this.getView().byId("table");
			//   oTable.getBinding("items").filter(Filters1);

			if (that.getMyComponent().getComponentData()) {

				/*
				 * Start of Change 
				 * Changed On - 22.06.2020
				 *Changed By - Rakesh
				 * Change Description -User creates onboard request directly from seperate tile in FLP */
				if (that.getMyComponent().getComponentData().startupParameters.onBoard) {
					that.onnewhire1();
					// window.location.hash = "#ZHR_CMS-register&/initiateRequest";
					return;
				} else {
					//that.init();
					//	this.getView().byId("Fmglogo").setVisible(true);
				}
			}
			//that.getOwnerComponent().getRouter().getRoute("displayTable").attachPatternMatched(that._onObjectmatched, that);
			that.init();
			// if (!that.getMyComponent().getComponentData()) {
			// var Filters1 = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, this.vUser);
			//   this.getView().byId("Table").getBinding("items").filter([Filters1]);
			// 	that.getOwnerComponent().getRouter().getRoute("displayTable").attachPatternMatched(that._onObjectmatched, that);
			// }

			// 	}
			// };
			// oxmlHttp.open("GET", vUrl, false);
			// oxmlHttp.send(null);
		},

		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description -
		 * -> This function will convert date object into dd.MM.yyyy format and concat date, month & year values
		 * Input - Date object value
		 * Output - Date value in dd.MM.yyyy format
		 * Called By -init()*/
		convertDate: function (dateValue) {

			var day = dateValue.getDate() + "";
			var month = (dateValue.getMonth() + 1) + "";
			var year = dateValue.getFullYear();
			if (day.length === 1) {
				day = "0" + day;
			}
			if (month.length === 1) {
				month = "0" + month;
			}
			return (day + "." + month + "." + year);
		},
		/* 
		 * Date - 11.05.2020
		 * Created By - Rakesh
		 * Description -
		 * -> This function will fetch the details of current logged in user
		 * -> This function will fetch  an array of user specific records  
		 * Input - User ID
		 * Output - User specific records are being fetched 
		 *Calling Function -onlivesearch(), convertDate()
		 * Called By- onInit()*/
		//init: function () {
		_onObjectmatched1: function () {

			var oModel = this.getOwnerComponent().getModel();
			oModel.setSizeLimit(9999);
			var CurrentUser, that = this;
			var jsonModel = new sap.ui.model.json.JSONModel();
			// var userID = new sap.ushell.services.UserInfo().getId(); 
			//var userID = "583554";
			/*
			 * Start of Change 
			 * Changed On - 17.07.2020
			 *Changed By - Karteek
			 * Change Description - Passing logged in user id as filter for CMSInitialSet & CMSContractorsSet*/
			var Filters = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, this.vUser);

			oModel.read("/CMSInitialSet", {
				filters: [Filters],
				/*End of Change*/
				success: function (OData) {

						var data = OData.results;
						that.Vendor = Number(data[0].Vendor).toString();
						var VName = data[0].VName;
						that.CurrentUser = that.Vendor + " - " + VName;
						var user = {
							CrUnam: that.CurrentUser
						};
						var Worksch = data[0].Worksch;
						// that.getView().byId("assign_Worksch").setValue(Worksch);
						that.getView().byId("idvendor").setText(that.CurrentUser);
						//	that.getView().byId("idvendor").setActive(false);
						jsonModel.setData(user);
						that.getView().setModel(jsonModel, "InitialModel");

					}
					// 	error: function (OData, response) {
					// 	sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
					// 	that.getView().setBusy(false);
					// }
			});

			var Data2, that = this;
			that.getView().setBusy(true);
			/*
			 * Start of Change 
			 * Changed On - 17.07.2020
			 *Changed By - Karteek
			 * Change Description - Passing logged in user id as filter for CMSInitialSet & CMSContractorsSet*/
			//var vendorID = new sap.ushell.services.UserInfo().getId();
			//var vendorID = "583554";
			var Filters2 = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, this.vUser);
			// var aFilters = new Filter({
			var entity = "/CMSContractorsSet";

			oModel.read(entity, {
				filters: [Filters2],
				/*End of Change*/
				success: function (oData) {
					that.getView().setBusy(false);

					Data2 = oData.results;

					for (var count = 0; count < oData.results.length; count++) {
						oData.results[count].Begda = that.convertDate(oData.results[count].Begda);
						oData.results[count].Endda = that.convertDate(oData.results[count].Endda);
						oData.results[count].Dats = that.convertDate(oData.results[count].Dats);
					}
					that.Count = oData.results.length;
					that.Dats = oData.Dats;
					var Prest_oModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(Prest_oModel, "PERTABELModel");

					var oMetadata = that.getView().getModel("PERTABELModel").setData(Data2);
					var Odatamodel = that.getView().getModel("PERTABELModel");
					Odatamodel.setSizeLimit(9999);
					that.getView().byId("idlisttable").setNumber(that.Count);
					var sQuery1 = that.getView().byId("searchField").getValue();

					if (sQuery1 !== "") {
						that.onlivesearch();
					}
					if (that.Sort) {
						var oTable = that.byId("table");
						if (that.SortmParams === "Position Number") {
							sap.ui.getCore().byId("idposid").getText();

							var oItems = that.getView().byId("table").getBinding("items");
							var oSorter = new sap.ui.model.Sorter("OrgPosid", false);

							oItems.sort(oSorter);
							that.txtSort = "Sort By: Position Number";
							that.getView().byId("labelBanner").setText(that.txtSort);

						} else if (that.SortmParams === "Location") {
							sap.ui.getCore().byId("idloc").getText();

							var oSelItems = that.getView().byId("table").getBinding("items");
							var oSorter1 = new sap.ui.model.Sorter("Location", false);

							oSelItems.sort(oSorter1);
							that.txtSort1 = "Sort By: Location";
							that.getView().byId("labelBanner").setText(that.txtSort1);
						}
					}

				},
				/* 
				 * Date - 17.07.2020
				 * Created By - Karteek
				 * Description- This function is invoked when the client side request is failed to process by the server*/
				error: function (OData, response) {
					sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
					that.getView().byId("searchField").setEnabled(false);
					that.getView().byId("idSortButton").setEnabled(false);
					that.getView().byId("idexcel").setEnabled(false);
					that.getView().byId("idnewhire").setEnabled(false);
					that.getView().byId("idRefreshButton").setEnabled(false);
					that.getView().setBusy(false);
				}
			});

		},
		getMyComponent: function () {
			"use strict";
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		},

		/*  * Date - 22.06.2020
		 * Created By - Rakesh
		 * Description -
		 *->This function will be called when user clicks on export button
		 * -> This function will export (download) the model data (worklist table columns data) into xls format*/
		onExportPress: function () {
			var oModel = this.getView().getModel("PERTABELModel");
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					// for xls....
					fileExtension: "xls",
					separatorChar: "\t",
					charset: "utf-8",
					mimeType: "application/vnd.ms-excel"

					// for CSV....
					/* charset: "utf-8",
					fileExtension:"csv",
					separatorChar:",",
					mimeType:"application/csv" */
				}),
				models: oModel,

				rows: {
					path: "/"
				},
				columns: [{
					name: "Fortescue Id",
					template: {
						content: "{Personid_ext}"
					}
				}, {
					name: "Full Name",
					template: {
						content: "{Fname}{Lname}"
					}
				}, {
					name: "DOB",
					template: {
						content: "{Dats}"
					}
				}, {
					name: "Employee Subgroup",
					template: {
						content: "{ESUBGRP_TEXT}"
					}
				}, {
					name: "Location",
					template: {
						content: "{Location}"
					}
				}, {
					name: "Position Number",
					template: {
						content: "{OrgPosid}"
					}
				}, {
					name: "Position",
					template: {
						content: "{SupPosText}"
					}
				}, {
					name: "Leader",
					template: {
						content: "{LeaderName}"
					}
				}, {
					name: "Start Date",
					template: {
						content: "{Begda}"
					}
				}, {
					name: "End Date",
					template: {
						content: "{Endda}"
					}
				}]
			});
			oExport.saveFile("MyActive Contractors").catch(function (oError) {
				sap.m.MessageToast.show("Generate is not possible beause no model was set");
			}).then(function () {
				oExport.destroy();
			});

		},

		onExit: function () {

			this.aKeys = [];
			this.aFilters = [];
			this.oModel = null;
		},
		handleToItemsUpdateFinished: function () {
			var that = this;
			var oTable = that.getView().byId("table");
			this.aItems = oTable.getItems().length;
			that.getView().byId("idset").setText("Contractors (" + this.aItems + ")");
		},
		onSelectPositionChange: function () {
			var sQuery = this.getView().byId("slSupplierName").getSelectedItem().getText();
			// sQuery = sQuery.split(" ");
			if (sQuery && sQuery.length > 0) {

				var filter = new sap.ui.model.Filter([

					new sap.ui.model.Filter("PositionName", sap.ui.model.FilterOperator.Contains, sQuery)

					// new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery),
					// new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery),
					// new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery)
				]);
				// aFilters.push(filter);
			}
			// update list binding
			var list = this.byId("table");
			var binding = list.getBinding("items");
			binding.filter(filter, "Application");
			var index = this.getView().byId("table").getBinding("items")["aIndices"].length;
		},
		onItem: function (oEvent) {
			var that = this;
			var sPath = oEvent.getSource().getBindingContext("PERTABELModel").getObject().Pernr;
			
			var oModel = this.getOwnerComponent().getModel();
				that.getView().setBusy(true);
			oModel.read("/CMSContractorsSet('" + sPath + "')", {
				success: function (oData) {
					that.getView().setBusy(false);
					var dataSet = oData;
					that.getOwnerComponent().getModel("tableModel").setData(dataSet);
					var Datatemp = that.getOwnerComponent().getModel("tableModel").getData();
					Datatemp.Dats = that.convertDatesforRouting(Datatemp.Dats);
					Datatemp.Begda = that.convertDatesforRouting(Datatemp.Begda);
					Datatemp.Endda = that.convertDatesforRouting(Datatemp.Endda);
					if (!that.dia3) {
						that.dia3 = new sap.ui.xmlfragment("com.fmgl.ZHR_CMS_VND_REQ.view.Fragment.worklistselection", that);
					}
					that.getView().addDependent(that.dia3);
					that.dia3.open();
				},
				error: function (OData, response) {
					that.getView().setBusy(false);
					sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
				}
			});

		},

		convertDatesforRouting: function (dateValue) {
			function pad(s) {
				return (s < 10) ? '0' + s : s;
			}
			var d = new Date(dateValue);
			return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('.');
		},
		/* 
       * Date - 22.0.2020
       * Created By - Rakesh
       * Description -
       * -> This function is invoked by onInit() method
       * -> This function will validate the selection and will fetch the text of onboard creation request type for the
       start up parameters
       *-> Called By - onInit()*/
		onnewhire1: function (oEvent) {
			var Data = "";

			Data = "Onboard";
			var NewHireData = {
				"Key": "01",
				"TextData": Data

			};

			this.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
			this.getOwnerComponent().getRouter().navTo("initiateRequest");

		},

		onnewhire: function (oEvent) {
			var Data = "";
			if (!oEvent) {
				Data = "Onboard";
			} else {
				Data = "Onboard";
			}
			// var oModel = new sap.ui.model.json.JSONModel(Data);
			// 	sap.ui.getCore().setModel(oModel, "DataModel");
			var NewHireData = {
				"Key": "01",
				"TextData": Data

			};

			this.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
			this.getOwnerComponent().getRouter().navTo("initiateRequest");

		},

		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description -
		 * -> This function will be invoked when user clicks on sort button
		 * -> This function will open a fragment with "Sort" & "Cancel" buttons with selection of "Position ID" & "Location"
		 *-> Sorting results will be seen in the table with the text on the banner
		 * Calling fragment - Sort*/
		oniconsort: function () {
			if (!this.dia4) {
				this.dia4 = new sap.ui.xmlfragment("com.fmgl.ZHR_CMS_VND_REQ.view.Fragment.Sort", this);
			}
			this.getView().addDependent(this.dia4);
			this.dia4.open();
		},
		onApplySort: function () {
			var allvalid;
			var Filter;
			this.getView().byId("infoTable").setVisible(true);
			this.getView().byId("labelBanner").setText("Sort Applied");

			var Data = sap.ui.getCore().byId("idposid").getSelected();
			var Data2 = sap.ui.getCore().byId("idloc").getSelected();
			if (Data === false && Data2 === false) {
				allvalid = true;
				sap.ui.getCore().byId("SortType").setValueState("Error");

			} else if (Data === true || Data2 === false) {
				allvalid = false;
				sap.ui.getCore().byId("SortType").setValueState("None");
			} else if (Data === false || Data2 === true) {
				allvalid = false;
				sap.ui.getCore().byId("SortType").setValueState("None");
			}

			if (allvalid === true) {
				return;
			}
			if (sap.ui.getCore().byId("idposid").getSelected()) {
				sap.ui.getCore().byId("idposid").getText();
				// 	Filter = {
				// 	Filter: sap.ui.getCore().byId("idstartdate").getText(),
				// 	flag: "Sort"
				// };
				this.Sort = true;
				this.SortmParams = sap.ui.getCore().byId("idposid").getText();
				var oItems = this.getView().byId("table").getBinding("items");
				var oSorter = new sap.ui.model.Sorter("OrgPosid", false);

				oItems.sort(oSorter);
				this.txtSort = "Sort By: Position Number";
				this.getView().byId("labelBanner").setText(this.txtSort);

			} else if (sap.ui.getCore().byId("idloc").getSelected()) {
				sap.ui.getCore().byId("idloc").getText();
				this.Sort = true;
				this.SortmParams = sap.ui.getCore().byId("idloc").getText();
				var oSelItems = this.getView().byId("table").getBinding("items");
				var oSorter1 = new sap.ui.model.Sorter("Location", false);

				oSelItems.sort(oSorter1);
				this.txtSort1 = "Sort By: Location";
				this.getView().byId("labelBanner").setText(this.txtSort1);
			}
			this.dia4.close();
		},
		/*
		 * Date - 20.05.2020
		 * Created By -Karteek 
		 * Description- This function is invoked when user clicks on the close icon in the banner
		 *-> This function will call onInit() method to retain the app to initial state
		 *-> Calling function- onInit() */
		onIconPress: function () {
			this.getView().byId("infoTable").setVisible(false);
			this.byId("searchField").setValue();
			this.Sort = false;
			if (typeof sap.ui.getCore().byId("idposid") !== 'undefined') {
				sap.ui.getCore().byId("idposid").setSelected(false);
			}
			if (typeof sap.ui.getCore().byId("idloc") !== 'undefined') {
				sap.ui.getCore().byId("idloc").setSelected(false);
			}
			this._onObjectmatched1();

		},
		onRefreshPress: function () {
			this.onIconPress();
		},
		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description -
		 * -> This function will be invoked when user clicks on "Cancel" button in the "Sort fragment"
		 * -> This function will clear all the selections and value states in the fragment
		 *->This function will close & destroy the fragment when close button is triggered
		 * Calling fragment - Sort*/
		onCancelSort: function () {
			sap.ui.getCore().byId("SortType").setValueState("None");
			sap.ui.getCore().byId("idposid").setSelected(false);
			sap.ui.getCore().byId("idloc").setSelected(false);
			this.dia4.close();
		},
		/* 
       * Date - 22.05.2020
       * Created By - Rakesh
       * Description -
       * -> This function will be invoked when user selects a row in the worklist table
       * -> This function will open a fragment with "OK" & "Cancel" buttons 
        *-> This function will validate and highlight the radio button with error value state
        when no selection is made for request type
        *-> This function will take user to the detail screen along with the selected request type as text
       * Calling fragment - worklistselection*/
		onnotification: function () {
			var allSupported;
			var Changeofconditions = sap.ui.getCore().byId("Cocf").getSelected();
			var Termination = sap.ui.getCore().byId("Term").getSelected();
			var Namechange = sap.ui.getCore().byId("NMC").getSelected();
			var extendEndDate = sap.ui.getCore().byId("ExtEndDate").getSelected();
			var covidTrackerUpdate = sap.ui.getCore().byId("idCovidVaccineTracking").getSelected();
			if (Changeofconditions === false && Termination === false && Namechange === false && extendEndDate === false && covidTrackerUpdate === false) {
				allSupported = true;
				sap.ui.getCore().byId("rbgtype").setValueState("Error");

			} else if (Changeofconditions === true || Termination === false || Namechange === false) {
				allSupported = false;
				sap.ui.getCore().byId("rbgtype").setValueState("None");
			} else if (Changeofconditions === false || Termination === true || Namechange === false) {
				allSupported = false;
				sap.ui.getCore().byId("rbgtype").setValueState("None");
			} else if (Changeofconditions === false || Termination === false || Namechange === false || extendEndDate === true) {
				allSupported = false;
				sap.ui.getCore().byId("rbgtype").setValueState("None");
			}
			else if(Changeofconditions === false || Termination === false || Namechange === false || extendEndDate === false ||
			covidTrackerUpdate === true ){
					allSupported = false;
				sap.ui.getCore().byId("rbgtype").setValueState("None");
			}

			if (allSupported === true) {
				return;
			}
			var textData = sap.ui.getCore().byId("rbgtype").getSelectedButton().getText();
			if (textData === "Change Of Conditions") {
				var NewHireData = {
					"Key": "04",
					"TextData": textData

				};
				this.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
			} else if (textData === "Demobilise") {
				var NewHireData = {
					"Key": "03",
					"TextData": textData

				};
				this.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
			} else if (textData === "Personal Info. Change") {
				var NewHireData = {
					"Key": "04",
					"TextData": textData

				};
				this.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
			} else if (textData === "Extend End Date") {
				var NewHireData = {
					"Key": "03",
					"TextData": textData

				};
				this.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
			}
			 else if (textData === "Covid-19 Vaccination Update") {
				var NewHireData = {
					"Key": "06",
					"TextData": textData

				};
				this.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
			}
			
			
			
			
			
			this.dia3.close();
			sap.ui.getCore().byId("rbgtype").setSelectedButton("");
			this.getOwnerComponent().getRouter().navTo("initiateRequest");

		},
		onClearValueStates: function () {
			sap.ui.getCore().byId("rbgtype").setValueState("None");
		},
		/* 
       * Date - 25.05.2020
       * Created By - Rakesh
       * Description -
       -> This function will be invoked when user searches for a record based on the columns in the worklist table
     Output- List of respective records and count displayed based on the input
     * Called By- init()*/
		onlivesearch: function (oEvt) {
			var that = this;
			// sQuery = oEvt.getSource().getValue();
			sQuery = this.getView().byId("searchField").getValue();
			// sQuery = sQuery.split(" ");

			if (sQuery && sQuery.length > 0) {
				var oData = this.getView().getModel("PERTABELModel").getData();
				var filter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("Personid_ext", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Fname", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Mname", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Lname", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Dats", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("ESUBGRP_TEXT", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Location", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("OrgPosid", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("SupPosText", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Begda", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Endda", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("LeaderName", sap.ui.model.FilterOperator.Contains, sQuery)

						// new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery)
					],
					and: false
				});
				// aFilters.push(filter);
			}
			// update list binding
			var list = this.byId("table");
			var binding = list.getBinding("items");
			binding.filter(filter, "Application");
			var tempdata = list.getItems().length;
			if (sQuery !== "") {
				that.getView().byId("idset").setText("Contractors (" + tempdata + ")");
				return;
			} else {
				that.getView().byId("idset").setText("Contractors (" + this.aItems + ")");

			}
			var index = this.getView().byId("table").getBinding("items")["aIndices"].length;
		},
		ondatachange: function () {
			sap.ui.getCore().byId("rbgtype").setValueState("None");
			sap.ui.getCore().byId("NMC").setSelected(false);
			sap.ui.getCore().byId("Cocf").setSelected(false);
			sap.ui.getCore().byId("Term").setSelected(false);
			sap.ui.getCore().byId("ExtEndDate").setSelected(false);
			this.dia3.close();
		},
		init: function () {
			var oModel = this.getOwnerComponent().getModel();
			oModel.setSizeLimit(9999);
			var CurrentUser, that = this;
			var jsonModel = new sap.ui.model.json.JSONModel();
			/*
			 * Start of Change 
			 * Changed On - 17.07.2020
			 *Changed By - Karteek
			 * Change Description - Passing logged in user id as filter for CMSInitialSet & CMSContractorsSet*/
			var Filters = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, this.vUser);
			oModel.read("/CMSInitialSet", {
				filters: [Filters],
				/*End of Change*/
				success: function (OData) {
					var data = OData.results;
					that.Vendor = Number(data[0].Vendor).toString();
					var VName = data[0].VName;
					that.CurrentUser = that.Vendor + " - " + VName;
					var user = {
						CrUnam: that.CurrentUser
					};
					var Worksch = data[0].Worksch;
					// that.getView().byId("assign_Worksch").setValue(Worksch);
					that.getView().byId("idvendor").setText(that.CurrentUser);
					//	that.getView().byId("idvendor").setActive(false);
					jsonModel.setData(user);
					that.getView().setModel(jsonModel, "InitialModel");

				},
				// 	error: function (OData, response) {
				// 	sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
				// 	that.getView().setBusy(false);
				// }
			});
			var Data2, that = this;
			that.getView().setBusy(true);
			/*
			 * Start of Change 
			 * Changed On - 17.07.2020
			 *Changed By - Karteek
			 * Change Description - Passing logged in user id as filter for CMSInitialSet & CMSContractorsSet*/
			//var vendorID = new sap.ushell.services.UserInfo().getId();
			//var vendorID = "583554";
			var Filters2 = new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, this.vUser);
			// var aFilters = new Filter({
			var entity = "/CMSContractorsSet";

			oModel.read(entity, {
				filters: [Filters2],
				/*End of Change*/
				success: function (oData) {
					that.getView().setBusy(false);

					Data2 = oData.results;

					for (var count = 0; count < oData.results.length; count++) {
						oData.results[count].Begda = that.convertDate(oData.results[count].Begda);
						oData.results[count].Endda = that.convertDate(oData.results[count].Endda);
						oData.results[count].Dats = that.convertDate(oData.results[count].Dats);
					}
					that.Count = oData.results.length;
					that.Dats = oData.Dats;
					var Prest_oModel = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(Prest_oModel, "PERTABELModel");

					var oMetadata = that.getView().getModel("PERTABELModel").setData(Data2);
					var Odatamodel = that.getView().getModel("PERTABELModel");
					Odatamodel.setSizeLimit(9999);
					that.getView().byId("idlisttable").setNumber(that.Count);
					var sQuery1 = that.getView().byId("searchField").getValue();

					if (sQuery1 !== "") {
						that.onlivesearch();
					}
					if (that.Sort) {
						var oTable = that.byId("table");
						if (that.SortmParams === "Position Number") {
							sap.ui.getCore().byId("idposid").getText();

							var oItems = that.getView().byId("table").getBinding("items");
							var oSorter = new sap.ui.model.Sorter("OrgPosid", false);

							oItems.sort(oSorter);
							that.txtSort = "Sort By: Position Number";
							that.getView().byId("labelBanner").setText(that.txtSort);

						} else if (that.SortmParams === "Location") {
							sap.ui.getCore().byId("idloc").getText();

							var oSelItems = that.getView().byId("table").getBinding("items");
							var oSorter1 = new sap.ui.model.Sorter("Location", false);

							oSelItems.sort(oSorter1);
							that.txtSort1 = "Sort By: Location";
							that.getView().byId("labelBanner").setText(that.txtSort1);
						}
					}

				},
				/* 
				 * Date - 17.07.2020
				 * Created By - Karteek
				 * Description- This function is invoked when the client side request is failed to process by the server*/
				error: function (OData, response) {
					sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
					that.getView().byId("searchField").setEnabled(false);
					that.getView().byId("idSortButton").setEnabled(false);
					that.getView().byId("idexcel").setEnabled(false);
					that.getView().byId("idnewhire").setEnabled(false);
					that.getView().byId("idRefreshButton").setEnabled(false);
					that.getView().setBusy(false);
				}
			});

		}

	});

});