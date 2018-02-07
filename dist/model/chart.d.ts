import { DataType } from '../interface/data';
import { Options, ClassOptions } from '../interface/options';
export declare class Chart {
    options: Options;
    data: any[][];
    chart: any;
    dataType: DataType;
    constructor(opts: ClassOptions);
    draw(): void;
}
