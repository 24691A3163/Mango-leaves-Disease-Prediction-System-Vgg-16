import React from 'react';
import { PredictionResult } from '../services/onnxModelService';
import { ProbabilityChart } from '../components/ProbabilityChart';
import { MANGO_DISEASES } from '../utils/diseaseData';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Sprout,
} from 'lucide-react';

interface ResultsPageProps {
  result: PredictionResult;
  imageUrl: string | null;
  onPredictAnother: () => void;
  onViewDiseaseDetails: (diseaseName: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  imageUrl,
  onPredictAnother,
  onViewDiseaseDetails,
}) => {
  const diseaseInfo = MANGO_DISEASES[result.predictedClass];
  const isHealthy = result.predictedClass.toLowerCase() === 'healthy';

  const getStatusBadge = () => {
    switch (result.status) {
      case 'High Confidence':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            High Confidence Prediction
          </span>
        );
      case 'Moderate Confidence':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Moderate Confidence Prediction
          </span>
        );
      case 'Uncertain':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
            Low / Uncertain Confidence
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <button
          type="button"
          onClick={onPredictAnother}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Predict Another Image</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Inference: {result.inferenceTimeMs} ms
          </span>
          <span>•</span>
          <span>Timestamp: {result.timestamp}</span>
        </div>
      </div>

      {/* Primary Result Banner / Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-all ${
          isHealthy
            ? 'bg-gradient-to-br from-emerald-50 via-white to-green-50 border-emerald-200'
            : 'bg-gradient-to-br from-amber-50/60 via-white to-rose-50/40 border-amber-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          {/* Leaf image preview */}
          <div className="w-full sm:w-72 h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md shrink-0 relative group">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Analyzed Mango Leaf"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                No image preview
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-mono">
              224 × 224 Normalized
            </div>
          </div>

          {/* Classification details */}
          <div className="flex-1 space-y-4 text-center lg:text-left w-full">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {getStatusBadge()}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                Model: VGG16
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Predicted Pathology
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center lg:justify-start gap-3">
                <span>{result.predictedClass}</span>
                {isHealthy && <Sprout className="w-8 h-8 text-emerald-600 inline-block" />}
              </h2>
              {diseaseInfo && (
                <p className="text-sm font-serif italic text-slate-500 mt-1">
                  Organism: {diseaseInfo.scientificName}
                </p>
              )}
            </div>

            {/* Confidence Gauge */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700">Confidence Score:</span>
                <span className="font-mono text-base font-extrabold text-emerald-600">
                  {result.confidence.toFixed(2)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isHealthy ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-green-600'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(result.confidence, 2))}%` }}
                ></div>
              </div>
            </div>

            {/* Short diagnosis overview */}
            {diseaseInfo && (
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {diseaseInfo.description}
              </p>
            )}

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              {diseaseInfo && (
                <button
                  type="button"
                  onClick={() => onViewDiseaseDetails(result.predictedClass)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Management Guide</span>
                </button>
              )}

              <button
                type="button"
                onClick={onPredictAnother}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs cursor-pointer transition-colors"
              >
                <span>Upload Another Leaf</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Predicted Classes Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Top 3 Predicted Classes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {result.top3.map((item, index) => {
            const isTop = index === 0;
            return (
              <div
                key={item.className}
                className={`p-4 rounded-2xl border transition-all ${
                  isTop
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                    isTop ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Rank #{index + 1}
                  </span>
                  <span className="font-mono font-extrabold text-sm text-slate-900">
                    {item.percentage.toFixed(2)}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate mb-2">
                  {item.className}
                </h4>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isTop ? 'bg-emerald-500' : 'bg-slate-400'}`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full 8-Class Probability Recharts Visualization */}
      <ProbabilityChart
        probabilities={result.probabilities}
        predictedClass={result.predictedClass}
      />

      {/* Treatment & Action Steps for Predicted Pathology */}
      {diseaseInfo && !isHealthy && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Immediate Advisory for {diseaseInfo.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                Recommended Remedial Actions
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                {diseaseInfo.management.slice(0, 3).map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                Prevention for Next Flush
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                {diseaseInfo.prevention.slice(0, 3).map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
