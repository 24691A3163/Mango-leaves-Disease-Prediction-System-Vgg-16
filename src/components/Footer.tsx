import React from 'react';
import { Leaf, Cpu, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 text-base">
                MangoVision <span className="text-emerald-600">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI-driven diagnostic tool for mango leaf pathology using trained deep convolutional neural networks running client-side.
            </p>
          </div>

          {/* Column 2: Deep Learning Architecture */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Model Architecture
            </h4>
            <ul className="space-y-1 text-slate-600">
              <li>• Base: <span className="font-semibold text-slate-800">VGG16</span> (13 Conv + 5 MaxPool)</li>
              <li>• Classifier: <span className="font-semibold text-slate-800">Linear(25088, 512) → ReLU → Dropout(0.5) → Linear(512, 8)</span></li>
              <li>• Input Dimensions: <span className="font-semibold text-slate-800">3 × 224 × 224 RGB</span></li>
              <li>• Normalization: <span className="font-semibold text-slate-800">ImageNet Mean &amp; Std</span></li>
            </ul>
          </div>

          {/* Column 3: Edge Computing & Privacy */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Privacy &amp; Security
            </h4>
            <ul className="space-y-1 text-slate-600">
              <li>• Inference Engine: <span className="font-semibold text-slate-800">ONNX Runtime Web (WASM)</span></li>
              <li>• Backend Requirement: <span className="font-semibold text-emerald-700 font-mono">None (Zero Backend)</span></li>
              <li>• Image Privacy: <span className="font-semibold text-slate-800">Photos never leave your device</span></li>
              <li>• Offline Capable: <span className="font-semibold text-slate-800">Runs locally in browser cache</span></li>
            </ul>
          </div>

          {/* Column 4: Supported Classes */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              8 Leaf Classes
            </h4>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
              <span>• Anthracnose</span>
              <span>• Bacterial Canker</span>
              <span>• Cutting Weevil</span>
              <span>• Die Back</span>
              <span>• Gall Midge</span>
              <span>• Healthy</span>
              <span>• Powdery Mildew</span>
              <span>• Sooty Mould</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Mango Leaf Disease Classification System. Educational &amp; Agricultural AI.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Powered by PyTorch, ONNX Runtime Web, and</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

