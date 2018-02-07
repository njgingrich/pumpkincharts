import * as d3 from 'd3';
import { DataPoint } from '../interface/data';
export declare function xScalePoints(data: DataPoint[][], range: number[]): d3.ScaleLinear<number, number>;
export declare function xScaleColumns(data: number[][], range: number[]): d3.ScaleLinear<number, number>;
export declare function yScalePoints(data: DataPoint[][], range: number[]): d3.ScaleLinear<number, number>;
export declare function yScaleColumns(data: number[][], range: number[]): d3.ScaleLinear<number, number>;
