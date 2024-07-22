sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller, Fragment, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.app.apicrudoperations.controller.Home", {
            onInit: function () {

            },

            onDelete: function () {
                var select =
                    this.getView().byId("idTable").getSelectedItem().getBindingContext().getPath();
                var oModel = this.getView().getModel();
                oModel.setUseBatch(false);
                oModel.remove(select, {
                    success: function (oData) {
                        sap.m.MessageBox.success("Succesfully deleted");
                        oModel.refresh(true);
                    },
                    error: function (oError) {
                        sap.m.MessageBox.error("Error while deleting data");
                    }
                })
            },

            onAdd: async function () {
                this.oDialog ??= await this.loadFragment({
                    name: "com.app.apicrudoperations.fragments.create"
                })
                this.oDialog.open();
            },
            // Create a New Id into Products Table...
            onCreate: async function () {
                debugger
                var oModel = this.getView().getModel();
                oModel.setUseBatch(false);
                var oId = this.getView().byId("idInput").getValue();
                var idEsixts = await this.onRead(oId);
                if (idEsixts) {
                    MessageToast.show("ID already exsists");
                    return
                }
                oModel.create("/Products", {
                    ID: this.byId("idInput").getValue(),
                    Name: this.byId("idInput1").getValue(),
                    Description: this.byId("idInput2").getValue(),
                    ReleaseDate: this.byId("idInput3").getValue(),
                    Rating: this.byId("idInput4").getValue(),
                    DiscontinuedDate: this.byId("idInput5").getValue(),
                    Price: this.byId("idInput6").getValue()
                }, {
                    success: function (oData) {
                        sap.m.MessageBox.success("Succesfully Created");
                        oModel.refresh(true);
                    },
                    error: function (oError) {
                        sap.m.MessageBox.error("Error while creating data");
                    }
                });
                this.onClear();
            },
            //checking oId in Products Table existed or not...
            onRead: function (oId) {
                var oModel = this.getView().getModel();
                return new Promise((resolve, reject) => {
                    oModel.read("/Products", {
                        filters: [new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oId)],
                        success: function (oData) {
                            // sap.m.MessageBox.error("Value Exists");
                            resolve(oData.results.length > 0);
                        },
                        error: function (oError) {
                            reject(
                                "An error occurred while checking username existence."
                            );
                        }
                    })
                });
            },
            onClear: function () {
                const oView = this.getView();
                oView.byId("idInput").setValue();
                oView.byId("idInput1").setValue();
                oView.byId("idInput2").setValue();
                oView.byId("idInput3").setValue();
                oView.byId("idInput4").setValue();
                oView.byId("idInput5").setValue();
            },

            //Close the Create Dialog Box... 
            onCancel: function () {
                //this.oDialog.close(); //another way to close a dialog
                this.byId("idDialog").close();
            },

            //EDIT & Updating the Details in Products Table...
            onEdit1: function (oEvent) {
                var oButton = oEvent.getSource();
                var oText = oButton.getText();
                var Table = oButton.getParent();
                var oModel = this.getView().getModel();
                oModel.setUseBatch(false)
                if (oText === 'Edit') {
                    oButton.setText("Submit");
                    var ocell1 = oButton.getParent().getCells()[4].setEditable(true);
                    var ocell2 = oButton.getParent().getCells()[6].setEditable(true);
                } else {
                    oButton.setText("Edit");
                    var ocell1 = oButton.getParent().getCells()[4].setEditable(false);
                    var ocell2 = oButton.getParent().getCells()[6].setEditable(false);
                    var value1 = oButton.getParent().getCells()[4].getValue();
                    var value2 = oButton.getParent().getCells()[6].getValue();
                    var id = oButton.getParent().getCells()[0].getText();
                    oModel.update("/Products(" + id + ")", { Rating: value1, Price: value2 }, {
                        success: function (oData) {
                            sap.m.MessageBox.success("Succesfully Updated");
                            oModel.refresh(true);
                        },
                        error: function (oError) {
                            sap.m.MessageBox.error("Error while Updating data");
                        }
                    })
                }
            },
        });
    });
