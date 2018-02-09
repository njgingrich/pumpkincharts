import { ChartType, DataOptions } from './data';
export interface Options {
    width: number;
    height: number;
    parent: SVGElement;
    chartType: ChartType;
    padding: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    strokes: string[];
    ticks: {
        x: number | Function;
        y: number | Function;
    };
    tickFormats: {
        x: string | Function | null;
        y: string | Function | null;
    };
}
export interface ClassOptions {
    data: DataOptions;
    options: Options;
}
