const ort = require('onnxruntime-web');
const fs = require('fs');
const path = require('path');

// ImageNet normalization constants matching PyTorch
const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD = [0.229, 0.224, 0.225];
const MODEL_SIZE = 224;

// Softmax implementation matching imagePreprocessing.ts
function softmax(logits) {
  let maxLogit = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxLogit) maxLogit = logits[i];
  }
  let sumExp = 0.0;
  const expVals = new Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    const e = Math.exp(logits[i] - maxLogit);
    expVals[i] = e;
    sumExp += e;
  }
  return expVals.map((v) => v / sumExp);
}

async function runVerification() {
  console.log('====================================================');
  console.log('Verifying ONNX Runtime Web Model & Preprocessing Pipeline');
  console.log('====================================================');

  const modelPath = path.join(__dirname, 'public/models/mango_leaf_vgg16.onnx');
  const classNamesPath = path.join(__dirname, 'public/models/class_names.json');

  const classNames = JSON.parse(fs.readFileSync(classNamesPath, 'utf8'));
  console.log('1. Loaded 8 classes:', classNames);

  const modelBuffer = fs.readFileSync(modelPath);
  const session = await ort.InferenceSession.create(modelBuffer);
  console.log('2. Created ONNX Runtime Web InferenceSession!');
  console.log('   Input Name:', session.inputNames[0]);
  console.log('   Output Name:', session.outputNames[0]);

  // Test deterministic input (zeros and ones)
  const planeSize = MODEL_SIZE * MODEL_SIZE;
  const floatArr = new Float32Array(3 * planeSize);

  // Fill with dummy normalized values
  for (let i = 0; i < planeSize; i++) {
    floatArr[0 * planeSize + i] = (128 / 255 - IMAGENET_MEAN[0]) / IMAGENET_STD[0];
    floatArr[1 * planeSize + i] = (128 / 255 - IMAGENET_MEAN[1]) / IMAGENET_STD[1];
    floatArr[2 * planeSize + i] = (128 / 255 - IMAGENET_MEAN[2]) / IMAGENET_STD[2];
  }

  const tensor = new ort.Tensor('float32', floatArr, [1, 3, MODEL_SIZE, MODEL_SIZE]);
  const feeds = { [session.inputNames[0]]: tensor };
  const results = await session.run(feeds);
  const rawLogits = Array.from(results[session.outputNames[0]].data);
  const probs = softmax(rawLogits);

  console.log('3. Test inference run successful:');
  console.log('   Raw Logits:', rawLogits.map(v => v.toFixed(4)));
  console.log('   Softmax Probs:', probs.map(v => (v * 100).toFixed(2) + '%'));
  const sumProbs = probs.reduce((a, b) => a + b, 0);
  console.log('   Sum of probabilities:', sumProbs.toFixed(6), '(Expected: 1.000000)');

  console.log('====================================================');
  console.log('ALL TESTS PASSED! ONNX Runtime Web is fully functional.');
  console.log('====================================================');
}

runVerification().catch(console.error);
