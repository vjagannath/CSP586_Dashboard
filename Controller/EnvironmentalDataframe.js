'use strict'

// Create a class to act as a wrapper to DataFrame library
class EnvironmentalDataframe {

    constructor(fileIn, client) {
        this._file = fileIn;
        this.DataFrame = dfjs.DataFrame;
        this._client = client;
        this.DataFrame.fromCSV(fileIn).then(df =>this.setDataFrameObject(df));
        this._filteredDataframe = null;
    }

    /* Getters */
    getFilteredDataframe() {
        return this._filteredDataframe;
    }

    getDataFrame() {
        return this.DataFrame;
    }

    getDataFrameColumns() {
        return this._dfColumns;
    }

    static dataFrameObject() {
        return EnvironmentalDataframe._df;
    }

    /* Setters */
    setDataFrameObject(dfIn) {
        EnvironmentalDataframe._df = dfIn;
        this._dfColumns = EnvironmentalDataframe._df.listColumns();
        this.notifyClients();
    }

    setFilteredDataframe(filteredDf) {
        this._filteredDataframe = filteredDf;
    }

    /* Notify registered client that data frame has changed*/
    notifyClients() {
        this._client.handleDataFrameChangedEvent();
    }

}