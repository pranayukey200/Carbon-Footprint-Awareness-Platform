/**
 * @fileoverview Donut chart showing per-category emission breakdown
 * with a colour-coded legend listing each category's value and percentage.
 * @module components/Dashboard/CategoryBreakdown
 */

import type { ReactNode } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCarbonStore } from '../../store/carbonStore';
import { useCategoryBreakdown } from '../../hooks/useCarbonCalculations';
import { formatCO2, formatPercentage } from '../../utils/formatters';
import { Card } from '../shared/Card';

/**
 * Renders a Recharts donut PieChart of the user's emission categories
 * with a legend below showing colour dot, name, value, and percentage.
 * Falls back to an empty-state message when no score data is available.
 * @returns Rendered breakdown chart or empty state
 */
export function CategoryBreakdown(): ReactNode {
  const carbonScore = useCarbonStore((s) => s.carbonScore);
  const data = useCategoryBreakdown(carbonScore);

  if (data.length === 0) {
    return (
      <Card className="breakdown" aria-label="Category breakdown">
        <div className="empty-state">
          <p className="empty-state__icon" aria-hidden="true">
            📊
          </p>
          <p className="empty-state__desc">No breakdown data available yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="breakdown" aria-label="Emission breakdown by category">
      <h3 className="card__title">Category Breakdown</h3>

      <div className="breakdown__chart" aria-hidden="true">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              aria-label="Emission category donut chart"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCO2(Number(value))}
              contentStyle={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="breakdown__legend" role="list" aria-label="Category legend">
        {data.map((entry) => (
          <li className="legend-item" key={entry.name}>
            <span
              className="legend-item__color"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="legend-item__name">{entry.name}</span>
            <span className="legend-item__value">{formatCO2(entry.value)}</span>
            <span className="legend-item__percentage">{formatPercentage(entry.percentage)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
