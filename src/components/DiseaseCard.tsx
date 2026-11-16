import React, { useState } from 'react';
import { DiseaseInfo } from '../utils/diseaseData';
import { ChevronDown, ChevronUp, AlertCircle, ShieldAlert, Sparkles, Sprout, Bug, Biohazard } from 'lucide-react';

interface DiseaseCardProps {
  disease: DiseaseInfo;
  isPredicted?: boolean;
  defaultExpanded?: boolean;
}

export const DiseaseCard: React.FC<DiseaseCardProps> = ({
  disease,
  isPredicted = false,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded || isPredicted);

  const getCategoryIcon = () => {
    switch (disease.category) {
      case 'Normal':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'Fungal':
        return <Biohazard className="w-4 h-4 text-purple-600" />;
      case 'Bacterial':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case 'Pest':
        return <Bug className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSeverityBadge = () => {
    switch (disease.severity) {
      case 'None':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Healthy</span>;
      case 'Moderate':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Moderate Severity</span>;
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800">High Severity</span>;
      case 'Severe':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">Severe Disease</span>;
    }
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
        isPredicted
          ? 'bg-white border-emerald-400 ring-2 ring-emerald-300 shadow-md'
          : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
      }`}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
      >
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {getCategoryIcon()}
              <span>{disease.category}</span>
            </span>
            {getSeverityBadge()}
            {isPredicted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                Detected Match
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {disease.name}
          </h3>

          <p className="text-xs font-serif italic text-slate-500">
            Pathogen / Organism: {disease.scientificName}
          </p>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {disease.description}
          </p>
        </div>

        <button
          type="button"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer"
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">
          {/* Symptoms */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Key Symptoms
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {disease.symptoms.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes & Triggers */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Causes &amp; Environmental Conditions
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {disease.causes.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Management & Treatment */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Recommended Management &amp; Treatment
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {disease.management.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span className="text-emerald-950">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Preventive Measures
            </h4>
            <ul className="space-y-1 text-xs text-slate-600">
              {disease.prevention.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">→</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

