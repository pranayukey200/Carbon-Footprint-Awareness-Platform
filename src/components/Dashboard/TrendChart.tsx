/**
 * @fileoverview Area chart showing total emissions over time with a
 * gradient fill. Uses Recharts AreaChart with the useTrendData hook.
 * @module components/Dashboard/TrendChart
 */

import type { ReactNode } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCarbonStore } from '../../store/carbonStore';
import { useTrendData } from '../../hooks/useCarbonCalculations';
import { formatCO2Compact } from '../../utils/formatters';
import { Card } from '../shared/Card';

/**
 * Renders an AreaChart of the user's total emissions over time with a
 * gradient fill beneath the line. Falls back to an informational message
 * when no trend data has been recorded yet.
 * @returns Rendered trend chart or empty state
 */
export function TrendChart(): ReactNode {
  const rawTrendData = useCarbonStore((s) => s.trendData);
  const progressLog = useCarbonStore((s) => s.progressLog);
  const chartData = useTrendData(rawTrendData, progressLog);

  if (chartData.length === 0) {
    return (
      <Card className="trend-chart" aria-label="Emission trend chart">
        <div className="empty-state">
          <p className="empty-state__icon" aria-hidden="true">
            📈
          </p>
          <p className="empty-state__desc">Track your progress to see trends</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="trend-chart" aria-label="Emissions over time">
      <div className="trend-chart__header">
        <h3 className="trend-chart__title">Emission Trend</h3>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          aria-label="Total emissions area chart"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => formatCO2Compact(v)}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            formatter={(value) => [formatCO2Compact(Number(value)), 'Total CO₂']}
            contentStyle={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
            }}
          />
          <Area
            type="monotone"
            dataKey="totalKgCO2"
            stroke="var(--color-accent-primary)"
            strokeWidth={2}
            fill="url(#trendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
