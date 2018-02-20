import { Chart } from "../src/chart";
import { ClassOptions } from "../src/interface/options";

export function initChart(chart: Chart, args: ClassOptions) {
  chart = new Chart(args)
  return chart
}
