import * as d3 from 'd3'
import { Arc, DefaultArcObject } from 'd3'

export function getArc(
  radius: number | Function,
  width: number,
  height: number,
) {
  if (typeof radius === 'function') {
    return d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius(width, height))
  } else {
    return d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius)
  }
}
