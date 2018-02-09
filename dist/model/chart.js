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
    chartType: data_1.ChartType.LINE,
    padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
    },
    strokes: [
        'blue',
        'red',
        'green',
        'yellow',
        'black',
        'brown',
        'purple',
        'orange',
    ],
    ticks: {
        x: function (d) { return d[0].length; },
        y: function (d) { return d[0].length; },
    },
    tickFormats: {
        x: null,
        y: null,
    },
};
var Chart = /** @class */ (function () {
    function Chart(opts) {
        this.options = Object.assign({}, defaultOptions, opts.options);
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
        this.draw(this.options.chartType);
    }
    Chart.prototype.draw = function (chartType) {
        this.chart = d3.select(this.options.parent);
        this.chart
            .attr('width', this.options.width)
            .attr('height', this.options.height);
        switch (chartType) {
            case data_1.ChartType.LINE: {
                this.lineChart();
                break;
            }
        }
    };
    Chart.prototype.lineChart = function () {
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
            case data_1.DataType.ROWS: {
                this.rotateRows();
                xScale = scale_1.xScaleColumns(this.data, [MARGIN.LEFT, WIDTH - MARGIN.RIGHT]);
                yScale = scale_1.yScaleColumns(this.data, [HEIGHT - MARGIN.TOP, MARGIN.BOTTOM]);
                lineFunctions = line_1.linesFromColumns(this.data, xScale, yScale);
                break;
            }
            default: {
                throw new Error('No valid data type found');
            }
        }
        var xAxis;
        var yAxis;
        if (typeof this.options.ticks.x === 'function') {
            xAxis = d3.axisBottom(xScale).ticks(this.options.ticks.x(this.data));
        }
        else {
            xAxis = d3.axisBottom(xScale).ticks(this.options.ticks.x);
        }
        if (typeof this.options.ticks.y === 'function') {
            yAxis = d3.axisLeft(yScale).ticks(this.options.ticks.y(this.data));
        }
        else {
            yAxis = d3.axisLeft(yScale).ticks(this.options.ticks.y);
        }
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
                .attr('stroke', this.options.strokes[i])
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        }
    };
    Chart.prototype.rotateRows = function () {
        var columns = [];
        for (var i = 0; i < this.data[0].length; i++) {
            columns.push(new Array());
        }
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var i = 0; i < row.length; i++) {
                var val = row[i];
                columns[i].push(val);
            }
        }
        this.data = columns;
    };
    return Chart;
}());
exports.Chart = Chart;
