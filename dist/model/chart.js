"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var DataType;
(function (DataType) {
    DataType[DataType["POINTS"] = 0] = "POINTS";
    DataType[DataType["COLUMNS"] = 1] = "COLUMNS";
    DataType[DataType["ROWS"] = 2] = "ROWS";
})(DataType = exports.DataType || (exports.DataType = {}));
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
            this.dataType = DataType.COLUMNS;
        }
        else if (opts.data.rows) {
            this.data = opts.data.rows;
            this.dataType = DataType.ROWS;
        }
        else if (opts.data.points) {
            this.data = opts.data.points;
            this.dataType = DataType.POINTS;
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
            case DataType.POINTS: {
                xScale = this.xScalePoints([MARGIN.LEFT, WIDTH - MARGIN.RIGHT]);
                yScale = this.yScalePoints([HEIGHT - MARGIN.TOP, MARGIN.BOTTOM]);
                lineFunctions = this.linesFromPoints(xScale, yScale);
                break;
            }
            case DataType.COLUMNS: {
                xScale = this.xScaleColumns([MARGIN.LEFT, WIDTH - MARGIN.RIGHT]);
                yScale = this.yScaleColumns([HEIGHT - MARGIN.TOP, MARGIN.BOTTOM]);
                lineFunctions = this.linesFromColumns(xScale, yScale);
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
        if (this.dataType === DataType.POINTS) {
            var lineFunction = d3
                .line()
                .x(function (d) { return xScale(Number(d.x)); })
                .y(function (d) { return yScale(Number(d.y)); });
            this.chart
                .append('path')
                .attr('d', lineFunction(this.data))
                .attr('stroke', this.options.strokes[0])
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        }
        else if (this.dataType === DataType.COLUMNS) {
            for (var i = 0; i < lineFunctions.length; i++) {
                this.chart
                    .append('path')
                    .attr('d', lineFunctions[i](this.data[i]))
                    .attr('stroke', this.options.strokes[0])
                    .attr('stroke-width', 2)
                    .attr('fill', 'none');
            }
        }
    };
    Chart.prototype.xScalePoints = function (range) {
        return d3
            .scaleLinear()
            .range(range)
            .domain([
            d3.min(this.data, function (d) { return d.x; }) * 1,
            d3.max(this.data, function (d) { return d.x; }) * 1,
        ]);
    };
    Chart.prototype.xScaleColumns = function (range) {
        var longest = this.data
            .map(function (a) { return a.length; })
            .reduce(function (max, cur) { return Math.max(max, cur); }, 0);
        return d3
            .scaleLinear()
            .range(range)
            .domain([0, longest]);
    };
    Chart.prototype.yScalePoints = function (range) {
        return d3
            .scaleLinear()
            .range(range)
            .domain([
            d3.min(this.data, function (d) { return d.y; }) * 1,
            d3.max(this.data, function (d) { return d.y; }) * 1,
        ]);
    };
    Chart.prototype.yScaleColumns = function (range) {
        var min = this.data
            .map(function (a) { return Math.min.apply(Math, a); })
            .reduce(function (max, cur) { return Math.min(max, cur); }, 0);
        var max = this.data
            .map(function (a) { return Math.max.apply(Math, a); })
            .reduce(function (max, cur) { return Math.max(max, cur); }, 0);
        return d3
            .scaleLinear()
            .range(range)
            .domain([min, max]);
    };
    Chart.prototype.linesFromPoints = function (xScale, yScale) {
        var funcs = [];
        funcs.push(d3
            .line()
            .x(function (d) { return xScale(Number(d.x)); })
            .y(function (d) { return yScale(Number(d.y)); }));
        return funcs;
    };
    Chart.prototype.linesFromColumns = function (xScale, yScale) {
        var funcs = [];
        var _loop_1 = function (col) {
            funcs.push(d3
                .line()
                .x(function (d) { return xScale(col.indexOf(d)); })
                .y(function (d) { return yScale(Number(d)); }));
        };
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var col = _a[_i];
            _loop_1(col);
        }
        return funcs;
    };
    return Chart;
}());
exports.Chart = Chart;
