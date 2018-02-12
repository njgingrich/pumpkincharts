import { arc, Arc, DefaultArcObject } from 'd3-shape'

export function getArc(
  radius: number | Function,
  width: number,
  height: number,
) {
  if (typeof radius === 'function') {
    return arc()
      .innerRadius(0)
      .outerRadius(radius(width, height))
  } else {
    return arc()
      .innerRadius(0)
      .outerRadius(radius)
  }
}
