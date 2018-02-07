"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
function linesFromPoints(data, xScale, yScale) {
    var funcs = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var col = data_1[_i];
        funcs.push(d3
            .line()
            .x(function (d) { return xScale(d.x); })
            .y(function (d) { return yScale(d.y); }));
    }
    return funcs;
}
exports.linesFromPoints = linesFromPoints;
function linesFromColumns(data, xScale, yScale) {
    var funcs = [];
    var _loop_1 = function (col) {
        funcs.push(d3
            .line()
            .x(function (d) { return xScale(col.indexOf(d)); })
            .y(function (d) { return yScale(d); }));
    };
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var col = data_2[_i];
        _loop_1(col);
    }
    return funcs;
}
exports.linesFromColumns = linesFromColumns;
