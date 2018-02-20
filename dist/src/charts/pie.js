"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_shape_1 = require("d3-shape");
function getArc(radius, width, height) {
    if (typeof radius === 'function') {
        return d3_shape_1.arc()
            .innerRadius(0)
            .outerRadius(radius(width, height));
    }
    else {
        return d3_shape_1.arc()
            .innerRadius(0)
            .outerRadius(radius);
    }
}
exports.getArc = getArc;
//# sourceMappingURL=pie.js.map