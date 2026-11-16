import React from 'react';
import {
  Leaf,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Maximize2,
  FileCode,
  BookOpen,
} from 'lucide-react';
import { ModelStatus } from '../services/onnxModelService';
import { ModelStatusBadge } from '../components/ModelStatusBadge';

interface HomePageProps {
  onStartPrediction: () => void;
  onViewGuide: () => void;
  modelStatus: ModelStatus;
  modelMessage: string;
  modelError: string | null;
  onRetryModelLoad: () => void;
  classNames: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartPrediction,
  onViewGuide,
  modelStatus,
  modelMessage,
  modelError,
  onRetryModelLoad,
  classNames,
}) => {
  const displayClasses = classNames.length > 0 ? classNames : [
    'Anthracnose', 'Bacterial Canker', 'Cutting Weevil', 'Die Back',
    'Gall Midge', 'Healthy', 'Powdery Mildew', 'Sooty Mould'
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-forest-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-green-400/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Status Badge in Hero */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              <Leaf className="w-3.5 h-3.5" />
              Agricultural AI Vision
            </span>
            <ModelStatusBadge
              status={modelStatus}
              message={modelMessage}
              error={modelError}
              onRetry={onRetryModelLoad}
              showDetails
            />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Mango Leaf Disease Detection
            </h1>
            <p className="text-lg sm:text-xl font-medium text-emerald-200">
              AI-powered mango leaf disease classification using VGG16
            </p>
          </div>

          {/* Short Description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the intelligent agricultural diagnostic portal. Our system provides instant, high-precision detection of 8 common mango foliar diseases using a trained <strong>VGG16 deep convolutional neural network</strong> running directly in your browser with ONNX Runtime Web.
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onStartPrediction}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Start Prediction</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onViewGuide}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-all cursor-pointer backdrop-blur-xs"
            >
              <BookOpen className="w-5 h-5" />
              <span>Disease Guide</span>
            </button>
          </div>
        </div>
      </section>

      {/* Model Specifications Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Disease Classes */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Layers className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Classes
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            8
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Total Disease Classes
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Includes Healthy control and 7 fungal, bacterial, and pest diseases.
          </p>
        </div>

        {/* Metric 2: Model Architecture */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Cpu className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              Architecture
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            VGG16
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Deep CNN Model
          </div>
          <p className="text-xs text-slate-400 mt-2">
            13 Convolutional Layers + Custom FC (25088 → 512 → 8).
          </p>
        </div>

        {/* Metric 3: Input Image Size */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Maximize2 className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              Input Size
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            224 × 224
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Tensor Resolution [1, 3, 224, 224]
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Standard RGB resolution normalized with ImageNet mean &amp; std.
          </p>
        </div>

        {/* Metric 4: Model Status */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Activity className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              Engine Status
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 mb-1 truncate capitalize">
            {modelStatus}
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            ONNX Runtime Web
          </div>
          <div className="mt-2">
            <ModelStatusBadge
              status={modelStatus}
              message={modelMessage}
              error={modelError}
              onRetry={onRetryModelLoad}
            />
          </div>
        </div>
      </section>

      {/* 8 Classes Showcase */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recognized Mango Leaf Classes (8)
            </h2>
            <p className="text-xs text-slate-500">
              Categorized diseases from real orchard datasets loaded from <code>class_names.json</code>
            </p>
          </div>
          <button
            type="button"
            onClick={onViewGuide}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Read full disease descriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {displayClasses.map((cls, index) => (
            <div
              key={cls}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                0{index + 1}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {cls}
                </span>
                <span className="text-[10px] text-slate-400">Class #{index}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Pillars: Edge AI, Privacy, Zero Backend */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% Client-Side Inference</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The trained VGG16 model is executed right in your browser via WebAssembly (WASM). No server queues, zero network roundtrips after initial load, and ultra-fast predictions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero Backend &amp; Total Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No FastAPI, Flask, Django, Node APIs, or external databases. Your photos never leave your device, ensuring complete privacy for your agricultural images.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
            <FileCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">True Trained PyTorch Weights</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct conversion from <code>MangoLeaf_VGG16.pth</code> to ONNX with validated numerical precision (&lt; 1e-6 diff). No mock data or hardcoded predictions.
          </p>
        </div>
      </section>
    </div>
  );
};
