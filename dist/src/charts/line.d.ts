import { ScaleLinear } from 'd3-scale';
import { Line } from 'd3-shape';
import { DataPoint, DataType } from '../interface/data';
export declare function getLineFunctions(dataType: DataType, data: number[][] | DataPoint[][], xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>): Line<any>[];
