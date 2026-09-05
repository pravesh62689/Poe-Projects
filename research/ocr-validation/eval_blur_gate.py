import os
import glob
import json
import numpy as np
from PIL import Image

def compute_laplacian_variance(image_path_or_pil):
    if isinstance(image_path_or_pil, str):
        im = Image.open(image_path_or_pil).convert('L')
    else:
        im = image_path_or_pil.convert('L')
    arr = np.array(im, dtype=np.float32)
    # 3x3 standard discrete Laplacian kernel in-place to minimize allocations
    lap = np.empty_like(arr[:-2, 1:-1])
    np.copyto(lap, arr[:-2, 1:-1])
    lap += arr[2:, 1:-1]
    lap += arr[1:-1, :-2]
    lap += arr[1:-1, 2:]
    lap -= 4.0 * arr[1:-1, 1:-1]
    return float(np.var(lap))

def evaluate_samples(sample_dir="research/ocr-validation/samples", threshold=300.0):
    sample_files = sorted(glob.glob(os.path.join(sample_dir, "*.png")))
    results = []
    
    tp, fp, tn, fn = 0, 0, 0, 0
    
    print(f"=== Evaluating Blur Detection Gate (Threshold = {threshold}) ===")
    print(f"{'Filename':35s} | {'Condition':13s} | {'Laplacian Var':13s} | {'Gate Decision':15s} | {'Status'}")
    print("-" * 95)
    
    for path in sample_files:
        basename = os.path.basename(path)
        condition = basename.split("_")[-1].replace(".png", "")
        # Adjust for composite names like low_contrast
        if "low_contrast" in basename:
            condition = "low_contrast"
        
        score = compute_laplacian_variance(path)
        is_blurred_detected = score < threshold
        is_actually_blurred = condition == "blurred"
        
        if is_blurred_detected and is_actually_blurred:
            tp += 1
            status = "CORRECT (REJECTED)"
        elif not is_blurred_detected and not is_actually_blurred:
            tn += 1
            status = "CORRECT (ACCEPTED)"
        elif is_blurred_detected and not is_actually_blurred:
            fp += 1
            status = "FALSE ALARM (FALSE REJECTION)"
        else:
            fn += 1
            status = "MISSED BLUR (LEAKAGE)"
            
        gate_str = "REJECT (Blur)" if is_blurred_detected else "ACCEPT"
        print(f"{basename:35s} | {condition:13s} | {score:13.2f} | {gate_str:15s} | {status}")
        
        results.append({
            "file": basename,
            "condition": condition,
            "score": score,
            "rejected": is_blurred_detected,
            "status": status,
        })
        
    total = len(sample_files)
    accuracy = (tp + tn) / total if total else 0
    precision = tp / (tp + fp) if (tp + fp) else 0
    recall = tp / (tp + fn) if (tp + fn) else 0
    
    print("-" * 95)
    print(f"Total Samples: {total} | TP={tp}, TN={tn}, FP={fp}, FN={fn}")
    print(f"Blur Detection Recall:    {recall:.1%} ({tp}/{tp+fn} blurred rejected)")
    print(f"False Positive Rate:      {fp/(fp+tn):.1%} ({fp}/{fp+tn} false rejections)")
    print(f"Overall Gate Accuracy:    {accuracy:.1%}")
    return results

if __name__ == "__main__":
    evaluate_samples()
