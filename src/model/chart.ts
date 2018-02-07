import * as d3 from 'd3'
import { Axis, BaseType, ScaleLinear } from 'd3'
import { DataType, DataOptions, DataPoint } from '../interface/data'
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
  padding: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
  strokes: ['blue'],
}

export class Chart {
  options: Options
  data: any[][]
  chart: any
  dataType: DataType

  constructor(opts: ClassOptions) {
    this.options = defaultOptions
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

    if (opts.options.height) this.options.height = opts.options.height
    if (opts.options.parent) this.options.parent = opts.options.parent
    if (opts.options.strokes) this.options.strokes = opts.options.strokes
    if (opts.options.width) this.options.width = opts.options.width
    if (opts.options.padding) {
      if (opts.options.padding.top)
        this.options.padding.top = opts.options.padding.top
      if (opts.options.padding.bottom)
        this.options.padding.bottom = opts.options.padding.bottom
      if (opts.options.padding.left)
        this.options.padding.left = opts.options.padding.left
      if (opts.options.padding.right)
        this.options.padding.right = opts.options.padding.right
    }
  }

  draw() {
    this.chart = d3.select<SVGElement, {}>(this.options.parent)
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
      default: {
        throw new Error('No valid data type found')
      }
    }

    const xAxis: any = d3.axisBottom(xScale)
    const yAxis: any = d3.axisLeft(yScale)

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
        .attr('stroke', this.options.strokes[0])
        .attr('stroke-width', 2)
        .attr('fill', 'none')
    }
  }
}
