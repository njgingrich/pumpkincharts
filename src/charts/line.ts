import * as d3 from 'd3'
import { Line, ScaleLinear } from 'd3'
import { DataPoint, DataType } from '../interface/data'

function linesFromPoints(
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

function linesFromColumns(
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

export function getLineFunctions(
  dataType: DataType,
  data: number[][] | DataPoint[][],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
): Line<any>[] {
  switch (dataType) {
    case DataType.POINTS: {
      return linesFromPoints(data as DataPoint[][], xScale, yScale)
    }
    case DataType.COLUMNS: {
      return linesFromColumns(data as number[][], xScale, yScale)
    }
    case DataType.ROWS: {
      return linesFromColumns(data as number[][], xScale, yScale)
    }
    default: {
      throw new Error('Not a valid data type for line chart')
    }
  }
}
