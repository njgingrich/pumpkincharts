"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
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
    return d3
        .arc()
        .innerRadius(donutSize)
        .outerRadius(radiusSize);
}
exports.getDonut = getDonut;
