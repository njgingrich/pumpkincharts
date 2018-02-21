import { scaleLinear, ScaleLinear } from 'd3-scale'
import { DataPoint, DataType } from '../interface/data'

function xScalePoints(data: DataPoint[][], range: number[]) {
  const min = data
    .map(a => Math.min(...a.map(e => e.x)))
    .reduce((max, cur) => Math.min(max, cur), 0)
  const max = data
    .map(a => Math.max(...a.map(e => e.x)))
    .reduce((max, cur) => Math.max(max, cur), 0)

  return scaleLinear<number>()
    .range(range)
    .domain([min, max])
}

function yScalePoints(data: DataPoint[][], range: number[]) {
  const min = data
    .map(a => Math.min(...a.map(e => e.y)))
    .reduce((min, cur) => Math.min(min, cur), 0)
  const max = data
    .map(a => Math.max(...a.map(e => e.y)))
    .reduce((max, cur) => Math.max(max, cur), 0)

  return scaleLinear<number>()
    .range(range)
    .domain([min, max])
}

export function getScales(
  dataType: DataType,
  data: number[][] | DataPoint[][],
  xRange: number[],
  yRange: number[],
) {
  switch (dataType) {
    case DataType.POINTS, DataType.ROWS, DataType.COLUMNS: {
      return {
        xScale: xScalePoints(data as DataPoint[][], xRange),
        yScale: yScalePoints(data as DataPoint[][], yRange),
      }
    }
    default: {
      throw new Error('No valid data type found')
    }
  }
}
