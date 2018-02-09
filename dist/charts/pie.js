"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
function getArc(radius, width, height) {
    if (typeof radius === 'function') {
        return d3
            .arc()
            .innerRadius(0)
            .outerRadius(radius(width, height));
    }
    else {
        return d3
            .arc()
            .innerRadius(0)
            .outerRadius(radius);
    }
}
exports.getArc = getArc;
