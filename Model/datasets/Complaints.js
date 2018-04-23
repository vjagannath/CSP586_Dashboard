'use strict'

class Complaints {

    constructor(fileName, dfIn) {
        var fileProps = {};
        var columns = dfIn.listColumns();

        for (let col in columns) {
            Object.defineProperty(fileProps, columns[col], {
                value: {},
                writable: true,
                enumerable: true,
                configurable: true
            });
            var distinctCount = dfIn.distinct(columns[col]).count();
        }

        this._properties = fileProps;
    }

    getFileProperties() {
        return this._properties;
    }
}