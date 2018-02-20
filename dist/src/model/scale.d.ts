import { ScaleLinear } from 'd3-scale';
import { DataPoint, DataType } from '../interface/data';
export declare function getScales(dataType: DataType, data: number[][] | DataPoint[][], xRange: number[], yRange: number[]): {
    xScale: ScaleLinear<number, number>;
    yScale: ScaleLinear<number, number>;
};
