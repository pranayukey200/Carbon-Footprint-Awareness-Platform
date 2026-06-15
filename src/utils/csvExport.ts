import type { ProgressEntry } from '../types';

/**
 * Exports progress logs to a CSV file downloadable in the browser.
 * @param progressLog List of progress entry logs to export
 */
export const exportProgressToCSV = (progressLog: readonly ProgressEntry[]): void => {
  if (progressLog.length === 0) {return;}
  const headers = 'Date,Action,Category,Saved(kg CO2),Notes\n';
  const rows = progressLog
    .map((e) => {
      const date = new Date(e.completedAt).toLocaleDateString();
      const title = `"${e.actionTitle.replace(/"/g, '""')}"`;
      const cat = e.category;
      const saved = e.kgCO2Saved;
      const note = `"${e.notes.replace(/"/g, '""')}"`;
      return `${date},${title},${cat},${saved},${note}`;
    })
    .join('\n');

  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `carbonlens_progress_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
