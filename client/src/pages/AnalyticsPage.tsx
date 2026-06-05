import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AnalyticsPage() {
  const { data: summary } = useQuery<any>({
    queryKey: ['analytics-summary'],
    queryFn: () => api.get('/analytics/summary')
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics</h1>
        <div className="text-sm text-slate-500">Last 30 Days</div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Submissions</p>
          <div className="text-2xl font-bold">{summary?.totalSubmissions || 0}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm font-medium text-muted-foreground mb-1">Avg Global QoL</p>
          <div className="text-2xl font-bold text-primary">{summary?.avgGlobalQol || 0} / 100</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm font-medium text-muted-foreground mb-1">This Month</p>
          <div className="text-2xl font-bold">{summary?.thisMonth || 0}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm font-medium text-muted-foreground mb-1">Pending Review</p>
          <div className="text-2xl font-bold text-amber-500">{summary?.pendingReview || 0}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-xl bg-white shadow-sm p-6 h-80 flex flex-col justify-center items-center text-slate-400">
          <p>Submission Volume Chart</p>
          <p className="text-sm">(Recharts implementation pending)</p>
        </div>
        <div className="border rounded-xl bg-white shadow-sm p-6 h-80 flex flex-col justify-center items-center text-slate-400">
          <p>QoL Trend Over Time</p>
          <p className="text-sm">(Recharts implementation pending)</p>
        </div>
        <div className="border rounded-xl bg-white shadow-sm p-6 h-80 flex flex-col justify-center items-center text-slate-400 md:col-span-2">
          <p>Symptom Frequency Heatmap</p>
          <p className="text-sm">(Implementation pending)</p>
        </div>
      </div>
    </div>
  );
}
