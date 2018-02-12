import * as d3 from 'd3'
import { Axis, BaseType, ScaleLinear } from 'd3'

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
    } else if (opts.data.values) {
      this.data = opts.data.values
      this.dataType = DataType.VALUES
    } else if (opts.data.json) {
      this.data = opts.data.json
      this.dataType = DataType.JSON
    } else {
      throw new Error('No valid data type found')
    }
    this.draw(this.options.chartType)
  }

  chartDimensions() {
    return {
      width: this.chartWidth(),
      height: this.chartHeight(),
    }
  }

  chartWidth() {
    return (
      this.options.width -
      this.options.padding.left -
      this.options.padding.right
    )
  }

  chartHeight() {
    return (
      this.options.height -
      this.options.padding.top -
      this.options.padding.bottom
    )
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

  private barChart() {
    this.chart.append('g').attr(
      'transform',
      `translate(
          ${this.options.padding.left},
          ${this.options.padding.top}
        )`,
    )

    const xScale = d3
      .scaleBand()
      .range([0, this.chartWidth()])
      .padding(0.1)
    const yScale = d3.scaleLinear().range([this.chartHeight(), 0])
    const xAxis = d3.axisBottom(xScale).ticks(this.options.tickFormats.x)
    const yAxis = d3.axisLeft(yScale).ticks(this.options.tickFormats.y)

    xScale.domain(this.data.map(d => d.name))
    yScale.domain([0, d3.max(this.data, d => d.sales)])

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
    const color = d3.scaleOrdinal().range(this.options.strokes)
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
    const donut = d3
      .pie()
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
    const color = d3.scaleOrdinal().range(this.options.strokes)
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
    const pie = d3
      .pie()
      .value((d: any) => d)
      .sort(null)
    const path = this.chart
      .select('g')
      .selectAll('path')
      .data(pie(this.data))
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
