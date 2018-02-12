import { arc, Arc, DefaultArcObject } from 'd3-shape'

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

  return arc()
    .innerRadius(donutSize)
    .outerRadius(radiusSize)
}
