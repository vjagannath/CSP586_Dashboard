'use strict'

var environmentalDashboard = environmentalDashboard || {};

environmentalDashboard.utils = function () {	
	var dataset = new Dataset();
	let chartController = new ChartController();
	var bindInitEvents = function () {
		//Bind a function to handle file upload event;
		$("#txtFileUpload").change(function () {			
			dataset.handleFileUploadEvent(chartController);
		});
		
		//Bind a function to handle clear content event;
		$("#btnClearContent").click(function () {
		    dataset.handleClearContentEvent();
		});

		//Bind a function to handle apply selection event;
		$("#btnApplySelection").click(function () {
		    dataset.handleApplySelectionEvent();
		});

        //Bind a function to handle apply selection event;
        $("#displayChart").click(function () {
            chartController.displayChart();
        });
	}();	
}

var utilities = new environmentalDashboard.utils();