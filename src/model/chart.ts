import * as d3 from 'd3'
import { Axis, BaseType, ScaleLinear } from 'd3'

import { ChartType, DataType, DataOptions, DataPoint } from '../interface/data'
import { Options, ClassOptions } from '../interface/options'
import { getScales } from './scale'

import { getLineFunctions } from './line'

const defaultOptions = {
  width: 900,
  height: 500,
  parent: document.getElementsByTagName('svg')[0] as SVGElement,
  chartType: ChartType.LINE,
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
    x: (d: any[]) => d[0].length,
    y: (d: any[]) => d[0].length,
  },
  tickFormats: {
    x: null,
    y: null,
  },
}

export class Chart {
  options: Options
  data: any[][]
  chart: any
  dataType: DataType

  constructor(opts: ClassOptions) {
    this.options = Object.assign({}, defaultOptions, opts.options)
    this.data = []
    this.chart = {}

    if (opts.data.columns) {
      this.data = opts.data.columns
      this.dataType = DataType.COLUMNS
    } else if (opts.data.rows) {
      this.data = opts.data.rows
      this.data = this.rotateRows(opts.data.rows)
      this.dataType = DataType.ROWS
    } else if (opts.data.points) {
      this.data = opts.data.points
      this.dataType = DataType.POINTS
    } else {
      throw new Error('No valid data type found')
    }
    this.draw(this.options.chartType)
  }

  private draw(chartType: ChartType) {
    this.chart = d3.select<SVGElement, {}>(this.options.parent)
    this.chart
      .attr('width', this.options.width)
      .attr('height', this.options.height)

    switch (chartType) {
      case ChartType.LINE: {
        this.lineChart()
        break
      }
    }
  }

  private lineChart() {
    const xRange = [
      this.options.padding.left,
      this.options.width - this.options.padding.right,
    ]
    const yRange = [
      this.options.height - this.options.padding.top,
      this.options.padding.bottom,
    ]
    const { xScale, yScale } = getScales(
      this.dataType,
      this.data,
      xRange,
      yRange,
    )
    const lineFunctions = getLineFunctions(
      this.dataType,
      this.data,
      xScale,
      yScale,
    )

    let xAxis: any
    let yAxis: any
    if (typeof this.options.ticks.x === 'function') {
      xAxis = d3.axisBottom(xScale).ticks(this.options.ticks.x(this.data))
    } else {
      xAxis = d3.axisBottom(xScale).ticks(this.options.ticks.x)
    }
    if (typeof this.options.ticks.y === 'function') {
      yAxis = d3.axisLeft(yScale).ticks(this.options.ticks.y(this.data))
    } else {
      yAxis = d3.axisLeft(yScale).ticks(this.options.ticks.y)
    }

    this.chart
      .append('g')
      .attr('class', 'x axis')
      .attr(
        'transform',
        `translate(0, ${this.options.height - this.options.padding.bottom})`,
      )
      .call(xAxis)
    this.chart
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.options.padding.left}, 0)`)
      .call(yAxis)

    for (let i = 0; i < lineFunctions.length; i++) {
      this.chart
        .append('path')
        .attr('d', lineFunctions[i](this.data[i]))
        .attr('stroke', this.options.strokes[i])
        .attr('stroke-width', 2)
        .attr('fill', 'none')
    }
  }

  private rotateRows(data: number[][]) {
    let columns = []
    for (let i = 0; i < data[0].length; i++) {
      columns.push(new Array())
    }
    for (let row of data) {
      for (let i = 0; i < row.length; i++) {
        let val: number = row[i]
        columns[i].push(val)
      }
    }
    return columns
  }
}
