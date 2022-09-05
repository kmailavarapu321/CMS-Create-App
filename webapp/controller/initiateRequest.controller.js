var that, ReqID, filename, fileevent, TempId, CurrentUser;
var a4 = [],
	a1 = [],
	a7 = [],
	a8 = [],
	Files = [],
	Files2 = [],
	IE = 0,
	IE1 = 0,
	Docno1 = [],
	Docno2 = [],
	FileUploaded = false,
	selected,
	FileUploader01,
	CheckBox,
	UploadDeleteEvt;
var array = [];
var covidDocno = "";
var covidFileName="";
var certificateFileName = "";
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"com/fmgl/ZHR_CMS_VND_REQ/model/formatter"
], function (Controller, JSONModel, Dialog, ButtonType, Text, Button, MessageToast, MessageBox, formatter) {
	"use strict";

	return Controller.extend("com.fmgl.ZHR_CMS_VND_REQ.controller.initiateRequest", {
		formatter: formatter,
		/* 
      * Date - 03.08.2020
      * Created By - Karteek
      * Description -
      * -> This function will be called when user launches the application
      * -> This function will fetch logged in user details from the server and authenticates whether user 
       is accessing the app from FLP or with the BSP URL.
      *-> This function will validate the start-up parameters for onboard tile in FLP,If launchpad parameters are determined
      on the back button user will be navigated to FLP home page if not to the worklist
      *-> FMG logo is visible based on the environment that the user is accessing
      * Input - Host Name
      * Output - User specific records are being fetched to the dashboard
      * Calling functions - handleClear(), _onObjectmatched()*/

		onInit: function () {
			that = this;

			/* Start of change 
			Changed on -04.01.2021
			Change Description - OData model size limit (Issue in Prod) */
			var oModel = this.getOwnerComponent().getModel();
			oModel.setSizeLimit(1000);
			/*End of Change
				Changed on -04.01.2021*/

			that.handleClear();
			/*
			 * Start of Change 
			 * Changed On - 04.08.2020
			 *Changed By - Rakesh
			 * Change Description - FMG logo is visible if user access the app with BSP URL
			 *-> FMG logo is invisible if user access the app from FLP */
			var Aoddata = {
				AODDATA: [{
					"Code": "E1",
					"Text": "YES"
				}, {
					"Code": "E2",
					"Text": "NO"
				}]
			};
			var ojsonmodel = new sap.ui.model.json.JSONModel(Aoddata);
			this.getView().setModel(ojsonmodel, "AODTestmodel");
			var healthPlan = {
				health: [{
					"Code": "E1",
					"Text": "YES"
				}, {
					"Code": "E2",
					"Text": "NO"
				}, {
					"Code": "NA",
					"Text": "Not Applicable"
				}]
			};
			var ojsonmodel1 = new sap.ui.model.json.JSONModel(healthPlan);
			this.getView().setModel(ojsonmodel1, "healthPlanmodel");

			if (!that.getMyComponent().getComponentData()) {
				that.getView().byId("idInitiate").setShowHeader(true);
				that.getView().byId("idBar").setVisible(false);
				that.getView().byId("Fmglogo").setVisible(true);
			}
			
			/*End of Change*/
			// var loc = "https://" + window.location.hostname;
			// var oModel = new sap.ui.model.json.JSONModel();
			// var data = oModel.loadData(loc + "/sap/bc/ui2/start_up", null, false, "GET", null, true, null);
			 that.vUser = sap.ushell.Container.getService("UserInfo").getId();
		     that.vUser = "FIORI_HR1";
			//var oRouter = that.getOwnerComponent().getRouter(that);
			//oRouter.attachRoutePatternMatched(that._onObjectmatched, that);
			that.getOwnerComponent().getRouter().getRoute("initiateRequest").attachPatternMatched(that._onObjectmatched, that);
			/*
			 * Start of Change 
			 * Changed On - 22.06.2020
			 *Changed By - Rakesh
			 * Change Description -User creates onboard request directly from seperate tile in FLP */
			if (that.getMyComponent().getComponentData()) {
				if (that.getMyComponent().getComponentData().startupParameters.onBoard) {
					that.getView().byId("idInitiate").setShowHeader(true);
					that.getView().byId("idBar").setVisible(false);
					that.navBack = "LAUNCHPAD";
					// var oModel = new sap.ui.model.json.JSONModel(Data);
					// 	sap.ui.getCore().setModel(oModel, "DataModel");
					var NewHireData = {
						"Key": "01",
						"TextData": "Onboard"

					};

					that.getOwnerComponent().getModel("initiateModel").setData(NewHireData);
					that.getOwnerComponent().getRouter().navTo("initiateRequest");
				} else {
					that.navBack = "WORKLIST";
					that.getView().byId("idInitiate").setShowHeader(true);
					that.getView().byId("idBar").setVisible(false);
					that.getView().byId("Fmglogo").setVisible(true);
				}
			} else {

				that.getView().byId("idInitiate").setShowHeader(true);
				that.getView().byId("idBar").setVisible(false);
				that.getView().byId("Fmglogo").setVisible(true);
				/*End of Change*/

			}
			// 	}
			// };
			// oxmlHttp.open("GET", vUrl, false);
			// oxmlHttp.send(null);
		},
		onseconddosage: function (oEvent) {
			if (!this._oResponsivePopover) {
				//   // adding 'this' makes sure you specify the current controller to be used for event handlers 
				this._oResponsivePopover = sap.ui.xmlfragment("com.fmgl.ZHR_CMS_VND_REQ.view.Fragment.Vaccinationdate", this);
				this.getView().addDependent(this._oResponsivePopover);
			}

			this._oResponsivePopover.openBy(oEvent.getSource());
		},
			onMedicalExpemtion: function (oEvent) {
			if (!this._oResponsivePopover2) {
				//   // adding 'this' makes sure you specify the current controller to be used for event handlers 
				this._oResponsivePopover2 = sap.ui.xmlfragment("com.fmgl.ZHR_CMS_VND_REQ.view.Fragment.medicalExemptionExpiry", this);
				this.getView().addDependent(this._oResponsivePopover2);
			}

			this._oResponsivePopover2.openBy(oEvent.getSource());
		},
		onVaccineCertificatePress: function (oEvent) {
			if (!this._oResponsivePopover1) {
				//   // adding 'this' makes sure you specify the current controller to be used for event handlers 
				this._oResponsivePopover1 = sap.ui.xmlfragment("com.fmgl.ZHR_CMS_VND_REQ.view.Fragment.vaccineCertificate", this);
				this.getView().addDependent(this._oResponsivePopover1);
			}

			this._oResponsivePopover1.openBy(oEvent.getSource());
		},
		getMyComponent: function () {
			"use strict";
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		},
		/* 
		 * Date - 13.08.2020
		 * Created By - Karteek
		 * Description -
		 * -> This function will be called when user changes Position ID & Fortescue CP ID
		 * -> This function will validate the position ID and CP ID by trigerring CMSOrgValidateSet
		 *-> This function will fetch leader, leader name, location, SupPosText ,SupPosStxt on success if position ID is passed
		 *-> This function will set leader, leader name, location to the respective input fields after being fetched
		 *-> This function will populate an error messsage when invalid CP ID is passed
		 *-> This function will populate an error messsage when invalid position ID is passed
		 *->Input-posId or Fnum
		 *->Ouput- Valid message from entity set
		 * Called By - _onObjectmatched()*/
		validatePositionID: function (posId, Fnum) {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			if (Fnum || posId !== "") {
				if (!Fnum) {
					Fnum = "";
				}
				if (!posId) {
					posId = "";

				}
				oModel.read("/CMSOrgValidateSet(Pernr='" + Fnum + "',OrgPosid='" + posId + "')", {
					success: function (oData) {
						var data = oData;
						that.leader = oData.Leader;
						var LeaderName = oData.LeaderName;
						var Location = oData.Location;
						var postext = oData.SupPosText;
						that.suspose = oData.SupPosStxt;
						that.loc_id = oData.Loc_id;
						that.valComments = oData.ValComments.split(":")[0];

						var ValComments = oData.ValComments.split(":")[0];
						var SupPosText = {
							SupPos: postext
						};

						if (posId) {
							if (oData.ValComments !== "") {
								var valcomments = !!that.getView().$().closest(".sapUiSizeCompact").length;
								MessageBox.information(
									ValComments, {
										styleClass: valcomments ? "sapUiSizeCompact" : ""
									}
								);
								that.getView().byId("assign_Pos").setValueState("Error");
								that.postext = oData.SupPosText;
								that.getView().byId("assign_Name").setValue(postext);
								that.getView().byId("assign_Leader").setValue(LeaderName);
								that.getView().byId("assign_loc").setValue(Location);
								return;
							} else if (SupPosText !== "") {

								var posmodel = new JSONModel(SupPosText);
								that.getView().setModel(posmodel, "SusposModel");
								sap.ui.getCore().setModel(posmodel, "SusposModel");
							}
							if (oData.ValComments === "") {
								that.getView().byId("assign_Pos").setValueState("None");
								that.getView().byId("assign_Name").setValue(postext);
								that.getView().byId("assign_Leader").setValue(LeaderName);
								that.getView().byId("assign_loc").setValue(Location);

							}
						}
						if (Fnum) {
							if (oData.ValComments !== "") {
								var valcomments1 = !!that.getView().$().closest(".sapUiSizeCompact").length;
								MessageBox.information(
									that.valComments, {
										styleClass: valcomments1 ? "sapUiSizeCompact" : ""
									}
								);
								that.getView().byId("pers_SAPnum").setValueState("Error");
								// that.postext = oData.SupPosText;
								return;
							} else {
								that.getView().byId("pers_SAPnum").setValueState("None");
								return;
							}
						}
						//	that.getView().byId("assign_Pos").setValueState("Error");
					},
					error: function (OData, response) {
						sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
					}
				});
			}
		},
		/* 
		 * Date - 21.08.2020
		 * Created By - Karteek
		 * Description -
		 * -> This function will be called by _onObjectmatched and onSubmit() methods
		 * -> This function will set all the flags to false when initiate request controller is instantiated
		 *-> This function will set all the flags to false when a request is succesfully submitted
		 * Called From - _onObjectmatched(), onSubmit()*/
		allFlagRestore: function () {
			this.descComments = false;
			this.titlevalid = false;
			this.firstNamevalid = false;
			this.middleNamevalid = false;
			this.lastNamevalid = false;
			this.DOBvalid = false;
			this.SAPNumvalid = false;
			this.gendervalid = false;
			this.prefNamevalid = false;
			this.natiovalid = false;
			this.Aboriginalvalid = false;
			this.nativeTitlevalid = false;
			this.mailvalid = false;
			this.mobileNumbervalid = false;
			this.relationshipvalid = false;
			this.emergencyNamevalid = false;
			this.emergencyphnvalid = false;
			this.startDatevalid = false;
			this.travelDatevalid = false;
			this.endDatevalid = false;
			this.Positionvalid = false;
			this.empSubvalid = false;
			this.empName = false;
			this.empPositionName = false;
			this.medicalComp = false;
			this.dateComp = false;
			this.dateExmp = false;
			this.project = false;
			this.AOD = false;
			this.fitness = false;
			this.health = false;
			this.mandtRole = false;
			this.Firstdose = false;
			this.Seconddose = false;
			this.vaccinevalid = false;
			this.consentValid = false;
		},
		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description -
		 * -> This function will be called when user launches the app
		 * -> This function will validate and fetch the vendor name & ID by passing loggedin user ID to the CMSInitialSet 
		 *-> This function will enable and disable the subsections and fields in the subsections based on request type
		 *-> This function will auto set the values based on the request type to the respective fields that are being fetched on navigation from worklist
		 *-> This function will auto set the request type,Travel date, work schedule, vendor input fields 
		 *->  This function will also validate and populate the failed requests from the server
		 * Called By - _onInit()
		 *->Calling Functions- handleClear(),validatePositionID(), onAfterRendering()*/
		_onObjectmatched: function () {

			this.handleClear();
			this.changeFlag = false;
			/*
			 * Start of Change 
			 * Changed On - 21.08.2020
			 *Changed By - Karteek
			 * Change Description - Set all the changes flags to false*/
			this.allFlagRestore();
			/*End of Change */

			var oModel = this.getOwnerComponent().getModel();
			var jsonModel = new sap.ui.model.json.JSONModel();
			//var userID = new sap.ushell.services.UserInfo().getId();
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
				success: function (OData, response) {

					var data = OData.results;
					var Vendor = Number(data[0].Vendor).toString();
					var VName = data[0].VName;
					var CurrentUser = Vendor + " - " + VName;
					var user = {
						CrUnam: CurrentUser
					};
					var Worksch = data[0].Worksch;
					that.getView().byId("assign_Worksch").setValue(Worksch);
					// console.log(Worksch);
					that.getView().byId("assign_Vendor").setValue(CurrentUser);
					jsonModel.setData(user);
					that.getView().setModel(jsonModel, "InitialModel");

				},
				error: function (OData, response) {
					sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
					that.getView().byId("Reqsection").setVisible(false);
					that.getView().byId("idpif").setVisible(false);
					that.getView().byId("idCINF").setVisible(false);
					that.getView().byId("idECD").setVisible(false);
					that.getView().byId("idASIF").setVisible(false);
					that.getView().byId("idDA").setVisible(false);
					that.getView().byId("IDMA").setVisible(false);
					that.getView().byId("IDCT").setVisible(false);
					that.getView().byId("idDECAG").setVisible(false);
					that.getView().byId("idSubmitButton").setEnabled(false);
					that.getView().byId("idCancelButton").setEnabled(false);
					//that.getView().byId("UploadCollection").setUploadButtonInvisible(true);
					that.getView().byId("idUploadcollection").setVisible(false);
					that.getView().byId("UploadCollection").setVisible(false);
				}
			});

			var Model = this.getOwnerComponent().getModel();
			this.getView().setModel(Model);
			var oModeldata = this.getOwnerComponent().getModel("initiateModel").getObject("/");
			var TempModel = oModeldata.TextData;
			var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd"
			});
			var Cdate = dateFormat1.format(new Date());
			Cdate = Number(Cdate) + 1;
			var CMonth = new Date().getMonth();
			var CYear = new Date().getFullYear();
			var CDate = {
				CDate: new Date(),
				EDate: new Date(CYear, CMonth, Cdate)
			};
			var NModel = new JSONModel(CDate);
			this.getView().setModel(NModel, "DateModel");

			if (TempModel === "Onboard") {
				this.getView().byId("contractorName").setVisible(false);
				this.getView().byId("SapNo").setVisible(false);
				this.getView().byId("pers_SAPnum").setEditable(false);
				this.Pernr = "";
			} else {
				this.getView().byId("contractorName").setVisible(true);
				this.getView().byId("SapNo").setVisible(true);
				this.getView().byId("pers_SAPnum").setEditable(true);
			}
			var ModelSample = oModeldata.Key;
			if (TempModel === "Onboard") {
				this.descComments1 = "";
				this.titlevalid1 = "";
				this.firstNamevalid1 = "";
				this.middleNamevalid1 = "";
				this.lastNamevalid1 = "";
				this.DOBvalid1 = "";
				this.SAPNumvalid1 = "";
				this.gendervalid1 = "";
				this.prefNamevalid1 = "";
				this.natiovalid1 = "";
				this.Aboriginalvalid1 = "";
				this.nativeTitlevalid1 = "";
				this.mailvalid1 = "";
				this.mobileNumbervalid1 = "";
				this.relationshipvalid1 = "";
				this.emergencyNamevalid1 = "";
				this.emergencyphnvalid1 = "";
				this.startDatevalid1 = "";
				this.travelDatevalid1 = "";
				this.endDatevalid1 = "";
				this.Positionvalid1 = "";
				this.empSubvalid1 = "";
				this.mandtRole1 = "";

				this.empName1 = "";
				this.empPositionName1 = "";
				this.medicalComp1 = "";
				this.dateComp1 = "";
				this.AOD1 = "";
				this.fitness1 = "";
				this.health1 = "";
				this.dateExmp1  = "";
				this.Firstdose1 = "";
				this.secondDose1 = "";
                this.vaccinevalid1 = "";
                this.consent1 = "";
				this.getView().byId("idLabelStartDate").setVisible(false);
				this.getView().byId("assign_StartDate").setVisible(false);
				this.getView().byId("assign_StartDate").setEditable(true);

				this.getView().byId("idLabelTravelDate").setVisible(true);
				this.getView().byId("assign_TravelDate").setVisible(true);

				this.getView().byId("IDMA").setVisible(true);
				this.getView().byId("req_Type").setSelectedKey(ModelSample);
				this.getView().byId("req_Type").setValue(TempModel);
				this.getView().byId("req_Type").setEnabled(true);
				this.getView().byId("empAuthorized1").setVisible(true);
				this.getView().byId("req_Desccomments").setEditable(true);
				this.getView().byId("pers_Title").setEnabled(true);
				this.getView().byId("pers_Fname").setEditable(true);
				this.getView().byId("pers_Mname").setEditable(true);
				this.getView().byId("pers_Lname").setEditable(true);
				this.getView().byId("pers_DOB").setEditable(true); /*Date*/
				this.getView().byId("pers_SAPnum").setEditable(false);
				this.getView().byId("pers_gender").setEnabled(true);
				this.getView().byId("pers_Prename").setEnabled(true);
				this.getView().byId("pers_Nationality").setEnabled(true);
				this.getView().byId("pers_islander").setEditable(true);
				this.getView().byId("pers_Native").setEditable(true);
				this.getView().byId("conmail").setEditable(true);
				this.getView().byId("conmobile").setEditable(true);
				this.getView().byId("emergency_Rel").setEditable(true);
				this.getView().byId("emergency_Name").setEditable(true);
				this.getView().byId("emergency_Phnumber").setEditable(true);
				this.getView().byId("mantrolId").setVisible(true);
				this.getView().byId("Mant_subgroup").setVisible(true);
				this.getView().byId("projecttype").setVisible(true);
				this.getView().byId("Project").setVisible(true);
				//	this.getView().byId("assign_StartDate").setValue("");
				this.getView().byId("assign_EstDate").setEditable(true);
				this.getView().byId("assign_Pos").setEditable(true);
				//	this.getView().byId("assign_Leader").setEditable(true);
				//	this.getView().byId("assign_loc").setEditable(true);
				this.getView().byId("Emp_subgroup").setEnabled(true);
				//	this.getView().byId("assign_Worksch").setValue("");
				//	this.getView().byId("assign_Vendor").setValue(Cu           );
				this.getView().byId("EmpAuth_name").setEditable(true);
				this.getView().byId("EmpAuth_pos").setEditable(true);
				this.getView().byId("medicalComp").setEnabled(true);
				this.getView().byId("medicalComp").setEditable(true);
				//this.getView().byId("idmedinput").setEditable(true);
				//this.getView().byId("idmedinput").setVisible(true);
				this.getView().byId("dateComp").setEditable(true);
				this.getView().byId("Reqsection").setVisible(true);
				this.getView().byId("idpif").setVisible(true);
				this.getView().byId("idCINF").setVisible(true);
				this.getView().byId("idECD").setVisible(true);
				this.getView().byId("idASIF").setVisible(true);
				this.getView().byId("idDA").setVisible(true);
					this.getView().byId("Med_Agreement").setVisible(true);
				this.getView().byId("IDMA").setVisible(true);
				this.getView().byId("idDECAG").setVisible(true);
				this.getView().byId("idDecLRW").setVisible(false);
				this.getView().byId("UploadCollection").setVisible(true);
				this.getView().byId("idUploadcollection").setVisible(true);
				var prj = this.getView().byId("Project").setSelectedKey(60);
				this.project1 = prj;
				this.getView().byId("IDCT").setVisible(true);
				//	this.getView().byId("CovidTitle").setVisible(true);
				//	this.getView().byId("CAT").setVisible(false);

			} else if (TempModel === "Change Of Conditions") {
				var oData = this.getOwnerComponent().getModel("tableModel").getData();
				this.getView().byId("empAuthorized1").setVisible(true);
				this.descComments1 = "";
				this.titlevalid1 = "";
				this.firstNamevalid1 = "";
				this.middleNamevalid1 = "";
				this.lastNamevalid1 = "";
				this.DOBvalid1 = "";
				this.SAPNumvalid1 = "";
				this.gendervalid1 = "";
				this.prefNamevalid1 = "";
				this.natiovalid1 = "";
				this.Aboriginalvalid1 = "";
				this.nativeTitlevalid1 = "";
				this.mailvalid1 = "";
				this.mobileNumbervalid1 = "";
				this.relationshipvalid1 = "";
				this.emergencyNamevalid1 = "";
				this.emergencyphnvalid1 = "";
				this.startDatevalid1 = "";
				this.travelDatevalid1 = "";
				this.endDatevalid1 = "";
				this.Positionvalid1 = oData.OrgPosid;
				this.empSubvalid1 = oData.Esubgrp;
				this.mandtRole1 = "";
				//this.project1 = "";
				this.empName1 = "";
				this.empPositionName1 = "";
				this.medicalComp1 = "";
				this.dateComp1 = "";
				this.AOD1 = "";
				this.fitness1 = "";
				this.health1 = "";
				this.dateExmp1 = "";
				this.Firstdose1 = "";
                this.secondDose1 = "";
                this.vaccinevalid1 = "";
                this.consent1 = "";
				this.getView().byId("idLabelStartDate").setVisible(false);
				this.getView().byId("assign_StartDate").setVisible(false);
				this.getView().byId("assign_StartDate").setEditable(true);

				this.getView().byId("idLabelTravelDate").setVisible(true);
				this.getView().byId("assign_TravelDate").setVisible(true);

				this.getView().byId("req_Type").setSelectedKey(ModelSample);
				this.getView().byId("req_Type").setValue(TempModel);
				this.getView().byId("IDMA").setVisible(true);
				this.getView().byId("UploadCollection").setVisible(true);
				this.getView().byId("idUploadcollection").setVisible(true);
				//	this.getView().byId("req_Type").setValue(oModeldata);
				//	this.getView().byId("idvendor").setText(oData.VendorId);
				//	this.getView().byId("req_Desccomments").setValue(oData.Vendor);
				this.Pernr = oData.Pernr;
				this.getView().byId("pers_Title").setSelectedKey(oData.Title);
				this.Perstitle = this.getView().byId("pers_Title").getSelectedKey();
				this.getView().byId("pers_Fname").setValue(oData.Fname);
				this.getView().byId("pers_Mname").setValue(oData.Mname);
				this.getView().byId("pers_Lname").setValue(oData.Lname);
				this.getView().byId("pers_DOB").setValue(oData.Dats);
				this.getView().byId("pers_gender").setSelectedKey(oData.Gender);
				this.gender = this.getView().byId("pers_gender").getSelectedKey();
				this.getView().byId("pers_Prename").setValue(oData.Prname);
				this.getView().byId("pers_Nationality").setSelectedKey(oData.Natio);
				this.Natio = this.getView().byId("pers_Nationality").getSelectedKey();

				this.getView().byId("pers_islander").setSelectedKey(oData.Aborts);
				this.Aborts = this.getView().byId("pers_islander").getSelectedKey();
				//this.getView().byId("conmail").setValue(oData.Email);

				//this.getView().byId("pers_islander").setSelectedKey(oData.Aborts);
				this.getView().byId("pers_Native").setSelectedKey(oData.Ntitle);
				this.getView().byId("assign_Pos").setValue(oData.OrgPosid);
				var Posid = this.getView().byId("assign_Pos").getValue();
				this.getView().byId("IDCT").setVisible(true);
				//this.getView().byId("CovidTitle").setVisible(true);
				//	this.getView().byId("CAT").setVisible(false);
				var Fnum = "";
				/*
				 * Start of Change 
				 * Changed On - 13.08.2020
				 *Changed By - Karteek
				 * Change Description - Calling validatePositionID(), passing eneterd value as an argument*/
				this.validatePositionID(Posid, Fnum);
				/*End of Change*/
				this.getView().byId("conmail").setValue(oData.Email);
				//this.getView().byId("conmobile").setValue(oData.Mobile);
				this.getView().byId("conmobile").setValue(oData.Mobile);
				//	this.getView().byId("assign_EstDate").setValue(oData.EstimatedEnddate);
				this.getView().byId("pers_SAPnum").setValue(parseFloat(oData.Personid_ext));
				this.getView().byId("Emp_subgroup").setSelectedKey(oData.Esubgrp);
				//this.getView().byId("Emp_subgroup").setSelectedKey('E6');

				//this.getView().byId("Project").setSelectedKey(60);
				var empSubgrp = this.getView().byId("Emp_subgroup").getSelectedKey();
				if (empSubgrp === "E6") {

					this.getView().byId("IDMA").setVisible(false);
					this.getView().byId("idemptext1").setVisible(false);
					this.getView().byId("idemptext2").setVisible(false);
					this.getView().byId("idemptext3").setVisible(false);
					this.getView().byId("idemptext4").setVisible(false);
					this.getView().byId("Med_Agreement").setVisible(false);
					this.getView().byId("idImage").setVisible(false);
					this.getView().byId("idDecLRW").setVisible(true);
					this.getView().byId("idDECAG").setVisible(false);
					this.getView().byId("IDMA").setVisible(false);
					this.getView().byId("Med_Agreement").setVisible(false);
					this.getView().byId("idImage").setVisible(false);
				} else {
					//this.getView().byId("IDMA").setVisible(true);
					this.getView().byId("idemptext1").setVisible(true);
					this.getView().byId("idemptext2").setVisible(true);
					this.getView().byId("idemptext3").setVisible(true);
					this.getView().byId("idemptext4").setVisible(true);
					this.getView().byId("Med_Agreement").setVisible(true);
					this.getView().byId("idImage").setVisible(true);
					this.getView().byId("idDecLRW").setVisible(false);
					this.getView().byId("idDECAG").setVisible(true);
					this.getView().byId("IDMA").setVisible(true);
					//this.getView().byId("Med_Agreement").setVisible(false);
					//this.getView().byId("idImage").setVisible(false);
				}
				// this.ESubgrp =	this.getView().byId("pers_Nationality").getSelectedKey();
				this.getView().byId("assign_Worksch").setValue(oData.Worksch);
				//	this.getView().byId("assign_Vendor").setValue(oData.Vendor);
				//	this.getView().byId("EmpAuth_pos").setValue(oData.PositionName);
				//	this.getView().byId("EmpAuth_name").setValue(oData.FirstName);
				this.getView().byId("medicalComp").setValue(oData.Medicalcomp);
				this.getView().byId("dateComp").setValue(oData.DateComp);
				this.getView().byId("emergency_Rel").setSelectedKey(oData.Erelation);

				this.getView().byId("emergency_Name").setValue(oData.Ename);
				this.getView().byId("emergency_Phnumber").setValue(oData.Ephone);
				this.getView().byId("mantrolId").setVisible(true);
				this.getView().byId("Mant_subgroup").setVisible(true);
				this.getView().byId("projecttype").setVisible(true);
				this.getView().byId("Project").setVisible(true);
				this.getView().byId("req_Type").setEnabled(true);
				this.getView().byId("req_Desccomments").setEditable(true);
				this.getView().byId("pers_Title").setEnabled(true);
				this.getView().byId("pers_Fname").setEditable(true);
				this.getView().byId("pers_Mname").setEditable(true);
				this.getView().byId("pers_Lname").setEditable(true);
				this.getView().byId("pers_DOB").setEditable(true); /*Date*/
				this.getView().byId("pers_SAPnum").setEditable(true);
				this.getView().byId("pers_gender").setEnabled(true);
				this.getView().byId("pers_Prename").setEnabled(true);
				this.getView().byId("pers_Nationality").setEnabled(true);
				this.getView().byId("pers_islander").setEditable(true);
				this.getView().byId("pers_Native").setEditable(true);
				this.getView().byId("conmail").setEditable(true);
				this.getView().byId("conmobile").setEditable(true);
				this.getView().byId("emergency_Rel").setEditable(true);
				this.getView().byId("emergency_Name").setEditable(true);
				this.getView().byId("emergency_Phnumber").setEditable(true);
				//	this.getView().byId("assign_StartDate").setValue("");
				this.getView().byId("assign_EstDate").setEditable(true);
				this.getView().byId("assign_Pos").setEditable(true);
				//	this.getView().byId("assign_Leader").setEditable(true);
				//	this.getView().byId("assign_loc").setEditable(true);
				this.getView().byId("Emp_subgroup").setEnabled(true);
				//	this.getView().byId("assign_Worksch").setValue("");
				//	this.getView().byId("assign_Vendor").setValue(Cu           );
				this.getView().byId("EmpAuth_name").setEditable(true);
				this.getView().byId("EmpAuth_pos").setEditable(true);
				this.getView().byId("medicalComp").setEnabled(true);
				this.getView().byId("medicalComp").setEditable(true);
				//	this.getView().byId("idmedinput").setEditable(true);
				//	this.getView().byId("idmedinput").setVisible(true);
				this.getView().byId("dateComp").setEditable(true);
				this.getView().byId("Reqsection").setVisible(true);
				this.getView().byId("idpif").setVisible(false);
				this.getView().byId("idCINF").setVisible(false);
				this.getView().byId("idECD").setVisible(false);
				this.getView().byId("idASIF").setVisible(true);
				this.getView().byId("idDA").setVisible(true);
				// this.getView().byId("IDMA").setVisible(true);
				// this.getView().byId("idDECAG").setVisible(true);
				//this.getView().byId("Project").setSelectedKey(60);
				var prj1 = this.getView().byId("Project").setSelectedKey(60);
				this.project1 = prj1;

			} else if (TempModel === "Personal Info. Change") {

				var oData = this.getOwnerComponent().getModel("tableModel").getData();
				this.getView().byId("empAuthorized1").setVisible(false);
					this.getView().byId("empauth1").setVisible(false);
				this.descComments1 = "";
				this.titlevalid1 = oData.Title;
				this.firstNamevalid1 = oData.Fname;
				this.middleNamevalid1 = oData.Mname;
				this.lastNamevalid1 = oData.Lname;
				this.DOBvalid1 = oData.Dats;
				this.SAPNumvalid1 = parseFloat(oData.Personid_ext);
				this.gendervalid1 = oData.Gender;
				this.prefNamevalid1 = oData.Prname;
				this.natiovalid1 = oData.Natio;
				this.Aboriginalvalid1 = oData.Aborts;
				this.nativeTitlevalid1 = oData.Ntitle;
				this.mailvalid1 = oData.Email;
				this.mobileNumbervalid1 = oData.Mobile;
				this.relationshipvalid1 = oData.Erelation;
				this.emergencyNamevalid1 = oData.Ename;
				this.emergencyphnvalid1 = oData.Ephone;
				this.startDatevalid1 = "";
				this.travelDatevalid1 = "";
				this.endDatevalid1 = "";
				this.Positionvalid1 = "";
				this.empSubvalid1 = "";
				this.empName1 = "";
				this.empPositionName1 = "";
				this.medicalComp1 = "";
				this.dateComp1 = "";
				this.dateExmp1 = "";
               	this.Firstdose1 = "";
                this.secondDose1 = "";
                this.vaccinevalid1 = "";
                this.consent1 = "";
				this.getView().byId("idLabelStartDate").setVisible(false);
				this.getView().byId("assign_StartDate").setVisible(false);
				this.getView().byId("assign_StartDate").setEditable(false);

				this.getView().byId("idLabelTravelDate").setVisible(false);
				this.getView().byId("assign_TravelDate").setVisible(false);

				this.getView().byId("idpif").setVisible(true);
				this.getView().byId("idCINF").setVisible(true);
				this.getView().byId("idECD").setVisible(true);
				this.getView().byId("idDA").setVisible(true);
				this.getView().byId("idDECAG").setVisible(false);
				this.getView().byId("idDecLRW").setVisible(false);
				this.getView().byId("idASIF").setVisible(false);
				this.getView().byId("IDMA").setVisible(false);
				this.getView().byId("idUploadcollection").setVisible(true);
				this.getView().byId("req_Type").setSelectedKey(ModelSample);
				this.getView().byId("req_Type").setValue(TempModel);
				//this.getView().byId("IDMA").setVisible(true);
				//	this.getView().byId("req_Type").setValue(oModeldata);

				//	this.getView().byId("idvendor").setText(oData.VendorId);
				//	this.getView().byId("req_Desccomments").setValue(oData.Vendor);
				this.Pernr = oData.Pernr;
				this.getView().byId("pers_Title").setSelectedKey(oData.Title);
				this.Perstitle = this.getView().byId("pers_Title").getSelectedKey();
				this.getView().byId("pers_Fname").setValue(oData.Fname);
				this.getView().byId("pers_Mname").setValue(oData.Mname);
				this.getView().byId("pers_Lname").setValue(oData.Lname);
				this.getView().byId("pers_DOB").setValue(oData.Dats);
				this.getView().byId("pers_SAPnum").setValue(parseFloat(oData.Personid_ext));
				this.getView().byId("pers_gender").setSelectedKey(oData.Gender);
				this.getView().byId("pers_Nationality").setSelectedKey(oData.Natio);
				this.gender = this.getView().byId("pers_gender").getSelectedKey();
				this.getView().byId("mantrolId").setVisible(true);
				this.getView().byId("Mant_subgroup").setVisible(true);
				this.getView().byId("projecttype").setVisible(true);
				this.getView().byId("Project").setVisible(true);
				this.getView().byId("pers_Prename").setValue(oData.Prname);
				this.getView().byId("pers_islander").setSelectedKey(oData.Aborts);
				this.getView().byId("pers_Native").setSelectedKey(oData.Ntitle);
				this.Aborts = this.getView().byId("pers_islander").getSelectedKey();
				this.getView().byId("conmail").setValue(oData.Email);
				this.getView().byId("conmobile").setValue(oData.Mobile);
				this.getView().byId("emergency_Rel").setSelectedKey(oData.Erelation);
				this.getView().byId("emergency_Name").setValue(oData.Ename);
				this.getView().byId("emergency_Phnumber").setValue(oData.Ephone);
				this.getView().byId("medicalComp").setValue(oData.Medicalcomp);
				this.getView().byId("dateComp").setValue(oData.DateComp);
				this.getView().byId("pers_Title").setEnabled(true);
				this.getView().byId("pers_Fname").setEditable(true);
				this.getView().byId("pers_Mname").setEditable(true);
				this.getView().byId("pers_Lname").setEditable(true);
				this.getView().byId("pers_DOB").setEditable(true); /*Date*/
				this.getView().byId("pers_SAPnum").setEditable(false);
				this.getView().byId("pers_gender").setEnabled(true);
				this.getView().byId("pers_Prename").setEnabled(true);
				this.getView().byId("pers_Nationality").setEnabled(true);

				this.getView().byId("pers_islander").setEditable(true);
				this.getView().byId("pers_Native").setEditable(true);
				this.getView().byId("conmail").setEditable(true);
				this.getView().byId("conmobile").setEditable(true);
				this.getView().byId("emergency_Rel").setEditable(true);
				this.getView().byId("emergency_Name").setEditable(true);
				this.getView().byId("emergency_Phnumber").setEditable(true);
				this.getView().byId("IDCT").setVisible(false);
				//	this.getView().byId("CovidTitle").setVisible(false);
				//	this.getView().byId("CAT").setVisible(false);

			}
			else if (oModeldata.Key === "06") {
					var oData = this.getOwnerComponent().getModel("tableModel").getData();
				this.Pernr = oData.Pernr;
				this.getView().byId("req_Type").setSelectedKey(ModelSample);
				this.getView().byId("req_Type").setValue(TempModel);
				this.getView().byId("Reqsection").setVisible(true);
				this.getView().byId("idpif").setVisible(false);
				this.getView().byId("idCINF").setVisible(false);
				this.getView().byId("idECD").setVisible(false);
				this.getView().byId("idDA").setVisible(false);
				this.getView().byId("idDA1").setVisible(false);
				this.getView().byId("idDECAG").setVisible(false);
				this.getView().byId("idDecLRW").setVisible(false);
				this.getView().byId("idASIF").setVisible(false);
				this.getView().byId("IDMA").setVisible(false);
				this.getView().byId("idUploadcollection").setVisible(false);
				this.getView().byId("IDCT").setVisible(true);
				
				
				
			}
			else {
				var oData = this.getOwnerComponent().getModel("tableModel").getData();
				this.getView().byId("empAuthorized1").setVisible(true);
				this.descComments1 = "";
				this.titlevalid1 = "";
				this.firstNamevalid1 = "";
				this.middleNamevalid1 = "";
				this.lastNamevalid1 = "";
				this.DOBvalid1 = "";
				this.SAPNumvalid1 = "";
				this.gendervalid1 = "";
				this.prefNamevalid1 = "";
				this.natiovalid1 = "";
				this.Aboriginalvalid1 = "";
				this.nativeTitlevalid1 = "";
				this.mailvalid1 = "";
				this.mobileNumbervalid1 = "";
				this.relationshipvalid1 = "";
				this.emergencyNamevalid1 = "";
				this.emergencyphnvalid1 = "";
				this.startDatevalid1 = "";
				this.travelDatevalid1 = "";
				this.endDatevalid1 = "";
				this.Positionvalid1 = "";
				this.empSubvalid1 = "";
				this.empName1 = "";
				this.empPositionName1 = "";
				this.medicalComp1 = "";
				this.dateComp1 = "";
				this.dateExmp1 = "";
				this.Firstdose1 = "";
			    this.secondDose1 = "";
			    this.vaccinevalid1 = "";
			    this.consent1 = "";
				this.getView().byId("idLabelStartDate").setVisible(true);
				this.getView().byId("assign_StartDate").setVisible(true);
				this.getView().byId("assign_StartDate").setEditable(false);
				this.getView().byId("idLabelTravelDate").setVisible(false);
				this.getView().byId("assign_TravelDate").setVisible(false);

				this.getView().byId("IDMA").setVisible(false);
				this.getView().byId("idDA").setVisible(false);
				this.getView().byId("req_Type").setSelectedKey(ModelSample);
				this.getView().byId("req_Type").setValue(TempModel);
				this.Pernr = oData.Pernr;
				this.getView().byId("pers_Title").setSelectedKey(oData.Title);
				this.Perstitle = this.getView().byId("pers_Title").getSelectedKey();
				this.getView().byId("pers_Fname").setValue(oData.Fname);
				this.getView().byId("pers_Mname").setValue(oData.Mname);
				this.getView().byId("pers_Lname").setValue(oData.Lname);
				this.getView().byId("pers_DOB").setValue(oData.Dats);
				this.getView().byId("mantrolId").setVisible(false);
				this.getView().byId("Mant_subgroup").setVisible(false);
				this.getView().byId("projecttype").setVisible(false);
				this.getView().byId("Project").setVisible(false);
				this.getView().byId("assign_StartDate").setValue(oData.Begda);
				this.getView().byId("pers_gender").setSelectedKey(oData.Gender);
				this.gender = this.getView().byId("pers_gender").getSelectedKey();
				this.getView().byId("pers_islander").setSelectedKey(oData.Aborts);
				this.Aboriginal = this.getView().byId("pers_islander").getSelectedKey();
				var AboriginalIslander = this.getView().byId("pers_islander").getSelectedKey();
				this.getView().byId("conmail").setValue(oData.Email);
				this.getView().byId("pers_Nationality").setSelectedKey(oData.Natio);
				this.Natio = this.getView().byId("pers_Nationality").getSelectedKey();
				this.getView().byId("assign_Pos").setValue(oData.OrgPosid);
				var Posid = this.getView().byId("assign_Pos").getValue();
				this.getView().byId("IDCT").setVisible(false);
				//	this.getView().byId("CovidTitle").setVisible(false);
				//	this.getView().byId("CAT").setVisible(false);
				var Fnum = "";
				/*
				 * Start of Change 
				 * Changed On - 13.08.2020
				 *Changed By - Karteek
				 * Change Description - Calling validatePositionID(), passing eneterd value as an argument*/
				this.validatePositionID(Posid, Fnum);
				/*End of Change*/
				this.getView().byId("conmobile").setValue(oData.Mobile);
				//	this.getView().byId("assign_EstDate").setValue(oData.EstimatedEnddate);
				this.getView().byId("pers_SAPnum").setValue(parseFloat(oData.Personid_ext));
				this.getView().byId("Emp_subgroup").setSelectedKey(oData.Esubgrp);
				this.ESubgrp = this.getView().byId("pers_Nationality").getSelectedKey();
				this.getView().byId("assign_Worksch").setValue(oData.Worksch);
				//	this.getView().byId("assign_Vendor").setValue(oData.Vendor);
				//	this.getView().byId("EmpAuth_pos").setValue(oData.PositionName);
				//	this.getView().byId("EmpAuth_name").setValue(oData.FirstName);
				this.getView().byId("medicalComp").setValue(oData.Medicalcomp);
				this.getView().byId("dateComp").setValue(oData.DateComp);
				this.getView().byId("emergency_Rel").setSelectedKey(oData.Erelation);
				this.Erelation = this.getView().byId("emergency_Rel").getSelectedKey();
				this.getView().byId("emergency_Name").setValue(oData.Ename);
				this.getView().byId("emergency_Phnumber").setValue(oData.Ephone);
				this.getView().byId("pers_Native").setSelectedKey(oData.Ntitle);
				this.Ntitle = this.getView().byId("pers_Native").getSelectedKey();
				this.getView().byId("Reqsection").setVisible(true);
				this.getView().byId("idpif").setVisible(false);
				this.getView().byId("idCINF").setVisible(false);
				this.getView().byId("idECD").setVisible(false);
				this.getView().byId("idUploadcollection").setVisible(false);
				this.getView().byId("idDECAG").setVisible(false);
				this.getView().byId("idDecLRW").setVisible(false);
				this.getView().byId("idASIF").setVisible(true);
				//	this.getView().byId("idDA").setVisible(true);
				//	this.getView().byId("IDMA").setVisible(true);
				//	this.getView().byId("idDECAG").setVisible(true);

				this.getView().byId("req_Type").setEnabled(false);
				//	this.getView().byId("req_Desccomments").setEditable(false);
				this.getView().byId("pers_Title").setEnabled(false);
				this.getView().byId("pers_Fname").setEditable(false);
				this.getView().byId("pers_Mname").setEditable(false);
				this.getView().byId("pers_Lname").setEditable(false);
				this.getView().byId("pers_DOB").setEditable(false); /*Date*/
				this.getView().byId("pers_SAPnum").setEditable(false);
				this.getView().byId("pers_gender").setEnabled(false);
				this.getView().byId("pers_Prename").setEnabled(false);
				this.getView().byId("pers_Nationality").setEnabled(false);
				this.getView().byId("pers_islander").setEditable(false);
				this.getView().byId("pers_Native").setEditable(false);
				this.getView().byId("conmail").setEditable(false);
				this.getView().byId("conmobile").setEditable(false);
				this.getView().byId("idECD").setVisible(false);
				this.getView().byId("emergency_Rel").setEditable(false);
				this.getView().byId("emergency_Name").setEditable(false);
				this.getView().byId("emergency_Phnumber").setEditable(false);
				//	this.getView().byId("assign_StartDate").setValue("");
				//	this.getView().byId("assign_EstDate").setEditable(false);
				this.getView().byId("assign_Pos").setEditable(false);
				this.getView().byId("assign_Leader").setEditable(false);
				this.getView().byId("assign_loc").setEditable(false);
				this.getView().byId("Emp_subgroup").setEnabled(false);
				//	this.getView().byId("assign_Worksch").setValue("");
				//	this.getView().byId("assign_Vendor").setValue(Cu           );
				//	this.getView().byId("EmpAuth_name").setEditable(false);
				//	this.getView().byId("EmpAuth_pos").setEditable(false);
				this.getView().byId("medicalComp").setEnabled(false);
				this.getView().byId("medicalComp").setEditable(false);
				//	this.getView().byId("idmedinput").setEditable(false);
				//	this.getView().byId("idmedinput").setVisible(false);
				this.getView().byId("dateComp").setEditable(false);
			}
			this.onAfterRendering();

		},
		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description -
		 * -> This function will be invoked after the view is rendered 
		 *-> This function will set the Travel date as current date other than Demobilise request type
		 *-> This function will set the Travel date that is fetched from worklist for Demobilise request type*/
		onAfterRendering: function () {
			var oModeldata = this.getOwnerComponent().getModel("initiateModel").getObject("/");

			var TempModel = oModeldata.TextData;
			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});
			var setDates = datformat.format(new Date());
			var date1 = new Date("2/21/2021");
			if (TempModel === "Demobilise" || TempModel === "Extend End Date") {
				var oData = this.getOwnerComponent().getModel("tableModel").getData();
				this.getView().byId("assign_StartDate").setValue(oData.Begda);
				this.getView().byId("assign_EstDate").setMinDate(new Date());
			} else if (TempModel === "Change Of Conditions" || TempModel === "Onboard") {
				this.getView().byId("assign_TravelDate").setValue(setDates);
				this.getView().byId("assign_EstDate").setMinDate(new Date());
				this.getView().byId("CFDD").setValue(setDates);
			this.getView().byId("SeconddoseDate").setMaxDate(new Date());
				this.getView().byId("SeconddoseDate").setMinDate(date1);
		
			
				
				
				
				
			} 
			else if (oModeldata.Key === "06") {
				this.getView().byId("CFDD").setValue(setDates);
				this.getView().byId("SeconddoseDate").setMaxDate(new Date());
				this.getView().byId("SeconddoseDate").setMinDate(date1);
				
			}
			else {
				this.getView().byId("assign_StartDate").setValue(setDates);
				this.getView().byId("assign_EstDate").setMinDate(new Date());
				this.startdate = this.getView().byId("assign_StartDate");
				this.enddate = this.getView().byId("assign_EstDate");
			}
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},
		reqtypechange: function () {
			var req_Type = this.getView().byId("req_Type").getValue();
			if (req_Type === "") {
				this.getView().byId("idpif").setVisible(false);
				this.getView().byId("idCINF").setVisible(false);
				this.getView().byId("idECD").setVisible(false);
				this.getView().byId("idASIF").setVisible(false);
				this.getView().byId("idDA").setVisible(false);
				this.getView().byId("IDMA").setVisible(false);
				this.getView().byId("idDECAG").setVisible(false);
			} else {
				this.getView().byId("idpif").setVisible(true);
				this.getView().byId("idCINF").setVisible(true);
				this.getView().byId("idECD").setVisible(true);
				this.getView().byId("idASIF").setVisible(true);
				this.getView().byId("idDA").setVisible(true);
				this.getView().byId("IDMA").setVisible(true);
				this.getView().byId("idDECAG").setVisible(true);
			}

		},
		request_Typechange: function (oEvent) {
			var reqChange = oEvent.getSource().getValue();
			if (reqChange !== "") {
				this.getView().byId("idpif").setVisible(true);
				this.getView().byId("idCINF").setVisible(true);
				this.getView().byId("idECD").setVisible(true);
				this.getView().byId("idASIF").setVisible(true);
				this.getView().byId("idDA").setVisible(true);
				this.getView().byId("IDMA").setVisible(true);
				this.getView().byId("idDECAG").setVisible(true);

			} else {
				this.getView().byId("idpif").setVisible(false);
				this.getView().byId("idCINF").setVisible(false);
				this.getView().byId("idECD").setVisible(false);
				this.getView().byId("idASIF").setVisible(false);
				this.getView().byId("idDA").setVisible(false);
				this.getView().byId("IDMA").setVisible(false);
				this.getView().byId("idDECAG").setVisible(false);
			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the item in the Medical Completed combobox
		 *-> This function will validate the selected key with the items that are binded to the combobox
		 *-> This function will also make the input field visible when only 'others' item in the combobox is selected
		 *Input- Key
		 *Output- returns boolean*/
		medicalChange: function () {
			this.changeFlag = true;
			var medComp = this.getView().byId("medicalComp").getValue();
			var medicalCompleted = this.getView().byId("medicalComp").getSelectedKey().trim();
			if (medComp === "Others (Please Specify)") {
				this.getView().byId("idmedinput").setVisible(true);
			} else {
				this.getView().byId("idmedinput").setValue("");
				this.getView().byId("idmedinput").setValueState("None");

				this.getView().byId("idmedinput").setVisible(false);
			}

			if (medicalCompleted === "" || medicalCompleted === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please Select Medical Completed", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("medicalComp").setSelectedKey();

			}
			if (medComp !== "") {
				this.getView().byId("medicalComp").setValueState("None");
			}
			if (this.medicalComp1 !== medicalCompleted) {
				this.medicalComp = true;
			}
			if (this.medicalComp1 === medicalCompleted) {
				this.medicalComp = false;
			}

		},
		/* 
		 * Date - 21.08.2020
		 * Created By - Karteek
		 * Description - This function will validate the date  if includes the format of '.' and '-'
		 *Input- Date value
		 *Output- returns boolean
		 *Called By - endDateChange()*/
		validateDateInput: function (enteredValue) {
			if (enteredValue !== "") {
				if (!enteredValue.includes(".") && !enteredValue.includes("-")) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.information(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});
					this.getView().byId("assign_EstDate").setValue("");
					this.getView().byId("assign_EstDate").setValueState("Error");
					return false;
				} else {
					return true;
				}
			}
		},
		startDateChange: function () {

			this.changeFlag = true;
			var enteredValueofStartDate = this.getView().byId("assign_StartDate").getValue();
			var returnValue = this.validateDateInputforStartDate(enteredValueofStartDate);
			if (!returnValue) {
				return;
			}
			var estEndDate = new Date(this.getView().byId("assign_StartDate").getValue());
			var dateValue = this.getView().byId("assign_StartDate").getValue();
			if (dateValue.split("-")[0]) {
				if (dateValue.split("-")[0].length !== 4 && !isNaN(dateValue.split(".")[0])) {
					var checkStartDate = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkStartDate ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("assign_StartDate").setValue("");
					this.getView().byId("assign_StartDate").setValueState("Error");
					return;
				}
			}
			var dt = new Date(this.getView().byId("assign_StartDate").getValue().split("-")[1] + "-" + this.getView().byId("assign_StartDate").getValue()
				.split("-")[2] + "." + this.getView().byId("assign_StartDate").getValue().split("-")[0]);

			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var dateFormatted = datformat.format(dt);
			if (dateFormatted === "") {
				var dateComp = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: dateComp ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("assign_StartDate").setValue("");
				return;

			}
			var datformat3 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});

			var datformat4 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});

			var startdate = this.getView().byId("assign_StartDate").getValue();
			if (typeof startdate === "string") {
				if (startdate.includes(".")) {

					startdate = datformat3.parse(startdate);

				} else

				if (startdate.includes("-")) {

					startdate = new Date(startdate);

				}
			}
			var enddate = this.getView().byId("assign_EstDate").getValue();
			if (enddate !== "") {
				if (typeof enddate === "string") {

					if (enddate.includes(".")) {

						enddate = datformat3.parse(enddate);

					} else

					if (enddate.includes("-")) {

						enddate = new Date(enddate);

					}
				}
			}
			if (enddate !== "") {
				if (startdate > enddate) {
					this.getView().byId("assign_StartDate").setValueState("Error");
					// sap.m.MessageBox.error("Travel Date can't exceed Estimated End Date");
					//                oEvent.getSource().setValue("");
					var remname4 = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Start Date can't exceed Estimated End Date", {
							styleClass: remname4 ? "sapUiSizeCompact" : ""
						});

					return;

				} else {
					this.getView().byId("assign_StartDate").setValueState("None");
					this.getView().byId("assign_EstDate").setValueState("None");

				}
			} else {
				this.getView().byId("assign_StartDate").setValueState("None");
				//this.getView().byId("assign_EstDate").setValueState("None");

			}
			var startdatestate = this.getView().byId("assign_StartDate").getValue();
			if (startdatestate !== "") {
				this.getView().byId("assign_StartDate").setValueState("None");
			}
			if (new Date(this.getView().byId("assign_StartDate").getValue()).toDateString() !== Date(this.startDatevalid1).slice(0, 15)) {
				this.startDatevalid = true;
			}
			if (new Date(this.getView().byId("assign_StartDate").getValue()).toDateString() === Date(this.startDatevalid1).slice(0, 15)) {
				this.startDatevalid = false;
			}
		},

		validateDateInputforStartDate: function (enteredValue) {
			if (enteredValue !== "") {
				if (!enteredValue.includes(".") && !enteredValue.includes("-")) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});
					this.getView().byId("assign_StartDate").setValue("");
					this.getView().byId("assign_StartDate").setValueState("Error");
					return false;
				} else {
					return true;
				}
			}
		},
		travelDateChange: function () {

			this.changeFlag = true;
			var enteredValueofTravelDate = this.getView().byId("assign_TravelDate").getValue();
			var returnValue = this.validateDateInputforTravelDate(enteredValueofTravelDate);
			if (!returnValue) {
				return;
			}
			var travelDate = new Date(this.getView().byId("assign_TravelDate").getValue());
			var dateValue = this.getView().byId("assign_TravelDate").getValue();
			if (dateValue.split("-")[0]) {
				if (dateValue.split("-")[0].length !== 4 && !isNaN(dateValue.split(".")[0])) {
					var checkTravelDate = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkTravelDate ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("assign_TravelDate").setValue("");
					this.getView().byId("assign_TravelDate").setValueState("Error");
					return;
				}
			}
			var dt = new Date(this.getView().byId("assign_TravelDate").getValue().split("-")[1] + "-" + this.getView().byId("assign_TravelDate")
				.getValue()
				.split("-")[2] + "." + this.getView().byId("assign_TravelDate").getValue().split("-")[0]);

			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var dateFormatted = datformat.format(dt);
			if (dateFormatted === "") {
				var dateComp = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: dateComp ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("assign_TravelDate").setValue("");
				return;

			}
			var datformat3 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});

			var datformat4 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});

			var travelDate = this.getView().byId("assign_TravelDate").getValue();
			if (typeof travelDate === "string") {
				if (travelDate.includes(".")) {

					travelDate = datformat3.parse(travelDate);

				} else

				if (travelDate.includes("-")) {

					travelDate = new Date(travelDate);

				}
			}
			var enddate = this.getView().byId("assign_EstDate").getValue();
			if (enddate !== "") {
				if (typeof enddate === "string") {

					if (enddate.includes(".")) {

						enddate = datformat3.parse(enddate);

					} else

					if (enddate.includes("-")) {

						enddate = new Date(enddate);

					}
				}
			}
			if (enddate !== "") {
				if (travelDate > enddate) {
					this.getView().byId("assign_TravelDate").setValueState("Error");
					var remname4 = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Travel Date can't exceed Estimated End Date", {
							styleClass: remname4 ? "sapUiSizeCompact" : ""
						});

					return;

				} else {
					this.getView().byId("assign_TravelDate").setValueState("None");
					//this.getView().byId("assign_EstDate").setValueState("None");

				}
			} else {
				this.getView().byId("assign_TravelDate").setValueState("None");
				this.getView().byId("assign_EstDate").setValueState("None");

			}
			var traveldatestate = this.getView().byId("assign_TravelDate").getValue();
			if (traveldatestate !== "") {
				this.getView().byId("assign_TravelDate").setValueState("None");
			}
			if (new Date(this.getView().byId("assign_TravelDate").getValue()).toDateString() !== Date(this.travelDatevalid1).slice(0, 15)) {
				this.travelDatevalid = true;
			}
			if (new Date(this.getView().byId("assign_TravelDate").getValue()).toDateString() === Date(this.travelDatevalid1).slice(0, 15)) {
				this.travelDatevalid = false;
			}
		},
		validateDateInputforTravelDate: function (enteredValue) {
			if (enteredValue !== "") {
				if (!enteredValue.includes(".") && !enteredValue.includes("-")) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});
					this.getView().byId("assign_TravelDate").setValue("");
					this.getView().byId("assign_TravelDate").setValueState("Error");
					return false;
				} else {
					return true;
				}
			}
		},
		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description - This function will be called when user changes the value in the input field of estimated date 
		 *->This function will validate  date string for the entered value of estimated date field value
		 *Input- Date value
		 *Output- returns error message if false
		 * Calling Functions- validateDateInput()*/
		endDateChange: function () {
			this.changeFlag = true;
			var enteredValue = this.getView().byId("assign_EstDate").getValue();
			var getReqtype = this.getView().getModel("initiateModel").getData().TextData;
			var returnValue = this.validateDateInput(enteredValue);

			if (!returnValue) {
				return;
			}
			var estEndDate = new Date(this.getView().byId("assign_EstDate").getValue());
			var dateValue = this.getView().byId("assign_EstDate").getValue();
			if (dateValue.split("-")[0]) {
				if (dateValue.split("-")[0].length !== 4 && !isNaN(dateValue.split(".")[0])) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("assign_EstDate").setValue("");
					this.getView().byId("assign_EstDate").setValueState("Error");
					return;
				}
			}
			var dt = new Date(this.getView().byId("assign_EstDate").getValue().split("-")[1] + "-" + this.getView().byId("assign_EstDate").getValue()
				.split("-")[2] + "." + this.getView().byId("assign_EstDate").getValue().split("-")[0]);

			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var dateFormatted = datformat.format(dt);
			if (dateFormatted === "") {
				var dateComp = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: dateComp ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("assign_EstDate").setValue("");
				//this.getView().byId("dateComp").setValueState("Error");
				return;

			}
			var datformat3 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});

			var datformat4 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});

			var startdate = "";
			if (getReqtype === "Change Of Conditions" || "Onboard") {
				startdate = this.getView().byId("assign_TravelDate").getValue();
			} else {
				startdate = this.getView().byId("assign_StartDate").getValue();
			}
			if (typeof startdate === "string") {
				if (startdate.includes(".")) {

					startdate = datformat3.parse(startdate);

				} else

				if (startdate.includes("-")) {

					startdate = new Date(startdate);

				}
			}
			var enddate = this.getView().byId("assign_EstDate").getValue();
			if (typeof enddate === "string") {

				if (enddate.includes(".")) {

					enddate = datformat3.parse(enddate);

				} else

				if (enddate.includes("-")) {
					enddate = new Date(enddate);
				}
			}
			if (startdate > enddate) {
				this.getView().byId("assign_EstDate").setValueState("Error");
				if (getReqtype === "Change Of Conditions" || "Onboard") {
					var travelDatemsg = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Travel Date can't exceed Estimated End Date", {
							styleClass: travelDatemsg ? "sapUiSizeCompact" : ""
						});

					return;
				} else {
					var remname4 = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Start Date can't exceed Estimated End Date", {
							styleClass: remname4 ? "sapUiSizeCompact" : ""
						});

					return;
				}
			} else {
				this.getView().byId("assign_EstDate").setValueState("None");
				this.getView().byId("assign_StartDate").setValueState("None");
				this.getView().byId("assign_TravelDate").setValueState("None");
			}
			var ENddatestate = this.getView().byId("assign_EstDate").getValue();
			if (ENddatestate !== "") {
				this.getView().byId("assign_EstDate").setValueState("None");
			}
			if (new Date(this.getView().byId("assign_EstDate").getValue()).toDateString() !== Date(this.endDatevalid1).slice(0, 15)) {
				this.endDatevalid = true;
			}
			if (new Date(this.getView().byId("assign_EstDate").getValue()).toDateString() === Date(this.endDatevalid1).slice(0, 15)) {
				this.endDatevalid = false;
			}
		},
		empsubgrp_Change: function (oEvent) {
			this.changeFlag = true;
			var titleChange = oEvent.getSource().getValue().trim();
			if (titleChange !== "") {

				this.getView().byId("Emp_subgroup").setValueState("None");
			}
			var empSubgrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubgrp === "E6") {

				this.getView().byId("idemptext1").setVisible(false);
				this.getView().byId("idemptext2").setVisible(false);
				this.getView().byId("idemptext3").setVisible(false);
				this.getView().byId("idemptext4").setVisible(false);
				this.getView().byId("Med_Agreement").setVisible(false);
				this.getView().byId("idImage").setVisible(false);
				this.getView().byId("idDecLRW").setVisible(true);
				this.getView().byId("idDECAG").setVisible(false);
				this.getView().byId("IDMA").setVisible(false);
				this.getView().byId("Med_Agreement").setVisible(false);
				this.getView().byId("IDMA").setVisible(false);
				this.getView().byId("idImage").setVisible(false);
				this.getView().byId("chk1").setSelected(false);
				this.getView().byId("chk2").setSelected(false);
				this.getView().byId("chk3").setSelected(false);
				this.getView().byId("chk4").setSelected(false);
				this.getView().byId("chk5").setSelected(false);
				this.getView().byId("chk6").setSelected(false);
				this.getView().byId("chk1").setValueState("None");
				this.getView().byId("chk2").setValueState("None");
				this.getView().byId("chk3").setValueState("None");
				this.getView().byId("chk4").setValueState("None");
				this.getView().byId("chk5").setValueState("None");
				this.getView().byId("chk6").setValueState("None");
			} else {
				var chk1 = this.getView().byId("chk1").getSelected();
				var chk2 = this.getView().byId("chk2").getSelected();
				var chk3 = this.getView().byId("chk3").getSelected();
				var chk4 = this.getView().byId("chk4").getSelected();
				var chk5 = this.getView().byId("chk5").getSelected();
				var chk6 = this.getView().byId("chk6").getSelected();
				this.getView().byId("medicalComp").setValueState("None");
				this.getView().byId("idmedinput").setValueState("None");
				this.getView().byId("dateComp").setValueState("None");
				this.getView().byId("AODTEST").setValueState("None");
				this.getView().byId("medicalfitness").setValueState("None");
				this.getView().byId("healthmanagement").setValueState("None");
				this.getView().byId("chk1").setValueState("None");
				this.getView().byId("chk2").setValueState("None");
				this.getView().byId("chk3").setValueState("None");
				this.getView().byId("chk4").setValueState("None");
				this.getView().byId("chk5").setValueState("None");
				this.getView().byId("chk6").setValueState("None");
				this.getView().byId("IDMA").setVisible(true);
				this.getView().byId("idemptext1").setVisible(true);
				this.getView().byId("idemptext2").setVisible(true);
				this.getView().byId("idemptext3").setVisible(true);
				this.getView().byId("idemptext4").setVisible(true);
				this.getView().byId("Med_Agreement").setVisible(true);
				this.getView().byId("idImage").setVisible(true);
				this.getView().byId("idDecLRW").setVisible(false);
				this.getView().byId("idDECAG").setVisible(true);

				// if (this.getView().getModel("initiateModel").getData().TextData === "Change Of Conditions") {
				// this.getView().byId("IDMA").setVisible(false);
				// this.getView().byId("Med_Agreement").setVisible(false);
				// this.getView().byId("idImage").setVisible(false);	
				// }
				// else {
				this.getView().byId("IDMA").setVisible(true);
				this.getView().byId("Med_Agreement").setVisible(true);
				this.getView().byId("idImage").setVisible(true);
				//}
				this.getView().byId("chk7").setSelected(false);
				this.getView().byId("chk8").setSelected(false);
				this.getView().byId("chk9").setSelected(false);
				this.getView().byId("chk10").setSelected(false);
				this.getView().byId("chk7").setValueState("None");
				this.getView().byId("chk8").setValueState("None");
				this.getView().byId("chk9").setValueState("None");
				this.getView().byId("chk10").setValueState("None");
				if (chk1 === true) {
					this.getView().byId("chk1").setSelected(true);
				} else if (chk2 === true) {
					this.getView().byId("chk2").setSelected(true);
				} else if (chk3 === true) {
					this.getView().byId("chk3").setSelected(true);
				} else if (chk4 === true) {
					this.getView().byId("chk4").setSelected(true);
				} else if (chk5 === true) {
					this.getView().byId("chk5").setSelected(true);
				} else if (chk6 === true) {
					this.getView().byId("chk6").setSelected(true);
				} else {
					this.getView().byId("chk1").setSelected(false);
					this.getView().byId("chk2").setSelected(false);
					this.getView().byId("chk3").setSelected(false);
					this.getView().byId("chk4").setSelected(false);
					this.getView().byId("chk5").setSelected(false);
					this.getView().byId("chk6").setSelected(false);
					this.getView().byId("chk7").setSelected(false);
					this.getView().byId("chk8").setSelected(false);
					this.getView().byId("chk9").setSelected(false);
					this.getView().byId("chk10").setSelected(false);

					this.getView().byId("chk1").setValueState("None");
					this.getView().byId("chk2").setValueState("None");
					this.getView().byId("chk3").setValueState("None");
					this.getView().byId("chk4").setValueState("None");
					this.getView().byId("chk5").setValueState("None");
					this.getView().byId("chk6").setValueState("None");
					this.getView().byId("chk7").setValueState("None");
					this.getView().byId("chk8").setValueState("None");
					this.getView().byId("chk9").setValueState("None");
					this.getView().byId("chk10").setValueState("None");
				}

			}

			if (empSubgrp === "" || empSubgrp === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Employee Subgroup", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("Emp_subgroup").setSelectedKey();
			}
			//var Nationalitychange = this.getView().byId("pers_Nationality").getValue();
			if (titleChange !== "") {
				this.getView().byId("Emp_subgroup").setValueState("None");
			}
			if (this.empSubvalid1 !== empSubgrp) {
				this.empSubvalid = true;
			}
			if (this.empSubvalid1 === empSubgrp) {
				this.empSubvalid = false;
			}
		},
		ProjectType_Change: function () {
			var ProjectType = this.getView().byId("Project").getValue();
			var projectTypeKey = this.getView().byId("Project").getSelectedKey().trim();
			if (projectTypeKey === "" || projectTypeKey === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Project Type", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("Project").setSelectedKey();
			}
			if (ProjectType !== "") {
				this.getView().byId("Project").setValueState("None");
			}
			if (this.project1 !== projectTypeKey) {
				this.project = true;
			}
			if (this.project1 === projectTypeKey) {
				this.project = false;
			}
		},
		Status_Change: function () {
			that = this;
			var Vaccinestatus = this.getView().byId("idvaccinestatus").getSelectedKey();
			// if(Vaccinestatus !== ""){

			// 		this.getView().byId("CovidATtachmentSection").setVisible(true);
			// 		this.getView().byId("covidAttachment").setVisible(true);
			// 		this.getView().byId("CAT").setVisible(true);
			// 		this.getView().byId("CovidTitle").setVisible(true);
			// 		this.getView().byId("idvaccinestatus").setValueState("None");
			// } else {
			// 	this.getView().byId("CovidATtachmentSection").setVisible(false);
			// 	this.getView().byId("covidAttachment").setVisible(false);
			// 		this.getView().byId("CAT").setVisible(false);
			// 		this.getView().byId("idvaccinestatus").setValueState("None");
			// 		this.getView().byId("CovidTitle").setVisible(false);
			// }
			var key1 = this.getView().byId("idvaccinestatus").getSelectedKey();
			if (this.vaccinestatus1 !== key1) {
				this.vaccinestatus = true;
			}
			if (this.vaccinestatus1 === key1) {
				this.vaccinestatus = false;
			}
			if (key1 !== "") {
				var oModel = this.getOwnerComponent().getModel();
				var Filters2 = new sap.ui.model.Filter("Jobid", sap.ui.model.FilterOperator.EQ, key1);
				var entity = "/LicenseSet";
				oModel.read(entity, {
					filters: [Filters2],
					success: function (oData) {
						var data = oData.results;
						var oModel1 = new JSONModel();
						oModel1.setData(data);
						that.getView().setModel(oModel1, "Mat");
						var simpleForm = that.getView().byId("covidAttachment");
						if (Files2.length !== 0) {
							MessageBox.warning("Changes will be lost.", {
								actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
								emphasizedAction: MessageBox.Action.OK,
								onClose: function (sAction) {
									if (sAction === "OK") {
										a7 = [];
										a8 = [];
										Files2 = [];
										IE1 = 0;
										Docno2 = [];
										// FileUploaded = false;
										// selected = false;
										//that.getView().byId("idSubmitButton").destroyCustomData();
										// that.getView().byId("Mant_subgroup").setSelectedKey();
										that.getCovidAttachSimpleFormContent();

									} else {
										that.getView().byId("idvaccinestatus").setSelectedKey(that.oldSelectedVaccineKey);

									}
								}
							});
						} else {
							that.getCovidAttachSimpleFormContent();
						}
					}
				});
			}
		},
		getCovidAttachSimpleFormContent: function () {
			var that = this;
			var total;
			var cust = [];
			a7 = [];
			a8 = [];
			Files2 = [];
			IE1 = 0;
			Docno2 = [];
			//FileUploaded = false;
			// selected = false;
			var key = this.getView().byId("idvaccinestatus").getSelectedKey();
			this.oldSelectedVaccineKey = key;

			var LicText = {

				lictxt: "Vaccine Certificate"

			};
			a7.push(LicText);

			var LicIDData = {
				licID: "COVID_19"
			};
			a8.push(LicIDData);
			//var simpleForm = this.getView().byId("covidAttachment");
			var simpleForm = this.getView().byId("Covid_Tracker");
			for (var t = 0; t < simpleForm.getContent().length; t++) {
				if (simpleForm.getContent()[t].getId().includes("idCancel")) {
					simpleForm.getContent()[t].destroy();
					t--;
				}
				if (simpleForm.getContent()[t].getId().includes("idVaccineLabel")) {
					simpleForm.getContent()[t].destroy();
					t--;
				}
				if (simpleForm.getContent()[t].getId().includes("uploader")) {
					simpleForm.getContent()[t].destroy();
					t--;

				}
				if (simpleForm.getContent()[t].getId().includes("idFileText")) {
					simpleForm.getContent()[t].destroy();
					t--;
				}
			}
			//simpleForm.destroyContent();

			var content = simpleForm.getContent();
			//that.getView().byId("idSubmitButton").destroyCustomData();
			// if (key !== "PV") {

			//var id = "upload1" + i;

			var label = new sap.m.Label("idVaccineLabel", {
				"wrapping": true,
				"text": a7[0].lictxt

				//labelFor : id
			}).addStyleClass("cgcolor");
			// 		var icon = new sap.ui.core.Icon ({
			// 	src: "sap-icon://sys-help",
			// 	press: that.onVaccineCertificatePress,

			// });
			var Text = new sap.m.Text("idFileText", {
				visible: false
			});
			var Button = new sap.m.Button("idCancel", {
				visible: false,
				width: "20%",
				icon: "sap-icon://sys-cancel",
				press: that.onUploadDelete,
				customData: [
					new sap.ui.core.CustomData({

						"key": a7[0].lictxt,
						"value": Text

					}),
					// new sap.ui.core.CustomData({

					// 	"key": "ggg",
					// 	"value": icon

					// }),
					new sap.ui.core.CustomData({
						"key": a7[0].lictxt,
						"value": a8[0].licID
					}),
					new sap.ui.core.CustomData({
						"key": a7[0].lictxt,
						"value": a7[0].licID
					})
				]
			});
			var AfterUploadCombo = {
				"Text": Text,
				"Button": Button
			};
			this.oFileUploader4 = new sap.ui.unified.FileUploader({
				uploadUrl: "/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV/FileSet",
				//	sendXHR: true,
				value: "",
				width: "300px",
				tooltip: "Upload your file to the local server.",
				placeholder: "Choose a file for uploading...",
				// mimeType: "image/png,image/jpeg,image/bmp,application/pdf,application/msexcel,application/msword,text/plain",
				//	maximumFileSize: 55,
				sendXHR: true,

				useMultipart: false,
				//maximumFilenameLength: 55,
				uploadOnChange: true,
				uploadComplete: that.handleUploadComplete02,
				buttonText: "Upload",
				change: that.onFileUploadChange02,
				customData: [
					new sap.ui.core.CustomData({
						"key": a7[0].lictxt,
						"value": AfterUploadCombo
					}),
					new sap.ui.core.CustomData({
						"key": a7[0].lictxt,
						"value": a8[0].licID
					})
				]
			});

			simpleForm.addContent(label);
			//simpleForm.addContent(icon);
			simpleForm.addContent(this.oFileUploader4);

			simpleForm.addContent(Text);
			simpleForm.addContent(Button);
			var customdata = new sap.ui.core.CustomData({
				"key": "1",
				"value": this.oFileUploader4
			});
			//this.getView().byId("idSubmitButton").addCustomData(customdata);
			// cust.push(customdata);

			// }
			var Text01 = new sap.m.Text({
				visible: false
			});
			var Button01 = new sap.m.Button({
				visible: false,
				width: "20%",
				icon: "sap-icon://sys-cancel",
				press: that.onUploadDelete,
				customData: [
					new sap.ui.core.CustomData({
						"key": "01",
						"value": Text01
					}),
					new sap.ui.core.CustomData({
						"key": "04",
						"value": "licID"
					}),
					new sap.ui.core.CustomData({
						"key": "04",
						"value": "licID"
					})
				]
			});
			var AfterUploadCombo01 = {
				"Text": Text01,
				"Button": Button01
			};
			var Uploaderlabel = new sap.m.Label({
				text: ""
					//labelFor : id
			});

		},
		Mant_Change: function () {
			that = this;
			var MandatoryRole = this.getView().byId("Mant_subgroup").getValue();
			if (MandatoryRole !== "") {
				this.getView().byId("idDA1").setVisible(true);
				this.getView().byId("TB1").setVisible(true);
				this.getView().byId("Title1").setVisible(true);
				this.getView().byId("Mant_subgroup").setValueState("None");
			} else {
				this.getView().byId("idDA1").setVisible(false);
				this.getView().byId("TB1").setVisible(false);
				this.getView().byId("Title1").setVisible(false);
			}
			var key1 = this.getView().byId("Mant_subgroup").getSelectedKey();
			if (this.mandtRole1 !== key1) {
				this.mandtRole = true;
			}
			if (this.mandtRole1 === key1) {
				this.mandtRole = false;
			}
			if (key1 !== "") {
				var oModel = this.getOwnerComponent().getModel();
				var Filters2 = new sap.ui.model.Filter("Jobid", sap.ui.model.FilterOperator.EQ, key1);
				var entity = "/LicenseSet";
				oModel.read(entity, {
					filters: [Filters2],
					success: function (oData) {
						var data = oData.results;
						var oModel1 = new JSONModel();
						oModel1.setData(data);
						that.getView().setModel(oModel1, "Mat");
						var simpleForm = that.getView().byId("empAuthorized11");
						if (Files.length !== 0 || selected === true) {
							MessageBox.warning("Changes will be lost.", {
								actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
								emphasizedAction: MessageBox.Action.OK,
								onClose: function (sAction) {
									if (sAction === "OK") {
										a4 = [];
										a1 = [];
										Files = [];
										IE = 0;
										Docno1 = [];
										FileUploaded = false;
										selected = false;
										that.getView().byId("idSubmitButton").destroyCustomData();
										// that.getView().byId("Mant_subgroup").setSelectedKey();
										that.getSimpleFormContent();

									} else {
										that.getView().byId("Mant_subgroup").setSelectedKey(that.oldSeledted);

									}
								}
							});
						} else {
							that.getSimpleFormContent();
						}
					}
				});
			} else {
				if (Files.length !== 0 && selected === true) {
					MessageBox.warning("Changes will be lost.", {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if (sAction === "OK") {
								a4 = [];
								a1 = [];
								Files = [];
								IE = 0;
								Docno1 = [];
								FileUploaded = false;
								selected = false;
								that.getView().byId("idSubmitButton").destroyCustomData();
								var simpleForm = that.getView().byId("empAuthorized1");
								simpleForm.destroyContent();
								that.getView().byId("idSubmitButton").destroyCustomData();
								that.getView().byId("idDA1").setVisible(false);
								that.getView().byId("TB1").setVisible(false);
								that.getView().byId("Title1").setVisible(false);
								that.getView().byId("Mant_subgroup").setSelectedKey();
								return;
								// that.getView().byId("Mant_subgroup").setSelectedKey();
								//that.getSimpleFormContent();

							} else {
								that.getView().byId("Mant_subgroup").setSelectedKey(that.oldSeledted);

							}
						}
					});
				}
				if (selected === true && Files.length === 0) {
					MessageBox.warning("Changes will be lost.", {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if (sAction === "OK") {
								a4 = [];
								a1 = [];
								Files = [];
								IE = 0;
								Docno1 = [];
								FileUploaded = false;
								selected = false;
								that.getView().byId("idSubmitButton").destroyCustomData();
								var simpleForm = that.getView().byId("empAuthorized1");
								simpleForm.destroyContent();
								that.getView().byId("idSubmitButton").destroyCustomData();
								that.getView().byId("idDA1").setVisible(false);
								that.getView().byId("TB1").setVisible(false);
								that.getView().byId("Title1").setVisible(false);
								that.getView().byId("Mant_subgroup").setSelectedKey();
								return;
								// that.getView().byId("Mant_subgroup").setSelectedKey();
								//that.getSimpleFormContent();

							} else {
								that.getView().byId("Mant_subgroup").setSelectedKey(that.oldSeledted);

							}
						}
					});
				}
				if (selected === false && Files.length !== 0) {
					MessageBox.warning("Changes will be lost.", {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if (sAction === "OK") {
								a4 = [];
								a1 = [];
								Files = [];
								IE = 0;
								Docno1 = [];
								FileUploaded = false;
								selected = false;
								that.getView().byId("idSubmitButton").destroyCustomData();
								var simpleForm = that.getView().byId("empAuthorized1");
								simpleForm.destroyContent();
								that.getView().byId("idSubmitButton").destroyCustomData();
								that.getView().byId("idDA1").setVisible(false);
								that.getView().byId("TB1").setVisible(false);
								that.getView().byId("Title1").setVisible(false);
								that.getView().byId("Mant_subgroup").setSelectedKey();
								return;
								// that.getView().byId("Mant_subgroup").setSelectedKey();
								//that.getSimpleFormContent();

							} else {
								that.getView().byId("Mant_subgroup").setSelectedKey(that.oldSeledted);

							}
						}
					});
				}
				if (selected === false && Files.length === 0) {
					MessageBox.information("Please select valid Mandatory Role Qualifications / Licenses");
					that.getView().byId("Mant_subgroup").setSelectedKey();
					var simpleForm = this.getView().byId("empAuthorized1");
					simpleForm.destroyContent();
					that.getView().byId("idSubmitButton").destroyCustomData();
					this.getView().byId("idDA1").setVisible(false);
					this.getView().byId("TB1").setVisible(false);
					this.getView().byId("Title1").setVisible(false);
					a4 = [];
					a1 = [];
					Files = [];
					IE = 0;
					Docno1 = [];
					FileUploaded = false;
					selected = false;
				}
			}
		},
        getSimpleFormContent: function () {
			var that = this;
			var total;
			var cust = [];
			a4 = [];
			a1 = [];
			Files = [];
			IE = 0;
			Docno1 = [];
			FileUploaded = false;
			selected = false;
			var key = this.getView().byId("Mant_subgroup").getSelectedKey();
			this.oldSeledted = key;
			var model = this.getView().getModel("Mat").getData();
			total = model.length;
			for (var j = 0; j < model.length; j++) {
				var a2 = model[j].Lictext;
				var LicText = {
					lictxt: a2
				};
				a1.push(LicText);
				var a3 = model[j].Licid;
				var LicIDData = {
					licID: a3
				};
				a4.push(LicIDData);
			}
			var simpleForm = this.getView().byId("empAuthorized1");
			simpleForm.destroyContent();
			that.getView().byId("idSubmitButton").destroyCustomData();
			if (key !== "NA") {
				for (var i = 0; i < total; i++) {
					//var id = "upload1" + i;
					var label = new sap.m.Label({
						"wrapping": true,
						"text": a1[i].lictxt
							//labelFor : id
					});
					var Text = new sap.m.Text({
						visible: false
					});
					var Button = new sap.m.Button({
						visible: false,
						width: "20%",
						icon: "sap-icon://sys-cancel",
						press: that.onUploadDelete,
						customData: [
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": Text
							}),
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": a4[i].licID
							}),
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": a4[i].licID
							})
						]
					});
					var AfterUploadCombo = {
						"Text": Text,
						"Button": Button
					};
					this.oFileUploader2 = new sap.ui.unified.FileUploader({
						uploadUrl: "/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV/FileSet",
						//	sendXHR: true,
						value: "",
						width: "300px",
						tooltip: "Upload your file to the local server.",
						placeholder: "Choose a file for uploading...",
						// mimeType: "image/png,image/jpeg,image/bmp,application/pdf,application/msexcel,application/msword,text/plain",
						//	maximumFileSize: 55,
						sendXHR: true,

						useMultipart: false,
						//maximumFilenameLength: 55,
						uploadOnChange: true,
						uploadComplete: that.handleUploadComplete,
						buttonText: "Upload",
						change: that.onFileUploadChange,
						customData: [
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": AfterUploadCombo
							}),
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": a4[i].licID
							})
						]
					});
					simpleForm.addContent(label);
					simpleForm.addContent(this.oFileUploader2);
					//simpleForm.addContent(this.oFileUploaderForMandt);
					simpleForm.addContent(Text);
					simpleForm.addContent(Button);
					var customdata = new sap.ui.core.CustomData({
						"key": i,
						"value": this.oFileUploader2
					});
					this.getView().byId("idSubmitButton").addCustomData(customdata);
					// cust.push(customdata);
				}
			}
			
			
			
			var Text01 = new sap.m.Text({
				visible: false
			});
			var Button01 = new sap.m.Button({
				visible: false,
				width: "20%",
				icon: "sap-icon://sys-cancel",
				press: that.onUploadDelete,
				customData: [
					new sap.ui.core.CustomData({
						"key": "01",
						"value": Text01
					}),
					new sap.ui.core.CustomData({
						"key": "04",
						"value": "licID"
					}),
					new sap.ui.core.CustomData({
						"key": "04",
						"value": "licID"
					})
				]
			});
			var AfterUploadCombo01 = {
				"Text": Text01,
				"Button": Button01
			};
			var Uploaderlabel = new sap.m.Label({
				text: ""
					//labelFor : id
			});

			if (key === "NA") {

				if (that.getView().getModel("initiateModel").getData().TextData !== "Change Of Conditions") {

					Uploaderlabel.setText("Proof of Identity");
				} else if (key === "NA") {
					if (that.getView().getModel("initiateModel").getData().TextData === "Change Of Conditions") {

						Uploaderlabel.setText("");
						that.getView().byId("empAuthorized1").setVisible(false);
						that.getView().byId("TB1").setVisible(false);
						that.getView().byId("Title1").setVisible(false);
					}
				}
			}
			// 	if (that.getView().getModel("initiateModel").getData().TextData === "Change Of Conditions") {
			// that.getView().byId("empAuthorized1").setVisible(false);
			// that.getView().byId("TB1").setVisible(false);
			// that.getView().byId("Title1").setVisible(false);
			// }
			// }
			if (that.getView().getModel("initiateModel").getData().TextData !== "Change Of Conditions") {
				FileUploader01 = new sap.ui.unified.FileUploader({
					uploadUrl: "/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV/FileSet",
					//	sendXHR: true,
					value: "",
					width: "300px",
					tooltip: "Upload your file to the local server.",
					placeholder: "Choose a file for uploading...",
					// mimeType: "image/png,image/jpeg,image/bmp,application/pdf,application/msexcel,application/msword,text/plain",
					//	maximumFileSize: 55,
					sendXHR: true,
					useMultipart: false,
					//maximumFilenameLength: 55,
					uploadOnChange: true,
					uploadComplete: that.handleUploadComplete01,
					buttonText: "Upload",
					change: that.onFileUploadChange01,
					customData: [
						new sap.ui.core.CustomData({
							"key": "01",
							"value": AfterUploadCombo01
						}),
						new sap.ui.core.CustomData({
							"key": "01",
							"value": "XXX"
						})
					]
				});
			}

			if (key !== "NA") {
				if (that.getView().getModel("initiateModel").getData().TextData !== "Change Of Conditions") {
					var Checkboxlabel = new sap.m.Label({
						text: "Proof of Identity"
							//labelFor : id
					});
					CheckBox = new sap.m.CheckBox({
						select: that.handleCheckBox,
						text: "Please check this box if a proof of identity document has already been attached above",
						customData: [
							new sap.ui.core.CustomData({
								"key": "02",
								"value": FileUploader01
							})
						]
					});

					simpleForm.addContent(Checkboxlabel);
					simpleForm.addContent(CheckBox);
					simpleForm.addContent(Uploaderlabel);
					simpleForm.addContent(FileUploader01);
					simpleForm.addContent(Text01);
					simpleForm.addContent(Button01);
					
					
				} else if (key !== "NA") {
					if (that.getView().getModel("initiateModel").getData().TextData === "Change Of Conditions") {
						that.getView().byId("empAuthorized1").setVisible(true);
						that.getView().byId("TB1").setVisible(true);
						that.getView().byId("Title1").setVisible(true);
					}
				}
			}
			if (key === "NA" && that.getView().getModel("initiateModel").getData().TextData !== "Change Of Conditions") {
				//simpleForm.addContent(Checkboxlabel);
				//simpleForm.addContent(CheckBox);
				simpleForm.addContent(Uploaderlabel);
				simpleForm.addContent(FileUploader01);
				simpleForm.addContent(Text01);
					simpleForm.addContent(Button01);
			}

		},
		getSimpleFormContent1: function () {
			var that = this;
			var total;
			var cust = [];
			a4 = [];
			a1 = [];
			Files = [];
			IE = 0;
			Docno1 = [];
			FileUploaded = false;
			selected = false;
			var key = this.getView().byId("Mant_subgroup").getSelectedKey();
			this.oldSeledted = key;
			var model = this.getView().getModel("Mat").getData();
			total = model.length;
			for (var j = 0; j < model.length; j++) {
				var a2 = model[j].Lictext;
				var LicText = {
					lictxt: a2
				};
				a1.push(LicText);
				var a3 = model[j].Licid;
				var LicIDData = {
					licID: a3
				};
				a4.push(LicIDData);
			}
			var simpleForm = this.getView().byId("empAuthorized1");
			simpleForm.destroyContent();
			that.getView().byId("idSubmitButton").destroyCustomData();
			if (key !== "NA") {
				for (var i = 0; i < total; i++) {
					//var id = "upload1" + i;
					var label = new sap.m.Label({
						"wrapping": true,
						"text": a1[i].lictxt
							//labelFor : id
					});
					var Text = new sap.m.Text({
						visible: false
					});
					var Button = new sap.m.Button({
						visible: false,
						width: "20%",
						icon: "sap-icon://sys-cancel",
						press: that.onUploadDelete,
						customData: [
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": Text
							}),
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": a4[i].licID
							}),
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": a4[i].licID
							})
						]
					});
					var AfterUploadCombo = {
						"Text": Text,
						"Button": Button
					};
					this.oFileUploader2 = new sap.ui.unified.FileUploader({
						uploadUrl: "/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV/FileSet",
						//	sendXHR: true,
						value: "",
						width: "300px",
						tooltip: "Upload your file to the local server.",
						placeholder: "Choose a file for uploading...",
						// mimeType: "image/png,image/jpeg,image/bmp,application/pdf,application/msexcel,application/msword,text/plain",
						//	maximumFileSize: 55,
						sendXHR: true,

						useMultipart: false,
						//maximumFilenameLength: 55,
						uploadOnChange: true,
						uploadComplete: that.handleUploadComplete,
						buttonText: "Upload",
						change: that.onFileUploadChange,
						customData: [
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": AfterUploadCombo
							}),
							new sap.ui.core.CustomData({
								"key": a1[i].lictxt,
								"value": a4[i].licID
							})
						]
					});
					simpleForm.addContent(label);
					simpleForm.addContent(this.oFileUploader2);
					//simpleForm.addContent(this.oFileUploaderForMandt);
					simpleForm.addContent(Text);
					simpleForm.addContent(Button);
					var customdata = new sap.ui.core.CustomData({
						"key": i,
						"value": this.oFileUploader2
					});
					this.getView().byId("idSubmitButton").addCustomData(customdata);
					// cust.push(customdata);
				}
			}
			var Text01 = new sap.m.Text({
				visible: false
			});
			var Button01 = new sap.m.Button({
				visible: false,
				width: "20%",
				icon: "sap-icon://sys-cancel",
				press: that.onUploadDelete,
				customData: [
					new sap.ui.core.CustomData({
						"key": "01",
						"value": Text01
					}),
					new sap.ui.core.CustomData({
						"key": "04",
						"value": "licID"
					}),
					new sap.ui.core.CustomData({
						"key": "04",
						"value": "licID"
					})
				]
			});
			var AfterUploadCombo01 = {
				"Text": Text01,
				"Button": Button01
			};
			var Uploaderlabel = new sap.m.Label({
				text: ""
					//labelFor : id
			});

			if (key === "NA") {

				if (that.getView().getModel("initiateModel").getData().TextData !== "Change Of Conditions") {

					Uploaderlabel.setText("Proof of Identity");
				}
                
                else if (key === "NA") {
					if (that.getView().getModel("initiateModel").getData().TextData === "Change Of Conditions") {

						Uploaderlabel.setText("");
						that.getView().byId("empAuthorized1").setVisible(false);
						that.getView().byId("TB1").setVisible(false);
						that.getView().byId("Title1").setVisible(false);
					}
				}
			}
			// 	if (that.getView().getModel("initiateModel").getData().TextData === "Change Of Conditions") {
			// that.getView().byId("empAuthorized1").setVisible(false);
			// that.getView().byId("TB1").setVisible(false);
			// that.getView().byId("Title1").setVisible(false);
			// }
			// }
			if (that.getView().getModel("initiateModel").getData().TextData !== "Change Of Conditions") {
				FileUploader01 = new sap.ui.unified.FileUploader({
					uploadUrl: "/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV/FileSet",
					//	sendXHR: true,
					value: "",
					width: "300px",
					tooltip: "Upload your file to the local server.",
					placeholder: "Choose a file for uploading...",
					// mimeType: "image/png,image/jpeg,image/bmp,application/pdf,application/msexcel,application/msword,text/plain",
					//	maximumFileSize: 55,
					sendXHR: true,
					useMultipart: false,
					//maximumFilenameLength: 55,
					uploadOnChange: true,
					uploadComplete: that.handleUploadComplete01,
					buttonText: "Upload",
					change: that.onFileUploadChange01,
					customData: [
						new sap.ui.core.CustomData({
							"key": "01",
							"value": AfterUploadCombo01
						}),
						new sap.ui.core.CustomData({
							"key": "01",
							"value": "XXX"
						})
					]
				});
			}

			if (key !== "NA") {
				if (that.getView().getModel("initiateModel").getData().TextData !== "Change Of Conditions") {
					var Checkboxlabel = new sap.m.Label({
						text: "Proof of Identity"
							//labelFor : id
					});
					CheckBox = new sap.m.CheckBox({
						select: that.handleCheckBox,
						text: "Please check this box if a proof of identity document has already been attached above",
						customData: [
							new sap.ui.core.CustomData({
								"key": "02",
								"value": FileUploader01
							})
						]
					});

					simpleForm.addContent(Checkboxlabel);
					simpleForm.addContent(CheckBox);
					simpleForm.addContent(Uploaderlabel);
					simpleForm.addContent(FileUploader01);
				} else if (key !== "NA") {
					if (that.getView().getModel("initiateModel").getData().TextData === "Change Of Conditions") {
						that.getView().byId("empAuthorized1").setVisible(true);
						that.getView().byId("TB1").setVisible(true);
						that.getView().byId("Title1").setVisible(true);

					}
				}
			}
			if (key === "NA" && that.getView().getModel("initiateModel").getData().TextData !== "Change Of Conditions") {
				//simpleForm.addContent(Checkboxlabel);
				//simpleForm.addContent(CheckBox);
				simpleForm.addContent(Uploaderlabel);
				simpleForm.addContent(FileUploader01);
			}

		},
		handleCheckBox: function (oEvent) {
			selected = oEvent.getSource().getSelected();
			FileUploader01 = oEvent.getSource().getCustomData()[0].getValue();
			if (selected) {
				if (FileUploader01.getValue() === "") {
					FileUploader01.setEnabled(false);
					oEvent.getSource().setValueState("None");
					FileUploader01.setValueState("None");
				} else {
					MessageBox.information("Please Delete Attachment before Check");
					FileUploader01.setEnabled(false);
					oEvent.getSource().setSelected(false);
				}
			} else {
				oEvent.getSource().setValueState("None");
				FileUploader01.setValueState("None");
				FileUploader01.setEnabled(true);
			}
		},
		/*	onFileUploadChange02: function (oEvent) {
			oEvent.getSource().setValueState("None");
			that.getView().setBusy(true);
			var file = oEvent.getParameter("files");
			// file[0].Licid = oEvent.getSource().getCustomData()[1].getValue();
			Files.push(file[0]);
			// oEvent.getSource().setMimeType(file[0].type);
			this.fileModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			this.fileModel.setUseBatch(false);
			this.fileModel.refreshSecurityToken();
			var oSlug = new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: that.vUser + "*CMSRQ" + "* *" + file[0].name + "*XXX" + "*" + file[0].type
					// + "@" + oEvent.getSource().getCustomData()[1].getValue() + "@" + file[0].type
			});
			oEvent.getSource().addHeaderParameter(oSlug);
			var oHeaderToken = new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: this.fileModel.getSecurityToken()
			});
			oEvent.getSource().addHeaderParameter(oHeaderToken);
		},*/
		onFileUploadChange01: function (oEvent) {
			oEvent.getSource().setValueState("None");
			that.getView().setBusy(true);
			var file = oEvent.getParameter("files");
			// file[0].Licid = oEvent.getSource().getCustomData()[1].getValue();
			Files.push(file[0]);
			// oEvent.getSource().setMimeType(file[0].type);
			this.fileModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			this.fileModel.setUseBatch(false);
			this.fileModel.refreshSecurityToken();
			var oSlug = new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: that.vUser + "*CMSRQ" + "* *" + file[0].name + "*XXX" + "*" + file[0].type
					// + "@" + oEvent.getSource().getCustomData()[1].getValue() + "@" + file[0].type
			});
			oEvent.getSource().addHeaderParameter(oSlug);
			var oHeaderToken = new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: this.fileModel.getSecurityToken()
			});
			oEvent.getSource().addHeaderParameter(oHeaderToken);
		},
		handleUploadComplete02: function (oEvent) {
		
			//FileUploaded = true;
			if (oEvent.getParameter("status") === 201) {
				
				var fileName =certificateFileName.name;
				covidFileName = fileName;
			
				
				// var CustomData = oEvent.getSource().getCustomData()[0].getValue();
				// CustomData.Text.setVisible(true);
				// CustomData.Text.setText(fileName);
				// CustomData.Button.setVisible(true);
				if (!fileName) {
					var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
					// fileName = fileName[0];
				}
				// this.fileName = fileName;
				var xml = oEvent.getParameter("responseRaw");

				function parse(node, j) {
					var nodeName = node.nodeName.replace(/^.+:/, '').toLowerCase();
					var cur = null;
					var text = $(node).contents().filter(function (x) {
						return this.nodeType === 3;
					});
					if (text[0] && text[0].nodeValue.trim()) {
						cur = text[0].nodeValue;
					} else {
						cur = {};
						$.each(node.attributes, function () {
							if (this.name.indexOf('xmlns:') !== 0) {
								cur[this.name.replace(/^.+:/, '')] = this.value;
							}
						});
						$.each(node.children, function () {
							parse(this, cur);
						});
					}
					j[nodeName] = cur;
				}
				var roots = $(xml);
				var root = roots[roots.length - 1];
				var json = {};
				parse(root, json);
				var JSONPath01 = "";
				if (typeof json.entry.properties !== "undefined") {
					JSONPath01 = json.entry.properties.docno;
				} else {
					JSONPath01 = json.entry.category.content.properties.docno;
				}
				var docno = {
					"docno": JSONPath01
						//"docno": json.entry.properties.docno
						//	"docno": json.entry.category.content.properties.docno
				};
				oEvent.getSource().setEnabled(false);
				covidDocno = JSONPath01; 
				////////////
				var Text1 = new sap.m.Text("idFileText1", {
					text: covidFileName
				});
			var Button1 = new sap.m.Button("idCancel1", {
				visible: true,
				width: "10%",
				icon: "sap-icon://sys-cancel",
				press: function (){
					that.onUploadDelete1();
				}
			});
			var simpleFormId = this.getView().byId("Covid_Tracker");
			simpleFormId.addContent(Text1);
			simpleFormId.addContent(Button1);
				that.getView().setBusy(false);
				sap.m.MessageToast.show("File: " + fileName + " uploaded successfully.");
			}
			IE1++;
		},
		handleUploadComplete01: function (oEvent) {
			FileUploaded = true;
			if (oEvent.getParameter("status") === 201) {
				var fileName = Files[IE].name;
				var CustomData = oEvent.getSource().getCustomData()[0].getValue();
				CustomData.Text.setVisible(true);
				CustomData.Text.setText(fileName);
				CustomData.Button.setVisible(true);
				if (!fileName) {
					var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
					// fileName = fileName[0];
				}
				// this.fileName = fileName;
				var xml = oEvent.getParameter("responseRaw");

				function parse(node, j) {
					var nodeName = node.nodeName.replace(/^.+:/, '').toLowerCase();
					var cur = null;
					var text = $(node).contents().filter(function (x) {
						return this.nodeType === 3;
					});
					if (text[0] && text[0].nodeValue.trim()) {
						cur = text[0].nodeValue;
					} else {
						cur = {};
						$.each(node.attributes, function () {
							if (this.name.indexOf('xmlns:') !== 0) {
								cur[this.name.replace(/^.+:/, '')] = this.value;
							}
						});
						$.each(node.children, function () {
							parse(this, cur);
						});
					}
					j[nodeName] = cur;
				}
				var roots = $(xml);
				var root = roots[roots.length - 1];
				var json = {};
				parse(root, json);
				var JSONPath01 = "";
				if (typeof json.entry.properties !== "undefined") {
					JSONPath01 = json.entry.properties.docno;
				} else {
					JSONPath01 = json.entry.category.content.properties.docno;
				}
				var docno = {
					"docno": JSONPath01
						//"docno": json.entry.properties.docno
						//	"docno": json.entry.category.content.properties.docno
				};
				oEvent.getSource().setEnabled(false);
				CustomData.Button.getCustomData()[1].setValue(fileName);
				CustomData.Button.getCustomData()[1].setKey(docno.docno);
				CustomData.Button.getCustomData()[2].setValue(oEvent.getSource());
				Docno1.push(docno);
				that.getView().setBusy(false);
				sap.m.MessageToast.show("File: " + fileName + " uploaded successfully.");
			}
			IE++;
		},
		onUploadDelete: function (oEvent) {
			// that = this;
			UploadDeleteEvt = oEvent.getSource();
			MessageBox.information("Are you sure you want to delete this Attachment?", {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction === "OK") {
						that.onFileDeleteConfirm(UploadDeleteEvt);
					}
				}
			});
		},
		onFileDeleteConfirm: function (val) {
			var oEvent = val;
			var Text = oEvent.getCustomData()[0].getValue();
			var docnum = oEvent.getCustomData()[1].getKey();
			var fileName = oEvent.getCustomData()[1].getValue();
			var FileUploader = oEvent.getCustomData()[2].getValue();
			//var CheckBox = FileUploader.getCustomData()[2].getValue();
			FileUploader.setValue();
			this.fileModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			this.fileModel.remove("/FileSet('" + docnum + "')", {
				method: "DELETE",
				success: function (data) {},
				error: function (e) {}
			});
			// var model = oEvent.getSource().getModel().getData()["items"].pop(i);
			// this.deleteItemById(oEvent.getParameter("documentId"));
			sap.m.MessageToast.show("File: " + fileName + "  Deleted.  ");
			Text.setText();
			Text.setVisible(false);
			oEvent.setVisible(false);
			FileUploader.destroyHeaderParameters();
			FileUploader.removeAllHeaderParameters();
			FileUploader.setEnabled(true);
			//CheckBox.setEnabled(true);
			//CheckBox.setSelected(false);
			for (var i = 0; i < Files.length; i++) {
				if (Files[i].Licid === FileUploader.getCustomData()[1].getValue()) {
					Files.splice(i, 1);
					IE--;
				}
			}
			// Docno
		},
		onFileUploadChange02: function (oEvent) {
			var that =  this;
		that.cancel=  that.getView().byId("idCancelbutton1");
			oEvent.getSource().setValueState("None");
			that.getView().setBusy(true);
			var file = oEvent.getParameter("files");
		//	file[0].Licid = oEvent.getSource().getCustomData()[1].getValue();
			//	file[0].Lictxt = oEvent.getSource().getCustomData()[2].getValue();
			// Files2.push(file[0]);
			certificateFileName = file[0];
			this.FileDescription = "COVID_19";
			// oEvent.getSource().setMimeType(file[0].type);
			this.fileModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			this.fileModel.setUseBatch(false);
			this.fileModel.refreshSecurityToken();
			var oSlug = new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: that.vUser + "*CMSRQ" + "* *" + file[0].name + "*" + "COVID_19" +
					"*" + file[
						0].type
			});
			oEvent.getSource().addHeaderParameter(oSlug);
			var oHeaderToken = new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: this.fileModel.getSecurityToken()
			});
			oEvent.getSource().addHeaderParameter(oHeaderToken);

		},
		onFileUploadChange: function (oEvent) {
			oEvent.getSource().setValueState("None");
			that.getView().setBusy(true);
			var file = oEvent.getParameter("files");
			file[0].Licid = oEvent.getSource().getCustomData()[1].getValue();
			Files.push(file[0]);
			//this.FileDescription = "COVID_19";
			// oEvent.getSource().setMimeType(file[0].type);
			this.fileModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			this.fileModel.setUseBatch(false);
			this.fileModel.refreshSecurityToken();
			var oSlug = new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: that.vUser + "*CMSRQ" + "* *" + file[0].name + "*" + oEvent.getSource().getCustomData()[1].getValue() + "*" + file[
					0].type
			});
			oEvent.getSource().addHeaderParameter(oSlug);
			var oHeaderToken = new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: this.fileModel.getSecurityToken()
			});
			oEvent.getSource().addHeaderParameter(oHeaderToken);

		},
		handleUploadComplete: function (oEvent) {
			FileUploaded = true;
			// var sResponse = oEvent.getParameter("response");
			// if (sResponse) {
			// 	var sMsg = "";
			// 	var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
			// 	if (m[1] === "200") {
			// 		sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
			// 		oEvent.getSource().setValue("");
			// 		this.getAttachmentList();

			// 	} else {
			// 		sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
			// 	}

			// 	MessageBox.show(sMsg);
			// }
			if (oEvent.getParameter("status") === 201) {
				var fileName = Files[IE].name;
				var CustomData = oEvent.getSource().getCustomData()[0].getValue();
				CustomData.Text.setVisible(true);
				CustomData.Text.setText(fileName);
				CustomData.Button.setVisible(true);
				if (!fileName) {
					var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
					// fileName = fileName[0];
				}
				// this.fileName = fileName;
				var xml = oEvent.getParameter("responseRaw");

				function parse(node, j) {
					var nodeName = node.nodeName.replace(/^.+:/, '').toLowerCase();
					var cur = null;
					var text = $(node).contents().filter(function (x) {
						return this.nodeType === 3;
					});
					if (text[0] && text[0].nodeValue.trim()) {
						cur = text[0].nodeValue;
					} else {
						cur = {};
						$.each(node.attributes, function () {
							if (this.name.indexOf('xmlns:') !== 0) {
								cur[this.name.replace(/^.+:/, '')] = this.value;
							}
						});
						$.each(node.children, function () {
							parse(this, cur);
						});
					}
					j[nodeName] = cur;
				}
				var roots = $(xml);
				var root = roots[roots.length - 1];
				var json = {};
				parse(root, json);
				var JSONPath = "";
				if (typeof json.entry.properties !== "undefined") {
					JSONPath = json.entry.properties.docno;
				} else {
					JSONPath = json.entry.category.content.properties.docno;
				}
				var docno = {
					"docno": JSONPath
						//	"docno": json.entry.category.content.properties.docno
						//"docno": json.entry.properties.docno
				};
				oEvent.getSource().setEnabled(false);
				CustomData.Button.getCustomData()[1].setValue(fileName);
				CustomData.Button.getCustomData()[1].setKey(docno.docno);
				CustomData.Button.getCustomData()[2].setValue(oEvent.getSource());
				// oEvent.getSource().getCustomData()[2].getValue().setEnabled(false);
				Docno1.push(docno);
				that.getView().setBusy(false);
				// this.sUploadedFile = oEvent.getParameter("files")[0].fileName;
				// if (!this.sUploadedFile) {
				// 	this.sUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
				// 	this.sUploadedFile = this.sUploadedFile[0];
				// }
				// console.log(json)\
				// if(oUploadCollection.getItems().length)
				// that.updateAttachmentsTempId(json.entry.properties.docno);
				// that.getAttachmentListFileUploadRead(json.entry.properties.docno);

				sap.m.MessageToast.show("File: " + fileName + " uploaded successfully.");
			}
			IE++;
		},
		UploadUpdateForCovidAttachments: function () {
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			//that.getView().setModel(oModel);
			var reqArray = [];
			//var data = Docno2;
		
				var docNumber = {
					Docno: covidDocno,
					Licid: "COVID_19",
					Lictext: "COVID_19_VACCINE_CERTIFICATE"
				};
				reqArray.push(docNumber);

			
			var entity = {
				RefDoc: ReqID,
				Items: reqArray
			};

			oModel.create("/UpdateRefDocSet", entity, null, false, function (
				OData,
				response) {
				var responseData = OData.results;
			});
			var FileUploader = this.getView().byId("fileUploader");
			FileUploader.setValue();
			FileUploader.destroyHeaderParameters();
			FileUploader.removeAllHeaderParameters();
			FileUploader.setEnabled(true);
			if(typeof sap.ui.getCore().byId("idCancel1") != 'undefined'){
					sap.ui.getCore().byId("idCancel1").destroy();
			} 
			if(typeof sap.ui.getCore().byId("idFileText1") != 'undefined'){
			sap.ui.getCore().byId("idFileText1").destroy();
			}
			// var simpleForm = this.getView().byId("covidAttachment");
			// simpleForm.destroyContent();
		},
		UploadUpdateForMandtAttachments: function () {
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			//that.getView().setModel(oModel);
			var reqArray = [];
			var data = Docno1;
			for (var i = 0; i < data.length; i++) {
				var items = data[i].docno;
				var docNumber = {
					Docno: items
				};
				reqArray.push(docNumber);

			}
			var entity = {
				RefDoc: ReqID,
				Items: reqArray
			};

			oModel.create("/UpdateRefDocSet", entity, null, false, function (
				OData,
				response) {
				var responseData = OData.results;
			});
			var simpleForm = this.getView().byId("empAuthorized1");
			simpleForm.destroyContent();
		},
		AOD_Change: function () {
			var Aod_Test = this.getView().byId("AODTEST").getValue();
			var AODTestKey = this.getView().byId("AODTEST").getSelectedKey().trim();
			if (AODTestKey === "" || AODTestKey === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid AOD TEST Completed", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("AODTEST").setSelectedKey();
			}
			if (Aod_Test !== "") {
				this.getView().byId("AODTEST").setValueState("None");
			}
			if (this.AOD1 !== AODTestKey) {
				this.AOD = true;
			}
			if (this.AOD1 === AODTestKey) {
				this.AOD = false;
			}
		},
		fitness_Change: function () {
			var Fitness = this.getView().byId("medicalfitness").getValue();
			var fitnessKey = this.getView().byId("medicalfitness").getSelectedKey().trim();
			if (fitnessKey === "" || fitnessKey === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Fitness for Work Risk Level", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("medicalfitness").setSelectedKey();
			}
			if (Fitness !== "") {
				this.getView().byId("medicalfitness").setValueState("None");
			}
			if (this.fitness1 !== fitnessKey) {
				this.fitness = true;
			}
			if (this.fitness1 === fitnessKey) {
				this.fitness = false;
			}
		},
		healthmanagenet_Change: function () {
			var Healthmanagement = this.getView().byId("healthmanagement").getValue();
			var healthKey = this.getView().byId("healthmanagement").getSelectedKey().trim();
			if (healthKey === "" || healthKey === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Health Management Plan", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("healthmanagement").setSelectedKey();
			}
			if (Healthmanagement !== "") {
				this.getView().byId("healthmanagement").setValueState("None");
			}
			if (this.health1 !== healthKey) {
				this.health = true;
			}
			if (this.health1 === healthKey) {
				this.health = false;
			}
		},

		/* 
		 * Date - 21.08.2020
		 * Created By - Karteek
		 * Description - This function will validate the date format that doesn't include the format of '.' and '-'
		 *Input- Date value
		 *Output- returns boolean
		 *Called By - completedChnage()*/
		validateDateInputCompleted: function (enteredValue) {
			if (enteredValue !== "") {
				if (!enteredValue.includes(".") && !enteredValue.includes("-")) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("dateComp").setValue("");
					this.getView().byId("dateComp").setValueState("Error");
					return false;
				} else {
					return true;
				}
			}
		},
		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description - This function will be called when user changes the value in the input field of date completed 
		 *->This function will validate  date string for the entered value of date completed field value
		 *Input- Date value
		 *Output- returns error message if false*/
		completedChnage: function (oEvent) {

			this.changeFlag = true;
			var dateValue = this.getView().byId("dateComp").getValue();
			var enteredValue = this.getView().byId("dateComp").getValue();
			var returnValue = this.validateDateInputCompleted(enteredValue);
			if (!returnValue) {
				return;
			}
			if (dateValue.split("-")[0]) {
				if (dateValue.split("-")[0].length !== 4 && !isNaN(dateValue.split(".")[0])) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("dateComp").setValue("");
					this.getView().byId("dateComp").setValueState("Error");
					return;
				}
			}

			var dt = new Date(this.getView().byId("dateComp").getValue().split("-")[1] + "-" + this.getView().byId("dateComp").getValue().split(
				"-")[2] + "." + this.getView().byId("dateComp").getValue().split("-")[0]);

			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var dateFormatted = datformat.format(dt);
			if (dateFormatted === "") {
				var dateComp = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: dateComp ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("dateComp").setValue("");
				//this.getView().byId("dateComp").setValueState("Error");
				return;
			}
			var datedefine = this.getView().byId("dateComp").getValue();
			if (datedefine !== "") {
				this.getView().byId("dateComp").setValueState("None");
			}
			if (new Date(this.getView().byId("dateComp").getValue()).toDateString() !== Date(this.dateComp1).slice(0, 15)) {
				this.dateComp = true;
			}
			if (new Date(this.getView().byId("dateComp").getValue()).toDateString() === Date(this.dateComp1).slice(0, 15)) {
				this.dateComp = false;
			}
		},
		Firstdosechange: function () {
			this.changeFlag = true;
			var dateValue = this.getView().byId("CFDD").getValue();
			var enteredValue = this.getView().byId("CFDD").getValue();
			var returnValue = this.validateDateInputCompleted(enteredValue);
			if (!returnValue) {
				return;
			}
			if (dateValue.split("-")[0]) {
				if (dateValue.split("-")[0].length !== 4 && !isNaN(dateValue.split(".")[0])) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("CFDD").setValue("");
					this.getView().byId("CFDD").setValueState("Error");
					return;
				}
			}

			var dt = new Date(this.getView().byId("CFDD").getValue().split("-")[1] + "-" + this.getView().byId("CFDD").getValue().split(
				"-")[2] + "." + this.getView().byId("CFDD").getValue().split("-")[0]);

			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var dateFormatted = datformat.format(dt);
			if (dateFormatted === "") {
				var dateComp = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: dateComp ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("CFDD").setValue("");
				//this.getView().byId("dateComp").setValueState("Error");
				return;
			}
			var datedefine = this.getView().byId("CFDD").getValue();
			if (datedefine !== "") {
				this.getView().byId("CFDD").setValueState("None");
			}
			if (new Date(this.getView().byId("CFDD").getValue()).toDateString() !== Date(this.Firstdose1).slice(0, 15)) {
				this.Firstdose = true;
			}
			if (new Date(this.getView().byId("CFDD").getValue()).toDateString() === Date(this.Firstdose1).slice(0, 15)) {
				this.Firstdose = false;
			}
		},
		Seconddosechange: function () {
			this.changeFlag = true;
			var dateValue = this.getView().byId("SeconddoseDate").getValue();
			var enteredValue = this.getView().byId("SeconddoseDate").getValue();
			var returnValue = this.validateDateInputCompleted(enteredValue);
			if (!returnValue) {
				return;
			}
			if (dateValue.split("-")[0]) {
				if (dateValue.split("-")[0].length !== 4 && !isNaN(dateValue.split(".")[0])) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("SeconddoseDate").setValue("");
					this.getView().byId("SeconddoseDate").setValueState("Error");
					return;
				}
			}

			var dt = new Date(this.getView().byId("SeconddoseDate").getValue().split("-")[1] + "-" + this.getView().byId("SeconddoseDate").getValue()
				.split(
					"-")[2] + "." + this.getView().byId("SeconddoseDate").getValue().split("-")[0]);

			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var dateFormatted = datformat.format(dt);
			if (dateFormatted === "") {
				var dateComp = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: dateComp ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("SeconddoseDate").setValue("");
				//this.getView().byId("dateComp").setValueState("Error");
				return;
			}
			var datedefine = this.getView().byId("SeconddoseDate").getValue();
			if (datedefine !== "") {
				this.getView().byId("SeconddoseDate").setValueState("None");
			}
			if (new Date(this.getView().byId("SeconddoseDate").getValue()).toDateString() !== Date(this.secondDose1).slice(0, 15)) {
				this.Seconddose = true;
			}
			if (new Date(this.getView().byId("SeconddoseDate").getValue()).toDateString() === Date(this.secondDose1).slice(0, 15)) {
				this.Seconddose = false;
			}
		},
		onMedicalExpChange: function () {
			this.changeFlag = true;
			var dateValue = this.getView().byId("medicalExpDate").getValue();
			var enteredValue = this.getView().byId("medicalExpDate").getValue();
			var returnValue = this.validateDateInputCompleted(enteredValue);
			if (!returnValue) {
				return;
			}
			if (dateValue.split("-")[0]) {
				if (dateValue.split("-")[0].length !== 4 && !isNaN(dateValue.split(".")[0])) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("medicalExpDate").setValue("");
					this.getView().byId("medicalExpDate").setValueState("Error");
					return;
				}
			}

			var dt = new Date(this.getView().byId("medicalExpDate").getValue().split("-")[1] + "-" + this.getView().byId("medicalExpDate").getValue()
				.split(
					"-")[2] + "." + this.getView().byId("medicalExpDate").getValue().split("-")[0]);

			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var dateFormatted = datformat.format(dt);
			if (dateFormatted === "") {
				var dateComp = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: dateComp ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("medicalExpDate").setValue("");
				//this.getView().byId("dateComp").setValueState("Error");
				return;
			}
			var datedefine = this.getView().byId("medicalExpDate").getValue();
			if (datedefine !== "") {
				this.getView().byId("medicalExpDate").setValueState("None");
			}
			if (new Date(this.getView().byId("medicalExpDate").getValue()).toDateString() !== Date(this.dateExmp1).slice(0, 15)) {
				this.dateExmp = true;
			}
			if (new Date(this.getView().byId("medicalExpDate").getValue()).toDateString() === Date(this.dateExmp1).slice(0, 15)) {
				this.dateExmp = false;
			}
		},
		onVaccineStatusChange: function() {
			this.changeFlag = true;
		var Vaccinestatus = this.getView().byId("idvaccinestatus").getSelectedKey().trim();

			if (Vaccinestatus === "" || Vaccinestatus === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Vaccination status", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("idvaccinestatus").setSelectedKey("");
			}
			if (Vaccinestatus !== "") {
				this.getView().byId("idvaccinestatus").setValueState("None");
			}
			var vaccine = this.getView().byId("idvaccinestatus").getValue();
			if (vaccine !== "") {
				this.getView().byId("idvaccinestatus").setValueState("None");
			}
			if (this.vaccinevalid1 !== Vaccinestatus) {
				this.vaccinevalid = true;
			}
			if (this.vaccinevalid1 === Vaccinestatus) {
				this.vaccinevalid = false;
			}

            if (Vaccinestatus=== "UV") {
                this.getView().byId("idDateofLastVacc").setRequired(false);
                this.getView().byId("idMedicalCertificate").setRequired(false);
                this.getView().byId("SeconddoseDate").setValueState("None");
                this.getView().byId("fileUploader").setValueState("None");
              }
              if (Vaccinestatus !== "UV") {
                this.getView().byId("idDateofLastVacc").setRequired(true);
                this.getView().byId("idMedicalCertificate").setRequired(true);
              }
		},
		onConsentChange: function() {
					this.changeFlag = true;
	var consent = this.getView().byId("Consent").getSelectedKey().trim();

			if (consent === "" || consent === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Consent", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("Consent").setSelectedKey("");
			}
			if (consent !== "") {
				this.getView().byId("Consent").setValueState("None");
			}
			if (this.consent1 !== consent) {
				this.consentValid = true;
			}
			if (this.consent1 === consent) {
				this.consentValid = false;
			}
		},
		
		
		
		onSelectCheck1: function () {
			var Checkbox1 = this.getView().byId("chk1").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk1").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox1 === true) {
					this.getView().byId("chk1").setValueState("None");
				}
			}

		},
		onSelectCheck2: function () {
			var Checkbox2 = this.getView().byId("chk2").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk2").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox2 === true) {
					this.getView().byId("chk2").setValueState("None");
				}
			}
		},
		onSelectCheck3: function () {
			var Checkbox3 = this.getView().byId("chk3").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk3").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox3 === true) {
					this.getView().byId("chk3").setValueState("None");
				}
			}
		},
		onSelectCheck4: function () {
			var Checkbox4 = this.getView().byId("chk4").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk4").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox4 === true) {
					this.getView().byId("chk4").setValueState("None");
				}

			}
		},
		onSelectCheck5: function () {
			var Checkbox5 = this.getView().byId("chk5").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk5").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox5 === true) {
					this.getView().byId("chk5").setValueState("None");
				}
			}
		},
		onSelectCheck6: function () {
			var Checkbox6 = this.getView().byId("chk6").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk6").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox6 === true) {
					this.getView().byId("chk6").setValueState("None");
				}
			}

		},
		onSelectCheck7: function () {
			var Checkbox7 = this.getView().byId("chk7").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk7").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox7 === true) {
					this.getView().byId("chk7").setValueState("None");
				}
			}
		},
		onSelectCheck8: function () {
			var Checkbox8 = this.getView().byId("chk8").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk8").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");
				return;
			} else {
				if (Checkbox8 === true) {
					this.getView().byId("chk8").setValueState("None");
				}
			}
		},
		onSelectCheck9: function () {
			var Checkbox9 = this.getView().byId("chk9").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk9").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox9 === true) {
					this.getView().byId("chk9").setValueState("None");
				}
			}
		},
		onSelectCheck10: function () {
			var Checkbox10 = this.getView().byId("chk10").getSelected();
			var empSubGrp = this.getView().byId("Emp_subgroup").getSelectedKey();
			if (empSubGrp === "") {
				this.getView().byId("chk10").setSelected(false);
				sap.m.MessageToast.show("Please select Employee Subgroup");

				return;

			} else {
				if (Checkbox10 === true) {
					this.getView().byId("chk10").setValueState("None");
				}
			}
		},
		/* 
		 * Date - 21.08.2020
		 * Created By - Rakesh
		 * Description - This function will validate the date format that doesn't include the format of '.' and '-'
		 *Input- Date value
		 *Output- returns boolean
		 *Called By - endDateChange()*/
		validateDateInputDOB: function (enteredValue) {
			if (enteredValue !== "") {
				if (!enteredValue.includes(".") && !enteredValue.includes("-")) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.information(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("pers_DOB").setValue("");
					this.getView().byId("pers_DOB").setValueState("Error");
					return false;
				} else {
					return true;
				}
			}
		},
		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description - This function will be called when user changes the value in the input field of date of birth
		 *->This function will validate the date string for the entered date of birth date field value
		 *-> *->This function will call validateDateInput() method to restrict the inputs that includes "-" or "."
		 *->This function will validate DOB with entered value for 18 years
		 *Input- Date value
		 *Output- returns error message if false*/
		DOBChnage: function (oEvent) {
			this.changeFlag = true;
			var dateValue = this.getView().byId("pers_DOB").getValue();
			var enteredValue = this.getView().byId("pers_DOB").getValue();
			var returnValue = this.validateDateInputDOB(enteredValue);
			if (!returnValue) {
				return;
			}
			if (dateValue.split("-")[0]) {
				if (dateValue.split("-")[0].length !== 4 && !isNaN(dateValue.split(".")[0])) {
					var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Invalid Entry", {
							styleClass: checkDOB ? "sapUiSizeCompact" : ""
						});

					this.getView().byId("pers_DOB").setValue("");
					this.getView().byId("pers_DOB").setValueState("Error");
					return;
				}
			}
			var dt = new Date(this.getView().byId("pers_DOB").getValue().split("-")[1] + "-" + this.getView().byId("pers_DOB").getValue().split(
				"-")[2] + "." + this.getView().byId("pers_DOB").getValue().split("-")[0]);

			var datformat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var dateFormatted = datformat.format(dt);
			if (dateFormatted === "") {
				var checkDOB = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: checkDOB ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("pers_DOB").setValue("");
				this.getView().byId("pers_DOB").setValueState("Error");
				return;
			}
			var birthMonth = dateFormatted.slice(5, 7);
			var birthYear = dateFormatted.slice(0, 4);
			var birthDay = dateFormatted.slice(8, 10);
			var nd = new Date();
			var datformat1 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY/MM/dd"
			});
			var format = new Date().toJSON().slice(0, 10);
			var res = ~~((Date.now(format) - new Date(dateValue)) / (31557600000));
			if (res < 18) {
				var remname3 = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Invalid Entry", {
						styleClass: remname3 ? "sapUiSizeCompact" : ""
					});

				this.getView().byId("pers_DOB").setValue("");
			}
			var datedefine = this.getView().byId("pers_DOB").getValue();
			if (datedefine !== "") {
				this.getView().byId("pers_DOB").setValueState("None");
			}
			if (new Date(this.getView().byId("pers_DOB").getValue()).toDateString() !==
				new Date(this.DOBvalid1.slice(6, 11) + '-' + this.DOBvalid1.slice(3, 5) + '-' + this.DOBvalid1.slice(0, 2)).toDateString()) {
				this.DOBvalid = true;
			}
			if (new Date(this.getView().byId("pers_DOB").getValue()).toDateString() === new Date(this.DOBvalid1.slice(6, 11) + '-' + this.DOBvalid1
					.slice(3, 5) + '-' + this.DOBvalid1.slice(0, 2)).toDateString()) {
				this.DOBvalid = false;
			}
		},
		/* 
		 * Date - 22.05.2020
		 * Created By - Rakesh
		 * Description - This function will be called when user enters the value in the input field of personal e-mail address
		 *->This function will validate the email address by using regular expression
		 *Input- String
		 *Output- returns error message if false and represents with value state error*/
		mailchange: function () {
			this.changeFlag = true;
			var email = this.getView().byId("conmail").getValue();
			//	var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			var mailregex =
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!mailregex.test(email)) {
				//this.getView().byId("conmail").setValueState(sap.ui.core.ValueState.Error);
				var emailAddress = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error(
					"Please Enter a Valid E-mail Address", {
						styleClass: emailAddress ? "sapUiSizeCompact" : ""
					}
				);
				//this.getView().byId("conmail").setValue();
				this.getView().byId("conmail").setValueState("Error");
				return;
			}
			// if (email !== "") {
			else {
				this.getView().byId("conmail").setValueState("None");
			}
			if (this.mailvalid1 !== email) {
				this.mailvalid = true;
			}
			if (this.mailvalid1 === email) {
				this.mailvalid = false;
			}
		},
		decPhonenumChnage: function () {
			var Phn = this.getView().byId("dec_Phnnum").getValue();
			if (Phn.length !== 10) {
				var PhnMsg = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please Enter a Valid Mobile Number", {
						styleClass: PhnMsg ? "sapUiSizeCompact" : ""
					}

				);
				this.getView().byId("dec_Phnnum").setValue();
			} else {
				this.getView().byId("emergency_Phnumber").setValueState(sap.ui.core.ValueState.None);
			}

		},
		/* 
		      * Date - 23.05.2020
		      * Created By - Karteek
		      * Description - This function will be called when user changes the value in the input field of position 
		      *-> The length of the position number should be equal to 8
		      *->This function will validate the length of  position number of the user entered and opens up message popup if value
		      is <8 or >8
		      *Input- position number
		      *Output- returns error message if invalid and represents with value state error*
		      Calling function - validatePositionID()*/
		PositionChange: function () {
			this.changeFlag = true;
			var Fnum = "";
			var Posid = this.getView().byId("assign_Pos").getValue().trim();
			if (this.Positionvalid1 !== Posid) {
				this.Positionvalid = true;

			}
			if (Number(this.Positionvalid1) === 0) {
				this.Positionvalid1 = "".toString();
			} else {
				this.Positionvalid1 = Number(this.Positionvalid1).toString();
			}
			if (this.Positionvalid1 === Posid) {
				this.Positionvalid = false;

			}
			if (Posid.length > 8 || Posid.length < 8) {
				var Position = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please enter valid Position Number", {
						styleClass: Position ? "sapUiSizeCompact" : ""
					}

				);
				that.getView().byId("assign_Pos").setValueState("Error");
				that.getView().byId("assign_Pos").setValueStateText("Please enter valid Position Number");
				that.getView().byId("assign_Name").setValue("");
				that.getView().byId("assign_Leader").setValue("");
				that.getView().byId("assign_loc").setValue("");
				return;
			} else {
				/*
				 * Start of Change 
				 * Changed On - 13.08.2020
				 *Changed By - Karteek
				 * Change Description - Calling validatePositionID(), passing eneterd value as an argument*/
				this.validatePositionID(Posid, Fnum);
			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the value in the first name input field
		 *-> This function doesn't allow special characters and sets the value state error to the element if found
		 *Input- String
		 *Output- returns boolean*/

		firstNameChange: function (oEvent) {
			this.changeFlag = true;
			var RemitterName = oEvent.getSource().getValue().trim();
			//var re = /[`1234567890~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var re = /[`1234567890~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = re.test(RemitterName);
			if (isSplChar) {
				var remname1 = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(

					"Please recheck the Names for any Special characters  other than - and ' that are not allowed", {
						styleClass: remname1 ? "sapUiSizeCompact" : ""
					});
				//this.getView().byId("pers_Fname").setValue();
				this.getView().byId("pers_Fname").setValueState("Error");
				return;
			}
			// else if (RemitterName !== "") {
			else {
				this.getView().byId("pers_Fname").setValueState("None");

			}
			if (this.firstNamevalid1 !== RemitterName) {
				this.firstNamevalid = true;

			}
			if (this.firstNamevalid1 === RemitterName) {
				this.firstNamevalid = false;

			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the value in the middle name input field
		 *-> This function doesn't allow special characters and auto removes them accepts only characters
		 *Input- String
		 *Output- returns boolean*/
		middleNameChange: function (oEvent) {
			this.changeFlag = true;
			var RemitterName = oEvent.getSource().getValue().trim();
			//var re = /[`1234567890~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var re = /[`1234567890~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = re.test(RemitterName);
			var middleName;
			if (isSplChar) {
				// var remname1 = !!this.getView().$().closest(".sapUiSizeCompact").length;
				// MessageBox.information(

				// 	"Please Provide  Relevant Name", {
				// 		styleClass: remname1 ? "sapUiSizeCompact" : ""
				// 	});
				//this.getView().byId("pers_Mname").setValue();
				middleName = RemitterName.replace(/[`1234567890~!@#$%^&*()_|+\-=?;:.'",<>\{\}\[\]\\\/]/gi, "");
				this.getView().byId("pers_Mname").setValue(middleName);
				return;
			} else {
				this.getView().byId("pers_Mname").setValueState("None");
				middleName = RemitterName;
			}
			if (this.middleNamevalid1 !== middleName) {
				this.middleNamevalid = true;

			}
			if (this.middleNamevalid1 === middleName) {
				this.middleNamevalid = false;

			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the value in the preferred name input field
		 *-> This function doesn't allow special characters and auto removes them accepts only characters
		 *Input- String
		 *Output- returns boolean*/
		preferNameChange: function (oEvent) {
			this.changeFlag = true;
			var RemitterName = oEvent.getSource().getValue().trim();
			//var re = /[`1234567890~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var re = /[`1234567890~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = re.test(RemitterName);
			var preferredName;
			if (isSplChar) {
				// var remname1 = !!this.getView().$().closest(".sapUiSizeCompact").length;
				// MessageBox.information(

				// 	"Please Provide  Relevant Name", {
				// 		styleClass: remname1 ? "sapUiSizeCompact" : ""
				// 	});
				//this.getView().byId("pers_Prename").setValue();
				preferredName = RemitterName.replace(/[`1234567890~!@#$%^&*()_|+\-+=?;:.'",<>\{\}\[\]\\\/]/gi, "");
				this.getView().byId("pers_Prename").setValue(preferredName);
				return;
			} else {
				this.getView().byId("pers_Prename").setValueState("None");
				preferredName = RemitterName;
			}
			if (this.prefNamevalid1 !== preferredName) {
				this.prefNamevalid = true;
			}
			if (this.prefNamevalid1 === preferredName) {
				this.prefNamevalid = false;
			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the value in the last name input field
		 *-> This function doesn't allow special characters and sets the value state error to the element if found
		 *Input- String
		 *Output- returns boolean*/
		lastNameChange: function (oEvent) {
			this.changeFlag = true;
			var RemitterName = oEvent.getSource().getValue().trim();
			//var re = /[`1234567890~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var re = /[`1234567890~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = re.test(RemitterName);
			if (isSplChar) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please recheck the Names for any Special characters  other than - and ' that are not allowed", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				//this.getView().byId("pers_Lname").setValue();
				this.getView().byId("pers_Lname").setValueState("Error");
				return;
			}
			// else if (RemitterName !== "") {
			else {
				this.getView().byId("pers_Lname").setValueState("None");
			}
			if (this.lastNamevalid1 !== RemitterName) {
				this.lastNamevalid = true;

			}
			if (this.lastNamevalid1 === RemitterName) {
				this.lastNamevalid = false;

			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the item in the gender combobox
		 *-> This function will validate the selected key with the items that are binded to the combobox
		 *Input- Key
		 *Output- returns boolean*/
		GenChange: function (oEvent) {
			this.changeFlag = true;
			var gender = this.getView().byId("pers_gender").getSelectedKey().trim();
			if (gender === "" || gender === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Gender", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("pers_gender").setSelectedKey();
			}
			var Genderchange = this.getView().byId("pers_gender").getValue();
			if (Genderchange !== "") {
				this.getView().byId("pers_gender").setValueState("None");
			}
			if (this.gendervalid1 !== gender) {
				this.gendervalid = true;
			} else {
				this.gendervalid = false;
			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the item in the nationality combobox
		 *-> This function will validate the selected key with the items that are binded to the combobox
		 *Input- Key
		 *Output- returns boolean*/
		NatChange: function (oEvent) {
			this.changeFlag = true;
			var natio = this.getView().byId("pers_Nationality").getSelectedKey().trim();

			if (natio === "" || natio === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Nationality", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("pers_Nationality").setSelectedKey();
			}
			var Nationalitychange = this.getView().byId("pers_Nationality").getValue();
			if (Nationalitychange !== "") {
				this.getView().byId("pers_Nationality").setValueState("None");
			}
			if (this.natiovalid1 !== natio) {
				this.natiovalid = true;
			}
			if (this.natiovalid1 === natio) {
				this.natiovalid = false;
			}
		},
		/* 
      * Date - 20.04.2020
      * Created By - Rakesh
      * Description - This function will be called when the user changes the value in the name input field of emergency 
      contact details section
      *-> This function doesn't allow special characters and auto removes them accepts only characters
      *Input- String
      *Output- returns boolean*/
		emergencyNamechange: function (oEvent) {
			var RemitterName = oEvent.getSource().getValue().trim();
			//var re = /[`1234567890~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var re = /[`1234567890~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = re.test(RemitterName);
			var emergencyName;
			if (isSplChar) {
				// var remname1 = !!this.getView().$().closest(".sapUiSizeCompact").length;
				// MessageBox.information(

				// 	"Please Provide  Relevant Name", {
				// 		styleClass: remname1 ? "sapUiSizeCompact" : ""
				// 	});
				emergencyName = RemitterName.replace(/[`1234567890~!@#$%^&*()_|+\-=?;:.'",<>\{\}\[\]\\\/]/gi, "");
				this.getView().byId("emergency_Name").setValue(emergencyName);
				this.getView().byId("emergency_Name").setValueState("None");
			} else {
				emergencyName = RemitterName;
				this.getView().byId("emergency_Name").setValueState("None");

			}
			if (this.emergencyNamevalid1 !== emergencyName) {
				this.emergencyNamevalid = true;
			} else {
				this.emergencyNamevalid = false;
			}
		},
		/* 
      * Date - 24.08.2020
      * Created By - Karteek
      * Description - This function will be called when the user changes the value in the Phone Number input field
      *-> This function will validate the input with regular expression that doesn't allow alphabets and special symbols except
      '+' and ""
      *Input- String
      *Output- returns boolean*/
		mobileChangeEM: function (oEvent) {
			this.changeFlag = true;
			var mobchange = oEvent.getSource().getValue().trim();
			var a = /^(?=.*\d)[\+?\s?[0-9]+]*$/;
			var s = a.test(mobchange);
			if (s) {
				this.getView().byId("emergency_Phnumber").setValue(mobchange);
				this.getView().byId("emergency_Phnumber").setValueState("None");
			} else {
				sap.m.MessageBox.error("Please Enter Valid Mobile Number");
				this.getView().byId("emergency_Phnumber").setValueState("Error");
			}
			if (this.emergencyphnvalid1 !== mobchange) {
				this.emergencyphnvalid = true;
			}
			if (this.emergencyphnvalid1 === mobchange) {
				this.emergencyphnvalid = false;
			}
		},

		/* 
      * Date - 24.08.2020
      * Created By - Karteek
      * Description - This function will be called when the user changes the value in the Mobile input field
      *-> This function will validate the input with regular expression that doesn't allow alphabets and special symbols except
      '+' and ""
      *Input- String
      *Output- returns boolean*/
		// mobilechange: function (oEvent) {
		// 	this.changeFlag = true;
		// 	var mobchange = oEvent.getSource().getValue();
		// 	var a = /[`abcdefghijklmnopqrstuvwxyz~!@#$%^&*()_|\-=?;:.'",<>\{\}\[\]\\\/]/gi;
		// 	var s = a.test(mobchange);
		// 	// var mobValue;

		// 	if (s) {
		// 		mobchange = mobchange.replace(/[`abcdefghijklmnopqrstuvwxyz~!@#$%^&*()_|\-=?;:.'",<>\{\}\[\]\\\/]/gi, "");
		// 		this.getView().byId("conmobile").setValue(mobchange);
		// 	} else {
		// 		mobchange = mobchange;
		// 		this.getView().byId("conmobile").setValue(mobchange);
		// 	}
		// 	var a1 = /[`abcdefghijklmnopqrstuvwxyz~!@#$%^&*()_|\-=?;:.'",<>\{\}\[\]\\\/]/gi;
		// 	var s1 = a1.test(this.mobileNumbervalid1);
		// 	if (s1) {
		// 		this.mobileNumbervalid1 = this.mobileNumbervalid1.replace(/[`abcdefghijklmnopqrstuvwxyz~!@#$%^&*()_|\-=?;:.'",<>\{\}\[\]\\\/]/gi,
		// 			"");
		// 	} else {
		// 		this.mobileNumbervalid1 = this.mobileNumbervalid1;
		// 	}
		// 	if (this.mobileNumbervalid1 !== mobchange) {
		// 		this.mobileNumbervalid = true;
		// 	} else {
		// 		this.mobileNumbervalid = false;
		// 	}
		// 	if (mobchange !== "") {

		// 		this.getView().byId("conmobile").setValueState("None");

		// 	}
		// },
		mobilechange: function (oEvent) {
			this.changeFlag = true;
			var mobchange = oEvent.getSource().getValue().trim();
			// var a = /[`abcdefghijklmnopqrstuvwxyz~!@#$%^&*()_|\-=?;:.'",<>\{\}\[\]\\\/]/gi;
			var a = /^(?=.*\d)[\+?\s?[0-9]+]*$/;
			var s = a.test(mobchange);
			// var mobValue;
			if (s) {
				// mobchange = mobchange.replace(/^[\+?\s?[0-9]+]*$/, "");
				this.getView().byId("conmobile").setValue(mobchange);
				this.getView().byId("conmobile").setValueState("None");
			} else {
				// mobchange = "";
				// this.getView().byId("conmobile").setValue(mobchange);
				sap.m.MessageBox.error("Please Enter Valid Mobile Number");
				this.getView().byId("conmobile").setValueState("Error");
			}
			if (this.mobileNumbervalid1 !== "") {
				var s1 = a.test(this.mobileNumbervalid1);
				if (s1) {
					this.mobileNumbervalid1 = this.mobileNumbervalid1;
				} else {
					//this.mobileNumbervalid1 = this.mobileNumbervalid1;
					sap.m.MessageBox.error("Please Enter Valid Mobile Number");
					this.getView().byId("conmobile").setValueState("Error");
				}
			}
			if (this.mobileNumbervalid1 !== mobchange) {
				this.mobileNumbervalid = true;
			} else {
				this.mobileNumbervalid = false;
			}
		},
		/*
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when user selects "Others" item in the medicals completed combobox
		 *-> This function will be called when user changes the value in input field*/

		medicalInputchange: function (oEvent) {
			this.changeFlag = true;
			var medicalChange = oEvent.getSource().getValue();

			if (medicalChange !== "") {

				this.getView().byId("idmedinput").setValueState("None");

			}
			var medicalCompleted = this.getView().byId("medicalComp").getSelectedKey();

			if (medicalCompleted === "" || medicalCompleted === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select Medical Completed", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("medicalComp").setSelectedKey();
			}
			//var Nationalitychange = this.getView().byId("pers_Nationality").getValue();
			if (medicalCompleted !== "") {
				this.getView().byId("medicalComp").setValueState("None");
			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the item in the relationship combobox
		 *-> This function will validate the selected key with the items that are binded to the combobox
		 *Input- Key
		 *Output- returns boolean*/
		Relationship_change: function (oEvent) {
			this.changeFlag = true;
			var relChange = oEvent.getSource().getValue();
			if (relChange !== "") {

				this.getView().byId("emergency_Rel").setValueState("None");

			}
			var Relationshipvalue = this.getView().byId("emergency_Rel").getSelectedKey().trim();

			if (Relationshipvalue === "" || Relationshipvalue === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Relationship", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("emergency_Rel").setSelectedKey("");
			}
			//var titleChange = this.getView().byId("pers_Title").getValue();
			if (Relationshipvalue !== "") {
				this.getView().byId("emergency_Rel").setValueState("None");
			}
			if (this.relationshipvalid1 !== Relationshipvalue) {
				this.relationshipvalid = true;
			}
			if (this.relationshipvalid1 === Relationshipvalue) {
				this.relationshipvalid = false;
			}
		},
		requestTypechange: function (oEvent) {
			this.changeFlag = true;
			var reqChange = oEvent.getSource().getValue();
			if (reqChange !== "") {

				this.getView().byId("req_Type").setValueState("None");

			}
		},
		descCommentsChange: function () {
			var desccomm = this.getView().byId("req_Desccomments").getValue().trim();
			this.changeFlag = true;
			if (this.descComments1 !== desccomm) {
				this.descComments = true;
			} else {
				this.descComments = false;
			}

		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the item in the native title combobox
		 *-> This function will validate the selected key with the items that are binded to the combobox
		 *Input- Key
		 *Output- returns boolean*/
		NativeTitle_Change: function () {
			this.changeFlag = true;
			var nativeTitle = this.getView().byId("pers_Native").getSelectedKey().trim();

			if (nativeTitle === "" || nativeTitle === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Native Title", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("pers_Native").setSelectedKey("");
			}
			//var titleChange = this.getView().byId("pers_Title").getValue();
			if (nativeTitle !== "") {
				this.getView().byId("pers_Native").setValueState("None");
			}
			if (this.nativeTitlevalid1 !== nativeTitle) {
				this.nativeTitlevalid = true;
			}
			if (this.nativeTitlevalid1 === nativeTitle) {
				this.nativeTitlevalid = false;
			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the item in the title combobox
		 *-> This function will validate the selected key with the items that are binded to the combobox
		 *Input- Key
		 *Output- returns boolean*/
		Title_Change: function (oEvent) {
			// // var titleChange = oEvent.getSource().getValue();
			// // if (titleChange !== "") {

			// 	this.getView().byId("pers_Title").setValueState("None");

			// // }
			this.changeFlag = true;

			var Title = this.getView().byId("pers_Title").getSelectedKey().trim();

			if (Title === "" || Title === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please select valid Title", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("pers_Title").setSelectedKey("");
			}
			//var titleChange = this.getView().byId("pers_Title").getValue();
			if (Title !== "") {
				this.getView().byId("pers_Title").setValueState("None");
			}
			if (this.titlevalid1 !== Title) {
				this.titlevalid = true;
			}
			if (this.titlevalid1 === Title) {
				this.titlevalid = false;
			}
		},
		/* 
		 * Date - 20.04.2020
		 * Created By - Rakesh
		 * Description - This function will be called when the user changes the item in the Aboriginal or Torres Straight Islander combobox
		 *-> This function will validate the selected key with the items that are binded to the combobox
		 *Input- Key
		 *Output- returns boolean*/
		islander_Change: function () {
			this.changeFlag = true;
			var AboriginalorTorresStraightIslander = this.getView().byId("pers_islander").getSelectedKey().trim();

			if (AboriginalorTorresStraightIslander === "" || AboriginalorTorresStraightIslander === null) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please Select Aboriginal or Torres Straight Islander", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("pers_islander").setSelectedKey("");
			}
			//	var aboriginalChange = this.getView().byId("pers_islander").getValue();
			if (AboriginalorTorresStraightIslander !== "") {
				this.getView().byId("pers_islander").setValueState("None");
			}
			if (this.Aboriginalvalid1 !== AboriginalorTorresStraightIslander) {
				this.Aboriginalvalid = true;
			}
			if (this.Aboriginalvalid1 === AboriginalorTorresStraightIslander) {
				this.Aboriginalvalid = false;
			}
		},
		/* 
      * Date - 22.08.2020
      * Created By - Rakesh
      * Description - This function will be called when the user changes the value in the name input field of 
      Employers Authorised Representative section
      *-> This function doesn't allow special characters and auto removes them accepts only characters
      *Input- String
      *Output- returns boolean*/

		empNameChange: function (oEvent) {
			this.changeFlag = true;
			var RemitterName = oEvent.getSource().getValue().trim();
			//var re = /[`1234567890~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
			var re = /[`1234567890~!@#$%^&*()_|+\=?;:",.<>\{\}\[\]\\\/]/gi;
			var isSplChar = re.test(RemitterName);
			if (isSplChar) {
				var remname = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.information(
					"Please recheck the Names for any Special characters  other than - and ' that are not allowed", {
						styleClass: remname ? "sapUiSizeCompact" : ""
					});
				this.getView().byId("EmpAuth_name").setValueState("Error");
				//this.getView().byId("EmpAuth_name").setValue();
				return;

			} else {
				this.getView().byId("EmpAuth_name").setValueState("None");
			}
			if (this.empName1 !== RemitterName) {
				this.empName = true;
			}
			if (this.empName1 === RemitterName) {
				this.empName = false;
			}
		},
		/* 
      * Date - 22.08.2020
      * Created By - Rakesh
      * Description - This function will be called when the user changes the value in the position input field of 
      Employers Authorised Representative section*/

		empPositionchange: function (oEvent) {
			this.changeFlag = true;
			var RemitterName = oEvent.getSource().getValue();
			if (RemitterName !== "") {
				this.getView().byId("EmpAuth_pos").setValueState("None");
			}
			if (this.empPositionName1 !== RemitterName) {
				this.empPositionName = true;
			}
			if (this.empPositionName1 === RemitterName) {
				this.empPositionName = false;
			}
		},
		/* 
      * Date - 23.05.2020
      * Created By - Karteek
      * Description - This function will be called when user changes the value in the input field of Fortescue Central Person Id 
      *->This function will call validatePositionID() to validate the CP ID 
      *Input- CP ID
      *Output- returns error message if invalid and represents with value state error*
      Calling function - validatePositionID()*/
		SAPNumChange: function () {
			var Fnum = this.getView().byId("pers_SAPnum").getValue().trim();
			this.changeFlag = true;
			if (Number(this.SAPNumvalid1) === 0) {
				this.SAPNumvalid1 = "".toString();
			} else {
				this.SAPNumvalid1 = this.SAPNumvalid1.toString();
			}
			if (Number(this.SAPNumvalid1).toString() !== Fnum) {
				this.SAPNumvalid = true;

			}
			if (this.SAPNumvalid1 === Fnum) {
				this.SAPNumvalid = false;
			}
			var posId = "";
			//	var Services = "/sap/opu/odata/sap/ZHR_CMS_REQ_SRV";
			var oModel = this.getOwnerComponent().getModel();

			//this._ODataModel = new sap.ui.model.odata.ODataModel(Services, true);
			if (Fnum === "") {
				this.getView().byId("pers_SAPnum").setValueState("None");
			}
			/*
			 * Start of Change 
			 * Changed On - 13.08.2020
			 *Changed By - Karteek
			 * Change Description - Calling validatePositionID(), passing eneterd value as an argument*/
			var ValComments = this.validatePositionID(posId, Fnum);
			/*End of Change*/
		},
		/* 
		 * Date - 26.04.2020
		 * Created By - Rakesh
		 * Description - This function is invoked when user clicks on submit button
		 *->This function will validate all the '*' marked fields based on the request type
		 *->This function will set the required fields to value state error when left empty
		 *->This function will validate the attachments for the respective request types
		 *->This function will update the Ref. Doc number with Request ID for the attachments after successfull submission
		 *->This function will also validate when the client side request is failed to process by the server
		 *Calling Functions - onNavigate(), UploadUpdate(), handleClear()*/
		
		// 	onSubmit: function (oEvent) {
		// 	var allvalid;
		// 	var uploadFlag;
		// 	that = this;
		// 	var requestType = this.getView().byId("req_Type").getSelectedKey().trim();
		// 	var requestTypecombo = this.getView().byId("req_Type").getValue().trim();
		// 	var getReqtypeText = this.getView().getModel("initiateModel").getData().TextData;
		// 	var Desccomments = this.getView().byId("req_Desccomments").getValue().trim();
		// 	var title = this.getView().byId("pers_Title").getSelectedKey().trim();
		// 	var titleselect = this.getView().byId("pers_Title").getValue().trim();
		// 	var firstName = this.getView().byId("pers_Fname").getValue().trim();
		// 	var firstNameState = this.getView().byId("pers_Fname").getValueState();
		// 	var middleName = this.getView().byId("pers_Mname").getValue().trim();
		// 	var middleNameState = this.getView().byId("pers_Mname").getValueState();
		// 	var lastName = this.getView().byId("pers_Lname").getValue().trim();
		// 	var lastNameState = this.getView().byId("pers_Lname").getValueState();
		// 	var DOB1 = this.getView().byId("pers_DOB").getValue();
		// 	var uploadCollection = this.getView().byId("UploadCollection").getItems().length;
		// 	var sapNumber1 = this.getView().byId("pers_SAPnum").getValue().trim();
		// 	var sapNumber = this.getView().byId("pers_SAPnum").getValueState();
		// 	var Gender = this.getView().byId("pers_gender").getSelectedKey().trim();
		// 	var Genderselection = this.getView().byId("pers_gender").getValue().trim();
		// 	var prefferedName = this.getView().byId("pers_Prename").getValue().trim();
		// 	var Nationality = this.getView().byId("pers_Nationality").getSelectedKey().trim();
		// 	var NationalitySelect = this.getView().byId("pers_Nationality").getValue().trim();
		// 	var straightIslander = this.getView().byId("pers_islander").getSelectedKey().trim();
		// 	var nativeTitle = this.getView().byId("pers_Native").getSelectedKey().trim();
		// 	var personalMailAddress = this.getView().byId("conmail").getValue().trim();
		// 	var personalMailAddressState = this.getView().byId("conmail").getValueState();
		// 	var mobileNumber = this.getView().byId("conmobile").getValue().trim();
		// 	var Relationship = this.getView().byId("emergency_Rel").getSelectedKey().trim();
		// 	var empRelationship = this.getView().byId("emergency_Rel").getValue().trim();
		// 	var Name = this.getView().byId("emergency_Name").getValue().trim();
		// 	var NameState = this.getView().byId("emergency_Name").getValueState();
		// 	var phoneNumber = this.getView().byId("emergency_Phnumber").getValue().trim();
		// 	var StartDate1 = this.getView().byId("assign_StartDate").getValue();
		// 	var StartDate = this.getView().byId("assign_StartDate").getValue();
		// 	var estimatedEndDate1 = this.getView().byId("assign_EstDate").getValue();
		// 	var covidCheckboxSelected = this.getView().byId("idCovidChkbx").getSelected();
			
		// 	var FirstdoseDate1 = this.getView().byId("CFDD").getValue();
		// 	var Vaccinestatus = this.getView().byId("idvaccinestatus").getValue();
		// 	var Vaccinestatus1 = this.getView().byId("idvaccinestatus").getSelectedKey();
		// 	var SeconddoseDate = this.getView().byId("SeconddoseDate").getValue();
		// 	var consest = this.getView().byId("Consent").getValue();
		// 	var medicalExemptionExpiry = this.getView().byId("medicalExpDate").getValue();
		// 	var fileUploader =  this.getView().byId("fileUploader").getValue();
		// 	var estimatedEndDate = new Date(estimatedEndDate1);
		// 	var estdate = "T00:00:00";
		// 	if (estimatedEndDate === "") {
		// 		estimatedEndDate = null;
		// 	} else {

		// 		var datformate = sap.ui.core.format.DateFormat.getDateInstance({
		// 			pattern: "yyyy-MM-dd"
		// 		});
		// 		var EsDate = datformate.format(estimatedEndDate);
		// 		var EndDate = EsDate.concat(estdate);
		// 	}
		// 	var travelDate1 = this.getView().byId("assign_TravelDate").getValue();
		// 	var travelDate = this.getView().byId("assign_TravelDate").getValue();
		// 	var Position = this.getView().byId("assign_Pos").getValue().trim();
		// 	var Rolerequirement = this.getView().byId("Mant_subgroup").getSelectedKey().trim();
		// 	var MandatoryRole = this.getView().byId("Mant_subgroup").getValue().trim();
		// 	var LeaderName = this.getView().byId("assign_Leader").getValue();
		// 	var projectType = this.getView().byId("Project").getSelectedKey().trim();
		// 	var ProjectValue = this.getView().byId("Project").getValue();
		// 	var Loaction = this.getView().byId("assign_loc").getValue();
		// 	var empSubgroup = this.getView().byId("Emp_subgroup").getSelectedKey().trim();
		// 	var empsubgroupselection = this.getView().byId("Emp_subgroup").getValue().trim();
		// 	//	var empSubgroup1 = this.getView().byId("Emp_subgroup").getSelectedItem().mProperties.text;
		// 	var workSchedule = this.getView().byId("assign_Worksch").getValue();
		// 	var assignVendor = this.getView().byId("assign_Vendor").getValue();
		// 	var VendorSplit = assignVendor.split(" - ")[0];

		// 	var empAuthName = this.getView().byId("EmpAuth_name").getValue().trim();
		// 	var empAuthNameState = this.getView().byId("EmpAuth_name").getValueState();
		// 	var empAuths = this.getView().byId("EmpAuth_pos").getValue().trim();
		// 	var medkey = this.getView().byId("medicalComp").getSelectedKey().trim();

		// 	var medComp = this.getView().byId("medicalComp").getValue().trim();
		// 	var AodTest = this.getView().byId("AODTEST").getValue().trim();
		// 	var medfitmess = this.getView().byId("medicalfitness").getSelectedKey().trim();
		// 	var healthmanagement = "";

		// 	var health = this.getView().byId("healthmanagement").getValue();
		// 	if (health === "Not Applicable") {
		// 		healthmanagement = "NA";
		// 	} else {
		// 		healthmanagement = health;
		// 	}
		// 	var Medicalcomp;
		// 	if (medComp === "Others (Please Specify)") {
		// 		Medicalcomp = this.getView().byId("idmedinput").getValue();
		// 		var medicalinput = this.getView().byId("idmedinput").getValue().trim();
		// 		if (medicalinput === "") {
		// 			allvalid = true;
		// 			this.getView().byId("idmedinput").setValueState("Error");
		// 			this.getView().byId("idmedinput").setValueStateText("Please Enter Medicals Completed");
		// 			// sap.m.MessageBox.error("Please enter Medicals Completed");
		// 			// return;

		// 		}
		// 	} else {
		// 		Medicalcomp = this.getView().byId("medicalComp").getValue();
		// 	}
		// 	var DateComp1 = this.getView().byId("dateComp").getValue();
		// 	//var DateComp = new Date(DateComp1);

		// 	var chk1 = this.getView().byId("chk1").getSelected();

		// 	var chk2 = this.getView().byId("chk2").getSelected();
		// 	var chk3 = this.getView().byId("chk3").getSelected();
		// 	var chk4 = this.getView().byId("chk4").getSelected();
		// 	var chk5 = this.getView().byId("chk5").getSelected();
		// 	var chk6 = this.getView().byId("chk6").getSelected();
		// 	var chk7 = this.getView().byId("chk7").getSelected();
		// 	var chk8 = this.getView().byId("chk8").getSelected();
		// 	var chk9 = this.getView().byId("chk9").getSelected();
		// 	var chk10 = this.getView().byId("chk10").getSelected();
		// 	var state = this.getView().byId("assign_Pos").getValueState();
		// 	var flag = true;
		// 	if (getReqtypeText === "Demobilise" || getReqtypeText === "Extend End Date") {
		// 		this.getView().byId("req_Type").setValueState("None");
		// 		this.getView().byId("pers_Title").setValueState("None");
		// 		this.getView().byId("pers_Fname").setValueState("None");
		// 		this.getView().byId("pers_Lname").setValueState("None");
		// 		this.getView().byId("pers_DOB").setValueState("None");

		// 		this.getView().byId("pers_gender").setValueState("None");
		// 		this.getView().byId("pers_Nationality").setValueState("None");
		// 		this.getView().byId("conmail").setValueState("None");
		// 		this.getView().byId("emergency_Rel").setValueState("None");
		// 		this.getView().byId("emergency_Name").setValueState("None");
		// 		this.getView().byId("emergency_Phnumber").setValueState("None");
		// 		this.getView().byId("conmobile").setValueState("None");

		// 		// if (StartDate1 === "") {
		// 		// 	allvalid = true;
		// 		// 	this.getView().byId("assign_StartDate").setValueState("Error");
		// 		// }

		// 		if (estimatedEndDate1 === "") {
		// 			allvalid = true;
		// 			this.getView().byId("assign_EstDate").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("assign_EstDate").setValueState("None");
		// 		}
		// 		if (Position === "" || LeaderName === "" || Loaction === "") {
		// 			allvalid = true;
		// 			this.getView().byId("assign_Pos").setValueState("Error");
		// 			this.getView().byId("assign_Leader").setValueState("Error");
		// 			this.getView().byId("assign_loc").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("assign_Pos").setValueState("None");
		// 			this.getView().byId("assign_Leader").setValueState("None");
		// 			this.getView().byId("assign_loc").setValueState("None");
		// 		}
		// 		this.getView().byId("Mant_subgroup").setValueState("None");
		// 		this.getView().byId("Emp_subgroup").setValueState("None");

		// 		this.getView().byId("EmpAuth_name").setValueState("None");

		// 		this.getView().byId("EmpAuth_pos").setValueState("None");

		// 		this.getView().byId("chk1").setValueState("None");

		// 		this.getView().byId("chk2").setValueState("Error");

		// 		this.getView().byId("chk2").setValueState("None");

		// 		this.getView().byId("chk3").setValueState("None");

		// 		this.getView().byId("chk4").setValueState("None");

		// 		this.getView().byId("chk5").setValueState("None");
		// 		this.getView().byId("chk6").setValueState("None");
		// 		if (empRelationship === "" && Name !== "" && phoneNumber === "") {

		// 			this.getView().byId("emergency_Rel").setValueState("None");

		// 			this.getView().byId("emergency_Phnumber").setValueState("None");

		// 		} else if (empRelationship === "" && Name === "" && phoneNumber !== "") {

		// 			this.getView().byId("emergency_Rel").setValueState("None");

		// 			this.getView().byId("emergency_Name").setValueState("None");

		// 		} else if (empRelationship === "" && Name !== "" && phoneNumber !== "") {

		// 			this.getView().byId("emergency_Rel").setValueState("None");

		// 		} else if (empRelationship !== "" && Name === "" && phoneNumber !== "") {

		// 			this.getView().byId("emergency_Name").setValueState("None");

		// 		} else if (empRelationship !== "" && Name !== "" && phoneNumber === "") {

		// 			this.getView().byId("emergency_Phnumber").setValueState("None");

		// 		} else if (empRelationship !== "" && Name === "" && phoneNumber === "") {

		// 			this.getView().byId("emergency_Name").setValueState("None");

		// 			this.getView().byId("emergency_Phnumber").setValueState("None");

		// 		}

		// 	} else if (getReqtypeText === "Personal Info. Change") {

		// 		this.getView().byId("req_Type").setValueState("None");

		// 		if (titleselect === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Title").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_Title").setValueState("None");
		// 		}
		// 		if (firstName === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Fname").setValueState("Error");

		// 		}
		// 		if (firstNameState === "Error") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Fname").setValueState("Error");
		// 		}
		// 		if (firstName !== "" && firstNameState !== "Error") {
		// 			this.getView().byId("pers_Fname").setValueState("None");
		// 		}
		// 		if (lastName === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Lname").setValueState("Error");

		// 		}
		// 		if (lastNameState === "Error") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Lname").setValueState("Error");
		// 		}
		// 		if (lastName !== "" && lastNameState !== "Error") {
		// 			this.getView().byId("pers_Lname").setValueState("None");
		// 		}
		// 		if (DOB1 === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_DOB").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_DOB").setValueState("None");
		// 		}
		// 		if (Genderselection === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_gender").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_gender").setValueState("None");
		// 		}
		// 		if (Genderselection === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_gender").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_gender").setValueState("None");
		// 		}
		// 		if (NationalitySelect === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Nationality").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_Nationality").setValueState("None");
		// 		}
		// 		var originalData = this.getOwnerComponent().getModel("tableModel").getData();
		// 		var orgFirstName = originalData.Fname;
		// 		var orgMiddleName = originalData.Mname;
		// 		var orgLastName = originalData.Lname;
		// 		var orgDOB = originalData.Dats;
		// 		var datformat3 = sap.ui.core.format.DateFormat.getDateInstance({
		// 			pattern: "dd.MM.yyyy"
		// 		});

		// 		var datformat4 = sap.ui.core.format.DateFormat.getDateInstance({
		// 			pattern: "yyyy-MM-dd"
		// 		});

		// 		var Dates = orgDOB;
		// 		if (typeof Dates === "string") {
		// 			if (Dates.includes(".")) {

		// 				Dates = datformat3.parse(Dates);

		// 			} else

		// 			if (Dates.includes("-")) {

		// 				Dates = new Date(Dates);

		// 			}
		// 		}
		// 		var dateOfBirth = this.getView().byId("pers_DOB").getValue();
		// 		var datformat5 = sap.ui.core.format.DateFormat.getDateInstance({
		// 			pattern: "dd.MM.yyyy"
		// 		});

		// 		var datformat6 = sap.ui.core.format.DateFormat.getDateInstance({
		// 			pattern: "yyyy-MM-dd"
		// 		});

		// 		var enteredValue = dateOfBirth;
		// 		if (typeof enteredValue === "string") {
		// 			if (enteredValue.includes(".")) {

		// 				enteredValue = datformat5.parse(enteredValue);

		// 			} else

		// 			if (enteredValue.includes("-")) {

		// 				enteredValue = new Date(enteredValue);

		// 			}
		// 		}

		// 		if (orgFirstName !== firstName || orgMiddleName !== middleName || orgLastName !== lastName || Dates.toDateString() !==
		// 			enteredValue.toDateString())

		// 		{
		// 			if (uploadCollection === 0) {
		// 				uploadFlag = true;
		// 			}
		// 		} else {
		// 			uploadFlag = false;
		// 		}
		// 		this.getView().byId("conmail").setValueState("None");
		// 		this.getView().byId("conmobile").setValueState("None");
		// 		this.getView().byId("assign_EstDate").setValueState("None");
		// 		this.getView().byId("assign_Pos").setValueState("None");
		// 		this.getView().byId("assign_Leader").setValueState("None");
		// 		this.getView().byId("assign_loc").setValueState("None");
		// 		this.getView().byId("medicalComp").setValueState("None");
		// 		this.getView().byId("dateComp").setValueState("None");
		// 		if (empRelationship === "" && Name !== "" && phoneNumber === "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Rel").setValueState("Error");

		// 			this.getView().byId("emergency_Phnumber").setValueState("Error");

		// 		} else if (empRelationship === "" && Name === "" && phoneNumber !== "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Rel").setValueState("Error");

		// 			this.getView().byId("emergency_Name").setValueState("Error");

		// 		} else if (empRelationship === "" && Name !== "" && phoneNumber !== "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Rel").setValueState("Error");

		// 		} else if (empRelationship !== "" && Name === "" && phoneNumber !== "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Name").setValueState("Error");

		// 		} else if (empRelationship !== "" && Name !== "" && phoneNumber === "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Phnumber").setValueState("Error");

		// 		} else if (empRelationship !== "" && Name === "" && phoneNumber === "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Name").setValueState("Error");

		// 			this.getView().byId("emergency_Phnumber").setValueState("Error");

		// 		}
		// 		if (personalMailAddress === "") {
		// 			allvalid = true;
		// 			this.getView().byId("conmail").setValueState("Error");

		// 		}
		// 		if (personalMailAddressState === "Error") {
		// 			allvalid = true;
		// 			this.getView().byId("conmail").setValueState("Error");
		// 		}
		// 		if (personalMailAddress !== "" && personalMailAddressState !== "Error") {
		// 			this.getView().byId("conmail").setValueState("None");
		// 		}
		// 		if (mobileNumber === "") {
		// 			allvalid = true;
		// 			this.getView().byId("conmobile").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("conmobile").setValueState("None");
		// 		}
		// 	} 
		// 	else if (getReqtypeText === "Change Of Conditions" ) {
		// 		this.getView().byId("req_Type").setValueState("None");

		// 		this.getView().byId("pers_Title").setValueState("None");

		// 		this.getView().byId("pers_Fname").setValueState("None");

		// 		this.getView().byId("pers_Lname").setValueState("None");
		// 		this.getView().byId("pers_DOB").setValueState("None");
		// 		this.getView().byId("pers_gender").setValueState("None");
		// 		this.getView().byId("pers_gender").setValueState("None");
		// 		this.getView().byId("pers_Nationality").setValueState("Error");

		// 		if (empAuthName === "") {
		// 			allvalid = true;
		// 			this.getView().byId("EmpAuth_name").setValueState("Error");

		// 		}
		// 		if (empAuthNameState === "Error") {
		// 			allvalid = true;
		// 			this.getView().byId("EmpAuth_name").setValueState("Error");
		// 		}
		// 		if (empAuthName !== "" && empAuthNameState !== "Error") {
		// 			this.getView().byId("EmpAuth_name").setValueState("None");
		// 		}
		// 		if (empAuths === "") {
		// 			allvalid = true;
		// 			this.getView().byId("EmpAuth_pos").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("EmpAuth_pos").setValueState("None");
		// 		}
		// 		if (empSubgroup === "E6") {

		// 			this.getView().byId("medicalComp").setValueState("None");

		// 			this.getView().byId("dateComp").setValueState("None");

		// 			this.getView().byId("AODTEST").setValueState("None");

		// 			this.getView().byId("medicalfitness").setValueState("None");

		// 			//	this.getView().byId("healthmanagement").setValueState("Error");

		// 			this.getView().byId("healthmanagement").setValueState("None");

		// 			if (chk7 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk7").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk7").setValueState("None");
		// 			}
		// 			if (chk8 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk8").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk8").setValueState("None");
		// 			}
		// 			if (chk9 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk9").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk9").setValueState("None");
		// 			}
		// 			if (chk10 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk10").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk10").setValueState("None");
		// 			}
		// 		} else {
		// 			if (medComp === "") {
		// 				allvalid = true;
		// 				this.getView().byId("medicalComp").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("medicalComp").setValueState("None");
		// 			}
		// 			if (DateComp1 === "") {
		// 				allvalid = true;
		// 				this.getView().byId("dateComp").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("dateComp").setValueState("None");
		// 			}
		// 			if (AodTest === "") {
		// 				allvalid = true;
		// 				this.getView().byId("AODTEST").setValueState("Error");
		// 			} else {
		// 				this.getView().byId("AODTEST").setValueState("None");
		// 			}
		// 			if (medfitmess === "") {
		// 				allvalid = true;
		// 				this.getView().byId("medicalfitness").setValueState("Error");
		// 			} else {
		// 				this.getView().byId("medicalfitness").setValueState("None");
		// 			}
		// 			if (healthmanagement === "") {
		// 				allvalid = true;
		// 				this.getView().byId("healthmanagement").setValueState("Error");
		// 			} else {
		// 				this.getView().byId("healthmanagement").setValueState("None");
		// 			}
		// 			if (chk1 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk1").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk1").setValueState("None");
		// 			}
		// 			if (chk2 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk2").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk2").setValueState("None");
		// 			}
		// 			if (chk3 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk3").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk3").setValueState("None");
		// 			}
		// 			if (chk4 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk4").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk4").setValueState("None");
		// 			}
		// 			if (chk5 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk5").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk5").setValueState("None");
		// 			}
		// 			if (chk6 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk6").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk6").setValueState("None");
		// 			}
		// 		}

		// 		this.getView().byId("conmail").setValueState("None");

		// 		this.getView().byId("conmobile").setValueState("None");
		// 		if (travelDate1 === "") {
		// 			allvalid = true;
		// 			this.getView().byId("assign_TravelDate").setValueState("Error");
		// 		}
		// 		if (estimatedEndDate1 === "") {
		// 			allvalid = true;
		// 			this.getView().byId("assign_EstDate").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("assign_EstDate").setValueState("None");
		// 		}
		// 		if (Position === "" || LeaderName === "" || Loaction === "") {
		// 			allvalid = true;
		// 			this.getView().byId("assign_Pos").setValueState("Error");
		// 			this.getView().byId("assign_Leader").setValueState("Error");
		// 			this.getView().byId("assign_loc").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("assign_Pos").setValueState("None");
		// 			this.getView().byId("assign_Leader").setValueState("None");
		// 			this.getView().byId("assign_loc").setValueState("None");
		// 		}
		// 		if (MandatoryRole === "") {
		// 			allvalid = true;
		// 			this.getView().byId("Mant_subgroup").setValueState("Error");
		// 		} else {
		// 			this.getView().byId("Mant_subgroup").setValueState("None");
		// 		}
		// 		if (ProjectValue === "") {
		// 			allvalid = true;
		// 			this.getView().byId("Project").setValueState("Error");
		// 		} else {
		// 			this.getView().byId("Project").setValueState("None");
		// 		}

		// 		if (empsubgroupselection === "") {
		// 			allvalid = true;
		// 			this.getView().byId("Emp_subgroup").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("Emp_subgroup").setValueState("None");
		// 		}
		// 		if (empAuthName === "") {
		// 			allvalid = true;
		// 			this.getView().byId("EmpAuth_name").setValueState("Error");

		// 		}
		// 		if (empAuthNameState === "Error") {
		// 			allvalid = true;
		// 			this.getView().byId("EmpAuth_name").setValueState("Error");

		// 		}
		// 		if (empAuthName !== "" && empAuthNameState !== "Error") {
		// 			this.getView().byId("EmpAuth_name").setValueState("None");
		// 		}

		// 		if (empAuths === "") {
		// 			allvalid = true;
		// 			this.getView().byId("EmpAuth_pos").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("EmpAuth_pos").setValueState("None");
		// 		}
				
		// 			if (!covidCheckboxSelected) {
		// 			if (FirstdoseDate1 === "") {
		// 			this.getView().byId("CFDD").setValueState("Error");
		// 			allvalid = true;
		// 			}
		// 			else {
		// 					this.getView().byId("CFDD").setValueState("None");
		// 			}
					
				
		// 		if (Vaccinestatus === "") {
		// 			this.getView().byId("idvaccinestatus").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("idvaccinestatus").setValueState("None");
		// 		}
		// 			if (SeconddoseDate === "") {
		// 			this.getView().byId("SeconddoseDate").setValueState("Error");
		// 			allvalid = true;
		// 		} 
		// 		else {
		// 			this.getView().byId("SeconddoseDate").setValueState("None");
		// 		}
		// 		if (consest === "") {
		// 			this.getView().byId("Consent").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("Consent").setValueState("None");
		// 		}
				
				
		// 		if (fileUploader === "") {
		// 			this.getView().byId("fileUploader").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("fileUploader").setValueState("None");
		// 		}
		// 		// if (medicalExemptionExpiry === "") {
		// 		// 	this.getView().byId("medicalExpDate").setValueState("Error");
		// 		// 	allvalid = true;
		// 		// }
		// 		// else {
		// 		// 	this.getView().byId("medicalExpDate").setValueState("None");
		// 		// }
				
					
		// 	}	
			
		// 	else {
		// 			this.getView().byId("CFDD").setValueState("None");
		// 		this.getView().byId("idvaccinestatus").setValueState("None");
		// 		this.getView().byId("Consent").setValueState("None");
		// 			this.getView().byId("SeconddoseDate").setValueState("None");
		// 		this.getView().byId("fileUploader").setValueState("None");
		// 		this.getView().byId("medicalExpDate").setValueState("None");
					
		// 		}

		// 		//	this.getView().byId("medicalComp").setValueState("None");
		// 		//	this.getView().byId("dateComp").setValueState("None");
		// 	} 
			
		// 	else if (requestType === "06") {
		// 			if (!covidCheckboxSelected) {
		// 			if (FirstdoseDate1 === "") {
		// 			this.getView().byId("CFDD").setValueState("Error");
		// 			allvalid = true;
		// 			}
		// 			else {
		// 					this.getView().byId("CFDD").setValueState("None");
		// 			}
					
				
		// 		if (Vaccinestatus === "") {
		// 			this.getView().byId("idvaccinestatus").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("idvaccinestatus").setValueState("None");
		// 		}
				
		// 		if (SeconddoseDate === "") {
		// 			this.getView().byId("SeconddoseDate").setValueState("Error");
		// 			allvalid = true;
		// 		} 
		// 		else {
		// 			this.getView().byId("SeconddoseDate").setValueState("None");
		// 		}
				
				
		// 		if (consest === "") {
		// 			this.getView().byId("Consent").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("Consent").setValueState("None");
		// 		}
		// 		if (fileUploader === "") {
		// 			this.getView().byId("fileUploader").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("fileUploader").setValueState("None");
		// 		}
		// 		// if (medicalExemptionExpiry === "") {
		// 		// 	this.getView().byId("medicalExpDate").setValueState("Error");
		// 		// 	allvalid = true;
		// 		// }
		// 		// else {
		// 		// 	this.getView().byId("medicalExpDate").setValueState("None");
		// 		// }
					
		// 	}	
			
		// 	else {
		// 			this.getView().byId("CFDD").setValueState("None");
		// 		this.getView().byId("idvaccinestatus").setValueState("None");
		// 			this.getView().byId("SeconddoseDate").setValueState("None");
		// 		this.getView().byId("Consent").setValueState("None");
		// 		this.getView().byId("fileUploader").setValueState("None");
		// 		this.getView().byId("medicalExpDate").setValueState("None");
					
		// 		}
		// 	}
			
			
			
			
			
			
			
			
			
		// 	else {

		// 		if (empSubgroup === "E6") {

		// 			this.getView().byId("medicalComp").setValueState("None");

		// 			this.getView().byId("dateComp").setValueState("None");

		// 			this.getView().byId("AODTEST").setValueState("None");

		// 			this.getView().byId("medicalfitness").setValueState("None");

		// 			//	this.getView().byId("healthmanagement").setValueState("Error");

		// 			this.getView().byId("healthmanagement").setValueState("None");

		// 			if (chk7 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk7").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk7").setValueState("None");
		// 			}
		// 			if (chk8 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk8").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk8").setValueState("None");
		// 			}
		// 			if (chk9 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk9").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk9").setValueState("None");
		// 			}
		// 			if (chk10 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk10").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk10").setValueState("None");
		// 			}
		// 		} else {
		// 			if (medComp === "") {
		// 				allvalid = true;
		// 				this.getView().byId("medicalComp").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("medicalComp").setValueState("None");
		// 			}
		// 			if (DateComp1 === "") {
		// 				allvalid = true;
		// 				this.getView().byId("dateComp").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("dateComp").setValueState("None");
		// 			}
		// 			if (AodTest === "") {
		// 				allvalid = true;
		// 				this.getView().byId("AODTEST").setValueState("Error");
		// 			} else {
		// 				this.getView().byId("AODTEST").setValueState("None");
		// 			}
		// 			if (medfitmess === "") {
		// 				allvalid = true;
		// 				this.getView().byId("medicalfitness").setValueState("Error");
		// 			} else {
		// 				this.getView().byId("medicalfitness").setValueState("None");
		// 			}
		// 			if (healthmanagement === "") {
		// 				allvalid = true;
		// 				this.getView().byId("healthmanagement").setValueState("Error");
		// 			} else {
		// 				this.getView().byId("healthmanagement").setValueState("None");
		// 			}
		// 			if (chk1 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk1").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk1").setValueState("None");
		// 			}
		// 			if (chk2 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk2").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk2").setValueState("None");
		// 			}
		// 			if (chk3 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk3").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk3").setValueState("None");
		// 			}
		// 			if (chk4 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk4").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk4").setValueState("None");
		// 			}
		// 			if (chk5 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk5").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk5").setValueState("None");
		// 			}
		// 			if (chk6 === false) {
		// 				allvalid = true;
		// 				this.getView().byId("chk6").setValueState("Error");

		// 			} else {
		// 				this.getView().byId("chk6").setValueState("None");
		// 			}
		// 		}

		// 		if (requestTypecombo === "") {
		// 			allvalid = true;
		// 			this.getView().byId("req_Type").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("req_Type").setValueState("None");
		// 		}
		// 		if (titleselect === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Title").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_Title").setValueState("None");
		// 		}
		// 		// if (uploadCollection === 0) {
		// 		// 	uploadFlag = true;
		// 		// } else {
		// 		// 	uploadFlag = false;
		// 		// }
		// 		if (firstName === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Fname").setValueState("Error");

		// 		}
		// 		if (firstNameState === "Error") {
		// 			allvalid = true;
		// 		}
		// 		if (firstName !== "" && firstNameState !== "Error") {
		// 			this.getView().byId("pers_Fname").setValueState("None");
		// 		}

		// 		if (lastName === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Lname").setValueState("Error");

		// 		}
		// 		if (lastNameState === "Error") {
		// 			allvalid = true;
		// 		}
		// 		if (lastName !== "" && lastNameState !== "Error") {
		// 			this.getView().byId("pers_Lname").setValueState("None");
		// 		}

		// 		if (DOB1 === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_DOB").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_DOB").setValueState("None");
		// 		}
		// 		if (Genderselection === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_gender").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_gender").setValueState("None");
		// 		}
		// 		if (Genderselection === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_gender").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_gender").setValueState("None");
		// 		}
		// 		if (NationalitySelect === "") {
		// 			allvalid = true;
		// 			this.getView().byId("pers_Nationality").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("pers_Nationality").setValueState("None");
		// 		}
		// 		if (personalMailAddress === "") {
		// 			allvalid = true;
		// 			this.getView().byId("conmail").setValueState("Error");

		// 		}
		// 		if (personalMailAddressState === "Error") {
		// 			allvalid = true;
		// 			this.getView().byId("conmail").setValueState("Error");
		// 		}
		// 		if (personalMailAddress !== "" && personalMailAddressState !== "Error") {
		// 			this.getView().byId("conmail").setValueState("None");
		// 		}

		// 		if (mobileNumber === "") {
		// 			allvalid = true;
		// 			this.getView().byId("conmobile").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("conmobile").setValueState("None");
		// 		}
		// 		if (travelDate1 === "") {
		// 			allvalid = true;
		// 			this.getView().byId("assign_TravelDate").setValueState("Error");
		// 		}
		// 		if (estimatedEndDate1 === "") {
		// 			allvalid = true;
		// 			this.getView().byId("assign_EstDate").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("assign_EstDate").setValueState("None");
		// 		}
		// 		if (Position === "" || LeaderName === "" || Loaction === "") {
		// 			allvalid = true;
		// 			this.getView().byId("assign_Pos").setValueState("Error");
		// 			this.getView().byId("assign_Leader").setValueState("Error");
		// 			this.getView().byId("assign_loc").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("assign_Pos").setValueState("None");
		// 			this.getView().byId("assign_Leader").setValueState("None");
		// 			this.getView().byId("assign_loc").setValueState("None");
		// 		}
		// 		if (MandatoryRole === "") {
		// 			allvalid = true;
		// 			this.getView().byId("Mant_subgroup").setValueState("Error");
		// 		} else {
		// 			this.getView().byId("Mant_subgroup").setValueState("None");
		// 		}
		// 		if (ProjectValue === "") {
		// 			allvalid = true;
		// 			this.getView().byId("Project").setValueState("Error");
		// 		} else {
		// 			this.getView().byId("Project").setValueState("None");
		// 		}

		// 		if (empsubgroupselection === "") {
		// 			allvalid = true;
		// 			this.getView().byId("Emp_subgroup").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("Emp_subgroup").setValueState("None");
		// 		}
		// 		if (empAuthName === "") {
		// 			allvalid = true;
		// 			this.getView().byId("EmpAuth_name").setValueState("Error");

		// 		}
		// 		if (empAuthNameState === "Error") {
		// 			allvalid = true;
		// 		}
		// 		if (empAuthName !== "" && empAuthNameState !== "Error") {
		// 			this.getView().byId("EmpAuth_name").setValueState("None");
		// 		}
		// 		if (empAuths === "") {
		// 			allvalid = true;
		// 			this.getView().byId("EmpAuth_pos").setValueState("Error");

		// 		} else {
		// 			this.getView().byId("EmpAuth_pos").setValueState("None");
		// 		}

		// 		// if (empSubgroup === "E6") {
		// 		// 	if (chk1 === false) {
		// 		// 		allvalid = true;
		// 		// 		this.getView().byId("chk1").setValueState("Error");

		// 		// 	} else {
		// 		// 		this.getView().byId("chk1").setValueState("None");
		// 		// 	}
		// 		// 	if (chk2 === false) {
		// 		// 		allvalid = true;
		// 		// 		this.getView().byId("chk2").setValueState("Error");

		// 		// 	} else {
		// 		// 		this.getView().byId("chk2").setValueState("None");
		// 		// 	}
		// 		// 	if (chk3 === false) {
		// 		// 		allvalid = true;
		// 		// 		this.getView().byId("chk3").setValueState("Error");

		// 		// 	} else {
		// 		// 		this.getView().byId("chk3").setValueState("None");
		// 		// 	}
		// 		// 	if (chk4 === false) {
		// 		// 		allvalid = true;
		// 		// 		this.getView().byId("chk4").setValueState("Error");

		// 		// 	} else {
		// 		// 		this.getView().byId("chk4").setValueState("None");
		// 		// 	}
		// 		// } else {

		// 		// }
		// 		if (empRelationship === "" && Name !== "" && phoneNumber === "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Rel").setValueState("Error");

		// 			this.getView().byId("emergency_Phnumber").setValueState("Error");

		// 		} else if (empRelationship === "" && Name === "" && phoneNumber !== "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Rel").setValueState("Error");

		// 			this.getView().byId("emergency_Name").setValueState("Error");

		// 		} else if (empRelationship === "" && Name !== "" && phoneNumber !== "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Rel").setValueState("Error");

		// 		} else if (empRelationship !== "" && Name === "" && phoneNumber !== "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Name").setValueState("Error");

		// 		} else if (empRelationship !== "" && Name !== "" && phoneNumber === "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Phnumber").setValueState("Error");

		// 		} else if (empRelationship !== "" && Name === "" && phoneNumber === "") {
		// 			allvalid = true;
		// 			this.getView().byId("emergency_Name").setValueState("Error");

		// 			this.getView().byId("emergency_Phnumber").setValueState("Error");

		// 		}
		// 			if (!covidCheckboxSelected) {
		// 			if (FirstdoseDate1 === "") {
		// 			this.getView().byId("CFDD").setValueState("Error");
		// 			allvalid = true;
		// 			}
		// 			else {
		// 					this.getView().byId("CFDD").setValueState("None");
		// 			}
					
				
		// 		if (Vaccinestatus === "") {
		// 			this.getView().byId("idvaccinestatus").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("idvaccinestatus").setValueState("None");
		// 		}
		// 			if (SeconddoseDate === "") {
		// 			this.getView().byId("SeconddoseDate").setValueState("Error");
		// 			allvalid = true;
		// 		} 
		// 		else {
		// 			this.getView().byId("SeconddoseDate").setValueState("None");
		// 		}
		// 		if (consest === "") {
		// 			this.getView().byId("Consent").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("Consent").setValueState("None");
		// 		}
		// 		if (fileUploader === "") {
		// 			this.getView().byId("fileUploader").setValueState("Error");
		// 			allvalid = true;
		// 		}
		// 		else {
		// 			this.getView().byId("fileUploader").setValueState("None");
		// 		}
		// 		// if (medicalExemptionExpiry === "") {
		// 		// 	this.getView().byId("medicalExpDate").setValueState("Error");
		// 		// 	allvalid = true;
		// 		// }
		// 		// else {
		// 		// 	this.getView().byId("medicalExpDate").setValueState("None");
		// 		// }
					
		// 	}	
			
		// 	else {
		// 			this.getView().byId("CFDD").setValueState("None");
		// 		this.getView().byId("idvaccinestatus").setValueState("None");
		// 			this.getView().byId("SeconddoseDate").setValueState("None");
		// 		this.getView().byId("Consent").setValueState("None");
		// 		this.getView().byId("fileUploader").setValueState("None");
		// 		this.getView().byId("medicalExpDate").setValueState("None");
					
		// 		}
			
			
		// 	}
		// 	if (allvalid === true) {
		// 		sap.m.MessageBox.error("Please fill in all required fields");
		// 		return;
		// 	} else if (uploadFlag === true) {
		// 		sap.m.MessageBox.error("Please upload an attachment to verify Identity");
		// 		return;
		// 	}
		// 	if (getReqtypeText === "Change Of Conditions" || requestTypecombo === "Onboard" || requestTypecombo === "New Hire") {
		// 		var FileUploaders = oEvent.getSource().getCustomData();
		// 		for (var i = 0; i < FileUploaders.length; i++) {
		// 			var Fileuploader = oEvent.getSource().getCustomData()[i].getValue().getValue();
		// 			if (Fileuploader === "") {
		// 				var Fileup = true;
		// 				oEvent.getSource().getCustomData()[i].getValue().setValueState("Error");

		// 			}
		// 		}

		// 		if (Fileup) {
		// 			sap.m.MessageBox.error("Please Upload Mandatory Documents");
		// 			return;
		// 		} else {
		// 			Fileup = false;
		// 		}
		// 		var key = this.getView().byId("Mant_subgroup").getSelectedKey();
		// 		if (key !== "NA"  && (requestTypecombo === "Onboard" || requestTypecombo === "New Hire")) {
		// 			if (!CheckBox.getSelected()) {
		// 				if (FileUploader01.getValue() === "") {
		// 					sap.m.MessageBox.error("Please upload an Attachment to verify Proof of Identity");
		// 					FileUploader01.setValueState("Error");
		// 					return;
		// 				}
		// 			}
		// 		}
		// 		if (key === "NA" && (requestTypecombo === "Onboard" || requestTypecombo === "New Hire")) {
		// 			if (FileUploader01.getValue() === "") {
		// 				sap.m.MessageBox.error("Please upload an Attachment to verify Proof of Identity");
		// 				FileUploader01.setValueState("Error");
		// 				return;
		// 			}
		// 		}
		// 	}
		// 	var datecom = "T00:00:00";
		// 	if (DateComp1.substring(2, 3) === ".") {
		// 		DateComp1 = DateComp1.split(".")[2] + "-" + DateComp1.split(".")[1] + "-" + DateComp1.split(".")[0];
		// 		DateComp1 = DateComp1.concat(datecom);
		// 	} else {
		// 		DateComp1 = DateComp1.concat(datecom);
		// 	}

		// 	var Dtdate = "T00:00:00";
		// 	if (DOB1.substring(2, 3) === ".") {
		// 		DOB1 = DOB1.split(".")[2] + "-" + DOB1.split(".")[1] + "-" + DOB1.split(".")[0];
		// 		DOB1 = DOB1.concat(Dtdate);
		// 	} else {
		// 		DOB1 = DOB1.concat(Dtdate);
		// 	}
		// 	if (flag) {
		// 		that = this;
		// 		var obj = {};
		// 		if (getReqtypeText === "Demobilise" || getReqtypeText === "Extend End Date") {
		// 			var susposition = sap.ui.getCore().getModel("SusposModel").getData();
		// 			var StartDate_Payload = this.getView().byId("assign_StartDate").getValue();
		// 			var stdate = "T00:00:00";
		// 			if (StartDate_Payload.substring(2, 3) === ".") {
		// 				StartDate_Payload = StartDate_Payload.split(".")[2] + "-" + StartDate_Payload.split(".")[1] + "-" + StartDate_Payload.split(".")[
		// 					0];
		// 				StartDate_Payload = StartDate_Payload.concat(stdate);
		// 			} else {
		// 				StartDate_Payload = StartDate_Payload.concat(stdate);
		// 			}
		// 			var SupPosText = susposition.SupPos;
		// 			obj.Reqid = "";
		// 			obj.ABORTS_TEXT = "";
		// 			obj.ERELATION_TEXT = "";
		// 			obj.ESUBGRP_TEXT = "";
		// 			obj.GENDER_TEXT = "";
		// 			obj.NATIO_TEXT = "";
		// 			obj.NTITLE_TEXT = "";
		// 			obj.REQ_TYPE_TEXT = "";
		// 			obj.TITLE_TEXT = "";
		// 			obj.CVC_STATUS= "";
		// 			obj.Vendor = VendorSplit;
		// 			obj.ReqType = requestType;
		// 			obj.Comments = Desccomments;
		// 			obj.VendLText = Desccomments;
		// 			obj.Title = title;

		// 			obj.Fname = firstName;
		// 			obj.Mname = middleName;
		// 			obj.Lname = lastName;
		// 			obj.Dats = DOB1;
		// 			obj.Pernr = this.Pernr;
		// 			obj.Personid_ext = sapNumber1;
		// 			obj.Gender = Gender;

		// 			obj.Prname = prefferedName;
		// 			obj.Natio = Nationality;

		// 			obj.Aborts = straightIslander;

		// 			obj.Ntitle = nativeTitle;

		// 			obj.Email = personalMailAddress;
		// 			obj.Mobile = mobileNumber;
		// 			obj.Erelation = Relationship;

		// 			obj.Ename = Name;
		// 			obj.Ephone = phoneNumber;
		// 			obj.Begda = StartDate_Payload;
		// 			obj.Endda = EndDate;
		// 			obj.OrgPosid = Position;
		// 			//obj.Jobid = Rolerequirement;
		// 			//obj.Prjct_type = projectType;
		// 			obj.Leader = this.leader;
		// 			obj.LeaderName = LeaderName;
		// 			//	obj.SupPosText = "";
		// 			obj.Location = Loaction;
		// 			obj.Esubgrp = empSubgroup;

		// 			obj.Worksch = workSchedule;
		// 			obj.SupPosText = SupPosText;
		// 			obj.SupPosStxt = this.suspose;
		// 			obj.Loc_id = this.loc_id;
		// 			obj.Erdat = null;
		// 			//obj.CrUnam = "";
		// 			obj.CrUnam = this.vUser;
		// 			// obj.Note = Note;
		// 			obj.UpdUnam = "";
		// 			obj.Cpudt = null;
		// 			obj.Note = "";
		// 			obj.Status = "NEW";
		// 			obj.UserId = this.vUser;
		// 			var reqSubtypeFlag;
		// 			if (requestTypecombo === "Demobilise") {
		// 				reqSubtypeFlag = "";
		// 			}
		// 			if (requestTypecombo === "Extend End Date") {
		// 				reqSubtypeFlag = "ED";
		// 			}
		// 			obj.Req_Subtype = reqSubtypeFlag;

		// 		} 
		// 		else if (getReqtypeText === "Personal Info. Change") {
		// 			obj.Reqid = "";
		// 			obj.ABORTS_TEXT = "";
		// 			obj.ERELATION_TEXT = "";
		// 			obj.ESUBGRP_TEXT = "";
		// 			obj.GENDER_TEXT = "";
		// 			obj.NATIO_TEXT = "";
		// 			obj.NTITLE_TEXT = "";
		// 			obj.REQ_TYPE_TEXT = "";
		// 			obj.TITLE_TEXT = "";
		// 			obj.CVC_STATUS= "";
		// 			obj.Vendor = VendorSplit;
		// 			obj.ReqType = requestType;
		// 			obj.Comments = Desccomments;
		// 			obj.VendLText = Desccomments;
		// 			obj.Title = title;

		// 			obj.Fname = firstName;
		// 			obj.Mname = middleName;
		// 			obj.Lname = lastName;
		// 			obj.Dats = DOB1;
		// 			obj.Pernr = this.Pernr;
		// 			obj.Personid_ext = sapNumber1;
		// 			obj.Gender = Gender;

		// 			obj.Prname = prefferedName;
		// 			obj.Natio = Nationality;

		// 			obj.Aborts = this.getView().byId("pers_islander").getSelectedKey();

		// 			obj.Ntitle = nativeTitle;
		// 			obj.Email = personalMailAddress;
		// 			obj.Mobile = mobileNumber;
		// 			obj.Erelation = Relationship;

		// 			obj.Ename = Name;
		// 			obj.Ephone = phoneNumber;
		// 			//	obj.SupPosText = SupPosText;
		// 			//	obj.SupPosStxt = this.suspose;
		// 			//	obj.Loc_id = this.loc_id;
		// 			obj.EMP_AUTH_REP = "";
		// 			obj.EMP_AUTH_RPOS = "";
		// 			obj.CrUnam = this.vUser;
		// 			//	obj.MED_COMP = medkey;
		// 			//	obj.MED_COML_TXT = Medicalcomp;
		// 			//	obj.MEDDT = decDate;
		// 			// obj.CHKBX1 = "T";
		// 			// obj.CHKBX2 = "T";
		// 			// obj.CHKBX3 = "T";
		// 			// obj.CHKBX4 = "T";
		// 			// obj.CHKBX5 = "T";
		// 			obj.Status = "NEW";
		// 			obj.Req_Subtype = "NC";
		// 			obj.UserId = this.vUser;
		// 		} 
		// 		else if (getReqtypeText === "Change Of Conditions") {
		// 			var susposition = sap.ui.getCore().getModel("SusposModel").getData();
		// 			var SupPosText = susposition.SupPos;
		// 			var COCDate = "T00:00:00";
		// 			var travelDateCOC = this.getView().byId("assign_TravelDate").getValue();
		// 			if (travelDateCOC.substring(2, 3) === ".") {
		// 				travelDateCOC = travelDateCOC.split(".")[2] + "-" + travelDateCOC.split(".")[1] + "-" + travelDateCOC.split(".")[0];
		// 				travelDateCOC = travelDateCOC.concat(COCDate);
		// 			} else {
		// 				travelDateCOC = travelDateCOC.concat(COCDate);
		// 			}

		// 			var effectDate = "T00:00:00";

		// 			var effectDate1 = this.getView().byId("CFDD").getValue();
		// 			if (effectDate1.substring(2, 3) === ".") {
		// 				effectDate1 = effectDate1.split(".")[2] + "-" + effectDate1.split(".")[1] + "-" + effectDate1.split(".")[0];
		// 				effectDate1 = effectDate1.concat(effectDate);
		// 			}
		// 			if (effectDate1.includes("-") && !effectDate1.includes("T00:00:00")) {
		// 				effectDate1 = effectDate1.concat(effectDate);
		// 			}
		// 			if (effectDate1 === "") {
		// 				effectDate1 = null;
		// 			}

		// 			var SecondDose = "T00:00:00";

		// 			var SecondDosage = this.getView().byId("SeconddoseDate").getValue();
		// 			if (SecondDosage.substring(2, 3) === ".") {
		// 				SecondDosage = SecondDosage.split(".")[2] + "-" + SecondDosage.split(".")[1] + "-" + SecondDosage.split(".")[0];
		// 				SecondDosage = SecondDosage.concat(SecondDose);
		// 			}
		// 		if (SecondDosage.includes("-") && !SecondDosage.includes("T00:00:00")) {
		// 				SecondDosage = SecondDosage.concat(SecondDose);
		// 			}
		// 			if (SecondDosage === "") {
		// 				SecondDosage = null;
		// 			}
		// 			var medicalExp = "T00:00:00";

		// 			var medicalExempExp = this.getView().byId("medicalExpDate").getValue();
		// 			if (medicalExempExp.substring(2, 3) === ".") {
		// 				medicalExempExp = medicalExempExp.split(".")[2] + "-" + medicalExempExp.split(".")[1] + "-" + medicalExempExp.split(".")[0];
		// 				medicalExempExp = medicalExempExp.concat(medicalExp);
		// 			}
		// 		if (medicalExempExp.includes("-") && !medicalExempExp.includes("T00:00:00")) {
		// 				medicalExempExp = medicalExempExp.concat(medicalExp);
		// 			}
		// 			if (medicalExempExp === "") {
		// 				medicalExempExp = null;
		// 			}

		// 			if (SupPosText === undefined || SupPosText !== undefined) {
		// 				obj.Reqid = "";
		// 				obj.ABORTS_TEXT = "";
		// 				obj.ERELATION_TEXT = "";
		// 				obj.ESUBGRP_TEXT = "";
		// 				obj.GENDER_TEXT = "";
		// 				obj.NATIO_TEXT = "";
		// 				obj.NTITLE_TEXT = "";
		// 				obj.REQ_TYPE_TEXT = "";
		// 				obj.TITLE_TEXT = "";
		// 				obj.CVC_STATUS= "";
		// 				obj.Vendor = VendorSplit;
		// 				obj.ReqType = requestType;
		// 				obj.Comments = Desccomments;
		// 				obj.VendLText = Desccomments;
		// 				obj.Title = title;

		// 				obj.Fname = firstName;
		// 				obj.Mname = middleName;
		// 				obj.Lname = lastName;
		// 				obj.Dats = DOB1;
		// 				//obj.Pernr = this.Pernr;
		// 				var pernr;
		// 				if (this.Pernr !== "") {
		// 					pernr = this.Pernr;
		// 				} else {
		// 					pernr = "";
		// 				}
		// 				obj.Pernr = pernr;
		// 				obj.Personid_ext = sapNumber1;
		// 				obj.Gender = Gender;

		// 				obj.Prname = prefferedName;
		// 				obj.Natio = Nationality;

		// 				obj.Aborts = straightIslander;

		// 				obj.Ntitle = nativeTitle;

		// 				obj.Email = personalMailAddress;
		// 				obj.Mobile = mobileNumber;
		// 				obj.Erelation = Relationship;

		// 				obj.Ename = Name;
		// 				obj.Ephone = phoneNumber;
		// 				//obj.Begda = StartDate;
		// 				obj.Begda = travelDateCOC;
		// 				obj.Endda = EndDate;
		// 				obj.OrgPosid = Position;
		// 				obj.Jobid = Rolerequirement;
		// 				obj.Prjct_type = projectType;
		// 				obj.Leader = this.leader;
		// 				obj.LeaderName = LeaderName;
		// 				//	obj.SupPosText = "";
		// 				obj.Location = Loaction;
		// 				obj.Esubgrp = empSubgroup;
		// 				obj.Worksch = workSchedule;
		// 				obj.SupPosText = SupPosText;
		// 				obj.SupPosStxt = this.suspose;
		// 				obj.Loc_id = this.loc_id;
		// 				obj.Erdat = null;
		// 				obj.CrUnam = this.vUser;
		// 				// obj.Note = Note;
		// 				obj.UpdUnam = "";
		// 				obj.Cpudt = null;
		// 				obj.Note = "";
		// 				obj.Status = "NEW";

		// 				obj.EMP_AUTH_REP = empAuthName;
		// 				obj.EMP_AUTH_RPOS = empAuths;
		// 				obj.UserId = this.vUser;
		// 				obj.CVC_EFF_DATE = effectDate1;
		// 				obj.CVC_STATUS_COD = Vaccinestatus1;
		// 				obj.CVC_2DS_DT = SecondDosage;
		// 				obj.CVC_DECL = consest;
		// 				obj.CVC_MEE_DT = medicalExempExp;
		// 				if (covidCheckboxSelected) {
		// 					obj.CVC_COMP_DECL = "T";
		// 				}
		// 					else if (!covidCheckboxSelected) {
		// 					obj.CVC_COMP_DECL = "F";
		// 				}
		// 				else {
		// 					obj.CVC_COMP_DECL = "";
		// 				}
						
						
						
		// 				if (empSubgroup === "E6") {
		// 					obj.MED_COMP = "";
		// 					obj.MEDDT = null;
		// 					obj.Aodtest = "";
		// 					obj.Risk_level = "";
		// 					obj.Hlthmngplan = "";
		// 					obj.MED_COML_TXT = "";
		// 					obj.LRWCHKBX1 = "T";
		// 					obj.LRWCHKBX2 = "T";
		// 					obj.LRWCHKBX3 = "T";
		// 					obj.LRWCHKBX4 = "T";
		// 				} else {
		// 					//obj.MEDDT = null;
		// 					// obj.MED_COMP = "";
		// 					// obj.Aodtest = "";
		// 					// obj.Risk_level = "";
		// 					// obj.Hlthmngplan = "";
		// 					// obj.MED_COML_TXT = "";
		// 					obj.MEDDT = DateComp1;
		// 					obj.MED_COMP = medkey;
		// 					obj.Aodtest = AodTest;
		// 					obj.Risk_level = medfitmess;
		// 					obj.Hlthmngplan = healthmanagement;
		// 					obj.MED_COML_TXT = Medicalcomp;
		// 					obj.CHKBX1 = "T";
		// 					obj.CHKBX2 = "T";
		// 					obj.CHKBX3 = "T";
		// 					obj.CHKBX4 = "T";
		// 					obj.CHKBX5 = "T";
		// 					obj.CHKBX6 = "T";
		// 				}

		// 			}
		// 		}
		// 		else if (requestType === "06") {
		// 				var effectDate = "T00:00:00";

		// 			var effectDate1 = this.getView().byId("CFDD").getValue();
		// 			if (effectDate1.substring(2, 3) === ".") {
		// 				effectDate1 = effectDate1.split(".")[2] + "-" + effectDate1.split(".")[1] + "-" + effectDate1.split(".")[0];
		// 				effectDate1 = effectDate1.concat(effectDate);
		// 			}
		// 		if (effectDate1.includes("-") && !effectDate1.includes("T00:00:00")) {
		// 				effectDate1 = effectDate1.concat(effectDate);
		// 			}
		// 			if (effectDate1 === "") {
		// 				effectDate1 = null;
		// 			}
		// 			var SecondDose = "T00:00:00";

		// 			var SecondDosage = this.getView().byId("SeconddoseDate").getValue();
		// 			if (SecondDosage.substring(2, 3) === ".") {
		// 				SecondDosage = SecondDosage.split(".")[2] + "-" + SecondDosage.split(".")[1] + "-" + SecondDosage.split(".")[0];
		// 				SecondDosage = SecondDosage.concat(SecondDose);
		// 			}
		// 			if (SecondDosage.includes("-") && !SecondDosage.includes("T00:00:00")) {
		// 				SecondDosage = SecondDosage.concat(SecondDose);
		// 			}
		// 			if (SecondDosage === "") {
		// 				SecondDosage = null;
		// 			}
					
		// 			var medicalExp = "T00:00:00";

		// 			var medicalExempExp = this.getView().byId("medicalExpDate").getValue();
		// 			if (medicalExempExp.substring(2, 3) === ".") {
		// 				medicalExempExp = medicalExempExp.split(".")[2] + "-" + medicalExempExp.split(".")[1] + "-" + medicalExempExp.split(".")[0];
		// 				medicalExempExp = medicalExempExp.concat(medicalExp);
		// 			}
		// 		if (medicalExempExp.includes("-") && !medicalExempExp.includes("T00:00:00")) {
		// 				medicalExempExp = medicalExempExp.concat(medicalExp);
		// 			}
		// 			if (medicalExempExp === "") {
		// 				medicalExempExp = null;
		// 			}
					
					
					
					
					
		// 			var DOB = this.getOwnerComponent().getModel("tableModel").getData().Dats;
		// 			var DOB1="";
		// 			if (DOB.substring(2, 3) === ".") {
		// 				DOB = DOB.split(".")[2] + "-" + DOB.split(".")[1] + "-" + DOB.split(".")[0];
		// 				DOB1 = DOB.concat(SecondDose);
		// 			}
		// 			// if (DOB1.includes("-")) {
		// 			// 	DOB1 = DOB1.concat(SecondDose);
		// 			// }
		// 			if (DOB === "") {
		// 				DOB1 = null;
		// 			}
		// 				var pernr = "";
		// 				if (this.Pernr !== "") {
		// 					pernr = this.Pernr;
		// 				} else {
		// 					pernr = "";
		// 				}
					
		// 			// obj.ABORTS_TEXT = "";
		// 			// 	obj.ERELATION_TEXT = "";
		// 			// 	obj.ESUBGRP_TEXT = "";
		// 			// 	obj.GENDER_TEXT = "";
		// 			// 	obj.NATIO_TEXT = "";
		// 			// 	obj.NTITLE_TEXT = "";
		// 			// 	obj.REQ_TYPE_TEXT = "";
		// 			// 	obj.TITLE_TEXT = "";
		// 			// 	obj.ReqType = requestType;
		// 			// 	obj.Comments = Desccomments;
		// 			// 	obj.Req_Subtype = "";
		// 		 //     	obj.Status = "NEW";
		// 			// 	obj.CVC_EFF_DATE = effectDate1;
		// 			// 	obj.CVC_STATUS = Vaccinestatus;
		// 			// 	obj.CVC_2DS_DT = SecondDosage;
		// 			// 	obj.CVC_DECL = consest;
		// 			// 		if (covidCheckboxSelected) {
		// 			// 		obj.CVC_COMP_DECL = "T";
		// 			// 	}
		// 			// 		else if (!covidCheckboxSelected) {
		// 			// 		obj.CVC_COMP_DECL = "F";
		// 			// 	}
		// 			// 	else {
		// 			// 		obj.CVC_COMP_DECL = "";
		// 			// 	}
		// 			 obj.Reqid = "";
		// 			obj.ABORTS_TEXT = "";
		// 			obj.ERELATION_TEXT = "";
		// 			obj.ESUBGRP_TEXT = "";
		// 			obj.GENDER_TEXT = "";
		// 			obj.NATIO_TEXT = "";
		// 			obj.NTITLE_TEXT = "";
		// 			obj.REQ_TYPE_TEXT = "";
		// 			obj.TITLE_TEXT = "";
		// 			obj.CVC_STATUS= "";
		// 			obj.Vendor = VendorSplit;
		// 			obj.ReqType = requestType;
		// 			obj.Comments = Desccomments;
		// 			obj.VendLText = Desccomments;
		// 			obj.Title = this.getOwnerComponent().getModel("tableModel").getData().Title;

		// 			obj.Fname = this.getOwnerComponent().getModel("tableModel").getData().Fname;
		// 			obj.Mname = this.getOwnerComponent().getModel("tableModel").getData().Mname;
		// 			obj.Lname = this.getOwnerComponent().getModel("tableModel").getData().Lname;
		// 			obj.Dats = DOB1;
		// 			obj.Pernr = pernr;
		// 			obj.Personid_ext = this.getOwnerComponent().getModel("tableModel").getData().Personid_ext;
		// 			obj.Gender = this.getOwnerComponent().getModel("tableModel").getData().Gender;

		// 			obj.Prname = this.getOwnerComponent().getModel("tableModel").getData().Prname;
		// 			obj.Natio = this.getOwnerComponent().getModel("tableModel").getData().Natio;

		// 			obj.Aborts = this.getOwnerComponent().getModel("tableModel").getData().Aborts;

		// 			obj.Ntitle = this.getOwnerComponent().getModel("tableModel").getData().Ntitle;
		// 			obj.Email = this.getOwnerComponent().getModel("tableModel").getData().Email;
		// 			obj.Mobile = this.getOwnerComponent().getModel("tableModel").getData().Mobile;
		// 			obj.Erelation = this.getOwnerComponent().getModel("tableModel").getData().Erelation;

		// 			obj.Ename = this.getOwnerComponent().getModel("tableModel").getData().Ename;
		// 			obj.Ephone = this.getOwnerComponent().getModel("tableModel").getData().Ephone;
		// 			//	obj.SupPosText = SupPosText;
		// 			//	obj.SupPosStxt = this.suspose;
		// 			//	obj.Loc_id = this.loc_id;
		// 			obj.EMP_AUTH_REP = "";
		// 			obj.EMP_AUTH_RPOS = "";
		// 			obj.CrUnam = this.vUser;
		// 			//	obj.MED_COMP = medkey;
		// 			//	obj.MED_COML_TXT = Medicalcomp;
		// 			//	obj.MEDDT = decDate;
		// 			// obj.CHKBX1 = "T";
		// 			// obj.CHKBX2 = "T";
		// 			// obj.CHKBX3 = "T";
		// 			// obj.CHKBX4 = "T";
		// 			// obj.CHKBX5 = "T";
		// 			obj.Status = "NEW";
		// 			obj.Req_Subtype = "";
		// 			obj.UserId = this.vUser;
		// 				obj.CVC_EFF_DATE = effectDate1;
		// 				obj.CVC_STATUS_COD = Vaccinestatus1;
		// 				obj.CVC_2DS_DT = SecondDosage;
		// 				obj.CVC_DECL = consest;
		// 				obj.CVC_MEE_DT = medicalExempExp;
		// 					if (covidCheckboxSelected) {
		// 					obj.CVC_COMP_DECL = "T";
		// 				}
		// 					else if (!covidCheckboxSelected) {
		// 					obj.CVC_COMP_DECL = "F";
		// 				}
		// 				else {
		// 					obj.CVC_COMP_DECL = "";
		// 				}
		// 				obj.UserId = this.vUser;
		// 		}
		// 		else {

		// 			var susposition = sap.ui.getCore().getModel("SusposModel").getData();
		// 			var NHDate = "T00:00:00";
		// 			var NHTravelDate = this.getView().byId("assign_TravelDate").getValue();
		// 			if (NHTravelDate.substring(2, 3) === ".") {
		// 				NHTravelDate = NHTravelDate.split(".")[2] + "-" + NHTravelDate.split(".")[1] + "-" + NHTravelDate.split(".")[0];
		// 				NHTravelDate = NHTravelDate.concat(NHDate);
		// 			} else {
		// 				NHTravelDate = NHTravelDate.concat(NHDate);
		// 			}

		// 			var effectDate = "T00:00:00";

		// 			var effectDate1 = this.getView().byId("CFDD").getValue();
		// 			if (effectDate1.substring(2, 3) === ".") {
		// 				effectDate1 = effectDate1.split(".")[2] + "-" + effectDate1.split(".")[1] + "-" + effectDate1.split(".")[0];
		// 				effectDate1 = effectDate1.concat(effectDate);
		// 			}
		// 			if (effectDate1.includes("-") && !effectDate1.includes("T00:00:00")) {
		// 				effectDate1 = effectDate1.concat(effectDate);
		// 			}
		// 			if (effectDate1 === "") {
		// 				effectDate1 = null;
		// 			}

		// 			var SecondDose = "T00:00:00";

		// 			var SecondDosage = this.getView().byId("SeconddoseDate").getValue();
		// 			if (SecondDosage.substring(2, 3) === ".") {
		// 				SecondDosage = SecondDosage.split(".")[2] + "-" + SecondDosage.split(".")[1] + "-" + SecondDosage.split(".")[0];
		// 				SecondDosage = SecondDosage.concat(SecondDose);
		// 			}
		// 			if (SecondDosage.includes("-") && !SecondDosage.includes("T00:00:00")) {
		// 				SecondDosage = SecondDosage.concat(SecondDose);
		// 			}
		// 			if (SecondDosage === "") {
		// 				SecondDosage = null;
		// 			}
		// 			var medicalExp = "T00:00:00";

		// 			var medicalExempExp = this.getView().byId("medicalExpDate").getValue();
		// 			if (medicalExempExp.substring(2, 3) === ".") {
		// 				medicalExempExp = medicalExempExp.split(".")[2] + "-" + medicalExempExp.split(".")[1] + "-" + medicalExempExp.split(".")[0];
		// 				medicalExempExp = medicalExempExp.concat(medicalExp);
		// 			}
		// 		if (medicalExempExp.includes("-") && !medicalExempExp.includes("T00:00:00")) {
		// 				medicalExempExp = medicalExempExp.concat(medicalExp);
		// 			}
		// 			if (medicalExempExp === "") {
		// 				medicalExempExp = null;
		// 			}
					

		// 			var SupPosText = susposition.SupPos;
		// 			if (SupPosText === undefined || SupPosText !== undefined) {
		// 				obj.Reqid = "";
		// 				obj.ABORTS_TEXT = "";
		// 				obj.ERELATION_TEXT = "";
		// 				obj.ESUBGRP_TEXT = "";
		// 				obj.GENDER_TEXT = "";
		// 				obj.NATIO_TEXT = "";
		// 				obj.NTITLE_TEXT = "";
		// 				obj.REQ_TYPE_TEXT = "";
		// 				obj.TITLE_TEXT = "";
		// 				obj.CVC_STATUS= "";
		// 				obj.Vendor = VendorSplit;
		// 				obj.ReqType = requestType;
		// 				obj.Comments = Desccomments;
		// 				obj.VendLText = Desccomments;
		// 				obj.Title = title;

		// 				obj.Fname = firstName;
		// 				obj.Mname = middleName;
		// 				obj.Lname = lastName;
		// 				obj.Dats = DOB1;
		// 				//obj.Pernr = this.Pernr;
		// 				var pernr;
		// 				if (this.Pernr !== "") {
		// 					pernr = this.Pernr;
		// 				} else {
		// 					pernr = "";
		// 				}
		// 				obj.Pernr = pernr;
		// 				obj.Personid_ext = sapNumber1;
		// 				obj.Gender = Gender;

		// 				obj.Prname = prefferedName;
		// 				obj.Natio = Nationality;

		// 				obj.Aborts = straightIslander;

		// 				obj.Ntitle = nativeTitle;

		// 				obj.Email = personalMailAddress;
		// 				obj.Mobile = mobileNumber;
		// 				obj.Erelation = Relationship;

		// 				obj.Ename = Name;
		// 				obj.Ephone = phoneNumber;
		// 				//obj.Begda = StartDate;
		// 				obj.Begda = NHTravelDate;
		// 				obj.Endda = EndDate;
		// 				obj.OrgPosid = Position;
		// 				obj.Jobid = Rolerequirement;
		// 				obj.Prjct_type = projectType;
		// 				obj.Leader = this.leader;
		// 				obj.LeaderName = LeaderName;
		// 				//	obj.SupPosText = "";
		// 				obj.Location = Loaction;
		// 				obj.Esubgrp = empSubgroup;
		// 				obj.Worksch = workSchedule;
		// 				obj.SupPosText = SupPosText;
		// 				obj.SupPosStxt = this.suspose;
		// 				obj.Loc_id = this.loc_id;
		// 				obj.Erdat = null;
		// 				obj.CrUnam = this.vUser;
		// 				// obj.Note = Note;
		// 				obj.UpdUnam = "";
		// 				obj.Cpudt = null;
		// 				obj.Note = "";
		// 				obj.Status = "NEW";
		// 				obj.CVC_EFF_DATE = effectDate1;
		// 				obj.CVC_STATUS_COD = Vaccinestatus1;
		// 				obj.CVC_2DS_DT = SecondDosage;
		// 				obj.CVC_DECL = consest;
		// 				obj.CVC_MEE_DT = medicalExempExp;
		// 					if (covidCheckboxSelected) {
		// 					obj.CVC_COMP_DECL = "T";
		// 				}
		// 					else if (!covidCheckboxSelected) {
		// 					obj.CVC_COMP_DECL = "F";
		// 				}
		// 				else {
		// 					obj.CVC_COMP_DECL = "";
		// 				}

		// 				obj.EMP_AUTH_REP = empAuthName;
		// 				obj.EMP_AUTH_RPOS = empAuths;

		// 				if (empSubgroup === "E6") {
		// 					obj.MED_COMP = "";
		// 					obj.MEDDT = null;
		// 					obj.Aodtest = "";
		// 					obj.Risk_level = "";
		// 					obj.Hlthmngplan = "";
		// 					obj.MED_COML_TXT = "";
		// 					obj.LRWCHKBX1 = "T";
		// 					obj.LRWCHKBX2 = "T";
		// 					obj.LRWCHKBX3 = "T";
		// 					obj.LRWCHKBX4 = "T";
		// 				} else {
		// 					obj.MEDDT = DateComp1;
		// 					obj.MED_COMP = medkey;
		// 					obj.Aodtest = AodTest;
		// 					obj.Risk_level = medfitmess;
		// 					obj.Hlthmngplan = healthmanagement;
		// 					obj.MED_COML_TXT = Medicalcomp;
		// 					obj.CHKBX1 = "T";
		// 					obj.CHKBX2 = "T";
		// 					obj.CHKBX3 = "T";
		// 					obj.CHKBX4 = "T";
		// 					obj.CHKBX5 = "T";
		// 					obj.CHKBX6 = "T";
		// 				}
		// 				obj.UserId = this.vUser;
		// 			}
		// 		}
		// 		var oModel = this.getOwnerComponent().getModel();
		// 		this.getView().setBusy(true);
		// 		oModel.create("/CMSRequestSet", obj, {
		// 			success: function (oData, response) {
		// 				that.changeFlag = false;
		// 				ReqID = response.data.Reqid;
		// 				/*
		// 				 * Start of Change 
		// 				 * Changed On - 21.08.2020
		// 				 *Changed By - Karteek
		// 				 * Change Description - Set all the changes flags to false*/
		// 				that.allFlagRestore();
		// 				/* End of Change*/
		// 				that.UploadUpdate();
		// 				that.UploadUpdateForMandtAttachments();
		// 				that.UploadUpdateForCovidAttachments();
		// 				that.getView().setBusy(false);
		// 				var inf = "";
		// 				if (getReqtypeText === "Demobilise") {
		// 					 inf = " Contractor 'Demobilise' Request created successfully - " + ReqID;
		// 				} 
		// 				else if (getReqtypeText === "Extend End Date") {
		// 					 inf = " Contractor 'Extend End Date' Request created successfully - " + ReqID;
		// 				} 
		// 				else if (getReqtypeText === "Change Of Conditions") {
		// 					 inf = " Contractor 'Change Of Conditions' Request created successfully - " + ReqID;
		// 				} else if (getReqtypeText === "Personal Info. Change") {
		// 					 inf = " Contractor 'Personal Info. Change' Request created successfully - " + ReqID;
		// 				} 
		// 					else if (requestType === "06") {
		// 					 inf = "'Covid-19 Vaccination Update' Request created successfully - " + ReqID;
		// 				} 
						
		// 				else {
		// 					 inf = " Contractor Mobilisation Request created successfully - " + ReqID;
		// 				}
		// 				MessageBox.success(inf, {
		// 					actions: MessageBox.Action.OK,
		// 					emphasizedAction: MessageBox.Action.OK,
		// 					onClose: function (sAction) {
		// 						that.handleClear();
		// 						that.onNavigate();
		// 					}
		// 				});
		// 			},
		// 			error: function (OData, response) {
		// 				that.getView().setBusy(false);
		// 				sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
		// 			}
		// 		});
		// 	}
		// },
	
    	onSubmit: function (oEvent) {
			var allvalid;
			var uploadFlag;
			that = this;
			var requestType = this.getView().byId("req_Type").getSelectedKey().trim();
			var requestTypecombo = this.getView().byId("req_Type").getValue().trim();
			var getReqtypeText = this.getView().getModel("initiateModel").getData().TextData;
			var Desccomments = this.getView().byId("req_Desccomments").getValue().trim();
			var title = this.getView().byId("pers_Title").getSelectedKey().trim();
			var titleselect = this.getView().byId("pers_Title").getValue().trim();
			var firstName = this.getView().byId("pers_Fname").getValue().trim();
			var firstNameState = this.getView().byId("pers_Fname").getValueState();
			var middleName = this.getView().byId("pers_Mname").getValue().trim();
			var middleNameState = this.getView().byId("pers_Mname").getValueState();
			var lastName = this.getView().byId("pers_Lname").getValue().trim();
			var lastNameState = this.getView().byId("pers_Lname").getValueState();
			var DOB1 = this.getView().byId("pers_DOB").getValue();
			var uploadCollection = this.getView().byId("UploadCollection").getItems().length;
			var sapNumber1 = this.getView().byId("pers_SAPnum").getValue().trim();
			var sapNumber = this.getView().byId("pers_SAPnum").getValueState();
			var Gender = this.getView().byId("pers_gender").getSelectedKey().trim();
			var Genderselection = this.getView().byId("pers_gender").getValue().trim();
			var prefferedName = this.getView().byId("pers_Prename").getValue().trim();
			var Nationality = this.getView().byId("pers_Nationality").getSelectedKey().trim();
			var NationalitySelect = this.getView().byId("pers_Nationality").getValue().trim();
			var straightIslander = this.getView().byId("pers_islander").getSelectedKey().trim();
			var nativeTitle = this.getView().byId("pers_Native").getSelectedKey().trim();
			var personalMailAddress = this.getView().byId("conmail").getValue().trim();
			var personalMailAddressState = this.getView().byId("conmail").getValueState();
			var mobileNumber = this.getView().byId("conmobile").getValue().trim();
			var Relationship = this.getView().byId("emergency_Rel").getSelectedKey().trim();
			var empRelationship = this.getView().byId("emergency_Rel").getValue().trim();
			var Name = this.getView().byId("emergency_Name").getValue().trim();
			var NameState = this.getView().byId("emergency_Name").getValueState();
			var phoneNumber = this.getView().byId("emergency_Phnumber").getValue().trim();
			var StartDate1 = this.getView().byId("assign_StartDate").getValue();
			var StartDate = this.getView().byId("assign_StartDate").getValue();
			var estimatedEndDate1 = this.getView().byId("assign_EstDate").getValue();
			var covidCheckboxSelected = this.getView().byId("idCovidChkbx").getSelected();
			
			var FirstdoseDate1 = this.getView().byId("CFDD").getValue();
			var Vaccinestatus = this.getView().byId("idvaccinestatus").getValue();
			var Vaccinestatus1 = this.getView().byId("idvaccinestatus").getSelectedKey();
			var SeconddoseDate = this.getView().byId("SeconddoseDate").getValue();
			var consest = this.getView().byId("Consent").getValue();
			var medicalExemptionExpiry = this.getView().byId("medicalExpDate").getValue();
			var fileUploader =  this.getView().byId("fileUploader").getValue();
			var estimatedEndDate = new Date(estimatedEndDate1);
			var estdate = "T00:00:00";
			if (estimatedEndDate === "") {
				estimatedEndDate = null;
			} else {

				var datformate = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				var EsDate = datformate.format(estimatedEndDate);
				var EndDate = EsDate.concat(estdate);
			}
			var travelDate1 = this.getView().byId("assign_TravelDate").getValue();
			var travelDate = this.getView().byId("assign_TravelDate").getValue();
			var Position = this.getView().byId("assign_Pos").getValue().trim();
			var Rolerequirement = this.getView().byId("Mant_subgroup").getSelectedKey().trim();
			var MandatoryRole = this.getView().byId("Mant_subgroup").getValue().trim();
			var LeaderName = this.getView().byId("assign_Leader").getValue();
			var projectType = this.getView().byId("Project").getSelectedKey().trim();
			var ProjectValue = this.getView().byId("Project").getValue();
			var Loaction = this.getView().byId("assign_loc").getValue();
			var empSubgroup = this.getView().byId("Emp_subgroup").getSelectedKey().trim();
			var empsubgroupselection = this.getView().byId("Emp_subgroup").getValue().trim();
			//	var empSubgroup1 = this.getView().byId("Emp_subgroup").getSelectedItem().mProperties.text;
			var workSchedule = this.getView().byId("assign_Worksch").getValue();
			var assignVendor = this.getView().byId("assign_Vendor").getValue();
			var VendorSplit = assignVendor.split(" - ")[0];

			var empAuthName = this.getView().byId("EmpAuth_name").getValue().trim();
			var empAuthNameState = this.getView().byId("EmpAuth_name").getValueState();
			var empAuths = this.getView().byId("EmpAuth_pos").getValue().trim();
			var medkey = this.getView().byId("medicalComp").getSelectedKey().trim();

			var medComp = this.getView().byId("medicalComp").getValue().trim();
			var AodTest = this.getView().byId("AODTEST").getValue().trim();
			var medfitmess = this.getView().byId("medicalfitness").getSelectedKey().trim();
			var healthmanagement = "";

			var health = this.getView().byId("healthmanagement").getValue();
			if (health === "Not Applicable") {
				healthmanagement = "NA";
			} else {
				healthmanagement = health;
			}
			var Medicalcomp;
			if (medComp === "Others (Please Specify)") {
				Medicalcomp = this.getView().byId("idmedinput").getValue();
				var medicalinput = this.getView().byId("idmedinput").getValue().trim();
				if (medicalinput === "") {
					allvalid = true;
					this.getView().byId("idmedinput").setValueState("Error");
					this.getView().byId("idmedinput").setValueStateText("Please Enter Medicals Completed");
					// sap.m.MessageBox.error("Please enter Medicals Completed");
					// return;

				}
			} else {
				Medicalcomp = this.getView().byId("medicalComp").getValue();
			}
			var DateComp1 = this.getView().byId("dateComp").getValue();
			//var DateComp = new Date(DateComp1);

			var chk1 = this.getView().byId("chk1").getSelected();

			var chk2 = this.getView().byId("chk2").getSelected();
			var chk3 = this.getView().byId("chk3").getSelected();
			var chk4 = this.getView().byId("chk4").getSelected();
			var chk5 = this.getView().byId("chk5").getSelected();
			var chk6 = this.getView().byId("chk6").getSelected();
			var chk7 = this.getView().byId("chk7").getSelected();
			var chk8 = this.getView().byId("chk8").getSelected();
			var chk9 = this.getView().byId("chk9").getSelected();
			var chk10 = this.getView().byId("chk10").getSelected();
			var state = this.getView().byId("assign_Pos").getValueState();
			var flag = true;
			if (getReqtypeText === "Demobilise" || getReqtypeText === "Extend End Date") {
				this.getView().byId("req_Type").setValueState("None");
				this.getView().byId("pers_Title").setValueState("None");
				this.getView().byId("pers_Fname").setValueState("None");
				this.getView().byId("pers_Lname").setValueState("None");
				this.getView().byId("pers_DOB").setValueState("None");

				this.getView().byId("pers_gender").setValueState("None");
				this.getView().byId("pers_Nationality").setValueState("None");
				this.getView().byId("conmail").setValueState("None");
				this.getView().byId("emergency_Rel").setValueState("None");
				this.getView().byId("emergency_Name").setValueState("None");
				this.getView().byId("emergency_Phnumber").setValueState("None");
				this.getView().byId("conmobile").setValueState("None");

				// if (StartDate1 === "") {
				// 	allvalid = true;
				// 	this.getView().byId("assign_StartDate").setValueState("Error");
				// }

				if (estimatedEndDate1 === "") {
					allvalid = true;
					this.getView().byId("assign_EstDate").setValueState("Error");

				} else {
					this.getView().byId("assign_EstDate").setValueState("None");
				}
				if (Position === "" || LeaderName === "" || Loaction === "") {
					allvalid = true;
					this.getView().byId("assign_Pos").setValueState("Error");
					this.getView().byId("assign_Leader").setValueState("Error");
					this.getView().byId("assign_loc").setValueState("Error");

				} else {
					this.getView().byId("assign_Pos").setValueState("None");
					this.getView().byId("assign_Leader").setValueState("None");
					this.getView().byId("assign_loc").setValueState("None");
				}
				this.getView().byId("Mant_subgroup").setValueState("None");
				this.getView().byId("Emp_subgroup").setValueState("None");

				this.getView().byId("EmpAuth_name").setValueState("None");

				this.getView().byId("EmpAuth_pos").setValueState("None");

				this.getView().byId("chk1").setValueState("None");

				this.getView().byId("chk2").setValueState("Error");

				this.getView().byId("chk2").setValueState("None");

				this.getView().byId("chk3").setValueState("None");

				this.getView().byId("chk4").setValueState("None");

				this.getView().byId("chk5").setValueState("None");
				this.getView().byId("chk6").setValueState("None");
				if (empRelationship === "" && Name !== "" && phoneNumber === "") {

					this.getView().byId("emergency_Rel").setValueState("None");

					this.getView().byId("emergency_Phnumber").setValueState("None");

				} else if (empRelationship === "" && Name === "" && phoneNumber !== "") {

					this.getView().byId("emergency_Rel").setValueState("None");

					this.getView().byId("emergency_Name").setValueState("None");

				} else if (empRelationship === "" && Name !== "" && phoneNumber !== "") {

					this.getView().byId("emergency_Rel").setValueState("None");

				} else if (empRelationship !== "" && Name === "" && phoneNumber !== "") {

					this.getView().byId("emergency_Name").setValueState("None");

				} else if (empRelationship !== "" && Name !== "" && phoneNumber === "") {

					this.getView().byId("emergency_Phnumber").setValueState("None");

				} else if (empRelationship !== "" && Name === "" && phoneNumber === "") {

					this.getView().byId("emergency_Name").setValueState("None");

					this.getView().byId("emergency_Phnumber").setValueState("None");

				}

			} else if (getReqtypeText === "Personal Info. Change") {

				this.getView().byId("req_Type").setValueState("None");

				if (titleselect === "") {
					allvalid = true;
					this.getView().byId("pers_Title").setValueState("Error");

				} else {
					this.getView().byId("pers_Title").setValueState("None");
				}
				if (firstName === "") {
					allvalid = true;
					this.getView().byId("pers_Fname").setValueState("Error");

				}
				if (firstNameState === "Error") {
					allvalid = true;
					this.getView().byId("pers_Fname").setValueState("Error");
				}
				if (firstName !== "" && firstNameState !== "Error") {
					this.getView().byId("pers_Fname").setValueState("None");
				}
				if (lastName === "") {
					allvalid = true;
					this.getView().byId("pers_Lname").setValueState("Error");

				}
				if (lastNameState === "Error") {
					allvalid = true;
					this.getView().byId("pers_Lname").setValueState("Error");
				}
				if (lastName !== "" && lastNameState !== "Error") {
					this.getView().byId("pers_Lname").setValueState("None");
				}
				if (DOB1 === "") {
					allvalid = true;
					this.getView().byId("pers_DOB").setValueState("Error");

				} else {
					this.getView().byId("pers_DOB").setValueState("None");
				}
				if (Genderselection === "") {
					allvalid = true;
					this.getView().byId("pers_gender").setValueState("Error");

				} else {
					this.getView().byId("pers_gender").setValueState("None");
				}
				if (Genderselection === "") {
					allvalid = true;
					this.getView().byId("pers_gender").setValueState("Error");

				} else {
					this.getView().byId("pers_gender").setValueState("None");
				}
				if (NationalitySelect === "") {
					allvalid = true;
					this.getView().byId("pers_Nationality").setValueState("Error");

				} else {
					this.getView().byId("pers_Nationality").setValueState("None");
				}
				var originalData = this.getOwnerComponent().getModel("tableModel").getData();
				var orgFirstName = originalData.Fname;
				var orgMiddleName = originalData.Mname;
				var orgLastName = originalData.Lname;
				var orgDOB = originalData.Dats;
				var datformat3 = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});

				var datformat4 = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});

				var Dates = orgDOB;
				if (typeof Dates === "string") {
					if (Dates.includes(".")) {

						Dates = datformat3.parse(Dates);

					} else

					if (Dates.includes("-")) {

						Dates = new Date(Dates);

					}
				}
				var dateOfBirth = this.getView().byId("pers_DOB").getValue();
				var datformat5 = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});

				var datformat6 = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});

				var enteredValue = dateOfBirth;
				if (typeof enteredValue === "string") {
					if (enteredValue.includes(".")) {

						enteredValue = datformat5.parse(enteredValue);

					} else

					if (enteredValue.includes("-")) {

						enteredValue = new Date(enteredValue);

					}
				}

				if (orgFirstName !== firstName || orgMiddleName !== middleName || orgLastName !== lastName || Dates.toDateString() !==
					enteredValue.toDateString())

				{
					if (uploadCollection === 0) {
						uploadFlag = true;
					}
				} else {
					uploadFlag = false;
				}
				this.getView().byId("conmail").setValueState("None");
				this.getView().byId("conmobile").setValueState("None");
				this.getView().byId("assign_EstDate").setValueState("None");
				this.getView().byId("assign_Pos").setValueState("None");
				this.getView().byId("assign_Leader").setValueState("None");
				this.getView().byId("assign_loc").setValueState("None");
				this.getView().byId("medicalComp").setValueState("None");
				this.getView().byId("dateComp").setValueState("None");
				if (empRelationship === "" && Name !== "" && phoneNumber === "") {
					allvalid = true;
					this.getView().byId("emergency_Rel").setValueState("Error");

					this.getView().byId("emergency_Phnumber").setValueState("Error");

				} else if (empRelationship === "" && Name === "" && phoneNumber !== "") {
					allvalid = true;
					this.getView().byId("emergency_Rel").setValueState("Error");

					this.getView().byId("emergency_Name").setValueState("Error");

				} else if (empRelationship === "" && Name !== "" && phoneNumber !== "") {
					allvalid = true;
					this.getView().byId("emergency_Rel").setValueState("Error");

				} else if (empRelationship !== "" && Name === "" && phoneNumber !== "") {
					allvalid = true;
					this.getView().byId("emergency_Name").setValueState("Error");

				} else if (empRelationship !== "" && Name !== "" && phoneNumber === "") {
					allvalid = true;
					this.getView().byId("emergency_Phnumber").setValueState("Error");

				} else if (empRelationship !== "" && Name === "" && phoneNumber === "") {
					allvalid = true;
					this.getView().byId("emergency_Name").setValueState("Error");

					this.getView().byId("emergency_Phnumber").setValueState("Error");

				}
				if (personalMailAddress === "") {
					allvalid = true;
					this.getView().byId("conmail").setValueState("Error");

				}
				if (personalMailAddressState === "Error") {
					allvalid = true;
					this.getView().byId("conmail").setValueState("Error");
				}
				if (personalMailAddress !== "" && personalMailAddressState !== "Error") {
					this.getView().byId("conmail").setValueState("None");
				}
				if (mobileNumber === "") {
					allvalid = true;
					this.getView().byId("conmobile").setValueState("Error");

				} else {
					this.getView().byId("conmobile").setValueState("None");
				}
			} 
			else if (getReqtypeText === "Change Of Conditions" ) {
				this.getView().byId("req_Type").setValueState("None");

				this.getView().byId("pers_Title").setValueState("None");

				this.getView().byId("pers_Fname").setValueState("None");

				this.getView().byId("pers_Lname").setValueState("None");
				this.getView().byId("pers_DOB").setValueState("None");
				this.getView().byId("pers_gender").setValueState("None");
				this.getView().byId("pers_gender").setValueState("None");
				this.getView().byId("pers_Nationality").setValueState("Error");

				if (empAuthName === "") {
					allvalid = true;
					this.getView().byId("EmpAuth_name").setValueState("Error");

				}
				if (empAuthNameState === "Error") {
					allvalid = true;
					this.getView().byId("EmpAuth_name").setValueState("Error");
				}
				if (empAuthName !== "" && empAuthNameState !== "Error") {
					this.getView().byId("EmpAuth_name").setValueState("None");
				}
				if (empAuths === "") {
					allvalid = true;
					this.getView().byId("EmpAuth_pos").setValueState("Error");

				} else {
					this.getView().byId("EmpAuth_pos").setValueState("None");
				}
				if (empSubgroup === "E6") {

					this.getView().byId("medicalComp").setValueState("None");

					this.getView().byId("dateComp").setValueState("None");

					this.getView().byId("AODTEST").setValueState("None");

					this.getView().byId("medicalfitness").setValueState("None");

					//	this.getView().byId("healthmanagement").setValueState("Error");

					this.getView().byId("healthmanagement").setValueState("None");

					if (chk7 === false) {
						allvalid = true;
						this.getView().byId("chk7").setValueState("Error");

					} else {
						this.getView().byId("chk7").setValueState("None");
					}
					if (chk8 === false) {
						allvalid = true;
						this.getView().byId("chk8").setValueState("Error");

					} else {
						this.getView().byId("chk8").setValueState("None");
					}
					if (chk9 === false) {
						allvalid = true;
						this.getView().byId("chk9").setValueState("Error");

					} else {
						this.getView().byId("chk9").setValueState("None");
					}
					if (chk10 === false) {
						allvalid = true;
						this.getView().byId("chk10").setValueState("Error");

					} else {
						this.getView().byId("chk10").setValueState("None");
					}
				} else {
					if (medComp === "") {
						allvalid = true;
						this.getView().byId("medicalComp").setValueState("Error");

					} else {
						this.getView().byId("medicalComp").setValueState("None");
					}
					if (DateComp1 === "") {
						allvalid = true;
						this.getView().byId("dateComp").setValueState("Error");

					} else {
						this.getView().byId("dateComp").setValueState("None");
					}
					if (AodTest === "") {
						allvalid = true;
						this.getView().byId("AODTEST").setValueState("Error");
					} else {
						this.getView().byId("AODTEST").setValueState("None");
					}
					if (medfitmess === "") {
						allvalid = true;
						this.getView().byId("medicalfitness").setValueState("Error");
					} else {
						this.getView().byId("medicalfitness").setValueState("None");
					}
					if (healthmanagement === "") {
						allvalid = true;
						this.getView().byId("healthmanagement").setValueState("Error");
					} else {
						this.getView().byId("healthmanagement").setValueState("None");
					}
					if (chk1 === false) {
						allvalid = true;
						this.getView().byId("chk1").setValueState("Error");

					} else {
						this.getView().byId("chk1").setValueState("None");
					}
					if (chk2 === false) {
						allvalid = true;
						this.getView().byId("chk2").setValueState("Error");

					} else {
						this.getView().byId("chk2").setValueState("None");
					}
					if (chk3 === false) {
						allvalid = true;
						this.getView().byId("chk3").setValueState("Error");

					} else {
						this.getView().byId("chk3").setValueState("None");
					}
					if (chk4 === false) {
						allvalid = true;
						this.getView().byId("chk4").setValueState("Error");

					} else {
						this.getView().byId("chk4").setValueState("None");
					}
					if (chk5 === false) {
						allvalid = true;
						this.getView().byId("chk5").setValueState("Error");

					} else {
						this.getView().byId("chk5").setValueState("None");
					}
					if (chk6 === false) {
						allvalid = true;
						this.getView().byId("chk6").setValueState("Error");

					} else {
						this.getView().byId("chk6").setValueState("None");
					}
				}

				this.getView().byId("conmail").setValueState("None");

				this.getView().byId("conmobile").setValueState("None");
				if (travelDate1 === "") {
					allvalid = true;
					this.getView().byId("assign_TravelDate").setValueState("Error");
				}
				if (estimatedEndDate1 === "") {
					allvalid = true;
					this.getView().byId("assign_EstDate").setValueState("Error");

				} else {
					this.getView().byId("assign_EstDate").setValueState("None");
				}
				if (Position === "" || LeaderName === "" || Loaction === "") {
					allvalid = true;
					this.getView().byId("assign_Pos").setValueState("Error");
					this.getView().byId("assign_Leader").setValueState("Error");
					this.getView().byId("assign_loc").setValueState("Error");

				} else {
					this.getView().byId("assign_Pos").setValueState("None");
					this.getView().byId("assign_Leader").setValueState("None");
					this.getView().byId("assign_loc").setValueState("None");
				}
				if (MandatoryRole === "") {
					allvalid = true;
					this.getView().byId("Mant_subgroup").setValueState("Error");
				} else {
					this.getView().byId("Mant_subgroup").setValueState("None");
				}
				if (ProjectValue === "") {
					allvalid = true;
					this.getView().byId("Project").setValueState("Error");
				} else {
					this.getView().byId("Project").setValueState("None");
				}

				if (empsubgroupselection === "") {
					allvalid = true;
					this.getView().byId("Emp_subgroup").setValueState("Error");

				} else {
					this.getView().byId("Emp_subgroup").setValueState("None");
				}
				if (empAuthName === "") {
					allvalid = true;
					this.getView().byId("EmpAuth_name").setValueState("Error");

				}
				if (empAuthNameState === "Error") {
					allvalid = true;
					this.getView().byId("EmpAuth_name").setValueState("Error");

				}
				if (empAuthName !== "" && empAuthNameState !== "Error") {
					this.getView().byId("EmpAuth_name").setValueState("None");
				}

				if (empAuths === "") {
					allvalid = true;
					this.getView().byId("EmpAuth_pos").setValueState("Error");

				} else {
					this.getView().byId("EmpAuth_pos").setValueState("None");
				}
				
					if (!covidCheckboxSelected) {
					if (FirstdoseDate1 === "") {
					this.getView().byId("CFDD").setValueState("Error");
					allvalid = true;
					}
					else {
							this.getView().byId("CFDD").setValueState("None");
					}
					
				
				if (Vaccinestatus === "") {
					this.getView().byId("idvaccinestatus").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("idvaccinestatus").setValueState("None");
				}
					if (SeconddoseDate === "" && Vaccinestatus1 !== "UV") {
					this.getView().byId("SeconddoseDate").setValueState("Error");
					allvalid = true;
				} 
				else {
					this.getView().byId("SeconddoseDate").setValueState("None");
				}
				if (consest === "") {
					this.getView().byId("Consent").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("Consent").setValueState("None");
				}
				
				
				if (fileUploader === "" && Vaccinestatus1 !== "UV") {
					this.getView().byId("fileUploader").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("fileUploader").setValueState("None");
				}
				// if (medicalExemptionExpiry === "") {
				// 	this.getView().byId("medicalExpDate").setValueState("Error");
				// 	allvalid = true;
				// }
				// else {
				// 	this.getView().byId("medicalExpDate").setValueState("None");
				// }
				
					
			}	
			
			else {
					this.getView().byId("CFDD").setValueState("None");
				this.getView().byId("idvaccinestatus").setValueState("None");
				this.getView().byId("Consent").setValueState("None");
					this.getView().byId("SeconddoseDate").setValueState("None");
				this.getView().byId("fileUploader").setValueState("None");
				this.getView().byId("medicalExpDate").setValueState("None");
					
				}

				//	this.getView().byId("medicalComp").setValueState("None");
				//	this.getView().byId("dateComp").setValueState("None");
			} 
			
			else if (requestType === "06") {
					if (!covidCheckboxSelected) {
					if (FirstdoseDate1 === "") {
					this.getView().byId("CFDD").setValueState("Error");
					allvalid = true;
					}
					else {
							this.getView().byId("CFDD").setValueState("None");
					}
					
				
				if (Vaccinestatus === "") {
					this.getView().byId("idvaccinestatus").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("idvaccinestatus").setValueState("None");
				}
				
				if (SeconddoseDate === ""  && Vaccinestatus1 !== "UV") {
					this.getView().byId("SeconddoseDate").setValueState("Error");
					allvalid = true;
				} 
				else {
					this.getView().byId("SeconddoseDate").setValueState("None");
				}
               
				
				
				if (consest === "") {
					this.getView().byId("Consent").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("Consent").setValueState("None");
				}
				if (fileUploader === "" && Vaccinestatus1 !== "UV") {
					this.getView().byId("fileUploader").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("fileUploader").setValueState("None");
				}
				// if (medicalExemptionExpiry === "") {
				// 	this.getView().byId("medicalExpDate").setValueState("Error");
				// 	allvalid = true;
				// }
				// else {
				// 	this.getView().byId("medicalExpDate").setValueState("None");
				// }
					
			}	
			
			else {
					this.getView().byId("CFDD").setValueState("None");
				this.getView().byId("idvaccinestatus").setValueState("None");
					this.getView().byId("SeconddoseDate").setValueState("None");
				this.getView().byId("Consent").setValueState("None");
				this.getView().byId("fileUploader").setValueState("None");
				this.getView().byId("medicalExpDate").setValueState("None");
					
				}
			}
			
			
			
			
			
			
			
			
			
			else {

				if (empSubgroup === "E6") {

					this.getView().byId("medicalComp").setValueState("None");

					this.getView().byId("dateComp").setValueState("None");

					this.getView().byId("AODTEST").setValueState("None");

					this.getView().byId("medicalfitness").setValueState("None");

					//	this.getView().byId("healthmanagement").setValueState("Error");

					this.getView().byId("healthmanagement").setValueState("None");

					if (chk7 === false) {
						allvalid = true;
						this.getView().byId("chk7").setValueState("Error");

					} else {
						this.getView().byId("chk7").setValueState("None");
					}
					if (chk8 === false) {
						allvalid = true;
						this.getView().byId("chk8").setValueState("Error");

					} else {
						this.getView().byId("chk8").setValueState("None");
					}
					if (chk9 === false) {
						allvalid = true;
						this.getView().byId("chk9").setValueState("Error");

					} else {
						this.getView().byId("chk9").setValueState("None");
					}
					if (chk10 === false) {
						allvalid = true;
						this.getView().byId("chk10").setValueState("Error");

					} else {
						this.getView().byId("chk10").setValueState("None");
					}
				} else {
					if (medComp === "") {
						allvalid = true;
						this.getView().byId("medicalComp").setValueState("Error");

					} else {
						this.getView().byId("medicalComp").setValueState("None");
					}
					if (DateComp1 === "") {
						allvalid = true;
						this.getView().byId("dateComp").setValueState("Error");

					} else {
						this.getView().byId("dateComp").setValueState("None");
					}
					if (AodTest === "") {
						allvalid = true;
						this.getView().byId("AODTEST").setValueState("Error");
					} else {
						this.getView().byId("AODTEST").setValueState("None");
					}
					if (medfitmess === "") {
						allvalid = true;
						this.getView().byId("medicalfitness").setValueState("Error");
					} else {
						this.getView().byId("medicalfitness").setValueState("None");
					}
					if (healthmanagement === "") {
						allvalid = true;
						this.getView().byId("healthmanagement").setValueState("Error");
					} else {
						this.getView().byId("healthmanagement").setValueState("None");
					}
					if (chk1 === false) {
						allvalid = true;
						this.getView().byId("chk1").setValueState("Error");

					} else {
						this.getView().byId("chk1").setValueState("None");
					}
					if (chk2 === false) {
						allvalid = true;
						this.getView().byId("chk2").setValueState("Error");

					} else {
						this.getView().byId("chk2").setValueState("None");
					}
					if (chk3 === false) {
						allvalid = true;
						this.getView().byId("chk3").setValueState("Error");

					} else {
						this.getView().byId("chk3").setValueState("None");
					}
					if (chk4 === false) {
						allvalid = true;
						this.getView().byId("chk4").setValueState("Error");

					} else {
						this.getView().byId("chk4").setValueState("None");
					}
					if (chk5 === false) {
						allvalid = true;
						this.getView().byId("chk5").setValueState("Error");

					} else {
						this.getView().byId("chk5").setValueState("None");
					}
					if (chk6 === false) {
						allvalid = true;
						this.getView().byId("chk6").setValueState("Error");

					} else {
						this.getView().byId("chk6").setValueState("None");
					}
				}

				if (requestTypecombo === "") {
					allvalid = true;
					this.getView().byId("req_Type").setValueState("Error");

				} else {
					this.getView().byId("req_Type").setValueState("None");
				}
				if (titleselect === "") {
					allvalid = true;
					this.getView().byId("pers_Title").setValueState("Error");

				} else {
					this.getView().byId("pers_Title").setValueState("None");
				}
				// if (uploadCollection === 0) {
				// 	uploadFlag = true;
				// } else {
				// 	uploadFlag = false;
				// }
				if (firstName === "") {
					allvalid = true;
					this.getView().byId("pers_Fname").setValueState("Error");

				}
				if (firstNameState === "Error") {
					allvalid = true;
				}
				if (firstName !== "" && firstNameState !== "Error") {
					this.getView().byId("pers_Fname").setValueState("None");
				}

				if (lastName === "") {
					allvalid = true;
					this.getView().byId("pers_Lname").setValueState("Error");

				}
				if (lastNameState === "Error") {
					allvalid = true;
				}
				if (lastName !== "" && lastNameState !== "Error") {
					this.getView().byId("pers_Lname").setValueState("None");
				}

				if (DOB1 === "") {
					allvalid = true;
					this.getView().byId("pers_DOB").setValueState("Error");

				} else {
					this.getView().byId("pers_DOB").setValueState("None");
				}
				if (Genderselection === "") {
					allvalid = true;
					this.getView().byId("pers_gender").setValueState("Error");

				} else {
					this.getView().byId("pers_gender").setValueState("None");
				}
				if (Genderselection === "") {
					allvalid = true;
					this.getView().byId("pers_gender").setValueState("Error");

				} else {
					this.getView().byId("pers_gender").setValueState("None");
				}
				if (NationalitySelect === "") {
					allvalid = true;
					this.getView().byId("pers_Nationality").setValueState("Error");

				} else {
					this.getView().byId("pers_Nationality").setValueState("None");
				}
				if (personalMailAddress === "") {
					allvalid = true;
					this.getView().byId("conmail").setValueState("Error");

				}
				if (personalMailAddressState === "Error") {
					allvalid = true;
					this.getView().byId("conmail").setValueState("Error");
				}
				if (personalMailAddress !== "" && personalMailAddressState !== "Error") {
					this.getView().byId("conmail").setValueState("None");
				}

				if (mobileNumber === "") {
					allvalid = true;
					this.getView().byId("conmobile").setValueState("Error");

				} else {
					this.getView().byId("conmobile").setValueState("None");
				}
				if (travelDate1 === "") {
					allvalid = true;
					this.getView().byId("assign_TravelDate").setValueState("Error");
				}
				if (estimatedEndDate1 === "") {
					allvalid = true;
					this.getView().byId("assign_EstDate").setValueState("Error");

				} else {
					this.getView().byId("assign_EstDate").setValueState("None");
				}
				if (Position === "" || LeaderName === "" || Loaction === "") {
					allvalid = true;
					this.getView().byId("assign_Pos").setValueState("Error");
					this.getView().byId("assign_Leader").setValueState("Error");
					this.getView().byId("assign_loc").setValueState("Error");

				} else {
					this.getView().byId("assign_Pos").setValueState("None");
					this.getView().byId("assign_Leader").setValueState("None");
					this.getView().byId("assign_loc").setValueState("None");
				}
				if (MandatoryRole === "") {
					allvalid = true;
					this.getView().byId("Mant_subgroup").setValueState("Error");
				} else {
					this.getView().byId("Mant_subgroup").setValueState("None");
				}
				if (ProjectValue === "") {
					allvalid = true;
					this.getView().byId("Project").setValueState("Error");
				} else {
					this.getView().byId("Project").setValueState("None");
				}

				if (empsubgroupselection === "") {
					allvalid = true;
					this.getView().byId("Emp_subgroup").setValueState("Error");

				} else {
					this.getView().byId("Emp_subgroup").setValueState("None");
				}
				if (empAuthName === "") {
					allvalid = true;
					this.getView().byId("EmpAuth_name").setValueState("Error");

				}
				if (empAuthNameState === "Error") {
					allvalid = true;
				}
				if (empAuthName !== "" && empAuthNameState !== "Error") {
					this.getView().byId("EmpAuth_name").setValueState("None");
				}
				if (empAuths === "") {
					allvalid = true;
					this.getView().byId("EmpAuth_pos").setValueState("Error");

				} else {
					this.getView().byId("EmpAuth_pos").setValueState("None");
				}

				// if (empSubgroup === "E6") {
				// 	if (chk1 === false) {
				// 		allvalid = true;
				// 		this.getView().byId("chk1").setValueState("Error");

				// 	} else {
				// 		this.getView().byId("chk1").setValueState("None");
				// 	}
				// 	if (chk2 === false) {
				// 		allvalid = true;
				// 		this.getView().byId("chk2").setValueState("Error");

				// 	} else {
				// 		this.getView().byId("chk2").setValueState("None");
				// 	}
				// 	if (chk3 === false) {
				// 		allvalid = true;
				// 		this.getView().byId("chk3").setValueState("Error");

				// 	} else {
				// 		this.getView().byId("chk3").setValueState("None");
				// 	}
				// 	if (chk4 === false) {
				// 		allvalid = true;
				// 		this.getView().byId("chk4").setValueState("Error");

				// 	} else {
				// 		this.getView().byId("chk4").setValueState("None");
				// 	}
				// } else {

				// }
				if (empRelationship === "" && Name !== "" && phoneNumber === "") {
					allvalid = true;
					this.getView().byId("emergency_Rel").setValueState("Error");

					this.getView().byId("emergency_Phnumber").setValueState("Error");

				} else if (empRelationship === "" && Name === "" && phoneNumber !== "") {
					allvalid = true;
					this.getView().byId("emergency_Rel").setValueState("Error");

					this.getView().byId("emergency_Name").setValueState("Error");

				} else if (empRelationship === "" && Name !== "" && phoneNumber !== "") {
					allvalid = true;
					this.getView().byId("emergency_Rel").setValueState("Error");

				} else if (empRelationship !== "" && Name === "" && phoneNumber !== "") {
					allvalid = true;
					this.getView().byId("emergency_Name").setValueState("Error");

				} else if (empRelationship !== "" && Name !== "" && phoneNumber === "") {
					allvalid = true;
					this.getView().byId("emergency_Phnumber").setValueState("Error");

				} else if (empRelationship !== "" && Name === "" && phoneNumber === "") {
					allvalid = true;
					this.getView().byId("emergency_Name").setValueState("Error");

					this.getView().byId("emergency_Phnumber").setValueState("Error");

				}
					if (!covidCheckboxSelected) {
					if (FirstdoseDate1 === "") {
					this.getView().byId("CFDD").setValueState("Error");
					allvalid = true;
					}
					else {
							this.getView().byId("CFDD").setValueState("None");
					}
					
				
				if (Vaccinestatus === "") {
					this.getView().byId("idvaccinestatus").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("idvaccinestatus").setValueState("None");
				}
					if (SeconddoseDate === "" && Vaccinestatus1 !== "UV") {
					this.getView().byId("SeconddoseDate").setValueState("Error");
					allvalid = true;
				} 
				else {
					this.getView().byId("SeconddoseDate").setValueState("None");
				}
				if (consest === "") {
					this.getView().byId("Consent").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("Consent").setValueState("None");
				}
				if (fileUploader === "" && Vaccinestatus1 !== "UV") {
					this.getView().byId("fileUploader").setValueState("Error");
					allvalid = true;
				}
				else {
					this.getView().byId("fileUploader").setValueState("None");
				}
				// if (medicalExemptionExpiry === "") {
				// 	this.getView().byId("medicalExpDate").setValueState("Error");
				// 	allvalid = true;
				// }
				// else {
				// 	this.getView().byId("medicalExpDate").setValueState("None");
				// }
					
			}	
			
			else {
					this.getView().byId("CFDD").setValueState("None");
				this.getView().byId("idvaccinestatus").setValueState("None");
					this.getView().byId("SeconddoseDate").setValueState("None");
				this.getView().byId("Consent").setValueState("None");
				this.getView().byId("fileUploader").setValueState("None");
				this.getView().byId("medicalExpDate").setValueState("None");
					
				}
			
			
			}
			if (allvalid === true) {
				sap.m.MessageBox.error("Please fill in all required fields");
				return;
			} else if (uploadFlag === true) {
				sap.m.MessageBox.error("Please upload an attachment to verify Identity");
				return;
			}
			if (getReqtypeText === "Change Of Conditions" || requestTypecombo === "Onboard" || requestTypecombo === "New Hire") {
				var FileUploaders = oEvent.getSource().getCustomData();
				for (var i = 0; i < FileUploaders.length; i++) {
					var Fileuploader = oEvent.getSource().getCustomData()[i].getValue().getValue();
					if (Fileuploader === "") {
						var Fileup = true;
						oEvent.getSource().getCustomData()[i].getValue().setValueState("Error");

					}
				}

				if (Fileup) {
					sap.m.MessageBox.error("Please Upload Mandatory Documents");
					return;
				} else {
					Fileup = false;
				}
				var key = this.getView().byId("Mant_subgroup").getSelectedKey();
				if (key !== "NA"  && (requestTypecombo === "Onboard" || requestTypecombo === "New Hire")) {
					if (!CheckBox.getSelected()) {
						if (FileUploader01.getValue() === "") {
							sap.m.MessageBox.error("Please upload an Attachment to verify Proof of Identity");
							FileUploader01.setValueState("Error");
							return;
						}
					}
				}
				if (key === "NA" && (requestTypecombo === "Onboard" || requestTypecombo === "New Hire")) {
					if (FileUploader01.getValue() === "") {
						sap.m.MessageBox.error("Please upload an Attachment to verify Proof of Identity");
						FileUploader01.setValueState("Error");
						return;
					}
				}
			}
			var datecom = "T00:00:00";
			if (DateComp1.substring(2, 3) === ".") {
				DateComp1 = DateComp1.split(".")[2] + "-" + DateComp1.split(".")[1] + "-" + DateComp1.split(".")[0];
				DateComp1 = DateComp1.concat(datecom);
			} else {
				DateComp1 = DateComp1.concat(datecom);
			}

			var Dtdate = "T00:00:00";
			if (DOB1.substring(2, 3) === ".") {
				DOB1 = DOB1.split(".")[2] + "-" + DOB1.split(".")[1] + "-" + DOB1.split(".")[0];
				DOB1 = DOB1.concat(Dtdate);
			} else {
				DOB1 = DOB1.concat(Dtdate);
			}
			if (flag) {
				that = this;
				var obj = {};
				if (getReqtypeText === "Demobilise" || getReqtypeText === "Extend End Date") {
					var susposition = sap.ui.getCore().getModel("SusposModel").getData();
					var StartDate_Payload = this.getView().byId("assign_StartDate").getValue();
					var stdate = "T00:00:00";
					if (StartDate_Payload.substring(2, 3) === ".") {
						StartDate_Payload = StartDate_Payload.split(".")[2] + "-" + StartDate_Payload.split(".")[1] + "-" + StartDate_Payload.split(".")[
							0];
						StartDate_Payload = StartDate_Payload.concat(stdate);
					} else {
						StartDate_Payload = StartDate_Payload.concat(stdate);
					}
					var SupPosText = susposition.SupPos;
					obj.Reqid = "";
					obj.ABORTS_TEXT = "";
					obj.ERELATION_TEXT = "";
					obj.ESUBGRP_TEXT = "";
					obj.GENDER_TEXT = "";
					obj.NATIO_TEXT = "";
					obj.NTITLE_TEXT = "";
					obj.REQ_TYPE_TEXT = "";
					obj.TITLE_TEXT = "";
					obj.CVC_STATUS= "";
					obj.Vendor = VendorSplit;
					obj.ReqType = requestType;
					obj.Comments = Desccomments;
					obj.VendLText = Desccomments;
					obj.Title = title;

					obj.Fname = firstName;
					obj.Mname = middleName;
					obj.Lname = lastName;
					obj.Dats = DOB1;
					obj.Pernr = this.Pernr;
					obj.Personid_ext = sapNumber1;
					obj.Gender = Gender;

					obj.Prname = prefferedName;
					obj.Natio = Nationality;

					obj.Aborts = straightIslander;

					obj.Ntitle = nativeTitle;

					obj.Email = personalMailAddress;
					obj.Mobile = mobileNumber;
					obj.Erelation = Relationship;

					obj.Ename = Name;
					obj.Ephone = phoneNumber;
					obj.Begda = StartDate_Payload;
					obj.Endda = EndDate;
					obj.OrgPosid = Position;
					//obj.Jobid = Rolerequirement;
					//obj.Prjct_type = projectType;
					obj.Leader = this.leader;
					obj.LeaderName = LeaderName;
					//	obj.SupPosText = "";
					obj.Location = Loaction;
					obj.Esubgrp = empSubgroup;

					obj.Worksch = workSchedule;
					obj.SupPosText = SupPosText;
					obj.SupPosStxt = this.suspose;
					obj.Loc_id = this.loc_id;
					obj.Erdat = null;
					//obj.CrUnam = "";
					obj.CrUnam = this.vUser;
					// obj.Note = Note;
					obj.UpdUnam = "";
					obj.Cpudt = null;
					obj.Note = "";
					obj.Status = "NEW";
					obj.UserId = this.vUser;
					var reqSubtypeFlag;
					if (requestTypecombo === "Demobilise") {
						reqSubtypeFlag = "";
					}
					if (requestTypecombo === "Extend End Date") {
						reqSubtypeFlag = "ED";
					}
					obj.Req_Subtype = reqSubtypeFlag;

				} 
				else if (getReqtypeText === "Personal Info. Change") {
					obj.Reqid = "";
					obj.ABORTS_TEXT = "";
					obj.ERELATION_TEXT = "";
					obj.ESUBGRP_TEXT = "";
					obj.GENDER_TEXT = "";
					obj.NATIO_TEXT = "";
					obj.NTITLE_TEXT = "";
					obj.REQ_TYPE_TEXT = "";
					obj.TITLE_TEXT = "";
					obj.CVC_STATUS= "";
					obj.Vendor = VendorSplit;
					obj.ReqType = requestType;
					obj.Comments = Desccomments;
					obj.VendLText = Desccomments;
					obj.Title = title;

					obj.Fname = firstName;
					obj.Mname = middleName;
					obj.Lname = lastName;
					obj.Dats = DOB1;
					obj.Pernr = this.Pernr;
					obj.Personid_ext = sapNumber1;
					obj.Gender = Gender;

					obj.Prname = prefferedName;
					obj.Natio = Nationality;

					obj.Aborts = this.getView().byId("pers_islander").getSelectedKey();

					obj.Ntitle = nativeTitle;
					obj.Email = personalMailAddress;
					obj.Mobile = mobileNumber;
					obj.Erelation = Relationship;

					obj.Ename = Name;
					obj.Ephone = phoneNumber;
					//	obj.SupPosText = SupPosText;
					//	obj.SupPosStxt = this.suspose;
					//	obj.Loc_id = this.loc_id;
					obj.EMP_AUTH_REP = "";
					obj.EMP_AUTH_RPOS = "";
					obj.CrUnam = this.vUser;
					//	obj.MED_COMP = medkey;
					//	obj.MED_COML_TXT = Medicalcomp;
					//	obj.MEDDT = decDate;
					// obj.CHKBX1 = "T";
					// obj.CHKBX2 = "T";
					// obj.CHKBX3 = "T";
					// obj.CHKBX4 = "T";
					// obj.CHKBX5 = "T";
					obj.Status = "NEW";
					obj.Req_Subtype = "NC";
					obj.UserId = this.vUser;
				} 
				else if (getReqtypeText === "Change Of Conditions") {
					var susposition = sap.ui.getCore().getModel("SusposModel").getData();
					var SupPosText = susposition.SupPos;
					var COCDate = "T00:00:00";
					var travelDateCOC = this.getView().byId("assign_TravelDate").getValue();
					if (travelDateCOC.substring(2, 3) === ".") {
						travelDateCOC = travelDateCOC.split(".")[2] + "-" + travelDateCOC.split(".")[1] + "-" + travelDateCOC.split(".")[0];
						travelDateCOC = travelDateCOC.concat(COCDate);
					} else {
						travelDateCOC = travelDateCOC.concat(COCDate);
					}

					var effectDate = "T00:00:00";

					var effectDate1 = this.getView().byId("CFDD").getValue();
					if (effectDate1.substring(2, 3) === ".") {
						effectDate1 = effectDate1.split(".")[2] + "-" + effectDate1.split(".")[1] + "-" + effectDate1.split(".")[0];
						effectDate1 = effectDate1.concat(effectDate);
					}
					if (effectDate1.includes("-") && !effectDate1.includes("T00:00:00")) {
						effectDate1 = effectDate1.concat(effectDate);
					}
					if (effectDate1 === "") {
						effectDate1 = null;
					}

					var SecondDose = "T00:00:00";

					var SecondDosage = this.getView().byId("SeconddoseDate").getValue();
					if (SecondDosage.substring(2, 3) === ".") {
						SecondDosage = SecondDosage.split(".")[2] + "-" + SecondDosage.split(".")[1] + "-" + SecondDosage.split(".")[0];
						SecondDosage = SecondDosage.concat(SecondDose);
					}
				if (SecondDosage.includes("-") && !SecondDosage.includes("T00:00:00")) {
						SecondDosage = SecondDosage.concat(SecondDose);
					}
					if (SecondDosage === "") {
						SecondDosage = null;
					}
					var medicalExp = "T00:00:00";

					var medicalExempExp = this.getView().byId("medicalExpDate").getValue();
					if (medicalExempExp.substring(2, 3) === ".") {
						medicalExempExp = medicalExempExp.split(".")[2] + "-" + medicalExempExp.split(".")[1] + "-" + medicalExempExp.split(".")[0];
						medicalExempExp = medicalExempExp.concat(medicalExp);
					}
				if (medicalExempExp.includes("-") && !medicalExempExp.includes("T00:00:00")) {
						medicalExempExp = medicalExempExp.concat(medicalExp);
					}
					if (medicalExempExp === "") {
						medicalExempExp = null;
					}

					if (SupPosText === undefined || SupPosText !== undefined) {
						obj.Reqid = "";
						obj.ABORTS_TEXT = "";
						obj.ERELATION_TEXT = "";
						obj.ESUBGRP_TEXT = "";
						obj.GENDER_TEXT = "";
						obj.NATIO_TEXT = "";
						obj.NTITLE_TEXT = "";
						obj.REQ_TYPE_TEXT = "";
						obj.TITLE_TEXT = "";
						obj.CVC_STATUS= "";
						obj.Vendor = VendorSplit;
						obj.ReqType = requestType;
						obj.Comments = Desccomments;
						obj.VendLText = Desccomments;
						obj.Title = title;

						obj.Fname = firstName;
						obj.Mname = middleName;
						obj.Lname = lastName;
						obj.Dats = DOB1;
						//obj.Pernr = this.Pernr;
						var pernr;
						if (this.Pernr !== "") {
							pernr = this.Pernr;
						} else {
							pernr = "";
						}
						obj.Pernr = pernr;
						obj.Personid_ext = sapNumber1;
						obj.Gender = Gender;

						obj.Prname = prefferedName;
						obj.Natio = Nationality;

						obj.Aborts = straightIslander;

						obj.Ntitle = nativeTitle;

						obj.Email = personalMailAddress;
						obj.Mobile = mobileNumber;
						obj.Erelation = Relationship;

						obj.Ename = Name;
						obj.Ephone = phoneNumber;
						//obj.Begda = StartDate;
						obj.Begda = travelDateCOC;
						obj.Endda = EndDate;
						obj.OrgPosid = Position;
						obj.Jobid = Rolerequirement;
						obj.Prjct_type = projectType;
						obj.Leader = this.leader;
						obj.LeaderName = LeaderName;
						//	obj.SupPosText = "";
						obj.Location = Loaction;
						obj.Esubgrp = empSubgroup;
						obj.Worksch = workSchedule;
						obj.SupPosText = SupPosText;
						obj.SupPosStxt = this.suspose;
						obj.Loc_id = this.loc_id;
						obj.Erdat = null;
						obj.CrUnam = this.vUser;
						// obj.Note = Note;
						obj.UpdUnam = "";
						obj.Cpudt = null;
						obj.Note = "";
						obj.Status = "NEW";

						obj.EMP_AUTH_REP = empAuthName;
						obj.EMP_AUTH_RPOS = empAuths;
						obj.UserId = this.vUser;
						obj.CVC_EFF_DATE = effectDate1;
						obj.CVC_STATUS_COD = Vaccinestatus1;
						obj.CVC_2DS_DT = SecondDosage;
						obj.CVC_DECL = consest;
						obj.CVC_MEE_DT = medicalExempExp;
						if (covidCheckboxSelected) {
							obj.CVC_COMP_DECL = "T";
						}
							else if (!covidCheckboxSelected) {
							obj.CVC_COMP_DECL = "F";
						}
						else {
							obj.CVC_COMP_DECL = "";
						}
						
						
						
						if (empSubgroup === "E6") {
							obj.MED_COMP = "";
							obj.MEDDT = null;
							obj.Aodtest = "";
							obj.Risk_level = "";
							obj.Hlthmngplan = "";
							obj.MED_COML_TXT = "";
							obj.LRWCHKBX1 = "T";
							obj.LRWCHKBX2 = "T";
							obj.LRWCHKBX3 = "T";
							obj.LRWCHKBX4 = "T";
						} else {
							//obj.MEDDT = null;
							// obj.MED_COMP = "";
							// obj.Aodtest = "";
							// obj.Risk_level = "";
							// obj.Hlthmngplan = "";
							// obj.MED_COML_TXT = "";
							obj.MEDDT = DateComp1;
							obj.MED_COMP = medkey;
							obj.Aodtest = AodTest;
							obj.Risk_level = medfitmess;
							obj.Hlthmngplan = healthmanagement;
							obj.MED_COML_TXT = Medicalcomp;
							obj.CHKBX1 = "T";
							obj.CHKBX2 = "T";
							obj.CHKBX3 = "T";
							obj.CHKBX4 = "T";
							obj.CHKBX5 = "T";
							obj.CHKBX6 = "T";
						}

					}
				}
				else if (requestType === "06") {
						var effectDate = "T00:00:00";

					var effectDate1 = this.getView().byId("CFDD").getValue();
					if (effectDate1.substring(2, 3) === ".") {
						effectDate1 = effectDate1.split(".")[2] + "-" + effectDate1.split(".")[1] + "-" + effectDate1.split(".")[0];
						effectDate1 = effectDate1.concat(effectDate);
					}
				if (effectDate1.includes("-") && !effectDate1.includes("T00:00:00")) {
						effectDate1 = effectDate1.concat(effectDate);
					}
					if (effectDate1 === "") {
						effectDate1 = null;
					}
					var SecondDose = "T00:00:00";

					var SecondDosage = this.getView().byId("SeconddoseDate").getValue();
					if (SecondDosage.substring(2, 3) === ".") {
						SecondDosage = SecondDosage.split(".")[2] + "-" + SecondDosage.split(".")[1] + "-" + SecondDosage.split(".")[0];
						SecondDosage = SecondDosage.concat(SecondDose);
					}
					if (SecondDosage.includes("-") && !SecondDosage.includes("T00:00:00")) {
						SecondDosage = SecondDosage.concat(SecondDose);
					}
					if (SecondDosage === "") {
						SecondDosage = null;
					}
					
					var medicalExp = "T00:00:00";

					var medicalExempExp = this.getView().byId("medicalExpDate").getValue();
					if (medicalExempExp.substring(2, 3) === ".") {
						medicalExempExp = medicalExempExp.split(".")[2] + "-" + medicalExempExp.split(".")[1] + "-" + medicalExempExp.split(".")[0];
						medicalExempExp = medicalExempExp.concat(medicalExp);
					}
				if (medicalExempExp.includes("-") && !medicalExempExp.includes("T00:00:00")) {
						medicalExempExp = medicalExempExp.concat(medicalExp);
					}
					if (medicalExempExp === "") {
						medicalExempExp = null;
					}
					
					
					
					
					
					var DOB = this.getOwnerComponent().getModel("tableModel").getData().Dats;
					var DOB1="";
					if (DOB.substring(2, 3) === ".") {
						DOB = DOB.split(".")[2] + "-" + DOB.split(".")[1] + "-" + DOB.split(".")[0];
						DOB1 = DOB.concat(SecondDose);
					}
					// if (DOB1.includes("-")) {
					// 	DOB1 = DOB1.concat(SecondDose);
					// }
					if (DOB === "") {
						DOB1 = null;
					}
						var pernr = "";
						if (this.Pernr !== "") {
							pernr = this.Pernr;
						} else {
							pernr = "";
						}
					
					// obj.ABORTS_TEXT = "";
					// 	obj.ERELATION_TEXT = "";
					// 	obj.ESUBGRP_TEXT = "";
					// 	obj.GENDER_TEXT = "";
					// 	obj.NATIO_TEXT = "";
					// 	obj.NTITLE_TEXT = "";
					// 	obj.REQ_TYPE_TEXT = "";
					// 	obj.TITLE_TEXT = "";
					// 	obj.ReqType = requestType;
					// 	obj.Comments = Desccomments;
					// 	obj.Req_Subtype = "";
				 //     	obj.Status = "NEW";
					// 	obj.CVC_EFF_DATE = effectDate1;
					// 	obj.CVC_STATUS = Vaccinestatus;
					// 	obj.CVC_2DS_DT = SecondDosage;
					// 	obj.CVC_DECL = consest;
					// 		if (covidCheckboxSelected) {
					// 		obj.CVC_COMP_DECL = "T";
					// 	}
					// 		else if (!covidCheckboxSelected) {
					// 		obj.CVC_COMP_DECL = "F";
					// 	}
					// 	else {
					// 		obj.CVC_COMP_DECL = "";
					// 	}
					 obj.Reqid = "";
					obj.ABORTS_TEXT = "";
					obj.ERELATION_TEXT = "";
					obj.ESUBGRP_TEXT = "";
					obj.GENDER_TEXT = "";
					obj.NATIO_TEXT = "";
					obj.NTITLE_TEXT = "";
					obj.REQ_TYPE_TEXT = "";
					obj.TITLE_TEXT = "";
					obj.CVC_STATUS= "";
					obj.Vendor = VendorSplit;
					obj.ReqType = requestType;
					obj.Comments = Desccomments;
					obj.VendLText = Desccomments;
					obj.Title = this.getOwnerComponent().getModel("tableModel").getData().Title;

					obj.Fname = this.getOwnerComponent().getModel("tableModel").getData().Fname;
					obj.Mname = this.getOwnerComponent().getModel("tableModel").getData().Mname;
					obj.Lname = this.getOwnerComponent().getModel("tableModel").getData().Lname;
					obj.Dats = DOB1;
					obj.Pernr = pernr;
					obj.Personid_ext = this.getOwnerComponent().getModel("tableModel").getData().Personid_ext;
					obj.Gender = this.getOwnerComponent().getModel("tableModel").getData().Gender;

					obj.Prname = this.getOwnerComponent().getModel("tableModel").getData().Prname;
					obj.Natio = this.getOwnerComponent().getModel("tableModel").getData().Natio;

					obj.Aborts = this.getOwnerComponent().getModel("tableModel").getData().Aborts;

					obj.Ntitle = this.getOwnerComponent().getModel("tableModel").getData().Ntitle;
					obj.Email = this.getOwnerComponent().getModel("tableModel").getData().Email;
					obj.Mobile = this.getOwnerComponent().getModel("tableModel").getData().Mobile;
					obj.Erelation = this.getOwnerComponent().getModel("tableModel").getData().Erelation;

					obj.Ename = this.getOwnerComponent().getModel("tableModel").getData().Ename;
					obj.Ephone = this.getOwnerComponent().getModel("tableModel").getData().Ephone;
					//	obj.SupPosText = SupPosText;
					//	obj.SupPosStxt = this.suspose;
					//	obj.Loc_id = this.loc_id;
					obj.EMP_AUTH_REP = "";
					obj.EMP_AUTH_RPOS = "";
					obj.CrUnam = this.vUser;
					//	obj.MED_COMP = medkey;
					//	obj.MED_COML_TXT = Medicalcomp;
					//	obj.MEDDT = decDate;
					// obj.CHKBX1 = "T";
					// obj.CHKBX2 = "T";
					// obj.CHKBX3 = "T";
					// obj.CHKBX4 = "T";
					// obj.CHKBX5 = "T";
					obj.Status = "NEW";
					obj.Req_Subtype = "";
					obj.UserId = this.vUser;
						obj.CVC_EFF_DATE = effectDate1;
						obj.CVC_STATUS_COD = Vaccinestatus1;
						obj.CVC_2DS_DT = SecondDosage;
						obj.CVC_DECL = consest;
						obj.CVC_MEE_DT = medicalExempExp;
							if (covidCheckboxSelected) {
							obj.CVC_COMP_DECL = "T";
						}
							else if (!covidCheckboxSelected) {
							obj.CVC_COMP_DECL = "F";
						}
						else {
							obj.CVC_COMP_DECL = "";
						}
						obj.UserId = this.vUser;
				}
				else {

					var susposition = sap.ui.getCore().getModel("SusposModel").getData();
					var NHDate = "T00:00:00";
					var NHTravelDate = this.getView().byId("assign_TravelDate").getValue();
					if (NHTravelDate.substring(2, 3) === ".") {
						NHTravelDate = NHTravelDate.split(".")[2] + "-" + NHTravelDate.split(".")[1] + "-" + NHTravelDate.split(".")[0];
						NHTravelDate = NHTravelDate.concat(NHDate);
					} else {
						NHTravelDate = NHTravelDate.concat(NHDate);
					}

					var effectDate = "T00:00:00";

					var effectDate1 = this.getView().byId("CFDD").getValue();
					if (effectDate1.substring(2, 3) === ".") {
						effectDate1 = effectDate1.split(".")[2] + "-" + effectDate1.split(".")[1] + "-" + effectDate1.split(".")[0];
						effectDate1 = effectDate1.concat(effectDate);
					}
					if (effectDate1.includes("-") && !effectDate1.includes("T00:00:00")) {
						effectDate1 = effectDate1.concat(effectDate);
					}
					if (effectDate1 === "") {
						effectDate1 = null;
					}

					var SecondDose = "T00:00:00";

					var SecondDosage = this.getView().byId("SeconddoseDate").getValue();
					if (SecondDosage.substring(2, 3) === ".") {
						SecondDosage = SecondDosage.split(".")[2] + "-" + SecondDosage.split(".")[1] + "-" + SecondDosage.split(".")[0];
						SecondDosage = SecondDosage.concat(SecondDose);
					}
					if (SecondDosage.includes("-") && !SecondDosage.includes("T00:00:00")) {
						SecondDosage = SecondDosage.concat(SecondDose);
					}
					if (SecondDosage === "") {
						SecondDosage = null;
					}
					var medicalExp = "T00:00:00";

					var medicalExempExp = this.getView().byId("medicalExpDate").getValue();
					if (medicalExempExp.substring(2, 3) === ".") {
						medicalExempExp = medicalExempExp.split(".")[2] + "-" + medicalExempExp.split(".")[1] + "-" + medicalExempExp.split(".")[0];
						medicalExempExp = medicalExempExp.concat(medicalExp);
					}
				if (medicalExempExp.includes("-") && !medicalExempExp.includes("T00:00:00")) {
						medicalExempExp = medicalExempExp.concat(medicalExp);
					}
					if (medicalExempExp === "") {
						medicalExempExp = null;
					}
					

					var SupPosText = susposition.SupPos;
					if (SupPosText === undefined || SupPosText !== undefined) {
						obj.Reqid = "";
						obj.ABORTS_TEXT = "";
						obj.ERELATION_TEXT = "";
						obj.ESUBGRP_TEXT = "";
						obj.GENDER_TEXT = "";
						obj.NATIO_TEXT = "";
						obj.NTITLE_TEXT = "";
						obj.REQ_TYPE_TEXT = "";
						obj.TITLE_TEXT = "";
						obj.CVC_STATUS= "";
						obj.Vendor = VendorSplit;
						obj.ReqType = requestType;
						obj.Comments = Desccomments;
						obj.VendLText = Desccomments;
						obj.Title = title;

						obj.Fname = firstName;
						obj.Mname = middleName;
						obj.Lname = lastName;
						obj.Dats = DOB1;
						//obj.Pernr = this.Pernr;
						var pernr;
						if (this.Pernr !== "") {
							pernr = this.Pernr;
						} else {
							pernr = "";
						}
						obj.Pernr = pernr;
						obj.Personid_ext = sapNumber1;
						obj.Gender = Gender;

						obj.Prname = prefferedName;
						obj.Natio = Nationality;

						obj.Aborts = straightIslander;

						obj.Ntitle = nativeTitle;

						obj.Email = personalMailAddress;
						obj.Mobile = mobileNumber;
						obj.Erelation = Relationship;

						obj.Ename = Name;
						obj.Ephone = phoneNumber;
						//obj.Begda = StartDate;
						obj.Begda = NHTravelDate;
						obj.Endda = EndDate;
						obj.OrgPosid = Position;
						obj.Jobid = Rolerequirement;
						obj.Prjct_type = projectType;
						obj.Leader = this.leader;
						obj.LeaderName = LeaderName;
						//	obj.SupPosText = "";
						obj.Location = Loaction;
						obj.Esubgrp = empSubgroup;
						obj.Worksch = workSchedule;
						obj.SupPosText = SupPosText;
						obj.SupPosStxt = this.suspose;
						obj.Loc_id = this.loc_id;
						obj.Erdat = null;
						obj.CrUnam = this.vUser;
						// obj.Note = Note;
						obj.UpdUnam = "";
						obj.Cpudt = null;
						obj.Note = "";
						obj.Status = "NEW";
						obj.CVC_EFF_DATE = effectDate1;
						obj.CVC_STATUS_COD = Vaccinestatus1;
						obj.CVC_2DS_DT = SecondDosage;
						obj.CVC_DECL = consest;
						obj.CVC_MEE_DT = medicalExempExp;
							if (covidCheckboxSelected) {
							obj.CVC_COMP_DECL = "T";
						}
							else if (!covidCheckboxSelected) {
							obj.CVC_COMP_DECL = "F";
						}
						else {
							obj.CVC_COMP_DECL = "";
						}

						obj.EMP_AUTH_REP = empAuthName;
						obj.EMP_AUTH_RPOS = empAuths;

						if (empSubgroup === "E6") {
							obj.MED_COMP = "";
							obj.MEDDT = null;
							obj.Aodtest = "";
							obj.Risk_level = "";
							obj.Hlthmngplan = "";
							obj.MED_COML_TXT = "";
							obj.LRWCHKBX1 = "T";
							obj.LRWCHKBX2 = "T";
							obj.LRWCHKBX3 = "T";
							obj.LRWCHKBX4 = "T";
						} else {
							obj.MEDDT = DateComp1;
							obj.MED_COMP = medkey;
							obj.Aodtest = AodTest;
							obj.Risk_level = medfitmess;
							obj.Hlthmngplan = healthmanagement;
							obj.MED_COML_TXT = Medicalcomp;
							obj.CHKBX1 = "T";
							obj.CHKBX2 = "T";
							obj.CHKBX3 = "T";
							obj.CHKBX4 = "T";
							obj.CHKBX5 = "T";
							obj.CHKBX6 = "T";
						}
						obj.UserId = this.vUser;
					}
				}
				var oModel = this.getOwnerComponent().getModel();
				this.getView().setBusy(true);
				oModel.create("/CMSRequestSet", obj, {
					success: function (oData, response) {
						that.changeFlag = false;
						ReqID = response.data.Reqid;
						/*
						 * Start of Change 
						 * Changed On - 21.08.2020
						 *Changed By - Karteek
						 * Change Description - Set all the changes flags to false*/
						that.allFlagRestore();
						/* End of Change*/
						that.UploadUpdate();
						that.UploadUpdateForMandtAttachments();
						that.UploadUpdateForCovidAttachments();
						that.getView().setBusy(false);
						var inf = "";
						if (getReqtypeText === "Demobilise") {
							 inf = " Contractor 'Demobilise' Request created successfully - " + ReqID;
						} 
						else if (getReqtypeText === "Extend End Date") {
							 inf = " Contractor 'Extend End Date' Request created successfully - " + ReqID;
						} 
						else if (getReqtypeText === "Change Of Conditions") {
							 inf = " Contractor 'Change Of Conditions' Request created successfully - " + ReqID;
						} else if (getReqtypeText === "Personal Info. Change") {
							 inf = " Contractor 'Personal Info. Change' Request created successfully - " + ReqID;
						} 
							else if (requestType === "06") {
							 inf = "'Covid-19 Vaccination Update' Request created successfully - " + ReqID;
						} 
						
						else {
							 inf = " Contractor Mobilisation Request created successfully - " + ReqID;
						}
						MessageBox.success(inf, {
							actions: MessageBox.Action.OK,
							emphasizedAction: MessageBox.Action.OK,
							onClose: function (sAction) {
								that.handleClear();
								that.onNavigate();
							}
						});
					},
					error: function (OData, response) {
						that.getView().setBusy(false);
						sap.m.MessageBox.error(JSON.parse(OData.responseText).error.message.value);
					}
				});
			}
		},
    
    
    
        /* 
      * Date - 25.04.2020
      * Created By - Karteek
      * Description - This function is called by handleCancel() method
      *->This function is invoked when user clicks on cancel button
      *-> This function will validate the value states of the input fields
      *-> This function will validate if any changes made on the required fields
      *->This function will return true if any changes are made to any of the element
      *->This function will return false if none of the changes are made to the elements
      Called From - handleCancel()*/
		_onCheckChanges: function (Value) {
			var requestType = this.getView().byId("req_Type").getValueState();
			var Desccomments = this.getView().byId("req_Desccomments").getValueState();
			var title = this.getView().byId("pers_Title").getValueState();
			var titleselect = this.getView().byId("pers_Title").getValueState();
			var firstName = this.getView().byId("pers_Fname").getValueState();
			var middleName = this.getView().byId("pers_Mname").getValueState();
			var lastName = this.getView().byId("pers_Lname").getValueState();
			var DOB1 = this.getView().byId("pers_DOB").getValueState();
			var uploadCollection = this.getView().byId("UploadCollection").getItems().length;
			var sapNumber = this.getView().byId("pers_SAPnum").getValueState();
			var Gender = this.getView().byId("pers_gender").getValueState();
			var Nationality = this.getView().byId("pers_Nationality").getValueState();
			var personalMailAddress = this.getView().byId("conmail").getValueState();
			var mobileNumber = this.getView().byId("conmobile").getValueState();
			var Relationship = this.getView().byId("emergency_Rel").getValueState();
			var empRelationship = this.getView().byId("emergency_Rel").getValueState();
			var Name = this.getView().byId("emergency_Name").getValueState();
			var phoneNumber = this.getView().byId("emergency_Phnumber").getValueState();
			var startDate1 = this.getView().byId("assign_StartDate").getValueState();
			var travelDate1 = this.getView().byId("assign_TravelDate").getValueState();
			var estimatedEndDate1 = this.getView().byId("assign_EstDate").getValueState();
			var Position = this.getView().byId("assign_Pos").getValueState();
			var mandatoryLicenses = this.getView().byId("Mant_subgroup").getValueState();
			var projectType = this.getView().byId("Project").getValueState();
			var empSubgroup = this.getView().byId("Emp_subgroup").getValueState();
			var empAuthName = this.getView().byId("EmpAuth_name").getValueState();
			var empAuths = this.getView().byId("EmpAuth_pos").getValueState();
			var medkey = this.getView().byId("medicalComp").getValueState();
			var DateComp1 = this.getView().byId("dateComp").getValueState();
			var AOD = this.getView().byId("AODTEST").getValueState();
			var fitness = this.getView().byId("medicalfitness").getValueState();
			var healthPlan = this.getView().byId("healthmanagement").getValueState();
			var chk1 = this.getView().byId("chk1").getSelected();
			var chk2 = this.getView().byId("chk2").getSelected();
			var chk3 = this.getView().byId("chk3").getSelected();
			var chk4 = this.getView().byId("chk4").getSelected();
			var chk5 = this.getView().byId("chk5").getSelected();
			var chk6 = this.getView().byId("chk6").getSelected();
			var chk7 = this.getView().byId("chk7").getSelected();
			var chk8 = this.getView().byId("chk8").getSelected();
			var chk9 = this.getView().byId("chk9").getSelected();
			var chk10 = this.getView().byId("chk10").getSelected();

			var checkbox1 = this.getView().byId("chk1").getValueState();
			var checkbox2 = this.getView().byId("chk2").getValueState();
			var checkbox3 = this.getView().byId("chk3").getValueState();
			var checkbox4 = this.getView().byId("chk4").getValueState();
			var checkbox5 = this.getView().byId("chk5").getValueState();
			var checkbox6 = this.getView().byId("chk6").getValueState();
			var checkbox7 = this.getView().byId("chk7").getValueState();
			var checkbox8 = this.getView().byId("chk8").getValueState();
			var checkbox9 = this.getView().byId("chk9").getValueState();
			var checkbox10 = this.getView().byId("chk10").getValueState();

			//var Position = this.getView().byId("assign_Pos").getValueState();
			if (chk1 === true || chk2 === true || chk3 === true || chk4 === true || chk5 === true || chk6 === true || chk7 === true || chk8 ===
				true || chk9 === true || chk10 === true ||
				uploadCollection > 0 || requestType === "Error" || title === "Error" || firstName === "Error" || lastName === "Error" ||
				startDate1 === "Error" || travelDate1 === "Error" || estimatedEndDate1 === "Error" || DOB1 === "Error" || sapNumber === "Error" ||
				Position === "Error" ||
				mandatoryLicenses ===
				"Error" ||
				projectType === "Error" || empSubgroup === "Error" ||
				DateComp1 === "Error" || Gender === "Error" || Nationality === "Error" || personalMailAddress === "Error" || mobileNumber ===
				"Error" || empAuthName === "Error" || empAuths === "Error" || medkey === "Error" || DateComp1 === "Error" || AOD === "Error" ||
				fitness === "Error" || healthPlan === "Error" || Relationship ===
				"Error" || Name ===
				"Error" || phoneNumber === "Error" || checkbox1 === "Error" || checkbox2 === "Error" || checkbox3 === "Error" || checkbox4 ===
				"Error" || checkbox5 === "Error" || checkbox6 === "Error" || checkbox7 === "Error" || checkbox8 === "Error" || checkbox9 ===
				"Error" ||
				checkbox10 === "Error") {
				return true;
			}
			if (this.descComments === true || this.Positionvalid === true || this.empSubvalid === true || this.project === true ||
				this.mandtRole === true ||
				this.titlevalid === true || this.firstNamevalid === true || this.lastNamevalid === true || this.middleNamevalid ===
				true ||
				this.SAPNumvalid === true || this.gendervalid === true || this.prefNamevalid === true || this.natiovalid === true || this.Aboriginalvalid ===
				true || this.nativeTitlevalid === true ||
				this.mailvalid === true || this.mobileNumbervalid === true || this.relationshipvalid === true || this.emergencyNamevalid === true ||
				this.emergencyphnvalid === true || this.empName === true || this.empPositionName === true ||
				this.DOBvalid === true || this.dateComp === true || this.startDatevalid === true || this.travelDatevalid === true || this.endDatevalid ===
				true || this.medicalComp ===
				true || this.AOD === true ||
				this.fitness === true ||
				this.health === true || this.dateExmp === true || this.vaccinevalid === true || this.Firstdose === true
				|| this.Seconddose === true || this.consentValid === true) {
				return true;
			}
			return false;
		},
		/* 
		 * Date - 25.04.2020
		 * Created By - Rakesh
		 * Description - This function is invoked when user clicks on cancel button
		 *-> This function will clear all the values and value states of the input fields
		 *-> This function will validate if any changes made on the required fields
		 *->This function will take user to the FLP home page when start up parameters are found
		 *->This function will take user to the worklist when start up parameters are not found*/
		handleCancel: function () {
			that = this;
			var Value;
			/*
			 * Start of Change 
			 * Changed On - 21.09.2020
			 *Changed By - Karteek
			 * Change Description - Tocheck if any changes are made to the input elements*/
			var onCheckChanges = that._onCheckChanges(Value);
			if (onCheckChanges) {
				var oDialog = new sap.m.Dialog({
					title: "Information",
					titleAlignment: "Center",
					icon: "sap-icon://warning",
					type: "Message",

					content: new Text({
						text: "Changes made will be lost"
					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "OK",
						press: function () {
							that.handleClear();
							/*End of Change */
							/*
							 * Start of Change 
							 * Changed On - 22.06.2020
							 *Changed By - Rakesh
							 * Change Description -User creates onboard request directly from seperate tile in FLP */
							if (that.getMyComponent().getComponentData() && that.getMyComponent().getComponentData().startupParameters.onBoard) {

								window.location.hash = "#";
								//window.history.go(-1);
								oDialog.close();
							}
							/*End of Change*/
							else {
								//that.getOwnerComponent().getRouter().navTo("displayTable");
								that.getView().byId("req_Type").setValue("");
								that.getView().byId("req_Desccomments").setValue("");
								that.getView().byId("pers_Title").setSelectedKey("");
								that.getView().byId("pers_Fname").setValue("");
								that.getView().byId("pers_Mname").setValue("");
								that.getView().byId("pers_Lname").setValue("");
								that.getView().byId("pers_DOB").setValue(""); /*Date*/
								that.getView().byId("pers_SAPnum").setValue("");
								that.getView().byId("pers_gender").setSelectedKey("");
								that.getView().byId("pers_Prename").setSelectedKey("");
								that.getView().byId("pers_Nationality").setSelectedKey("");
								that.getView().byId("pers_islander").setValue("");
								that.getView().byId("pers_Native").setValue("");
								that.getView().byId("conmail").setSelectedKey("");
								that.getView().byId("conmobile").setValue("");
								that.getView().byId("emergency_Rel").setSelectedKey("");
								that.getView().byId("emergency_Name").setValue("");
								that.getView().byId("emergency_Phnumber").setValue("");
								that.getView().byId("assign_StartDate").setValue("");
								that.getView().byId("assign_TravelDate").setValue("");
								that.getView().byId("assign_EstDate").setValue("");
								that.getView().byId("assign_Pos").setValue("");
								that.getView().byId("assign_Name").setValue("");
								that.getView().byId("assign_Leader").setValue("");
								that.getView().byId("assign_loc").setValue("");
								that.getView().byId("Emp_subgroup").setSelectedKey("");
								that.getView().byId("Mant_subgroup").setSelectedKey("");
								that.getView().byId("Project").setSelectedKey("");
								//	this.getView().byId("assign_Vendor").setValue(Cu           );
								that.getView().byId("EmpAuth_name").setValue("");
								that.getView().byId("EmpAuth_pos").setValue("");
								that.getView().byId("medicalComp").getSelectedKey("");
								that.getView().byId("medicalComp").setValue("");
								that.getView().byId("idmedinput").setValue("");
								that.getView().byId("idmedinput").setVisible(false);
								that.getView().byId("dateComp").setValue("");
								that.getView().byId("AODTEST").setSelectedKey("");
								that.getView().byId("medicalfitness").setSelectedKey("");
								that.getView().byId("healthmanagement").setSelectedKey("");

								that.getView().byId("chk1").setSelected(false);
								that.getView().byId("chk2").setSelected(false);
								that.getView().byId("chk3").setSelected(false);
								that.getView().byId("chk4").setSelected(false);
								that.getView().byId("chk5").setSelected(false);
								that.getView().byId("chk6").setSelected(false);
								that.getView().byId("chk7").setSelected(false);
								that.getView().byId("chk8").setSelected(false);
								that.getView().byId("chk9").setSelected(false);
								that.getView().byId("chk10").setSelected(false);
								that.getView().byId("req_Type").setValueState("None");
								that.getView().byId("req_Desccomments").setValueState("None");
								that.getView().byId("pers_Title").setValueState("None");
								that.getView().byId("pers_Fname").setValueState("None");
								that.getView().byId("pers_Mname").setValueState("None");
								that.getView().byId("pers_Lname").setValueState("None");
								that.getView().byId("pers_DOB").setValueState("None"); /*Date*/
								that.getView().byId("pers_SAPnum").setValueState("None");
								that.getView().byId("pers_gender").setValueState("None");
								that.getView().byId("pers_Prename").setValueState("None");
								that.getView().byId("pers_Nationality").setValueState("None");
								that.getView().byId("pers_islander").setValueState("None");
								that.getView().byId("pers_Native").setValueState("None");
								that.getView().byId("conmail").setValueState("None");
								that.getView().byId("conmobile").setValueState("None");
								that.getView().byId("emergency_Rel").setValueState("None");
								that.getView().byId("emergency_Name").setValueState("None");
								that.getView().byId("emergency_Phnumber").setValueState("None");
								//	this.getView().byId("assign_StartDate").setValue("");
								that.getView().byId("assign_EstDate").setValueState("None");
								that.getView().byId("assign_Pos").setValueState("None");
								that.getView().byId("assign_Leader").setValueState("None");
								that.getView().byId("assign_loc").setValueState("None");
								that.getView().byId("Emp_subgroup").setValueState("None");
								that.getView().byId("Mant_subgroup").setValueState("None");
								that.getView().byId("Project").setValueState("None");
								//	this.getView().byId("assign_Worksch").setValue("");
								//	this.getView().byId("assign_Vendor").setValue(Cu           );
								that.getView().byId("EmpAuth_name").setValueState("None");
								that.getView().byId("EmpAuth_pos").setValueState("None");
								that.getView().byId("medicalComp").setValueState("None");
								that.getView().byId("medicalComp").setValueState("None");
								that.getView().byId("idmedinput").setValueState("None");
								//	that.getView().byId("idmedinput")setValueState("None");
								that.getView().byId("dateComp").setValueState("None");
								that.getView().byId("AODTEST").setValueState("None");
								that.getView().byId("medicalfitness").setValueState("None");
								that.getView().byId("healthmanagement").setValueState("None");
								that.getView().byId("chk1").setValueState("None");
								that.getView().byId("chk2").setValueState("None");
								that.getView().byId("chk3").setValueState("None");
								that.getView().byId("chk4").setValueState("None");
								that.getView().byId("chk5").setValueState("None");
								that.getView().byId("chk6").setValueState("None");
								that.getView().byId("chk7").setValueState("None");
								that.getView().byId("chk8").setValueState("None");
								that.getView().byId("chk9").setValueState("None");
								that.getView().byId("chk10").setValueState("None");
								that.getOwnerComponent().getModel("tableModel").setData(null);
								that.getView().byId("UploadCollection").destroyItems();
								that.getView().byId("UploadCollection").removeAllItems();
								that.getView().byId("IDMA").setVisible(true);
								that.getView().byId("Med_Agreement").setVisible(true);
								that.getView().byId("idImage").setVisible(true);
								array = [];
								FileUploaded = false;
								var simpleForm = that.getView().byId("empAuthorized1");
								simpleForm.destroyContent();
								a4 = [];
								a1 = [];
								Files = [];
								IE = 0;
								Docno1 = [];
								FileUploaded = false;
								selected = false;
								that.getView().byId("idSubmitButton").destroyCustomData();
								that.getOwnerComponent().getRouter().navTo("displayTable");
								var objectPageLayout = that.getView().byId("ObjectPageLayout");
								var EditAttrSection = that.getView().byId("Reqsection");
								objectPageLayout.setSelectedSection(EditAttrSection);
								oDialog.close();
							}
						}
					}),
					endButton: new Button({
						type: ButtonType.Reject,
						text: "Cancel",
						press: function () {
							oDialog.close();
						}
					}),
					afterClose: function () {
						oDialog.destroy();
					}
				});

				oDialog.open();
			} else {
				/*
				 * Start of Change 
				 * Changed On - 22.06.2020
				 *Changed By - Rakesh
				 * Change Description -User creates onboard request directly from seperate tile in FLP */
				if (that.getMyComponent().getComponentData() && that.getMyComponent().getComponentData().startupParameters.onBoard) {

					window.location.hash = "#";
					//window.history.go(-1);
					oDialog.close();
				}
				/*End of Change*/
				else {
					that.getView().byId("req_Type").setValue("");
					that.getView().byId("req_Desccomments").setValue("");
					that.getView().byId("pers_Title").setSelectedKey("");
					that.getView().byId("pers_Fname").setValue("");
					that.getView().byId("pers_Mname").setValue("");
					that.getView().byId("pers_Lname").setValue("");
					that.getView().byId("pers_DOB").setValue(""); /*Date*/
					that.getView().byId("pers_SAPnum").setValue("");
					that.getView().byId("pers_gender").setSelectedKey("");
					that.getView().byId("pers_Prename").setSelectedKey("");
					that.getView().byId("pers_Nationality").setSelectedKey("");
					that.getView().byId("pers_islander").setValue("");
					that.getView().byId("pers_Native").setValue("");
					that.getView().byId("conmail").setSelectedKey("");
					that.getView().byId("conmobile").setValue("");
					that.getView().byId("emergency_Rel").setSelectedKey("");
					that.getView().byId("emergency_Name").setValue("");
					that.getView().byId("emergency_Phnumber").setValue("");
					this.getView().byId("assign_StartDate").setValue("");
					this.getView().byId("assign_TravelDate").setValue("");
					that.getView().byId("assign_EstDate").setValue("");
					that.getView().byId("assign_Pos").setValue("");
					that.getView().byId("assign_Name").setValue("");
					that.getView().byId("assign_Leader").setValue("");
					that.getView().byId("assign_loc").setValue("");
					that.getView().byId("Emp_subgroup").setSelectedKey("");
					//	this.getView().byId("assign_Worksch").setValue("");
					//	this.getView().byId("assign_Vendor").setValue(Cu           );
					that.getView().byId("Mant_subgroup").setSelectedKey("");
					that.getView().byId("Project").setSelectedKey("");
					that.getView().byId("EmpAuth_name").setValue("");
					that.getView().byId("EmpAuth_pos").setValue("");
					that.getView().byId("medicalComp").getSelectedKey("");
					that.getView().byId("medicalComp").setValue("");
					that.getView().byId("idmedinput").setValue("");
					that.getView().byId("idmedinput").setVisible(false);
					that.getView().byId("dateComp").setValue("");
					that.getView().byId("AODTEST").setSelectedKey("");
					that.getView().byId("medicalfitness").setSelectedKey("");
					that.getView().byId("healthmanagement").setSelectedKey("");
					that.getView().byId("chk1").setSelected(false);
					that.getView().byId("chk2").setSelected(false);
					that.getView().byId("chk3").setSelected(false);
					that.getView().byId("chk4").setSelected(false);
					that.getView().byId("chk5").setSelected(false);
					that.getView().byId("chk6").setSelected(false);
					that.getView().byId("chk7").setSelected(false);
					that.getView().byId("chk8").setSelected(false);
					that.getView().byId("chk9").setSelected(false);
					that.getView().byId("chk10").setSelected(false);
					that.getView().byId("req_Type").setValueState("None");
					that.getView().byId("req_Desccomments").setValueState("None");
					that.getView().byId("pers_Title").setValueState("None");
					that.getView().byId("pers_Fname").setValueState("None");
					that.getView().byId("pers_Mname").setValueState("None");
					that.getView().byId("pers_Lname").setValueState("None");
					that.getView().byId("pers_DOB").setValueState("None");
					that.getView().byId("pers_SAPnum").setValueState("None");
					that.getView().byId("pers_gender").setValueState("None");
					that.getView().byId("pers_Prename").setValueState("None");
					that.getView().byId("pers_Nationality").setValueState("None");
					that.getView().byId("pers_islander").setValueState("None");
					that.getView().byId("pers_Native").setValueState("None");
					that.getView().byId("conmail").setValueState("None");
					that.getView().byId("conmobile").setValueState("None");
					that.getView().byId("emergency_Rel").setValueState("None");
					that.getView().byId("emergency_Name").setValueState("None");
					that.getView().byId("emergency_Phnumber").setValueState("None");
					this.getView().byId("assign_StartDate").setValueState("None");
					that.getView().byId("assign_EstDate").setValueState("None");
					this.getView().byId("assign_TravelDate").setValueState("None");
					that.getView().byId("assign_Pos").setValueState("None");
					that.getView().byId("assign_Leader").setValueState("None");
					that.getView().byId("assign_loc").setValueState("None");
					that.getView().byId("Emp_subgroup").setValueState("None");
					that.getView().byId("Mant_subgroup").setValueState("None");
					that.getView().byId("Project").setValueState("None");
					that.getView().byId("EmpAuth_name").setValueState("None");
					that.getView().byId("EmpAuth_pos").setValueState("None");
					that.getView().byId("medicalComp").setValueState("None");
					that.getView().byId("medicalComp").setValueState("None");
					that.getView().byId("idmedinput").setValueState("None");
					that.getView().byId("dateComp").setValueState("None");
					that.getView().byId("AODTEST").setValueState("None");
					that.getView().byId("medicalfitness").setValueState("None");
					that.getView().byId("healthmanagement").setValueState("None");
					that.getView().byId("chk1").setValueState("None");
					that.getView().byId("chk2").setValueState("None");
					that.getView().byId("chk3").setValueState("None");
					that.getView().byId("chk4").setValueState("None");
					that.getView().byId("chk5").setValueState("None");
					that.getView().byId("chk6").setValueState("None");
					that.getView().byId("chk7").setValueState("None");
					that.getView().byId("chk8").setValueState("None");
					that.getView().byId("chk9").setValueState("None");
					that.getView().byId("chk10").setValueState("None");
					that.getOwnerComponent().getModel("tableModel").setData(null);
					that.getView().byId("UploadCollection").destroyItems();
					that.getView().byId("UploadCollection").removeAllItems();
					that.getView().byId("IDMA").setVisible(true);
					that.getView().byId("Med_Agreement").setVisible(true);
					that.getView().byId("idImage").setVisible(true);
					// this.getView().byId("UploadCollection").setModel();
					// this.getView().byId("UploadCollection").unbindItems();
					// 	this.getView().byId("UploadCollection").removeAllAggregation();
					array = [];
					//       		if(that.getView().byId("UploadCollection").getModel()){
					//       		that.getView().byId("UploadCollection").getModel().setData({
					// 	"items": []
					// });
					//       		}
					that.getOwnerComponent().getRouter().navTo("displayTable");
					var objectPageLayout = that.getView().byId("ObjectPageLayout");
					var EditAttrSection = that.getView().byId("Reqsection");
					objectPageLayout.setSelectedSection(EditAttrSection);

				}
			}

		},
		/* 
		 * Date - 25.04.2020
		 * Created By - Rakesh
		 * Description - This function is invoked after the request id is generated from the server
		 *-> This function will clear all the values and value states of the input fields
		 *Called By- onSubmit(), onInit()*/
		handleClear: function (oEvent) {
			FileUploaded = false;
			var simpleForm = this.getView().byId("empAuthorized1");
			simpleForm.destroyContent();
			var covidAttachmentSimpleForm = this.getView().byId("Covid_Tracker");
			//	covidAttachmentSimpleForm.destroyContent();
			for (var t = 0; t < covidAttachmentSimpleForm.getContent().length; t++) {
				if (covidAttachmentSimpleForm.getContent()[t].getId().includes("idCancel")) {
					covidAttachmentSimpleForm.getContent()[t].destroy();
					t--;
				}
				if (covidAttachmentSimpleForm.getContent()[t].getId().includes("idVaccineLabel")) {
					covidAttachmentSimpleForm.getContent()[t].destroy();
					t--;
				}
				if (covidAttachmentSimpleForm.getContent()[t].getId().includes("uploader")) {
					covidAttachmentSimpleForm.getContent()[t].destroy();
					t--;

				}
				if (covidAttachmentSimpleForm.getContent()[t].getId().includes("idFileText")) {
					covidAttachmentSimpleForm.getContent()[t].destroy();
					t--;
				}
			}
			a4 = [];
			a1 = [];
			a7 = [];
			a8 = [];
			Files = [];
			Files2 = [];
			IE = 0;
			Docno1 = [];
			Docno2 = [];
			FileUploaded = false;
			selected = false;
			this.Pernr = "";
			this.getView().byId("IDMA").setVisible(true);
			this.getView().byId("Med_Agreement").setVisible(true);
			this.getView().byId("idImage").setVisible(true);

			//	that.getView().byId("idSubmitButton").destroyCustomData();

			this.getView().byId("TB1").setVisible(false);
			this.getView().byId("Title1").setVisible(false);
			this.getView().byId("req_Type").setSelectedKey("");
			this.getView().byId("req_Desccomments").setValue("");
			this.getView().byId("pers_Title").setSelectedKey("");
			this.getView().byId("pers_Fname").setValue("");
			this.getView().byId("pers_Mname").setValue("");
			this.getView().byId("pers_Lname").setValue("");
			this.getView().byId("pers_DOB").setValue(""); /*Date*/
			this.getView().byId("pers_SAPnum").setValue("");
			this.getView().byId("pers_gender").setSelectedKey("");
			this.getView().byId("pers_Prename").setSelectedKey("");
			this.getView().byId("pers_Nationality").setSelectedKey("");
			this.getView().byId("pers_islander").setValue("");
			this.getView().byId("pers_Native").setSelectedKey("");
			this.getView().byId("conmail").setSelectedKey("");
			this.getView().byId("conmobile").setValue("");
			this.getView().byId("emergency_Rel").setSelectedKey("");
			this.getView().byId("emergency_Name").setValue("");
			this.getView().byId("emergency_Phnumber").setValue("");
			this.getView().byId("emergency_Rel").setValueState("None");
			this.getView().byId("emergency_Name").setValueState("None");
			this.getView().byId("emergency_Phnumber").setValueState("None");
			this.getView().byId("assign_StartDate").setValue("");
			this.getView().byId("assign_TravelDate").setValue("");

			this.getView().byId("assign_EstDate").setValue("");
			this.getView().byId("assign_Pos").setValue("");
			this.getView().byId("assign_Name").setValue("");
			this.getView().byId("Mant_subgroup").setValue("");
			this.getView().byId("assign_Leader").setValue("");
			this.getView().byId("Project").setValue("");
			this.getView().byId("assign_loc").setValue("");
			this.getView().byId("Emp_subgroup").setSelectedKey("");
			this.getView().byId("Mant_subgroup").setSelectedKey("");
			this.getView().byId("Project").setSelectedKey("");
			this.getView().byId("Mant_subgroup").setValueState("None");
			this.getView().byId("Project").setValueState("None");
			//	this.getView().byId("assign_Worksch").setValue("");
			//	this.getView().byId("assign_Vendor").setValue(Cu           );
			this.getView().byId("EmpAuth_name").setValue("");
			this.getView().byId("EmpAuth_pos").setValue("");
			this.getView().byId("medicalComp").getSelectedKey("");
			this.getView().byId("AODTEST").setValue("");
			this.getView().byId("medicalfitness").setValue("");
			this.getView().byId("healthmanagement").setValue("");
			this.getView().byId("medicalComp").setValue("");
			this.getView().byId("idmedinput").setValue("");
			this.getView().byId("idmedinput").setValueState("None");
			this.getView().byId("idmedinput").setVisible(false);

			this.getView().byId("dateComp").setValue("");
			this.getView().byId("AODTEST").setSelectedKey("");
			this.getView().byId("medicalfitness").setSelectedKey("");
			this.getView().byId("healthmanagement").setSelectedKey("");
			this.getView().byId("AODTEST").setValueState("None");
			this.getView().byId("medicalfitness").setValueState("None");
			this.getView().byId("healthmanagement").setValueState("None");
			this.getView().byId("chk1").setSelected(false);
			this.getView().byId("chk2").setSelected(false);
			this.getView().byId("chk3").setSelected(false);
			this.getView().byId("chk4").setSelected(false);

			this.getView().byId("chk5").setSelected(false);
			this.getView().byId("chk6").setSelected(false);
			this.getView().byId("chk7").setSelected(false);
			this.getView().byId("chk8").setSelected(false);
			this.getView().byId("chk9").setSelected(false);
			this.getView().byId("chk10").setSelected(false);
			this.getView().byId("idLabelStartDate").setVisible(true);
			this.getView().byId("assign_StartDate").setVisible(true);

			this.getView().byId("idLabelTravelDate").setVisible(true);
			this.getView().byId("assign_TravelDate").setVisible(true);
			// this.getView().byId("CFDD").setVisible(false);
			// 	this.getView().byId("idvaccinestatus").setVisible(false);
			// 	this.getView().byId("SeconddoseDate").setVisible(false);
			// 	this.getView().byId("Consent").setVisible(false);

			this.getView().byId("CFDD").setValue("");
			this.getView().byId("CFDD").setValueState("None");
			this.getView().byId("idvaccinestatus").setSelectedKey("");
				this.getView().byId("idvaccinestatus").setValueState("None");
			this.getView().byId("SeconddoseDate").setValue("");
				this.getView().byId("SeconddoseDate").setValueState("None");
			this.getView().byId("Consent").setSelectedKey("");
				this.getView().byId("Consent").setValueState("None");
			this.getView().byId("medicalExpDate").setValue("");
				this.getView().byId("medicalExpDate").setValueState("None");
			this.getView().byId("idCovidChkbx").setSelected(false);
			this.getView().byId("idvaccinestatus").setEditable(true);
				this.getView().byId("SeconddoseDate").setEditable(true);
					
					this.getView().byId("Consent").setEditable(true);
						
				this.getView().byId("fileUploader").setEnabled(true);
					
			      this.getView().byId("medicalExpDate").setEditable(true);
			this.getView().byId("empauth1").setVisible(true);
			//	this.getView().byId("CovidTitle").setVisible(false);
			//	this.getView().byId("CAT").setVisible(false);

		},
		/* 
		 * Date - 28.04.2020
		 * Created By - Rakesh
		 * Description - This function is invoked when user clicks on back button of initiate request page
		 *->This function is invoked by onSubmit() method
		 *-> This function will take user to the FLP home screen when user launches the app from onboard tile
		 *-> This function will take user to the display table when user launches app from display table page
		 *->This function will auto clear all the values and value states of the input fields on navigation
		 *Called By- Onsubmit()*/
		onNavigate: function () {
			FileUploaded = false;
			this.changeFlag = false;
			this.Pernr = "";
			var simpleForm = this.getView().byId("empAuthorized1");
			simpleForm.destroyContent();
			this.getView().byId("idSubmitButton").destroyCustomData();
			this.getView().byId("idLabelStartDate").setVisible(true);
			this.getView().byId("assign_StartDate").setVisible(true);

			this.getView().byId("idLabelTravelDate").setVisible(true);
			this.getView().byId("assign_TravelDate").setVisible(true);
			//	this.getView().byId("CovidTitle").setVisible(false);
			var covidAttachmentSimpleForm = this.getView().byId("Covid_Tracker");
			var vaccineCertificate= this.getView().byId("fileUploader").getValue();
			if (vaccineCertificate !== "") {
			this.onFileDeleteConfirm1();
				
			}
			//	covidAttachmentSimpleForm.destroyContent();
			// for (var t = 0; t < covidAttachmentSimpleForm.getContent().length; t++) {
			// 	if (covidAttachmentSimpleForm.getContent()[t].getId().includes("idCancel")) {
			// 		covidAttachmentSimpleForm.getContent()[t].destroy();
			// 		t--;
			// 	}
			// 	if (covidAttachmentSimpleForm.getContent()[t].getId().includes("idVaccineLabel")) {
			// 		covidAttachmentSimpleForm.getContent()[t].destroy();
			// 		t--;
			// 	}
			// 	if (covidAttachmentSimpleForm.getContent()[t].getId().includes("uploader")) {
			// 		covidAttachmentSimpleForm.getContent()[t].destroy();
			// 		t--;

			// 	}
			// 	if (covidAttachmentSimpleForm.getContent()[t].getId().includes("idFileText")) {
			// 		covidAttachmentSimpleForm.getContent()[t].destroy();
			// 		t--;
			// 	}
			// }

			/*
			 * Start of Change 
			 * Changed On - 22.06.2020
			 *Changed By - Rakesh
			 * Change Description -User creates onboard request directly from seperate tile in FLP */
			if (this.navBack === "LAUNCHPAD") {
				//	window.history.go(-2);
				window.location.hash = "#";
				//window.history.go(-1);
				//return;
			}
			/*End of Change*/
			else {
				
				this.getView().byId("UploadCollection").setModel(new sap.ui.model.json.JSONModel());
				this.getView().byId("req_Type").setValue("");
				this.getView().byId("req_Desccomments").setValue("");
				this.getView().byId("pers_Title").setSelectedKey("");
				this.getView().byId("pers_Fname").setValue("");
				this.getView().byId("pers_Mname").setValue("");
				this.getView().byId("pers_Lname").setValue("");
				this.getView().byId("pers_DOB").setValue(""); /*Date*/
				this.getView().byId("pers_SAPnum").setValue("");
				this.getView().byId("pers_gender").setSelectedKey("");
				this.getView().byId("pers_Prename").setSelectedKey("");
				this.getView().byId("pers_Nationality").setSelectedKey("");
				this.getView().byId("pers_islander").setValue("");
				this.getView().byId("pers_Native").setSelectedKey("");
				this.getView().byId("conmail").setSelectedKey("");
				this.getView().byId("conmobile").setValue("");
				this.getView().byId("emergency_Rel").setSelectedKey("");
				this.getView().byId("emergency_Name").setValue("");
				this.getView().byId("emergency_Phnumber").setValue("");
				this.getView().byId("TB1").setVisible(false);
				this.getView().byId("Title1").setVisible(false);
				this.getView().byId("assign_StartDate").setValue("");
				this.getView().byId("assign_TravelDate").setValue("");
				this.getView().byId("assign_EstDate").setValue("");
				this.getView().byId("assign_Pos").setValue("");
				this.getView().byId("Mant_subgroup").setSelectedKey("");
				this.getView().byId("assign_Name").setValue("");
				this.getView().byId("assign_Leader").setValue("");
				this.getView().byId("assign_loc").setValue("");
				this.getView().byId("Project").setSelectedKey("");
				this.getView().byId("Emp_subgroup").setSelectedKey("");
				//	this.getView().byId("assign_Worksch").setValue("");
				//	this.getView().byId("assign_Vendor").setValue(Cu           );
				this.getView().byId("EmpAuth_name").setValue("");
				this.getView().byId("EmpAuth_pos").setValue("");
				this.getView().byId("medicalComp").setSelectedKey("");
				this.getView().byId("AODTEST").setSelectedKey("");
				this.getView().byId("medicalfitness").setSelectedKey("");
				this.getView().byId("healthmanagement").setSelectedKey("");
				this.getView().byId("medicalComp").setValue("");
				this.getView().byId("idmedinput").setValue("");
				this.getView().byId("idmedinput").setVisible(false);
				this.getView().byId("dateComp").setValue("");
				this.getView().byId("chk1").setSelected(false);
				this.getView().byId("chk2").setSelected(false);
				this.getView().byId("chk3").setSelected(false);
				this.getView().byId("chk4").setSelected(false);
				this.getView().byId("chk5").setSelected(false);
				this.getView().byId("chk6").setSelected(false);
				this.getView().byId("chk7").setSelected(false);
				this.getView().byId("chk8").setSelected(false);
				this.getView().byId("chk9").setSelected(false);
				this.getView().byId("chk10").setSelected(false);

				that.getView().byId("req_Type").setValueState("None");
				that.getView().byId("req_Desccomments").setValueState("None");
				that.getView().byId("pers_Title").setValueState("None");
				that.getView().byId("pers_Fname").setValueState("None");
				that.getView().byId("pers_Mname").setValueState("None");
				that.getView().byId("pers_Lname").setValueState("None");
				that.getView().byId("pers_DOB").setValueState("None"); /*Date*/
				that.getView().byId("pers_SAPnum").setValueState("None");
				that.getView().byId("pers_gender").setValueState("None");
				that.getView().byId("pers_Prename").setValueState("None");
				that.getView().byId("Mant_subgroup").setValueState("None");
				that.getView().byId("pers_Nationality").setValueState("None");
				that.getView().byId("pers_islander").setValueState("None");
				that.getView().byId("pers_Native").setValueState("None");
				that.getView().byId("conmail").setValueState("None");
				that.getView().byId("conmobile").setValueState("None");
				that.getView().byId("emergency_Rel").setValueState("None");
				that.getView().byId("emergency_Name").setValueState("None");
				that.getView().byId("emergency_Phnumber").setValueState("None");
				that.getView().byId("assign_StartDate").setValueState("None");
				that.getView().byId("assign_TravelDate").setValueState("None");
				that.getView().byId("assign_EstDate").setValueState("None");
				that.getView().byId("assign_Pos").setValueState("None");
				that.getView().byId("assign_Leader").setValueState("None");
				that.getView().byId("assign_loc").setValueState("None");
				that.getView().byId("Emp_subgroup").setValueState("None");
				that.getView().byId("Mant_subgroup").setValueState("None");
				that.getView().byId("Project").setValueState("None");
				//	this.getView().byId("assign_Worksch").setValue("");
				//	this.getView().byId("assign_Vendor").setValue(Cu           );
				that.getView().byId("EmpAuth_name").setValueState("None");
				that.getView().byId("EmpAuth_pos").setValueState("None");
				that.getView().byId("medicalComp").setValueState("None");
				that.getView().byId("medicalComp").setValueState("None");
				that.getView().byId("AODTEST").setValueState("None");
				that.getView().byId("medicalfitness").setValueState("None");
				that.getView().byId("healthmanagement").setValueState("None");
				that.getView().byId("idmedinput").setValueState("None");
				//	that.getView().byId("idmedinput")setValueState("None");
				that.getView().byId("dateComp").setValueState("None");
				that.getView().byId("chk1").setValueState("None");
				that.getView().byId("chk2").setValueState("None");
				that.getView().byId("chk3").setValueState("None");
				that.getView().byId("chk4").setValueState("None");

				that.getView().byId("chk5").setValueState("None");
				that.getView().byId("chk6").setValueState("None");
				that.getView().byId("chk7").setValueState("None");
				that.getView().byId("chk8").setValueState("None");
				that.getView().byId("chk9").setValueState("None");
				that.getView().byId("chk10").setValueState("None");
				that.getView().byId("UploadCollection").destroyItems();
				that.getView().byId("UploadCollection").removeAllItems();

				that.getView().byId("UploadCollection").setVisible(true);
				this.getView().byId("idUploadcollection").setVisible(true);
				this.getView().byId("Reqsection").setVisible(true);
				this.getView().byId("idpif").setVisible(true);
				this.getView().byId("idCINF").setVisible(true);
				this.getView().byId("idECD").setVisible(true);
				this.getView().byId("idASIF").setVisible(true);
				this.getView().byId("idDA").setVisible(true);
				this.getView().byId("IDMA").setVisible(true);
				this.getView().byId("idDECAG").setVisible(true);
				this.getView().byId("idDecLRW").setVisible(true);
				// this.getView().byId("CFDD").setVisible(false);
				// 		this.getView().byId("idvaccinestatus").setVisible(false);
				// 		this.getView().byId("SeconddoseDate").setVisible(false);
				// 		this.getView().byId("Consent").setVisible(false);

				this.getView().byId("CFDD").setValue("");
				this.getView().byId("idvaccinestatus").setSelectedKey("");
				this.getView().byId("SeconddoseDate").setValue("");
				this.getView().byId("Consent").setSelectedKey("");
				this.getView().byId("medicalExpDate").setValue("");
				this.getView().byId("idCovidChkbx").setSelected(false);
				this.getView().byId("idvaccinestatus").setEditable(true);
						
				this.getView().byId("SeconddoseDate").setEditable(true);
					
					this.getView().byId("Consent").setEditable(true);
						
				this.getView().byId("fileUploader").setEnabled(true);
					
			      this.getView().byId("medicalExpDate").setEditable(true);
					this.getView().byId("empauth1").setVisible(true);

				array = [];
				this.getOwnerComponent().getModel("tableModel").setData([]);
				var objectPageLayout = that.getView().byId("ObjectPageLayout");
				var EditAttrSection = that.getView().byId("Reqsection");
				objectPageLayout.setSelectedSection(EditAttrSection);
				this.getOwnerComponent().getRouter().navTo("displayTable");
				//return;
			}
		},
		/* 
		      * Date - 06.05.2020
		      * Created By - Akhil
		      * Description - This function will be invoked when user clicks on the '+' symbol in the attachments section
		      *->This function will POST the uploaded attachments one after the other with the slug value to the server
		      *->This function will call the getAttachmentListFileUploadRead() method to read the uploaded attachments
		      by passing the docno which is received
		      *Calling Function- getAttachmentListFileUploadRead()*/
		handleFileUploadDocument: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
			this.NotesModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			this.NotesModel.setUseBatch(false);
			this.NotesModel.refreshSecurityToken();
			//var userID = new sap.ushell.services.UserInfo().getId();
			//var userID = "583554";
			// var csrftoken = "nwIh7Khl5SSrKfz-hCN7YQ==";
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: this.vUser + "*CMSRQ" + "* *" + oEvent.getParameter("files")[0].name
			});
			this.getView().byId("UploadCollection").addHeaderParameter(oCustomerHeaderSlug);
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: this.NotesModel.getSecurityToken()
			});
			this.getView().byId("UploadCollection").addHeaderParameter(oCustomerHeaderToken);
		},
		// onBeforeUploadStarts: function (oEvent) {
		// 	var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
		// 		name: "slug",
		// 		value: "CMSRQ" + "@ @" + oEvent.getParameter("fileName")
		// 	});
		// 	this.getView().byId("UploadCollection").addHeaderParameter(oCustomerHeaderSlug);
		// },
		/* 
		 * Date - 06.05.2020
		 * Created By - Akhil
		 * Description - This function is called by onSubmit() method after request id is generated successfully
		 *-> This function will call the UpdateRefDocSet to update all the attachments with the request id */
		UploadUpdate: function () {
			// this.onOpenBusyDialog();
			var oUploadCollection = this.getView().byId("UploadCollection");
			var cFiles = oUploadCollection.getItems().length;
			// var UploadUrl =  "/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV/FileSet";
			// var uploadInfo = cFiles + " file(s)";
			// oUploadCollection.setUploadUrl(UploadUrl);
			if (cFiles > 0) {
				oUploadCollection.upload();
				var data = array;
				var docnum = [];
				for (var i = 0; i < data.length; i++) {
					var d = data[i][0].Docno;
					var Docno = {
						Docno: d
					};
					docnum.push(Docno);

				}
				var entity = {
					RefDoc: ReqID,
					Items: docnum
				};
				this.NotesModel.create("/UpdateRefDocSet", entity, null, false, function (
					OData,
					response) {
					data = OData.results;
				});
				var aItems = [];
				this.uploadecollectionlength = oUploadCollection.getItems().length;
				this.getView().byId("UploadCollection").getModel().setData({
					"items": aItems
				});
			}
		},
		/* 
      * Date - 06.05.2020
      * Created By - Akhil
      * Description - This function will be auto trigerred when the response code ron the server is 201 after the 
      upload of each attachment
      *-> This function will populate the error and success response from the server*/
		onUploadComplete: function (oEvent) {
			/*var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			var oUploadCollection = this.getView().byId("UploadCollection");
			for (var i = 0; i < oUploadCollection.getItems().length; i++) {
				if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
					oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
					break;
				}
			}*/
			var that = this;
			var otherJsonModel = new sap.ui.model.json.JSONModel();
			// var oUploadCollection = this.getView().byId("UploadCollection");
			var oUploadCollection = oEvent.getSource();
			if (oEvent.getParameter("files")[0].status === "201" || oEvent.getParameter("files")[0].status === 201) {
				var sFile = oEvent.getParameter("files")[0];
				var fileName = sFile.fileName;
				fileName = fileName;
				if (!fileName) {
					var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
					fileName = fileName[0];
				}
				this.fileName = fileName;
				var xml = oEvent.getParameter("files")[0].responseRaw;

				function parse(node, j) {
					var nodeName = node.nodeName.replace(/^.+:/, '').toLowerCase();
					var cur = null;
					var text = $(node).contents().filter(function (x) {
						return this.nodeType === 3;
					});
					if (text[0] && text[0].nodeValue.trim()) {
						cur = text[0].nodeValue;
					} else {
						cur = {};
						$.each(node.attributes, function () {
							if (this.name.indexOf('xmlns:') !== 0) {
								cur[this.name.replace(/^.+:/, '')] = this.value;
							}
						});
						$.each(node.children, function () {
							parse(this, cur);
						});
					}
					j[nodeName] = cur;
				}
				var roots = $(xml);
				var root = roots[roots.length - 1];
				var json = {};
				parse(root, json);
				this.sUploadedFile = oEvent.getParameter("files")[0].fileName;
				if (!this.sUploadedFile) {
					this.sUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
					this.sUploadedFile = this.sUploadedFile[0];
				}
				// that.updateAttachmentsTempId(json.entry.properties.docno);
				if (typeof json.entry.properties !== "undefined") {
					that.getAttachmentListFileUploadRead(json.entry.properties.docno);
				} else {
					that.getAttachmentListFileUploadRead(json.entry.category.content.properties.docno);
				}
				// console.log(json)\
				// if(oUploadCollection.getItems().length)
				// that.updateAttachmentsTempId(json.entry.properties.docno);
				//that.getAttachmentListFileUploadRead(json.entry.properties.docno);
				//	that.getAttachmentListFileUploadRead(json.entry.category.content.properties.docno);

				sap.m.MessageToast.show("File uploaded successfully.");
			} else if (oEvent.getParameter("files")[0].status === "0" || oEvent.getParameter("files")[0].status === 0) {
				// oUploadCollection.fireUploadTerminated();
			} else {
				if (oEvent.getParameter("files")[0] && oEvent.getParameter("files")[0].responseRaw) {
					var msgText = oEvent.getParameter("files")[0].responseRaw;
					var parseErrorMsg = jQuery.parseXML(msgText);
					var oXMLMsg = parseErrorMsg.querySelector("message");
					sap.m.MessageBox.show(oXMLMsg.textContent, sap.m.MessageBox.Icon.ERROR, "Error");
				} else {
					sap.m.MessageBox.show("File Upload failed!", sap.m.MessageBox.Icon.ERROR, "Error");
				}
				oUploadCollection.setUploadEnabled(true);
				// oUploadCollection.fireUploadTerminated();
			}
		},
		/* 
		 * Date - 06.05.2020
		 * Created By - Akhil
		 * Description - This function is called by onUploadComplete() method after the attachment is uploaded successfully
		 *Input- Document number to be passed to AttachmentsSet as a filter
		 *Output- This function will fetch the list of attachments uploaded for that document number
		 *Called By- onUploadComplete()*/
		getAttachmentListFileUploadRead: function (docno) {
			// /sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV/AttachmentsSet/?$filter=Refdocty eq 'MNFST' and Refdoc eq ‘ ' Ernam eq ‘Loginuser’

			var data;
			this.NotesModel.read("/AttachmentsSet/?$filter=Docno eq '" + docno + "'", null, null, false, function (
				OData,
				response) {
				data = OData.results;
			});
			array.push(data);
			// var omodel = new sap.ui.model.json.JSONModel(data);
			// this.getView().setModel(omodel, "AttachmentsModel");
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			if (!oData) {
				this.getView().byId("UploadCollection").setModel(new sap.ui.model.json.JSONModel());
			}
			var aItems = jQuery.extend(true, {}, oData).items;
			var oItem = {};
			// at the moment parameter fileName is not set in IE9
			if (!aItems) {
				aItems = [];
			}
			var formatting = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});

			var dateChangeFormat = formatting.format(data[0].Erdate);
			var currentUser = data[0].Ernam;
			oItem = {
				"documentId": jQuery.now().toString(), // generate Id,
				"fileName": this.sUploadedFile,
				"mimeType": "",
				"thumbnailUrl": "",
				"url": "",
				"attributes": [{
					"title": "Uploaded By",
					"text": currentUser
				}, {
					"title": "Uploaded On",
					"text": dateChangeFormat
				}]
			};
			aItems.push(oItem);
			this.getView().byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},
		/* 
		 * Date - 08.05.2020
		 * Created By - Akhil
		 * Description - This function is invoked when user clicks on delete button at the end of each file
		 *-> This function will delete the selected attachment by calling FileSet passing document number as a filter
		 * This function will populate error and success message from the server
		 *Called By- onUploadComplete()*/
		onFileDeleted: function (oEvent) {
			var deleteselect = oEvent.getParameter("item").getBindingContext().getPath();
			deleteselect = deleteselect.split("/");
			var i = deleteselect[2];
			var docnum = array[i][0].Docno;
			array.splice(i, 1);
			this.NotesModel.remove("/FileSet('" + docnum + "')", {
				method: "DELETE",
				success: function (data) {},
				error: function (e) {}
			});
			// var model = oEvent.getSource().getModel().getData()["items"].pop(i);
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("FileDeleted event triggered.");
		},
		/* 
		 * Date - 08.05.2020
		 * Created By - Akhil
		 * Description - This function is called by onFileDeleted() function
		 *-> This function will delete the  attachment pertaining to the received document number
		 *-> This function will update the count of attachments by calling getAttachmentTitleText() funtion
		 *Input- Document number
		 *Output- Array of attachments
		 *Called By- onFileDeleted()*/
		deleteItemById: function (sItemToDeleteId) {
			var oData = this.byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			jQuery.each(aItems, function (index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});
			this.byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
			this.byId("UploadCollection").setText(this.getAttachmentTitleText());
		},
		/* 
		 * Date - 08.05.2020
		 * Created By - Akhil
		 * Description - This function is called by deleteItemById() function
		 *-> This function will update the count after successful deletion of attachment
		 *-> This function will read the items of upload collection and retuns the length to deleteItemById() function*/
		getAttachmentTitleText: function () {
			var aItems = this.byId("UploadCollection").getItems();
			return "Additional Attachments (" + aItems.length + ")";
		},
		onUploadDelete1: function (oEvent) {
			// that = this;
		//	this.UploadDeleteEvt1 = oEvent.getSource();
			MessageBox.information("Are you sure you want to delete this Attachment?", {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction === "OK") {
						that.onFileDeleteConfirm1();
					}
				}
			});
		},
		onFileDeleteConfirm1: function (val) {
			var oEvent = val;
			var FileUploader = this.getView().byId("fileUploader");
			//var CheckBox = FileUploader.getCustomData()[2].getValue();
			FileUploader.setValue();
			this.fileModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_CMS_ATTACH_SRV", true);
			this.fileModel.remove("/FileSet('" + covidDocno + "')", {
				method: "DELETE",
				success: function (data) {},
				error: function (e) {}
			});
			// var model = oEvent.getSource().getModel().getData()["items"].pop(i);
			// this.deleteItemById(oEvent.getParameter("documentId"));
			sap.m.MessageToast.show("File: " + covidFileName + "  Deleted.  ");
			
			FileUploader.destroyHeaderParameters();
			FileUploader.removeAllHeaderParameters();
			FileUploader.setEnabled(true);
			if(typeof sap.ui.getCore().byId("idCancel1") != 'undefined'){
					sap.ui.getCore().byId("idCancel1").destroy();
			} 
			if(typeof sap.ui.getCore().byId("idFileText1") != 'undefined'){
			sap.ui.getCore().byId("idFileText1").destroy();
			}
			

			//CheckBox.setEnabled(true);
			//CheckBox.setSelected(false);
					// Docno2.splice(0, 1);
					// IE1--;
			// Docno
		},
		onCovidFormSelect: function () {
			var Checkbox1 = this.getView().byId("idCovidChkbx").getSelected();
			var vaccineCertificate= this.getView().byId("fileUploader").getValue();
			if (vaccineCertificate !== "") {
			this.onFileDeleteConfirm1();
				
			}
			
			
			if (Checkbox1) {
				this.getView().byId("CFDD").setValueState("None");
				this.getView().byId("idvaccinestatus").setValueState("None");
					this.getView().byId("idvaccinestatus").setEditable(false);
					this.getView().byId("idvaccinestatus").setSelectedKey();
					this.getView().byId("SeconddoseDate").setValueState("None");
				this.getView().byId("SeconddoseDate").setEditable(false);
					this.getView().byId("SeconddoseDate").setValue("");
				this.getView().byId("Consent").setValueState("None");
					this.getView().byId("Consent").setValue("");
					this.getView().byId("Consent").setEditable(false);
				this.getView().byId("fileUploader").setValueState("None");
					this.getView().byId("fileUploader").setValue("");
				this.getView().byId("fileUploader").setEnabled(false);
			    this.getView().byId("medicalExpDate").setValueState("None");
			      this.getView().byId("medicalExpDate").setEditable(false);
			       this.getView().byId("medicalExpDate").setValue("");
			    
				
			}
			else {
					this.getView().byId("CFDD").setValueState("None");
				this.getView().byId("idvaccinestatus").setValueState("None");
					this.getView().byId("idvaccinestatus").setEditable(true);
						this.getView().byId("idvaccinestatus").setSelectedKey();
					this.getView().byId("SeconddoseDate").setValueState("None");
				this.getView().byId("SeconddoseDate").setEditable(true);
					this.getView().byId("SeconddoseDate").setValue("");
				this.getView().byId("Consent").setValueState("None");
					this.getView().byId("Consent").setEditable(true);
						this.getView().byId("Consent").setValue("");
				this.getView().byId("fileUploader").setValueState("None");
				this.getView().byId("fileUploader").setEnabled(true);
					this.getView().byId("fileUploader").setValue("");
			    this.getView().byId("medicalExpDate").setValueState("None");
			      this.getView().byId("medicalExpDate").setEditable(true);
			       this.getView().byId("medicalExpDate").setValue("");
			}
			
			
			
		}
		
		
		
		
		
	});

});