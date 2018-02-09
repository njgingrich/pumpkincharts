export declare enum ChartType {
    BAR = "bar",
    DONUT = "donut",
    LINE = "line",
    PIE = "pie",
    STACKED = "stacked",
}
export interface DataPoint {
    x: number;
    y: number;
}
export declare enum DataType {
    POINTS = "points",
    COLUMNS = "columns",
    ROWS = "rows",
}
export interface DataOptions {
    points?: DataPoint[][];
    columns?: number[][];
    rows?: number[][];
}
