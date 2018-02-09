import * as d3 from 'd3'
import { Arc, DefaultArcObject } from 'd3'

export function getDonut(
  radius: number | Function,
  donut: number | Function,
  width: number,
  height: number,
) {
  let radiusSize
  if (typeof radius === 'function') {
    radiusSize = radius(width, height)
  } else {
    radiusSize = radius
  }

  let donutSize
  if (typeof donut === 'function') {
    donutSize = donut(radiusSize)
  } else {
    donutSize = donut
  }

  return d3
    .arc()
    .innerRadius(donutSize)
    .outerRadius(radiusSize)
}
