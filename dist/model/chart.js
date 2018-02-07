"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var data_1 = require("../interface/data");
var scale_1 = require("./scale");
var line_1 = require("./line");
var defaultOptions = {
    width: 900,
    height: 500,
    parent: document.getElementsByTagName('svg')[0],
    padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
    },
    strokes: ['blue'],
};
var Chart = /** @class */ (function () {
    function Chart(opts) {
        this.options = defaultOptions;
        this.data = [];
        this.chart = {};
        if (opts.data.columns) {
            this.data = opts.data.columns;
            this.dataType = data_1.DataType.COLUMNS;
        }
        else if (opts.data.rows) {
            this.data = opts.data.rows;
            this.dataType = data_1.DataType.ROWS;
        }
        else if (opts.data.points) {
            this.data = opts.data.points;
            this.dataType = data_1.DataType.POINTS;
        }
        else {
            throw new Error('No valid data type found');
        }
        if (opts.options.height)
            this.options.height = opts.options.height;
        if (opts.options.parent)
            this.options.parent = opts.options.parent;
        if (opts.options.strokes)
            this.options.strokes = opts.options.strokes;
        if (opts.options.width)
            this.options.width = opts.options.width;
        if (opts.options.padding) {
            if (opts.options.padding.top)
                this.options.padding.top = opts.options.padding.top;
            if (opts.options.padding.bottom)
                this.options.padding.bottom = opts.options.padding.bottom;
            if (opts.options.padding.left)
                this.options.padding.left = opts.options.padding.left;
            if (opts.options.padding.right)
                this.options.padding.right = opts.options.padding.right;
        }
    }
    Chart.prototype.draw = function () {
        this.chart = d3.select(this.options.parent);
        var WIDTH = this.options.width;
        var HEIGHT = this.options.height;
        var MARGIN = {
            TOP: this.options.padding.top,
            RIGHT: this.options.padding.right,
            BOTTOM: this.options.padding.bottom,
            LEFT: this.options.padding.left,
        };
        var xScale;
        var yScale;
        var lineFunctions;
        switch (this.dataType) {
            case data_1.DataType.POINTS: {
                xScale = scale_1.xScalePoints(this.data, [MARGIN.LEFT, WIDTH - MARGIN.RIGHT]);
                yScale = scale_1.yScalePoints(this.data, [HEIGHT - MARGIN.TOP, MARGIN.BOTTOM]);
                lineFunctions = line_1.linesFromPoints(this.data, xScale, yScale);
                break;
            }
            case data_1.DataType.COLUMNS: {
                xScale = scale_1.xScaleColumns(this.data, [MARGIN.LEFT, WIDTH - MARGIN.RIGHT]);
                yScale = scale_1.yScaleColumns(this.data, [HEIGHT - MARGIN.TOP, MARGIN.BOTTOM]);
                lineFunctions = line_1.linesFromColumns(this.data, xScale, yScale);
                break;
            }
            default: {
                throw new Error('No valid data type found');
            }
        }
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);
        this.chart
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', "translate(0, " + (HEIGHT - MARGIN.BOTTOM) + ")")
            .call(xAxis);
        this.chart
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', "translate(" + MARGIN.LEFT + ", 0)")
            .call(yAxis);
        for (var i = 0; i < lineFunctions.length; i++) {
            this.chart
                .append('path')
                .attr('d', lineFunctions[i](this.data[i]))
                .attr('stroke', this.options.strokes[0])
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        }
    };
    return Chart;
}());
exports.Chart = Chart;
