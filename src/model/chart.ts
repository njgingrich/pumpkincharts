import * as d3 from 'd3'
import { Axis, BaseType, ScaleLinear } from 'd3'

import { ChartType, DataType, DataOptions, DataPoint } from '../interface/data'
import { Options, ClassOptions } from '../interface/options'
import {
  xScalePoints,
  xScaleColumns,
  yScalePoints,
  yScaleColumns,
} from './scale'

import { linesFromPoints, linesFromColumns } from './line'

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
    const WIDTH = this.options.width
    const HEIGHT = this.options.height
    const MARGIN = {
      TOP: this.options.padding.top,
      RIGHT: this.options.padding.right,
      BOTTOM: this.options.padding.bottom,
      LEFT: this.options.padding.left,
    }

    let xScale: ScaleLinear<number, number>
    let yScale: ScaleLinear<number, number>
    let lineFunctions: any[]
    switch (this.dataType) {
      case DataType.POINTS: {
        xScale = xScalePoints(this.data, [MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
        yScale = yScalePoints(this.data, [HEIGHT - MARGIN.TOP, MARGIN.BOTTOM])
        lineFunctions = linesFromPoints(this.data, xScale, yScale)
        break
      }
      case DataType.COLUMNS: {
        xScale = xScaleColumns(this.data, [MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
        yScale = yScaleColumns(this.data, [HEIGHT - MARGIN.TOP, MARGIN.BOTTOM])
        lineFunctions = linesFromColumns(this.data, xScale, yScale)
        break
      }
      case DataType.ROWS: {
        this.rotateRows()

        xScale = xScaleColumns(this.data, [MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
        yScale = yScaleColumns(this.data, [HEIGHT - MARGIN.TOP, MARGIN.BOTTOM])
        lineFunctions = linesFromColumns(this.data, xScale, yScale)
        break
      }
      default: {
        throw new Error('No valid data type found')
      }
    }

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
      .attr('transform', `translate(0, ${HEIGHT - MARGIN.BOTTOM})`)
      .call(xAxis)
    this.chart
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${MARGIN.LEFT}, 0)`)
      .call(yAxis)

    for (let i = 0; i < lineFunctions.length; i++) {
      this.chart
        .append('path')
        .attr('d', <any>lineFunctions[i](this.data[i]))
        .attr('stroke', this.options.strokes[i])
        .attr('stroke-width', 2)
        .attr('fill', 'none')
    }
  }

  private rotateRows() {
    let columns = []
    for (let i = 0; i < this.data[0].length; i++) {
      columns.push(new Array())
    }
    for (let row of this.data) {
      for (let i = 0; i < row.length; i++) {
        let val: number = row[i]
        columns[i].push(val)
      }
    }
    this.data = columns
  }
}
