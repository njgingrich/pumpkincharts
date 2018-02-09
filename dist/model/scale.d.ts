import * as d3 from 'd3';
import { DataPoint, DataType } from '../interface/data';
export declare function getScales(dataType: DataType, data: number[][] | DataPoint[][], xRange: number[], yRange: number[]): {
    xScale: d3.ScaleLinear<number, number>;
    yScale: d3.ScaleLinear<number, number>;
};
