"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var data_1 = require("../interface/data");
function xScalePoints(data, range) {
    var min = data
        .map(function (a) { return Math.min.apply(Math, a.map(function (e) { return e.x; })); })
        .reduce(function (max, cur) { return Math.min(max, cur); }, 0);
    var max = data
        .map(function (a) { return Math.max.apply(Math, a.map(function (e) { return e.x; })); })
        .reduce(function (max, cur) { return Math.max(max, cur); }, 0);
    return d3
        .scaleLinear()
        .range(range)
        .domain([min, max]);
}
function xScaleColumns(data, range) {
    var longest = data
        .map(function (a) { return a.length; })
        .reduce(function (max, cur) { return Math.max(max, cur); }, 0);
    return d3
        .scaleLinear()
        .range(range)
        .domain([0, longest - 1]);
}
function yScalePoints(data, range) {
    var min = data
        .map(function (a) { return Math.min.apply(Math, a.map(function (e) { return e.y; })); })
        .reduce(function (min, cur) { return Math.min(min, cur); }, 0);
    var max = data
        .map(function (a) { return Math.max.apply(Math, a.map(function (e) { return e.y; })); })
        .reduce(function (max, cur) { return Math.max(max, cur); }, 0);
    return d3
        .scaleLinear()
        .range(range)
        .domain([min, max]);
}
function yScaleColumns(data, range) {
    var min = data
        .map(function (a) { return Math.min.apply(Math, a); })
        .reduce(function (min, cur) { return Math.min(min, cur); }, 0);
    var max = data
        .map(function (a) { return Math.max.apply(Math, a); })
        .reduce(function (max, cur) { return Math.max(max, cur); }, 0);
    return d3
        .scaleLinear()
        .range(range)
        .domain([min, max]);
}
function getScales(dataType, data, xRange, yRange) {
    switch (dataType) {
        case data_1.DataType.POINTS: {
            return {
                xScale: xScalePoints(data, xRange),
                yScale: yScalePoints(data, yRange),
            };
        }
        case data_1.DataType.COLUMNS: {
            return {
                xScale: xScaleColumns(data, xRange),
                yScale: yScaleColumns(data, yRange),
            };
        }
        case data_1.DataType.ROWS: {
            return {
                xScale: xScaleColumns(data, xRange),
                yScale: yScaleColumns(data, yRange),
            };
        }
        default: {
            throw new Error('No valid data type found');
        }
    }
}
exports.getScales = getScales;
