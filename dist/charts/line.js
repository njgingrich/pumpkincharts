"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_shape_1 = require("d3-shape");
var data_1 = require("../interface/data");
function linesFromPoints(data, xScale, yScale) {
    var funcs = [];
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var col = data_2[_i];
        funcs.push(d3_shape_1.line()
            .x(function (d) { return xScale(d.x); })
            .y(function (d) { return yScale(d.y); }));
    }
    return funcs;
}
function linesFromColumns(data, xScale, yScale) {
    var funcs = [];
    var _loop_1 = function (col) {
        funcs.push(d3_shape_1.line()
            .x(function (d) { return xScale(col.indexOf(d)); })
            .y(function (d) { return yScale(d); }));
    };
    for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
        var col = data_3[_i];
        _loop_1(col);
    }
    return funcs;
}
function getLineFunctions(dataType, data, xScale, yScale) {
    switch (dataType) {
        case data_1.DataType.POINTS: {
            return linesFromPoints(data, xScale, yScale);
        }
        case data_1.DataType.COLUMNS: {
            return linesFromColumns(data, xScale, yScale);
        }
        case data_1.DataType.ROWS: {
            return linesFromColumns(data, xScale, yScale);
        }
        default: {
            throw new Error('Not a valid data type for line chart');
        }
    }
}
exports.getLineFunctions = getLineFunctions;
