import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { ClassProbability } from '../services/onnxModelService';

interface ProbabilityChartProps {
  probabilities: ClassProbability[];
  predictedClass: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ClassProbability }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs backdrop-blur-xs border border-slate-700">
        <p className="font-bold text-emerald-400">{data.className}</p>
        <p className="text-slate-300 mt-1">
          Confidence: <span className="font-mono font-bold text-white">{data.percentage.toFixed(2)}%</span>
        </p>
        <p className="text-slate-400 text-[10px]">Softmax probability: {data.probability.toFixed(5)}</p>
      </div>
    );
  }
  return null;
};

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  probabilities,
  predictedClass,
}) => {
  // Sort descending for the bar chart display
  const chartData = [...probabilities].sort((a, b) => b.probability - a.probability);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Probability Distribution (All 8 Classes)
          </h3>
          <p className="text-xs text-slate-500">
            Softmax output probabilities across all mango leaf categories
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
            <span className="text-slate-600 font-medium">Top Prediction</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block"></span>
            <span className="text-slate-600 font-medium">Other Classes</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="className"
              tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={18}>
              {chartData.map((entry) => {
                const isWinner = entry.className === predictedClass;
                return (
                  <Cell
                    key={`cell-${entry.className}`}
                    fill={isWinner ? '#10b981' : '#94a3b8'}
                    opacity={isWinner ? 1 : 0.45}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabular / Progress breakdown of all 8 classes */}
      <div className="border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Detailed Class Probability Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {chartData.map((item) => {
            const isWinner = item.className === predictedClass;
            return (
              <div
                key={item.className}
                className={`p-3 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-semibold ${isWinner ? 'text-emerald-900 font-bold' : 'text-slate-700'}`}>
                    {item.className}
                  </span>
                  <span className={`font-mono font-bold ${isWinner ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {item.percentage.toFixed(2)}%
                  </span>
                </div>
                {/* Progress track */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinner ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(item.percentage, 1))}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

