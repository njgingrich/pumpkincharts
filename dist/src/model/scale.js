"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_scale_1 = require("d3-scale");
var data_1 = require("../interface/data");
function xScalePoints(data, range) {
    var min = data
        .map(function (a) { return Math.min.apply(Math, a.map(function (e) { return e.x; })); })
        .reduce(function (max, cur) { return Math.min(max, cur); }, 0);
    var max = data
        .map(function (a) { return Math.max.apply(Math, a.map(function (e) { return e.x; })); })
        .reduce(function (max, cur) { return Math.max(max, cur); }, 0);
    return d3_scale_1.scaleLinear()
        .range(range)
        .domain([min, max]);
}
function yScalePoints(data, range) {
    var min = data
        .map(function (a) { return Math.min.apply(Math, a.map(function (e) { return e.y; })); })
        .reduce(function (min, cur) { return Math.min(min, cur); }, 0);
    var max = data
        .map(function (a) { return Math.max.apply(Math, a.map(function (e) { return e.y; })); })
        .reduce(function (max, cur) { return Math.max(max, cur); }, 0);
    return d3_scale_1.scaleLinear()
        .range(range)
        .domain([min, max]);
}
function getScales(dataType, data, xRange, yRange) {
    switch (dataType) {
        case (data_1.DataType.POINTS, data_1.DataType.ROWS, data_1.DataType.COLUMNS): {
            return {
                xScale: xScalePoints(data, xRange),
                yScale: yScalePoints(data, yRange),
            };
        }
        default: {
            throw new Error('No valid data type found');
        }
    }
}
exports.getScales = getScales;
//# sourceMappingURL=scale.js.map