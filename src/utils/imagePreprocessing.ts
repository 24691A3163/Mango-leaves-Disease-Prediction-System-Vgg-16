import * as ort from 'onnxruntime-web';

export interface PreprocessedImageResult {
  tensor: ort.Tensor;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
}

// Exact ImageNet statistics used in torchvision.transforms.Normalize
const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD = [0.229, 0.224, 0.225];
const MODEL_IMAGE_SIZE = 224;

/**
 * Validates an uploaded image file.
 * Allowed formats: JPEG, JPG, PNG.
 * Max size: 15 MB.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a JPG, JPEG, or PNG image of a mango leaf.',
    };
  }

  const maxSizeInBytes = 15 * 1024 * 1024; // 15MB
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: 'File size exceeds 15 MB limit. Please upload a smaller image file.',
    };
  }

  return { valid: true };
}

/**
 * Loads an image from a URL or File object into an HTMLImageElement.
 */
export function loadImageElement(source: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for processing.'));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read image file data.'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading image file.'));
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Preprocesses an image element matching the original PyTorch evaluation transforms:
 * 1. Convert/Render to RGB at 224 x 224 pixels.
 * 2. Convert pixel values from [0, 255] to [0.0, 1.0].
 * 3. Normalize channels: (x - mean) / std with ImageNet constants:
 *    mean = [0.485, 0.456, 0.406]
 *    std  = [0.229, 0.224, 0.225]
 * 4. Transpose from HWC (canvas) to CHW (PyTorch standard) format.
 * 5. Shape into ONNX tensor of dimensions [1, 3, 224, 224].
 */
export function preprocessImage(img: HTMLImageElement): PreprocessedImageResult {
  const canvas = document.createElement('canvas');
  canvas.width = MODEL_IMAGE_SIZE;
  canvas.height = MODEL_IMAGE_SIZE;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Could not acquire 2D rendering context from canvas.');
  }

  // Draw image scaled to 224x224 (equivalent to transforms.Resize((224, 224)))
  ctx.drawImage(img, 0, 0, MODEL_IMAGE_SIZE, MODEL_IMAGE_SIZE);

  const imageData = ctx.getImageData(0, 0, MODEL_IMAGE_SIZE, MODEL_IMAGE_SIZE);
  const data = imageData.data; // RGBA data: length = 224 * 224 * 4

  const planeSize = MODEL_IMAGE_SIZE * MODEL_IMAGE_SIZE;
  const floatArr = new Float32Array(3 * planeSize);

  // Layout: [Batch=1, Channels=3, Height=224, Width=224]
  // Channel 0 (R): offset = 0 * planeSize
  // Channel 1 (G): offset = 1 * planeSize
  // Channel 2 (B): offset = 2 * planeSize
  const rOffset = 0 * planeSize;
  const gOffset = 1 * planeSize;
  const bOffset = 2 * planeSize;

  for (let i = 0; i < planeSize; i++) {
    const pxIndex = i * 4;

    // Convert [0, 255] -> [0.0, 1.0]
    const r = data[pxIndex + 0] / 255.0;
    const g = data[pxIndex + 1] / 255.0;
    const b = data[pxIndex + 2] / 255.0;

    // Apply exact PyTorch normalization: (val - mean) / std
    floatArr[rOffset + i] = (r - IMAGENET_MEAN[0]) / IMAGENET_STD[0];
    floatArr[gOffset + i] = (g - IMAGENET_MEAN[1]) / IMAGENET_STD[1];
    floatArr[bOffset + i] = (b - IMAGENET_MEAN[2]) / IMAGENET_STD[2];
  }

  const tensor = new ort.Tensor('float32', floatArr, [1, 3, MODEL_IMAGE_SIZE, MODEL_IMAGE_SIZE]);

  return {
    tensor,
    width: MODEL_IMAGE_SIZE,
    height: MODEL_IMAGE_SIZE,
    canvas,
  };
}

/**
 * Calculates numerically stable Softmax over an array or Float32Array of logits.
 */
export function softmax(logits: number[] | Float32Array): number[] {
  let maxLogit = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxLogit) {
      maxLogit = logits[i];
    }
  }

  let sumExp = 0.0;
  const expVals = new Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    const e = Math.exp(logits[i] - maxLogit);
    expVals[i] = e;
    sumExp += e;
  }

  return expVals.map((val) => val / sumExp);
}

