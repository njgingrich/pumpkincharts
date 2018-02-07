export interface DataPoint {
    x: number;
    y: number;
}
export declare enum DataType {
    POINTS = 0,
    COLUMNS = 1,
    ROWS = 2,
}
export interface DataOptions {
    points?: DataPoint[][];
    columns?: number[][];
    rows?: number[][];
}
