'use strict'

var environmentalDashboard = environmentalDashboard || {};

environmentalDashboard.utils = function () {	
	var dataset = new Dataset();
	var bindInitEvents = function () {

		//Bind a function to handle file upload event;
		$("#txtFileUpload").change(function () {			
			dataset.handleFileUploadEvent();
		});
		
		//Bind a function to handle clear content event;
		$("#btnClearContent").click(function () {
		    dataset.handleClearContentEvent();
		});

		//Bind a function to handle apply selection event;
		$("#btnApplySelection").click(function () {
		    dataset.handleApplySelectionEvent();
		});
	}();	
}

var utilities = new environmentalDashboard.utils();
