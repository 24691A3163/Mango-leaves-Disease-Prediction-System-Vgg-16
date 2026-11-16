import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { ModelStatusBadge } from '../components/ModelStatusBadge';
import { onnxModelService, ModelStatus, PredictionResult } from '../services/onnxModelService';
import { loadImageElement } from '../utils/imagePreprocessing';
import { AlertTriangle, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface PredictionPageProps {
  imageFile: File | null;
  imageUrl: string | null;
  onImageSelected: (file: File | null, url: string | null) => void;
  onPredictionComplete: (result: PredictionResult) => void;
  modelStatus: ModelStatus;
  modelMessage: string;
  modelError: string | null;
  onRetryModelLoad: () => void;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  imageFile,
  imageUrl,
  onImageSelected,
  onPredictionComplete,
  modelStatus,
  modelMessage,
  modelError,
  onRetryModelLoad,
}) => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!imageUrl) {
      setPredictionError('Please upload or select a mango leaf image before running prediction.');
      return;
    }

    try {
      setIsPredicting(true);
      setPredictionError(null);

      // Ensure model is loaded
      if (modelStatus !== 'loaded') {
        await onnxModelService.loadModel();
      }

      // 1. Load image into HTMLImageElement
      const imgElement = await loadImageElement(imageUrl);

      // 2. Run inference via onnxModelService
      // Preprocesses (224x224, ImageNet normalization, NCHW), runs ONNX session, computes Softmax
      const result = await onnxModelService.predict(imgElement);

      // 3. Callback to update state and navigate to Results page
      onPredictionComplete(result);
    } catch (err: unknown) {
      console.error('Prediction failed:', err);
      const msg = err instanceof Error ? err.message : 'An error occurred during inference.';
      setPredictionError(msg);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Inference Studio
            </span>
            <span className="text-xs text-slate-400">• VGG16 Browser Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Mango Leaf Disease Prediction
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload a high-resolution mango leaf photo to classify pathology across 8 trained classes.
          </p>
        </div>

        <div className="shrink-0">
          <ModelStatusBadge
            status={modelStatus}
            message={modelMessage}
            error={modelError}
            onRetry={onRetryModelLoad}
            showDetails
          />
        </div>
      </div>

      {/* Model Loading Warning Banner if not yet loaded */}
      {modelStatus === 'loading' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
          <div>
            <span className="font-semibold">VGG16 Model Initializing: </span>
            <span>Downloading and preparing ONNX WebAssembly weights (~105MB). Inference will automatically start once ready.</span>
          </div>
        </div>
      )}

      {modelStatus === 'error' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Model Load Error: </span>
            <span>{modelError || 'Failed to initialize ONNX Runtime Web session.'}</span>
            <div className="mt-2">
              <button
                type="button"
                onClick={onRetryModelLoad}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Retry Loading Model
              </button>
            </div>
          </div>
        </div>
      )}

      {predictionError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Prediction Failed: </span>
            <span>{predictionError}</span>
          </div>
        </div>
      )}

      {/* Upload Component */}
      <ImageUploader
        imageFile={imageFile}
        imageUrl={imageUrl}
        onImageSelected={onImageSelected}
        onPredict={handlePredict}
        isPredicting={isPredicting}
        modelReady={modelStatus === 'loaded'}
        onLoadModel={onRetryModelLoad}
      />

      {/* Quick Tips / Instructions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Optimal Lighting</span>
          </div>
          <p className="text-slate-500">
            Take photos under diffuse daylight without strong glare or deep shadows across the leaf surface.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Single Leaf Focus</span>
          </div>
          <p className="text-slate-500">
            Capture a single infected or healthy leaf centered in the frame to match the 224x224 training dataset.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Private &amp; Offline</span>
          </div>
          <p className="text-slate-500">
            Images are processed locally using your device's CPU/GPU and are never uploaded to any server.
          </p>
        </div>
      </div>
    </div>
  );
};
