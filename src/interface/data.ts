export interface DataPoint {
  x: number
  y: number
}

export enum DataType {
  POINTS,
  COLUMNS,
  ROWS,
}

export interface DataOptions {
  points?: DataPoint[][]
  columns?: number[][]
  rows?: number[][]
}
