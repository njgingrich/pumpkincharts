import * as d3 from 'd3'
import { ScaleLinear } from 'd3'
import { DataPoint } from '../interface/data'

export function xScalePoints(data: DataPoint[][], range: number[]) {
  const min = data
    .map(a => Math.min(...a.map(e => e.x)))
    .reduce((max, cur) => Math.min(max, cur), 0)
  const max = data
    .map(a => Math.max(...a.map(e => e.x)))
    .reduce((max, cur) => Math.max(max, cur), 0)

  return d3
    .scaleLinear<number>()
    .range(range)
    .domain([min, max])
}

export function xScaleColumns(data: number[][], range: number[]) {
  const longest = data
    .map(a => a.length)
    .reduce((max, cur) => Math.max(max, cur), 0)

  return d3
    .scaleLinear<number>()
    .range(range)
    .domain([0, longest - 1])
}

export function yScalePoints(data: DataPoint[][], range: number[]) {
  const min = data
    .map(a => Math.min(...a.map(e => e.y)))
    .reduce((min, cur) => Math.min(min, cur), 0)
  const max = data
    .map(a => Math.max(...a.map(e => e.y)))
    .reduce((max, cur) => Math.max(max, cur), 0)

  return d3
    .scaleLinear<number>()
    .range(range)
    .domain([min, max])
}

export function yScaleColumns(data: number[][], range: number[]) {
  const min = data
    .map(a => Math.min(...a))
    .reduce((min, cur) => Math.min(min, cur), 0)
  const max = data
    .map(a => Math.max(...a))
    .reduce((max, cur) => Math.max(max, cur), 0)

  return d3
    .scaleLinear<number>()
    .range(range)
    .domain([min, max])
}
