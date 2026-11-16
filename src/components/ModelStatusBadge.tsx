import React from 'react';
import { CheckCircle2, Loader2, AlertTriangle, Cpu } from 'lucide-react';
import { ModelStatus } from '../services/onnxModelService';

interface ModelStatusBadgeProps {
  status: ModelStatus;
  message: string;
  error?: string | null;
  onRetry?: () => void;
  showDetails?: boolean;
}

export const ModelStatusBadge: React.FC<ModelStatusBadgeProps> = ({
  status,
  message,
  error,
  onRetry,
  showDetails = false,
}) => {
  if (status === 'loaded') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>VGG16 ONNX Active</span>
        {showDetails && <span className="text-emerald-600 font-normal ml-1">| 224x224 In-Browser</span>}
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-xs">
        <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
        <span>{message || 'Loading VGG16 Model...'}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold shadow-xs">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
        <span>Model Load Error</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="underline hover:text-rose-950 font-bold ml-1 cursor-pointer"
          >
            Retry
          </button>
        )}
        {showDetails && error && (
          <span className="text-rose-600 font-normal truncate max-w-xs" title={error}>
            ({error})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
      <Cpu className="w-3.5 h-3.5 text-slate-500" />
      <span>Model Idle</span>
    </div>
  );
};

