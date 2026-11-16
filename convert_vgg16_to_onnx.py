"""
Model Conversion Script: PyTorch VGG16 to ONNX
Converts the trained Mango Leaf Disease Classification VGG16 PyTorch checkpoint
to ONNX format for browser inference with ONNX Runtime Web.
"""

import os
import sys
import json
import shutil
import numpy as np
import torch
import torch.nn as nn
import onnx
import onnxruntime as ort

class VGG16MangoClassifier(nn.Module):
    """
    Exact VGG16 architecture matching the training checkpoint:
    - Pretrained VGG16 feature extraction layers (13 Conv2d, ReLU, MaxPool2d)
    - AdaptiveAvgPool2d((7, 7))
    - Custom classifier:
        - Linear(512 * 7 * 7 = 25088, 512)
        - ReLU(inplace=True)
        - Dropout(0.5)
        - Linear(512, num_classes=8)
    """
    def __init__(self, num_classes=8):
        super().__init__()
        # VGG16 features configuration: 64, 64, M, 128, 128, M, 256, 256, 256, M, 512, 512, 512, M, 512, 512, 512, M
        cfg = [64, 64, 'M', 128, 128, 'M', 256, 256, 256, 'M', 512, 512, 512, 'M', 512, 512, 512, 'M']
        layers = []
        in_channels = 3
        for v in cfg:
            if v == 'M':
                layers += [nn.MaxPool2d(kernel_size=2, stride=2)]
            else:
                conv2d = nn.Conv2d(in_channels, v, kernel_size=3, padding=1)
                layers += [conv2d, nn.ReLU(inplace=True)]
                in_channels = v
        self.features = nn.Sequential(*layers)
        self.avgpool = nn.AdaptiveAvgPool2d((7, 7))
        self.classifier = nn.Sequential(
            nn.Linear(512 * 7 * 7, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x

def convert_checkpoint_to_onnx(
    checkpoint_path="MangoLeaf_VGG16_Models/MangoLeaf_VGG16.pth",
    class_names_path="MangoLeaf_VGG16_Models/class_names.json",
    output_dir="public/models",
    onnx_filename="mango_leaf_vgg16.onnx"
):
    print("=" * 60)
    print("Starting Mango Leaf Disease VGG16 Model Conversion to ONNX")
    print("=" * 60)

    if not os.path.exists(checkpoint_path):
        raise FileNotFoundError(f"Checkpoint not found at: {checkpoint_path}")
    if not os.path.exists(class_names_path):
        raise FileNotFoundError(f"Class names file not found at: {class_names_path}")

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    onnx_output_path = os.path.join(output_dir, onnx_filename)
    public_class_names_path = os.path.join(output_dir, "class_names.json")

    # Copy class names to public/models
    print(f"1. Copying {class_names_path} -> {public_class_names_path}")
    shutil.copyfile(class_names_path, public_class_names_path)

    # Load class names
    with open(class_names_path, "r", encoding="utf-8") as f:
        class_names = json.load(f)
    num_classes = len(class_names)
    print(f"   Loaded {num_classes} classes: {class_names}")

    # Load checkpoint
    print(f"2. Loading PyTorch checkpoint from {checkpoint_path}...")
    checkpoint = torch.load(checkpoint_path, map_location="cpu")

    ckpt_class_names = checkpoint.get("class_names", class_names)
    image_size = checkpoint.get("image_size", 224)
    architecture = checkpoint.get("architecture", "VGG16")
    print(f"   Checkpoint Architecture: {architecture}")
    print(f"   Checkpoint Image Size: {image_size}x{image_size}")
    print(f"   Checkpoint Num Classes: {checkpoint.get('num_classes', num_classes)}")

    # Instantiate model and load state dict
    print("3. Recreating VGG16 architecture and loading state dict...")
    model = VGG16MangoClassifier(num_classes=num_classes)
    state_dict = checkpoint["model_state_dict"] if "model_state_dict" in checkpoint else checkpoint
    load_result = model.load_state_dict(state_dict, strict=True)
    print(f"   State dict loaded successfully! Result: {load_result}")

    # Set model to evaluation mode
    model.eval()

    # Dummy input matching the expected dimensions [batch, channels, height, width]
    batch_size = 1
    dummy_input = torch.randn(batch_size, 3, image_size, image_size, dtype=torch.float32)

    # Run PyTorch inference on dummy input
    print("4. Testing PyTorch forward pass...")
    with torch.no_grad():
        torch_output = model(dummy_input)
    print(f"   PyTorch output shape: {torch_output.shape}")

    # Export to ONNX
    print(f"5. Exporting model to ONNX: {onnx_output_path}...")
    torch.onnx.export(
        model,
        dummy_input,
        onnx_output_path,
        export_params=True,
        opset_version=17,
        do_constant_folding=True,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={
            "input": {0: "batch_size"},
            "output": {0: "batch_size"}
        },
        dynamo=False
    )
    print(f"   ONNX export complete. File size: {os.path.getsize(onnx_output_path) / (1024*1024):.2f} MB")

    # Validate ONNX model with onnx checker
    print("6. Validating ONNX model integrity...")
    onnx_model = onnx.load(onnx_output_path)
    onnx.checker.check_model(onnx_model)
    print("   ONNX model structure is valid!")

    # Verify ONNX Runtime produces matching output
    print("7. Verifying numerical precision with ONNX Runtime...")
    ort_session = ort.InferenceSession(onnx_output_path)
    input_name = ort_session.get_inputs()[0].name
    output_name = ort_session.get_outputs()[0].name
    print(f"   ONNX input name: '{input_name}', output name: '{output_name}'")

    ort_inputs = {input_name: dummy_input.numpy()}
    ort_outputs = ort_session.run([output_name], ort_inputs)

    # Compare outputs
    max_diff = np.max(np.abs(torch_output.numpy() - ort_outputs[0]))
    print(f"   Max absolute numerical difference: {max_diff:.8e}")
    if max_diff < 1e-4:
        print("   SUCCESS: ONNX model output matches PyTorch model within tolerance!")
    else:
        raise ValueError(f"Discrepancy too large between PyTorch and ONNX: {max_diff}")

    print("=" * 60)
    print("CONVERSION COMPLETED SUCCESSFULLY!")
    print(f"Artifacts saved in '{output_dir}':")
    print(f" - {onnx_filename}")
    print(" - class_names.json")
    print("=" * 60)

if __name__ == "__main__":
    convert_checkpoint_to_onnx()

