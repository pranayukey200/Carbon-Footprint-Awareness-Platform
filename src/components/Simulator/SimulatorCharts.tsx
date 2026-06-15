/**
 * @fileoverview Recharts comparative and proportional visualizations for the simulator.
 * Renders BarChart, PieChart, and screen-reader accessible data tables.
 * @module components/Simulator/SimulatorCharts
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ChartDataPoint {
  name: string;
  Baseline: number;
  Simulated: number;
}

interface PieDataPoint {
  name: string;
  value: number;
  fill: string;
}

interface SimulatorChartsProps {
  readonly activeChartTab: 'bar' | 'pie';
  readonly chartData: readonly ChartDataPoint[];
  readonly pieData: readonly PieDataPoint[];
}

/**
 * Recharts visualization panel.
 * Includes fallback accessibility data tables hidden via CSS class `.sr-only`.
 *
 * @returns The rendered chart container.
 */
export const SimulatorCharts: React.FC<SimulatorChartsProps> = ({
  activeChartTab,
  chartData,
  pieData,
}) => {
  return (
    <div style={{ width: '100%', height: '300px' }} aria-label="Footprint simulation charts">
      {/* Screen Reader Table for Accessibility */}
      <div className="sr-only">
        <h4>Simulator Data Table</h4>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Baseline Emissions (kg CO₂e)</th>
              <th>Simulated Emissions (kg CO₂e)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((d) => (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td>{d.Baseline} kg</td>
                <td>{d.Simulated} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        {activeChartTab === 'bar' ? (
          <BarChart data={chartData as ChartDataPoint[]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
            <YAxis stroke="var(--color-text-secondary)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
            <Legend wrapperStyle={{ color: 'var(--color-text-primary)' }} />
            <Bar dataKey="Baseline" fill="var(--color-text-secondary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Simulated" fill="var(--color-accent-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={pieData as PieDataPoint[]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
            <Legend formatter={(value) => <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
