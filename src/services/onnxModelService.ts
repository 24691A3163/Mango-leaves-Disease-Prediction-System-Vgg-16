import * as ort from 'onnxruntime-web';
import { preprocessImage, softmax } from '../utils/imagePreprocessing';

export interface ClassProbability {
  className: string;
  probability: number; // 0.0 - 1.0
  percentage: number;  // 0.0 - 100.0%
  index: number;
}

export interface PredictionResult {
  predictedClass: string;
  confidence: number; // 0.0 - 100.0%
  rawLogits: number[];
  probabilities: ClassProbability[];
  top3: ClassProbability[];
  inferenceTimeMs: number;
  timestamp: string;
  status: 'High Confidence' | 'Moderate Confidence' | 'Uncertain';
}

export type ModelStatus = 'unloaded' | 'loading' | 'loaded' | 'error';

class OnnxModelService {
  private session: ort.InferenceSession | null = null;
  private classNames: string[] = [];
  private status: ModelStatus = 'unloaded';
  private statusMessage: string = 'Model not loaded';
  private errorMessage: string | null = null;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    this.configureWasm();
  }

  private configureWasm() {
    try {
      // Set wasmPaths to public/wasm directory where binaries were copied
      ort.env.wasm.wasmPaths = '/wasm/';
      // Single thread ensures compatibility across all modern browsers without strict COOP/COEP header enforcement
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.simd = true;
    } catch (err) {
      console.warn('WASM config warning:', err);
    }
  }

  public getStatus(): { status: ModelStatus; message: string; error: string | null } {
    return {
      status: this.status,
      message: this.statusMessage,
      error: this.errorMessage,
    };
  }

  public getClassNames(): string[] {
    return [...this.classNames];
  }

  /**
   * Initializes and loads the ONNX VGG16 model and class names.
   */
  public async loadModel(): Promise<void> {
    if (this.session && this.classNames.length > 0) {
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        this.status = 'loading';
        this.statusMessage = 'Loading class labels...';
        this.errorMessage = null;

        // 1. Fetch class names from public/models/class_names.json
        const classNamesResp = await fetch('/models/class_names.json');
        if (!classNamesResp.ok) {
          throw new Error(`Failed to load class_names.json (${classNamesResp.status} ${classNamesResp.statusText})`);
        }
        this.classNames = await classNamesResp.json();

        // 2. Load ONNX model
        this.statusMessage = 'Loading VGG16 ONNX model into browser memory...';
        const modelUrl = '/models/mango_leaf_vgg16.onnx';

        // Check if model exists via HEAD or direct session creation
        const sessionOptions: ort.InferenceSession.SessionOptions = {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all',
        };

        try {
          this.session = await ort.InferenceSession.create(modelUrl, sessionOptions);
        } catch (localErr) {
          console.warn('Initial session creation with local wasmPaths failed, trying CDN fallback...', localErr);
          ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.0/dist/';
          this.session = await ort.InferenceSession.create(modelUrl, sessionOptions);
        }

        this.status = 'loaded';
        this.statusMessage = `VGG16 Model ready (${this.classNames.length} classes)`;
        console.log('VGG16 ONNX Model loaded successfully!', {
          inputs: this.session.inputNames,
          outputs: this.session.outputNames,
          classes: this.classNames,
        });
      } catch (err: unknown) {
        this.status = 'error';
        const msg = err instanceof Error ? err.message : String(err);
        this.errorMessage = msg;
        this.statusMessage = 'Failed to load VGG16 model';
        console.error('Model load error:', err);
        throw err;
      } finally {
        this.loadingPromise = null;
      }
    })();

    return this.loadingPromise;
  }

  /**
   * Runs inference on an HTMLImageElement using the loaded VGG16 ONNX model.
   */
  public async predict(imageElement: HTMLImageElement): Promise<PredictionResult> {
    if (!this.session) {
      await this.loadModel();
    }

    if (!this.session) {
      throw new Error('Model is not loaded. Cannot execute prediction.');
    }

    const startTime = performance.now();

    // 1. Exact PyTorch preprocessing (Resize 224x224, Normalize with ImageNet mean/std, NCHW)
    const { tensor } = preprocessImage(imageElement);

    // 2. Prepare ONNX input feeds
    const inputName = this.session.inputNames[0] || 'input';
    const feeds: Record<string, ort.Tensor> = {};
    feeds[inputName] = tensor;

    // 3. Run Inference directly in the browser
    const results = await this.session.run(feeds);
    const outputName = this.session.outputNames[0] || 'output';
    const outputTensor = results[outputName];

    if (!outputTensor) {
      throw new Error(`Output tensor "${outputName}" not found in model results.`);
    }

    const rawLogits = Array.from(outputTensor.data as Float32Array);

    // 4. Calculate Softmax Probabilities
    const probs = softmax(rawLogits);

    const inferenceTimeMs = Math.round(performance.now() - startTime);

    // 5. Structure probabilities with class names
    const probabilities: ClassProbability[] = this.classNames.map((name, index) => ({
      className: name,
      probability: probs[index],
      percentage: Number((probs[index] * 100).toFixed(2)),
      index,
    }));

    // Sort by probability descending
    const sorted = [...probabilities].sort((a, b) => b.probability - a.probability);
    const top1 = sorted[0];
    const top3 = sorted.slice(0, 3);

    // Confidence status badge
    let status: 'High Confidence' | 'Moderate Confidence' | 'Uncertain' = 'High Confidence';
    if (top1.percentage < 60) {
      status = 'Uncertain';
    } else if (top1.percentage < 85) {
      status = 'Moderate Confidence';
    }

    return {
      predictedClass: top1.className,
      confidence: top1.percentage,
      rawLogits,
      probabilities,
      top3,
      inferenceTimeMs,
      timestamp: new Date().toLocaleTimeString(),
      status,
    };
  }
}

// Export singleton instance
export const onnxModelService = new OnnxModelService();

