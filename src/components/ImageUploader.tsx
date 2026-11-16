import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { validateImageFile } from '../utils/imagePreprocessing';

interface SampleImage {
  className: string;
  fileName: string;
  path: string;
}

interface ImageUploaderProps {
  imageFile: File | null;
  imageUrl: string | null;
  onImageSelected: (file: File | null, url: string | null) => void;
  onPredict: () => void;
  isPredicting: boolean;
  modelReady: boolean;
  onLoadModel?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageFile,
  imageUrl,
  onImageSelected,
  onPredict,
  isPredicting,
  modelReady,
  onLoadModel,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [samples, setSamples] = useState<SampleImage[]>([]);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample leaves list
  useEffect(() => {
    let isMounted = true;
    async function loadSamples() {
      try {
        setLoadingSamples(true);
        const resp = await fetch('/samples/samples.json');
        if (resp.ok) {
          const data = await resp.json();
          if (isMounted) setSamples(data);
        }
      } catch (e) {
        console.warn('Could not load sample images list', e);
      } finally {
        if (isMounted) setLoadingSamples(false);
      }
    }
    loadSamples();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = (file: File) => {
    setValidationError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file format.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onImageSelected(file, objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    onImageSelected(null, null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectSample = async (sample: SampleImage) => {
    try {
      setValidationError(null);
      // Fetch sample image as blob to create a real File object for consistency
      const resp = await fetch(sample.path);
      const blob = await resp.blob();
      const file = new File([blob], sample.fileName, { type: blob.type || 'image/jpeg' });
      onImageSelected(file, sample.path);
    } catch (err) {
      console.error('Failed to load sample image:', err);
      setValidationError('Could not load selected sample image.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Upload Error: </span>
            <span>{validationError}</span>
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-rose-500 hover:text-rose-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Drop Area / Preview Card */}
      {!imageUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-400 bg-white/70 hover:bg-emerald-50/20'
          }`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center text-emerald-700 mb-5 shadow-inner">
              <UploadCloud className="w-10 h-10 stroke-[1.8]" />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Upload Mango Leaf Image
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Drag and drop your mango leaf photo here, or browse your files. Supported formats: <span className="font-medium text-slate-700">JPG, JPEG, PNG</span> (up to 15MB).
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all duration-150 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Browse Image</span>
            </button>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Image Box */}
            <div className="relative w-full md:w-80 h-72 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group shrink-0">
              <img
                src={imageUrl}
                alt="Uploaded Mango Leaf"
                className="w-full h-full object-contain"
              />

              {/* Scanning visual overlay during inference */}
              {isPredicting && (
                <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute animate-scanline shadow-lg shadow-emerald-400"></div>
                  <div className="bg-white/90 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900 shadow-lg">
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>Preprocessing &amp; Classifying...</span>
                  </div>
                </div>
              )}

              {/* Remove button */}
              {!isPredicting && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white transition-colors duration-150 shadow-md cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Actions & Image Info */}
            <div className="flex-1 w-full flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Image Ready for Analysis
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 truncate">
                  {imageFile ? imageFile.name : 'Sample Leaf Image'}
                </h4>
                {imageFile && (
                  <p className="text-xs text-slate-500 mt-1">
                    Size: {(imageFile.size / 1024).toFixed(1)} KB • Type: {imageFile.type || 'image/jpeg'}
                  </p>
                )}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="font-semibold text-slate-800">Inference Pipeline:</div>
                  <div>1. RGB conversion &amp; 224×224 bilinear scaling</div>
                  <div>2. ImageNet normalization: (x - mean) / std</div>
                  <div>3. In-browser VGG16 forward pass via ONNX Runtime Web</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onPredict}
                  disabled={isPredicting || !modelReady}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-md transition-all duration-150 ${
                    isPredicting || !modelReady
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 hover:shadow-lg cursor-pointer'
                  }`}
                >
                  {isPredicting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Classifying Disease...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>Predict Disease</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isPredicting}
                  className="px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Remove Image
                </button>

                {!modelReady && onLoadModel && (
                  <button
                    type="button"
                    onClick={onLoadModel}
                    className="px-4 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Load Model First
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1-Click Sample Dataset Images Drawer */}
      <div className="bg-white/80 rounded-2xl border border-emerald-100 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Or Try A Sample Leaf From The Dataset (8 Classes)
            </h4>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click any leaf to test immediately
          </span>
        </div>

        {loadingSamples ? (
          <div className="flex items-center justify-center py-6 text-xs text-slate-500 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Loading sample dataset leaves...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {samples.map((s) => (
              <button
                key={s.className}
                type="button"
                onClick={() => handleSelectSample(s)}
                disabled={isPredicting}
                className="group flex flex-col items-center p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-center cursor-pointer"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 mb-1.5 border border-slate-200 group-hover:scale-105 transition-transform">
                  <img
                    src={s.path}
                    alt={s.className}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-800 line-clamp-1 leading-tight">
                  {s.className}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

