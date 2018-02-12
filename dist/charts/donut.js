"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_shape_1 = require("d3-shape");
function getDonut(radius, donut, width, height) {
    var radiusSize;
    if (typeof radius === 'function') {
        radiusSize = radius(width, height);
    }
    else {
        radiusSize = radius;
    }
    var donutSize;
    if (typeof donut === 'function') {
        donutSize = donut(radiusSize);
    }
    else {
        donutSize = donut;
    }
    return d3_shape_1.arc()
        .innerRadius(donutSize)
        .outerRadius(radiusSize);
}
exports.getDonut = getDonut;
