import { DataType } from './interface/data';
import { Options, ClassOptions } from './interface/options';
export declare class Chart {
    options: Options;
    data: any[];
    chart: any;
    dataType: DataType;
    constructor(opts: ClassOptions);
    chartDimensions(): {
        width: number;
        height: number;
    };
    chartWidth(): number;
    chartHeight(): number;
    setOptions(newOptions: any): void;
    redraw(): void;
    private draw(chartType);
    private barChart();
    private donutChart();
    private pieChart();
    private lineChart();
    private rotateRows(data);
}
