import { assert, expect } from 'chai'
import 'mocha'
import { Chart } from '../../src/chart'
import { ClassOptions } from '../../src/interface/options';

describe('Line chart drawing', () => {
  let chart: Chart
  let args: ClassOptions | any

  beforeEach(() => {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<svg id="chart"></svg>'
    );
    chart = new Chart(args)
  })

  afterEach(() => {
    const el =  document.getElementById('chart')
    if (el) document.body.removeChild(el)
  })

  describe('Proper rendering for line chart', () => {
    before(() => {
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
            x: (d: any) => d[0].length * 2,
            y: 10,
          },
        },
      }
    })

    it('should render 2 lines', (done) => {
      const count = document.querySelectorAll('#chart > path')
      expect(count.length).to.equal(2)
      done()
    })

    it('should have the correct paths', (done) => {
      setTimeout(() => {
        const line1 = document.querySelector('.line-1') as Element
        expect(line1.getAttribute('d')).to.equal('M20,237.37704918032787L96.66666666666666,66.88524590163934L173.33333333333331,143.60655737704917L250,224.59016393442624L326.66666666666663,20L403.33333333333337,181.9672131147541L480,194.75409836065575')

        const line2 = document.querySelector('.line-2') as Element
        expect(line2.getAttribute('d')).to.equal('M20,228.85245901639345L96.66666666666666,224.59016393442624L173.33333333333331,135.08196721311478L250,88.19672131147539L326.66666666666663,41.31147540983605L403.33333333333337,181.9672131147541L480,275.73770491803276')
        done()
      }, 500)
    })

    it('can change its size', (done) => {
      setTimeout(() => {
        let chartEl = document.getElementById('chart') as HTMLElement
        expect(chartEl.getAttribute('width')).to.equal('500')
        expect(chartEl.getAttribute('height')).to.equal('300')

        chart.setOptions({ width: 800, height: 800 })

        chartEl = document.getElementById('chart') as HTMLElement
        expect(chartEl.getAttribute('width')).to.equal('800')
        expect(chartEl.getAttribute('height')).to.equal('800')
        done()
      }, 500)
    })
  })
})
