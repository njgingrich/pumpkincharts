"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_shape_1 = require("d3-shape");
var data_1 = require("../interface/data");
function linesFromPoints(data, xScale, yScale) {
    var funcs = [];
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var col = data_2[_i];
        funcs.push(d3_shape_1.line()
            .x(function (d) {
            console.log('d:', d, 'x:', d.x);
            return xScale(d.x);
        })
            .y(function (d) {
            console.log('d:', d, 'y:', d.y);
            return yScale(d.y);
        }));
    }
    return funcs;
}
function getLineFunctions(dataType, data, xScale, yScale) {
    switch (dataType) {
        // only allow points, rows, or columns for line charts
        case data_1.DataType.POINTS, data_1.DataType.ROWS, data_1.DataType.COLUMNS: {
            return linesFromPoints(data, xScale, yScale);
        }
        default: {
            throw new Error('Not a valid data type for line chart');
        }
    }
}
exports.getLineFunctions = getLineFunctions;
//# sourceMappingURL=line.js.map