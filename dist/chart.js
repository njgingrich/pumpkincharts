"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
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
        if (opts.data.columns) {
            this.data = opts.data.columns;
            this.dataType = data_1.DataType.COLUMNS;
        }
        else if (opts.data.rows) {
            this.data = opts.data.rows;
            this.data = this.rotateRows(opts.data.rows);
            this.dataType = data_1.DataType.ROWS;
        }
        else if (opts.data.points) {
            this.data = opts.data.points;
            this.dataType = data_1.DataType.POINTS;
        }
        else if (opts.data.values) {
            this.data = opts.data.values;
            this.dataType = data_1.DataType.VALUES;
        }
        else if (opts.data.json) {
            this.data = opts.data.json;
            this.dataType = data_1.DataType.JSON;
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
    Chart.prototype.barChart = function () {
        var _this = this;
        this.chart.append('g').attr('transform', "translate(\n          " + (this.options.padding.left + this.options.padding.right) + ",\n          " + this.options.padding.top + "\n        )");
        var x = d3
            .scaleBand()
            .range([
            0,
            this.options.width -
                this.options.padding.left -
                this.options.padding.right,
        ])
            .padding(0.1);
        var y = d3
            .scaleLinear()
            .range([
            this.options.height -
                this.options.padding.top -
                this.options.padding.bottom,
            0,
        ]);
        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y).ticks(10, '%');
        x.domain(this.data.map(function (d) { return d.name; }));
        y.domain([0, d3.max(this.data, function (d) { return d.sales; })]);
        this.chart
            .select('g')
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', "translate(0, " + (this.options.height -
            this.options.padding.top -
            this.options.padding.bottom) + ")")
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
            .attr('x', function (d) { return x(d.name); })
            .attr('width', x.bandwidth())
            .attr('y', function (d) { return y(d.sales); })
            .attr('height', function (d) {
            return _this.options.height -
                _this.options.padding.top -
                _this.options.padding.bottom -
                y(d.sales);
        });
    };
    Chart.prototype.donutChart = function () {
        var color = d3.scaleOrdinal().range(this.options.strokes);
        this.chart
            .append('g')
            .attr('transform', "translate(" + this.options.width / 2 + ", " + this.options.height / 2 + ")");
        var arc = donut_1.getDonut(this.options.radius, this.options.donut, this.options.width, this.options.height);
        var donut = d3
            .pie()
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
        var color = d3.scaleOrdinal().range(this.options.strokes);
        this.chart.append('g').attr('transform', "translate(\n          " + this.options.width / 2 + ",\n          " + this.options.height / 2 + ")");
        var arc = pie_1.getArc(this.options.radius, this.options.width, this.options.height);
        var pie = d3
            .pie()
            .value(function (d) { return d; })
            .sort(null);
        var path = this.chart
            .select('g')
            .selectAll('path')
            .data(pie(this.data))
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
            .attr('transform', "translate(0, " + (this.options.height - this.options.padding.bottom) + ")")
            .call(xAxis);
        this.chart
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', "translate(" + this.options.padding.left + ", 0)")
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
    return Chart;
}());
exports.Chart = Chart;
