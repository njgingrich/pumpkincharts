export enum ChartType {
  BAR = 'bar',
  DONUT = 'donut',
  LINE = 'line',
  PIE = 'pie',
  STACKED = 'stacked',
}

export interface DataPoint {
  x: number
  y: number
}

export enum DataType {
  POINTS = 'points',
  COLUMNS = 'columns',
  ROWS = 'rows',
  VALUES = 'values',
}

export interface DataOptions {
  points?: DataPoint[][]
  columns?: number[][]
  rows?: number[][]
  values?: number[]
}
