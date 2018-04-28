'use strict'

class Dataset {

    constructor(cc) {
        this._dfObj = null;
        this._fileIn = null;
        this._fileProperties = null;
        this.chartController = null;
        this.reloadValue = 0;
        this.rowFilter = null;
    }

    handleFileUploadEvent(cc) {
        // Set the chartController
        this.chartController = cc;

        //disable file upload again until clear button is clicked
        document.getElementById("txtFileUpload").disabled = true;

        // read and set the file name
        this._fileIn = document.getElementById("txtFileUpload").files[0];

        // create and set the data frame instance
        this._dfObj = new EnvironmentalDataframe(this._fileIn, this);
    }

    handleDataFrameChangedEvent() {
        //get df object from environmental data frame class instance
        var df = EnvironmentalDataframe.dataFrameObject();

        // create an instance of the data set considered
        var complaintsDataSetObj = new Complaints(this._fileIn, df);

        // set file properties
        this._fileProperties = complaintsDataSetObj.getFileProperties();

        // display the table data
        this.displayDataTable(df);        
    }

    displayStatistics(dataFrameInput){
        var statistics = document.getElementById("statistics");
        statistics.innerHTML = "";
        statistics.appendChild(document.createTextNode("Statistics"));
        statistics.appendChild(document.createElement("br"));
        statistics.appendChild(document.createTextNode("Total Number Of Complaints : " + dataFrameInput.count()));
        statistics.appendChild(document.createElement("br"));
        statistics.appendChild(document.createTextNode("Types of Complaints : " + dataFrameInput.unique('COMPLAINT TYPE').count()));
        $("#statistics").show();
    }
    
    clearStatistics(){
        var statistics = document.getElementById("statistics");
        statistics.innerHTML = "";
        $("#statistics").show();
    }

    displayDataTable(dataFrameInput, filteredColumnList) {
        // clear existing table content from display
        this.clearDataTableContent();

        // check if any filter had been applied on columns to be displayed
        var df;
        if (filteredColumnList == undefined || filteredColumnList.length == 0) 
        {            
            df = dataFrameInput;
        }
        else 
        {
            df = dataFrameInput.select(...filteredColumnList)           
        }

        // show available column options for filtering
        this.displayColumns(dataFrameInput);

        // display table data
        var columnNames = this.toObject(df.listColumns());
        var displayedTable = $('#dataset').DataTable
        (
            {
                data: df.toArray(),
                columns: columnNames,
                "pageLength": 10,
                "searching": false,
                "info": false,
                "ordering": false,          
            }

        )

        document.getElementById('exporttocsv').style.visibility = 'visible';
        $("#exporttocsv").show();

        // display statistics
        this.displayStatistics(df);

        // handle charts
        this.chartController.displayColumns(df);

        // handle row filtering
        if (this.reloadValue > 0)
        {
            this.rowFilter.refresh($('#dataset'));
        }
        else
        {
            this.rowFilter = new DropDownFilter($('#dataset'), {});
        }

        this.reloadValue++;

        var target = this.rowFilter;

        displayedTable.on( 'draw', function () {
            target.refresh($('#dataset'));
        } );
    }

    handleApplySelectionEvent() 
    {
        try 
        {
            var columnList = this.getSelectedColumns();
            this.displayDataTable(EnvironmentalDataframe.dataFrameObject(), columnList);
        }
        catch (error) {
            // do -nothing
        }
    }

    //This method displays list of columns to apply selection criteria
    displayColumns(df) 
    {           
        // get the selected columns
        //var columns = $("#selection .selectionColumn label input[name=lblColSelect]:checked");
        
      var f = df.listColumns();
      var selection = document.getElementById("selection");
      selection.innerHTML = "";
      var table = document.createElement("table");
      var count = 0;
      var tr, tabCell;
      for (var k = 0; k < f.length; k++) 
      {
        if(count%4 == 0)
        {
            tr = table.insertRow(-1);
        }

        var label = document.createElement("label");
        var description = document.createTextNode(f[k]);
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "selectedcol";
        checkbox.name = "lblColSelect";
        checkbox.value = f[k];

        label.appendChild(checkbox);
        label.appendChild(description);

        tabCell = tr.insertCell(-1);
        tabCell.innerHTML = label.innerHTML;
        count++;
      }
      selection.appendChild(table);
      $("#selection").show();
      $("#applySelection").show();
    }

    handleClearContentEvent() 
    {
        this.clearDataTableContent();
        this.clearSelectionContent();
        this.clearStatistics();
        
        // Enable browse button to select the file
        document.getElementById("txtFileUpload").disabled = false;
    }

    clearSelectionContent()
    {
        $('#selection').empty();
        //$('#applySelection').empty();
    }

    clearDataTableContent() 
    {
        try 
        {
            if ($.fn.DataTable.isDataTable('#dataset')) 
            {
                $('#dataset').DataTable().destroy();
            }
        }
        catch (error) 
        {
            // do - nothing
        }
        finally 
        {
            $('#dataset').empty();
            $("#txtFileUpload").empty();
            $("txtFileUpload").value = "";
            
            document.getElementById('exporttocsv').style.visibility = 'hidden';
            $("#exporttocsv").show();
        }
    }

    toObject(arr) 
	{
        var objArray = [];
        for (var i = 0; i < arr.length; i++) {
            objArray[i] = { "title": arr[i] };
        }
        return objArray;
    }

    getSelectedColumns() 
	{        
        var checkedColumns = [];
        
        var inp = document.querySelectorAll("[id='selectedcol']");
        var nr_inp = inp.length;

        for (var j = 0; j < nr_inp; j++) 
        {
          if (inp[j].type == 'checkbox' && inp[j].checked == true) checkedColumns.push(inp[j].value);
        }

        return checkedColumns;
    }
}