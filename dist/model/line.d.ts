import * as d3 from 'd3';
import { ScaleLinear } from 'd3';
import { DataPoint } from '../interface/data';
export declare function linesFromPoints(data: DataPoint[][], xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>): d3.Line<DataPoint>[];
export declare function linesFromColumns(data: number[][], xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>): d3.Line<number>[];
