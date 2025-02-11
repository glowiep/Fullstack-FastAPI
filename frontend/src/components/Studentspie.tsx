import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function Studentspie() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'Class A' },
            { id: 1, value: 15, label: 'Class B' },
            { id: 2, value: 20, label: 'Class C' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
}
