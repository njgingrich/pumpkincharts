"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_array_1 = require("d3-array");
var d3_selection_1 = require("d3-selection");
var d3_scale_1 = require("d3-scale");
var d3_shape_1 = require("d3-shape");
var d3_axis_1 = require("d3-axis");
var data_1 = require("./interface/data");
var scale_1 = require("./model/scale");
var line_1 = require("./charts/line");
var donut_1 = require("./charts/donut");
var pie_1 = require("./charts/pie");
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
    radius: function (width, height) { return Math.min(width, height) / 2; },
    donut: function (radius) { return radius / 2; },
};
var Chart = /** @class */ (function () {
    function Chart(opts) {
        this.options = Object.assign({}, defaultOptions, opts.options);
        this.data = [];
        this.chart = {};
        this.dataType = data_1.DataType.COLUMNS;
        this.add(opts.data);
    }
    Chart.prototype.add = function (data) {
        if (data.columns) {
            this.data = this.data.concat(this.convertColumnsToPoints(data.columns));
            this.dataType = data_1.DataType.COLUMNS;
        }
        else if (data.rows) {
            this.data = this.data.concat(this.rotateRows(data.rows));
            this.dataType = data_1.DataType.ROWS;
        }
        else if (data.points) {
            this.data = this.data.concat(data.points);
            this.dataType = data_1.DataType.POINTS;
        }
        else if (data.values) {
            this.data = this.data.concat(data.values);
            this.dataType = data_1.DataType.VALUES;
        }
        else if (data.json) {
            this.data = this.data.concat(data.json);
            this.dataType = data_1.DataType.JSON;
        }
        else {
            throw new Error('No valid data type found');
        }
        this.redraw();
    };
    Chart.prototype.chartDimensions = function () {
        return {
            width: this.chartWidth(),
            height: this.chartHeight(),
        };
    };
    Chart.prototype.chartWidth = function () {
        return (this.options.width -
            this.options.padding.left -
            this.options.padding.right);
    };
    Chart.prototype.chartHeight = function () {
        return (this.options.height -
            this.options.padding.top -
            this.options.padding.bottom);
    };
    Chart.prototype.draw = function (chartType) {
        this.chart = d3_selection_1.select(this.options.parent);
        this.chart
            .attr('width', this.options.width)
            .attr('height', this.options.height);
        switch (chartType) {
            case data_1.ChartType.LINE: {
                this.lineChart();
                break;
            }
            case data_1.ChartType.PIE: {
                this.pieChart();
                break;
            }
            case data_1.ChartType.DONUT: {
                this.donutChart();
                break;
            }
            case data_1.ChartType.BAR: {
                this.barChart();
                break;
            }
        }
    };
    Chart.prototype.redraw = function () {
        d3_selection_1.select(this.options.parent).selectAll('*').remove();
        this.draw(this.options.chartType);
    };
    Chart.prototype.setOptions = function (newOptions) {
        this.options = Object.assign(this.options, newOptions);
        this.redraw();
    };
    Chart.prototype.barChart = function () {
        var _this = this;
        this.chart.append('g').attr('transform', "translate(\n          " + this.options.padding.left + ",\n          " + this.options.padding.top + "\n        )");
        var xScale = d3_scale_1.scaleBand()
            .range([0, this.chartWidth()])
            .padding(0.1);
        var yScale = d3_scale_1.scaleLinear().range([this.chartHeight(), 0]);
        var xAxis = d3_axis_1.axisBottom(xScale).ticks(this.options.tickFormats.x);
        var yAxis = d3_axis_1.axisLeft(yScale).ticks(this.options.tickFormats.y);
        xScale.domain(this.data.map(function (d) { return d.name; }));
        yScale.domain([0, d3_array_1.max(this.data, function (d) { return d.sales; })]);
        this.chart
            .select('g')
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', "translate(0, " + this.chartHeight() + ")")
            .call(xAxis);
        this.chart
            .select('g')
            .append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Frequency');
        this.chart
            .select('g')
            .selectAll('.bar')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function (d) { return xScale(d.name); })
            .attr('width', xScale.bandwidth())
            .attr('y', function (d) { return yScale(d.sales); })
            .attr('height', function (d) { return _this.chartHeight() - yScale(d.sales); });
    };
    Chart.prototype.donutChart = function () {
        var color = d3_scale_1.scaleOrdinal().range(this.options.strokes);
        this.chart
            .append('g')
            .attr('transform', "translate(" + this.options.width / 2 + ", " + this.options.height / 2 + ")");
        var arc = donut_1.getDonut(this.options.radius, this.options.donut, this.options.width, this.options.height);
        var donut = d3_shape_1.pie()
            .value(function (d) { return d; })
            .sort(null);
        var path = this.chart
            .select('g')
            .selectAll('path')
            .data(donut(this.data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) { return color(d.data); });
    };
    Chart.prototype.pieChart = function () {
        var color = d3_scale_1.scaleOrdinal().range(this.options.strokes);
        this.chart.append('g').attr('transform', "translate(\n          " + this.options.width / 2 + ",\n          " + this.options.height / 2 + ")");
        var arc = pie_1.getArc(this.options.radius, this.options.width, this.options.height);
        var piechart = d3_shape_1.pie()
            .value(function (d) { return d; })
            .sort(null);
        var path = this.chart
            .select('g')
            .selectAll('path')
            .data(piechart(this.data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) { return color(d.data); });
    };
    Chart.prototype.lineChart = function () {
        var xRange = [
            this.options.padding.left,
            this.options.width - this.options.padding.right,
        ];
        var yRange = [
            this.options.height - this.options.padding.top,
            this.options.padding.bottom,
        ];
        var _a = scale_1.getScales(this.dataType, this.data, xRange, yRange), xScale = _a.xScale, yScale = _a.yScale;
        var lineFunctions = line_1.getLineFunctions(this.dataType, this.data, xScale, yScale);
        var xAxis;
        var yAxis;
        if (typeof this.options.ticks.x === 'function') {
            xAxis = d3_axis_1.axisBottom(xScale).ticks(this.options.ticks.x(this.data));
        }
        else {
            xAxis = d3_axis_1.axisBottom(xScale).ticks(this.options.ticks.x);
        }
        if (typeof this.options.ticks.y === 'function') {
            yAxis = d3_axis_1.axisLeft(yScale).ticks(this.options.ticks.y(this.data));
        }
        else {
            yAxis = d3_axis_1.axisLeft(yScale).ticks(this.options.ticks.y);
        }
        this.chart
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', "translate(0, " + (this.options.height - this.options.padding.bottom) + ")")
            .call(xAxis);
        this.chart
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', "translate(" + this.options.padding.left + ", 0)")
            .call(yAxis);
        for (var i = 0; i < lineFunctions.length; i++) {
            console.log('drawing data:', this.data[i]);
            this.chart
                .append('path')
                .attr('class', "line-" + (i + 1))
                .attr('d', lineFunctions[i](this.data[i]))
                .attr('stroke', this.options.strokes[(i % this.options.strokes.length)])
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        }
    };
    Chart.prototype.rotateRows = function (data) {
        var columns = [];
        for (var i = 0; i < data[0].length; i++) {
            columns.push(new Array());
        }
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var row = data_2[_i];
            for (var i = 0; i < row.length; i++) {
                var val = row[i];
                columns[i].push(val);
            }
        }
        return columns;
    };
    /**
     * i.e. [ [1,2], [3,4] ] to [ [{x:0, y:1}, {x:1, y:2}], [{x:0, y:3}, {x:1, y:4}] ]
     */
    Chart.prototype.convertColumnsToPoints = function (columns) {
        var pts = [];
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var col = columns_1[_i];
            var objCol = [];
            for (var i = 0; i < col.length; i++) {
                objCol.push({
                    x: i,
                    y: col[i]
                });
            }
            pts.push(objCol);
        }
        return pts;
    };
    return Chart;
}());
exports.Chart = Chart;
//# sourceMappingURL=chart.js.map