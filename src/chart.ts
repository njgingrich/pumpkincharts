import { max } from 'd3-array'
import { BaseType, select } from 'd3-selection'
import { scaleBand, scaleLinear, scaleOrdinal, ScaleLinear } from 'd3-scale'
import { pie } from 'd3-shape'
import { axisBottom, axisLeft, Axis } from 'd3-axis'
import { isEqual } from 'lodash'

import { ChartType, DataType, DataOptions, DataPoint } from './interface/data'
import { Options, ClassOptions } from './interface/options'
import { getScales } from './model/scale'

import { getLineFunctions } from './charts/line'
import { getDonut } from './charts/donut'
import { getArc } from './charts/pie'

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
  radius: (width: number, height: number) => Math.min(width, height) / 2,
  donut: (radius: number) => radius / 2,
}

export class Chart {
  options: Options
  data: any[]
  originalData: any[]
  chart: any
  dataType: DataType

  constructor(opts: ClassOptions) {
    this.options = Object.assign({}, defaultOptions, opts.options)
    this.data = []
    this.originalData = []
    this.chart = {}
    this.dataType = DataType.COLUMNS
    this.add(opts.data)
  }

  public add(data: DataOptions) {
    if (data.columns) {
      this.data = this.data.concat(this.convertColumnsToPoints(data.columns))
      this.originalData = this.data.concat(data.columns)
      this.dataType = DataType.COLUMNS
    } else if (data.rows) {
      this.data = this.data.concat(this.convertRowsToPoints(data.rows))
      this.originalData = this.data.concat(data.rows)
      this.dataType = DataType.ROWS
    } else if (data.points) {
      this.data = this.data.concat(data.points)
      this.originalData = this.data.concat(data.points)
      this.dataType = DataType.POINTS
    } else if (data.values) {
      this.data = this.data.concat(data.values)
      this.originalData = this.data.concat(data.values)
      this.dataType = DataType.VALUES
    } else if (data.json) {
      this.data = this.data.concat(data.json)
      this.originalData = this.data.concat(data.json)
      this.dataType = DataType.JSON
    } else {
      throw new Error('No valid data type found')
    }
    this.redraw()
  }

  public chartDimensions() {
    return {
      width: this.chartWidth(),
      height: this.chartHeight(),
    }
  }

  public chartWidth() {
    return (
      this.options.width -
      this.options.padding.left -
      this.options.padding.right
    )
  }

  public chartHeight() {
    return (
      this.options.height -
      this.options.padding.top -
      this.options.padding.bottom
    )
  }

  private draw(chartType: ChartType) {
    this.chart = select<SVGElement, {}>(this.options.parent)
    this.chart
      .attr('width', this.options.width)
      .attr('height', this.options.height)

    switch (chartType) {
      case ChartType.LINE: {
        this.lineChart()
        break
      }
      case ChartType.PIE: {
        this.pieChart()
        break
      }
      case ChartType.DONUT: {
        this.donutChart()
        break
      }
      case ChartType.BAR: {
        this.barChart()
        break
      }
    }
  }

  public redraw() {
    select(this.options.parent).selectAll('*').remove()
    this.draw(this.options.chartType)
  }

  public remove(data: DataOptions) {

  }

  public setOptions(newOptions: any) {
    this.options = Object.assign(this.options, newOptions)
    this.redraw()
  }

  private barChart() {
    this.chart.append('g').attr(
      'transform',
      `translate(
          ${this.options.padding.left},
          ${this.options.padding.top}
        )`,
    )

    const xScale = scaleBand()
      .range([0, this.chartWidth()])
      .padding(0.1)
    const yScale = scaleLinear().range([this.chartHeight(), 0])
    const xAxis = axisBottom(xScale).ticks(this.options.tickFormats.x)
    const yAxis = axisLeft(yScale).ticks(this.options.tickFormats.y)

    xScale.domain(this.data.map(d => d.name))
    yScale.domain([0, max(this.data, d => d.sales)])

    this.chart
      .select('g')
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.chartHeight()})`)
      .call(xAxis)

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
      .text('Frequency')

    this.chart
      .select('g')
      .selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => xScale(d.name))
      .attr('width', xScale.bandwidth())
      .attr('y', (d: any) => yScale(d.sales))
      .attr('height', (d: any) => this.chartHeight() - yScale(d.sales))
  }

  private donutChart() {
    const color = scaleOrdinal().range(this.options.strokes)
    this.chart
      .append('g')
      .attr(
        'transform',
        `translate(${this.options.width / 2}, ${this.options.height / 2})`,
      )

    const arc = getDonut(
      this.options.radius,
      this.options.donut,
      this.options.width,
      this.options.height,
    )
    const donut = pie()
      .value((d: any) => d)
      .sort(null)
    const path = this.chart
      .select('g')
      .selectAll('path')
      .data(donut(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any, i: any) => color(d.data))
  }

  private pieChart() {
    const color = scaleOrdinal().range(this.options.strokes)
    this.chart.append('g').attr(
      'transform',
      `translate(
          ${this.options.width / 2},
          ${this.options.height / 2})`,
    )

    const arc = getArc(
      this.options.radius,
      this.options.width,
      this.options.height,
    )
    const piechart = pie()
      .value((d: any) => d)
      .sort(null)
    const path = this.chart
      .select('g')
      .selectAll('path')
      .data(piechart(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any, i: any) => color(d.data))
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
      xAxis = axisBottom(xScale).ticks(this.options.ticks.x(this.data))
    } else {
      xAxis = axisBottom(xScale).ticks(this.options.ticks.x)
    }
    if (typeof this.options.ticks.y === 'function') {
      yAxis = axisLeft(yScale).ticks(this.options.ticks.y(this.data))
    } else {
      yAxis = axisLeft(yScale).ticks(this.options.ticks.y)
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
        .attr('class', `line-${i+1}`)
        .attr('d', lineFunctions[i](this.data[i]))
        .attr('stroke', this.options.strokes[(i % this.options.strokes.length)])
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

  /**
   * i.e. [ [1,2], [3,4] ] to [ [{x:0, y:1}, {x:1, y:2}], [{x:0, y:3}, {x:1, y:4}] ]
   */
  private convertColumnsToPoints(columns: number[][]) {
    let pts = []
    for (let col of columns) {
      let objCol = []

      for (let i = 0; i < col.length; i++) {
        objCol.push({
          x: i,
          y: col[i]
        })
      }
      pts.push(objCol)
    }
    return pts
  }

  /**
   * i.e. [ [1, 2], [3, 4], [5, 6] ] to
   * [ [{x: 0, y: 1}, {x: 1, y: 3}, {x: 2, y: 5}], [{x: 0, y: 2}, {x: 1, y: 4}, {x: 2, y: 6}] ]
   */
  private convertRowsToPoints(rows: number[][]) {
    const columns = this.rotateRows(rows)
    return this.convertColumnsToPoints(columns)
  }
}
