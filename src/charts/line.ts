import { ScaleLinear } from 'd3-scale'
import { line, Line } from 'd3-shape'
import { DataPoint, DataType } from '../interface/data'

function linesFromPoints(
  data: DataPoint[][],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
) {
  let funcs = []
  for (let col of data) {
    funcs.push(
      line<DataPoint>()
        .x(d => {
          return xScale(d.x)
        })
        .y(d => {
          return yScale(d.y)
        }),
    )
  }
  return funcs
}

export function getLineFunctions(
  dataType: DataType,
  data: DataPoint[][],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
): Line<any>[] {
  switch (dataType) {
    // only allow points, rows, or columns for line charts
    case DataType.POINTS, DataType.ROWS, DataType.COLUMNS: {
      return linesFromPoints(data, xScale, yScale)
    }
    default: {
      throw new Error('Not a valid data type for line chart')
    }
  }
}
