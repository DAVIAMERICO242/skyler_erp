import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

export function BasicLineChart() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
          color: "var(--skyler-blue)"
        },
      ]}
      width={600}
      height={300}
    />
  );
}

export function BasicPie() {
    return (
      <PieChart
        colors={['var(--skyler-blue)', 'blue']} // Use palette
        series={[
          {
            data: [
              { id: 0, value: 10, label: 'Ativos' },
              { id: 1, value: 15, label: 'Passivos' },
            ],
          },
        ]}
        width={400}
        height={200}
      />
    );
  }

export function BasicBars() {
return (
    <BarChart
    xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
    series={[{ data: [4, 3, 5],color: "var(--skyler-blue)" }]}
    width={600}
    height={300}
    />
);
}

