import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActivePage } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PredictionPage } from './pages/PredictionPage';
import { ResultsPage } from './pages/ResultsPage';
import { DiseaseInfoPage } from './pages/DiseaseInfoPage';
import { onnxModelService, ModelStatus, PredictionResult } from './services/onnxModelService';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  // Model status state
  const [modelStatus, setModelStatus] = useState<ModelStatus>('unloaded');
  const [modelMessage, setModelMessage] = useState<string>('Initializing...');
  const [modelError, setModelError] = useState<string | null>(null);
  const [classNames, setClassNames] = useState<string[]>([]);

  // Initialize and load the model on application mount
  const loadModelSafely = useCallback(async () => {
    try {
      setModelStatus('loading');
      setModelMessage('Loading VGG16 ONNX model...');
      setModelError(null);

      await onnxModelService.loadModel();

      const st = onnxModelService.getStatus();
      setModelStatus(st.status);
      setModelMessage(st.message);
      setModelError(st.error);
      setClassNames(onnxModelService.getClassNames());
    } catch (err: unknown) {
      console.error('Failed to load model:', err);
      setModelStatus('error');
      setModelMessage('Model initialization failed');
      setModelError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    loadModelSafely();
  }, [loadModelSafely]);

  const handleImageSelected = (file: File | null, url: string | null) => {
    setImageFile(file);
    setImageUrl(url);
    // Reset any previous prediction result when new image is picked
    setPredictionResult(null);
  };

  const handlePredictionComplete = (result: PredictionResult) => {
    setPredictionResult(result);
    setActivePage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePredictAnother = () => {
    setActivePage('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDiseaseDetails = (_diseaseName: string) => {
    setActivePage('diseases');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        modelStatus={modelStatus}
        modelMessage={modelMessage}
        modelError={modelError}
        onRetryModelLoad={loadModelSafely}
        hasResults={predictionResult !== null}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'home' && (
          <HomePage
            onStartPrediction={() => setActivePage('predict')}
            onViewGuide={() => setActivePage('diseases')}
            modelStatus={modelStatus}
            modelMessage={modelMessage}
            modelError={modelError}
            onRetryModelLoad={loadModelSafely}
            classNames={classNames}
          />
        )}

        {activePage === 'predict' && (
          <PredictionPage
            imageFile={imageFile}
            imageUrl={imageUrl}
            onImageSelected={handleImageSelected}
            onPredictionComplete={handlePredictionComplete}
            modelStatus={modelStatus}
            modelMessage={modelMessage}
            modelError={modelError}
            onRetryModelLoad={loadModelSafely}
          />
        )}

        {activePage === 'results' && predictionResult && (
          <ResultsPage
            result={predictionResult}
            imageUrl={imageUrl}
            onPredictAnother={handlePredictAnother}
            onViewDiseaseDetails={handleViewDiseaseDetails}
          />
        )}

        {activePage === 'diseases' && (
          <DiseaseInfoPage
            predictedClass={predictionResult?.predictedClass}
            classNames={classNames}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
