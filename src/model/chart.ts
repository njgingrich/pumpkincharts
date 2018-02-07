import * as d3 from 'd3'
import { Axis, BaseType, ScaleLinear } from 'd3'

export interface Options {
  width: number
  height: number
  parent: SVGElement
  padding: {
    top: number
    bottom: number
    left: number
    right: number
  }
  strokes: string[]
}

export interface ChartDatum {
  x?: number
  y?: number
}

export enum DataType {
  POINTS,
  COLUMNS,
  ROWS,
}

export interface DataOptions {
  points?: any[]
  columns: number[][]
  rows: number[][]
}

export interface ClassOptions {
  data: DataOptions
  options: Options
}

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
  data: any[]
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
        xScale = this.xScalePoints([MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
        yScale = this.yScalePoints([HEIGHT - MARGIN.TOP, MARGIN.BOTTOM])
        lineFunctions = this.linesFromPoints(xScale, yScale)
        break
      }
      case DataType.COLUMNS: {
        xScale = this.xScaleColumns([MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
        yScale = this.yScaleColumns([HEIGHT - MARGIN.TOP, MARGIN.BOTTOM])
        lineFunctions = this.linesFromColumns(xScale, yScale)
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

    if (this.dataType === DataType.POINTS) {
      const lineFunction = d3
        .line<ChartDatum>()
        .x(d => xScale(Number(d.x)))
        .y(d => yScale(Number(d.y)))
      this.chart
        .append('path')
        .attr('d', <any>lineFunction(this.data))
        .attr('stroke', this.options.strokes[0])
        .attr('stroke-width', 2)
        .attr('fill', 'none')
    } else if (this.dataType === DataType.COLUMNS) {
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

  private xScalePoints(range: number[]) {
    return d3
      .scaleLinear<number>()
      .range(range)
      .domain([
        d3.min(this.data, d => d.x) * 1,
        d3.max(this.data, d => d.x) * 1,
      ])
  }

  private xScaleColumns(range: number[]) {
    const longest = this.data
      .map(a => a.length)
      .reduce((max, cur) => Math.max(max, cur), 0)

    return d3
      .scaleLinear<number>()
      .range(range)
      .domain([0, longest])
  }

  private yScalePoints(range: number[]) {
    return d3
      .scaleLinear<number>()
      .range(range)
      .domain([
        d3.min(this.data, d => d.y) * 1,
        d3.max(this.data, d => d.y) * 1,
      ])
  }

  private yScaleColumns(range: number[]) {
    let min = this.data
      .map(a => Math.min(...a))
      .reduce((max, cur) => Math.min(max, cur), 0)
    let max = this.data
      .map(a => Math.max(...a))
      .reduce((max, cur) => Math.max(max, cur), 0)

    return d3
      .scaleLinear<number>()
      .range(range)
      .domain([min, max])
  }

  private linesFromPoints(
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
  ) {
    let funcs = []
    funcs.push(
      d3
        .line<ChartDatum>()
        .x(d => xScale(Number(d.x)))
        .y(d => yScale(Number(d.y))),
    )
    return funcs
  }

  private linesFromColumns(
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
  ) {
    let funcs = []
    for (let col of this.data) {
      funcs.push(
        d3
          .line<ChartDatum>()
          .x(d => xScale(col.indexOf(d)))
          .y(d => yScale(Number(d))),
      )
    }
    return funcs
  }
}
