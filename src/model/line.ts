import * as d3 from 'd3'
import { Line, ScaleLinear } from 'd3'
import { DataPoint } from '../interface/data'

export function linesFromPoints(
  data: DataPoint[][],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
) {
  let funcs = []
  for (let col of data) {
    funcs.push(
      d3
        .line<DataPoint>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y)),
    )
  }
  return funcs
}

export function linesFromColumns(
  data: number[][],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
) {
  let funcs = []
  for (let col of data) {
    funcs.push(
      d3
        .line<number>()
        .x(d => xScale(col.indexOf(d)))
        .y(d => yScale(d)),
    )
  }
  return funcs
}
