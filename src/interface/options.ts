import { DataOptions } from './data'

export interface Options {
  width: number
  height: number
  parent: SVGElement
  padding: {
    top: number
    bottom: number
    left: number
    right: number
  }
  strokes: string[]
}

export interface ClassOptions {
  data: DataOptions
  options: Options
}
