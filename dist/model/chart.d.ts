export interface Options {
    width: number;
    height: number;
    parent: SVGElement;
    padding: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    strokes: string[];
}
export interface ChartDatum {
    x?: number;
    y?: number;
}
export declare enum DataType {
    POINTS = 0,
    COLUMNS = 1,
    ROWS = 2,
}
export interface DataOptions {
    points?: any[];
    columns: number[][];
    rows: number[][];
}
export interface ClassOptions {
    data: DataOptions;
    options: Options;
}
export declare class Chart {
    options: Options;
    data: any[];
    chart: any;
    dataType: DataType;
    constructor(opts: ClassOptions);
    draw(): void;
    private xScalePoints(range);
    private xScaleColumns(range);
    private yScalePoints(range);
    private yScaleColumns(range);
    private linesFromPoints(xScale, yScale);
    private linesFromColumns(xScale, yScale);
}
