"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var chart_1 = require("../../src/chart");
describe('Line chart drawing', function () {
    var chart;
    var args;
    beforeEach(function () {
        document.body.insertAdjacentHTML('afterbegin', '<svg id="chart"></svg>');
        chart = new chart_1.Chart(args);
    });
    afterEach(function () {
        var el = document.getElementById('chart');
        if (el)
            document.body.removeChild(el);
    });
    describe('Proper rendering for line chart', function () {
        before(function () {
            args = {
                data: {
                    // points
                    columns: [[10, 50, 32, 13, 61, 23, 20], [12, 13, 34, 45, 56, 23, 1]],
                },
                options: {
                    parent: '#chart',
                    chartType: "line",
                    width: 500,
                    height: 300,
                    strokes: ['red', 'blue'],
                    ticks: {
                        x: function (d) { return d[0].length * 2; },
                        y: 10,
                    },
                },
            };
        });
        it('should render 2 lines', function (done) {
            var count = document.querySelectorAll('#chart > path');
            chai_1.expect(count.length).to.equal(2);
            done();
        });
        it('should have the correct paths', function (done) {
            var line1 = document.querySelector('.line-1');
            chai_1.expect(line1.getAttribute('d')).to.equal('M20,237.37704918032787L96.66666666666666,66.88524590163934L173.33333333333331,143.60655737704917L250,224.59016393442624L326.66666666666663,20L403.33333333333337,181.9672131147541L480,194.75409836065575');
            var line2 = document.querySelector('.line-2');
            chai_1.expect(line2.getAttribute('d')).to.equal('M20,228.85245901639345L96.66666666666666,224.59016393442624L173.33333333333331,135.08196721311478L250,88.19672131147539L326.66666666666663,41.31147540983605L403.33333333333337,181.9672131147541L480,275.73770491803276');
            done();
        });
        it('can change its size', function (done) {
            var chartEl = document.getElementById('chart');
            chai_1.expect(chartEl.getAttribute('width')).to.equal('500');
            chai_1.expect(chartEl.getAttribute('height')).to.equal('300');
            chart.setOptions({ width: 800, height: 800 });
            chartEl = document.getElementById('chart');
            chai_1.expect(chartEl.getAttribute('width')).to.equal('800');
            chai_1.expect(chartEl.getAttribute('height')).to.equal('800');
            done();
        });
        it('can add a line', function (done) {
            chart.add({
                columns: [[1, 1, 1, 1, 1, 1, 1]]
            });
            var count = document.querySelectorAll('#chart > path');
            chai_1.expect(count.length).to.equal(3);
            done();
        });
    });
});
//# sourceMappingURL=line.spec.js.map