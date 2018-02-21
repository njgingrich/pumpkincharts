import { DataType, DataOptions } from './interface/data';
import { Options, ClassOptions } from './interface/options';
export declare class Chart {
    options: Options;
    data: any[];
    chart: any;
    dataType: DataType;
    constructor(opts: ClassOptions);
    add(data: DataOptions): void;
    chartDimensions(): {
        width: number;
        height: number;
    };
    chartWidth(): number;
    chartHeight(): number;
    private draw(chartType);
    redraw(): void;
    setOptions(newOptions: any): void;
    private barChart();
    private donutChart();
    private pieChart();
    private lineChart();
    private rotateRows(data);
    /**
     * i.e. [ [1,2], [3,4] ] to [ [{x:0, y:1}, {x:1, y:2}], [{x:0, y:3}, {x:1, y:4}] ]
     */
    private convertColumnsToPoints(columns);
}
