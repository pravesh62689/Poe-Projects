import os, json, re, sys, time
import pytesseract
from PIL import Image

OUT = "/home/claude/testdata"

# ---------- parsers (mirrors what ocr-doc-bot's parseX functions would do) ----------

GST_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
CONFUSION_SUBS = {'0':'O','O':'0','1':'I','I':'1','2':'Z','Z':'2','5':'S','S':'5','8':'B','B':'8'}

def gstin_checksum_valid(gstin):
    if len(gstin) != 15 or not all(c in GST_ALPHABET for c in gstin):
        return False
    total = 0
    for i, ch in enumerate(gstin[:14]):
        factor = 2 if i % 2 == 1 else 1
        cp = GST_ALPHABET.index(ch)
        product = cp * factor
        product = (product // 36) + (product % 36)
        total += product
    check_cp = (36 - (total % 36)) % 36
    return GST_ALPHABET[check_cp] == gstin[14]

def try_correct_gstin(raw):
    if raw is None:
        return None
    if gstin_checksum_valid(raw):
        return raw
    # try single-character confusion substitutions to find a checksum-valid variant
    for i, ch in enumerate(raw):
        if ch in CONFUSION_SUBS:
            candidate = raw[:i] + CONFUSION_SUBS[ch] + raw[i+1:]
            if gstin_checksum_valid(candidate):
                return candidate
    return raw  # give up, return as-read

import numpy as np

def _projection_score(gray, angle):
    test = gray.rotate(angle, expand=True, fillcolor=255)
    arr = np.array(test)
    binary = (arr < 128).astype(np.int32)
    row_sums = binary.sum(axis=1)
    return np.var(row_sums)

def projection_profile_deskew(img, angle_range=20, step=1.0, min_gain=1.30):
    # Only trust a detected skew angle if it beats doing nothing by a clear
    # margin. Without this guard, the scan finds a spurious "best" angle on
    # already-upright images (especially low-contrast/blurred ones where the
    # binarization threshold is noisy) and actively degrades them.
    gray = img.convert('L')
    baseline = _projection_score(gray, 0)
    best_angle, best_score = 0, baseline
    for angle in np.arange(-angle_range, angle_range + step, step):
        if angle == 0:
            continue
        score = _projection_score(gray, angle)
        if score > best_score:
            best_score, best_angle = score, angle
    if best_angle != 0 and best_score > baseline * min_gain:
        return best_angle
    return 0

def deskew(img):
    # coarse 90-degree-multiple correction via Tesseract's own OSD — only
    # act on it when OSD itself reports reasonable confidence
    try:
        osd = pytesseract.image_to_osd(img)
        coarse = int(re.search(r'Rotate: (\d+)', osd).group(1))
        conf_m = re.search(r'Rotate: \d+\s*\nOrientation confidence: ([\d.]+)', osd) or \
                 re.search(r'Orientation confidence: ([\d.]+)', osd)
        conf = float(conf_m.group(1)) if conf_m else 0
        if coarse != 0 and conf >= 1.0:
            img = img.rotate(-coarse, expand=True, fillcolor='white')
    except pytesseract.TesseractError:
        pass
    # fine residual-tilt correction — guarded, see projection_profile_deskew
    fine_angle = projection_profile_deskew(img)
    if fine_angle != 0:
        img = img.rotate(fine_angle, expand=True, fillcolor='white')
    return img

def parse_receipt(text):
    vendor = None
    for line in text.splitlines():
        line = line.strip()
        if line:
            vendor = line
            break
    date_m = re.search(r'\b(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4})\b', text)
    amount_m = re.search(r'TOTAL[:\s]*Rs\.?\s*([\d,]+\.\d{2})', text, re.IGNORECASE)
    if not amount_m:
        amount_m = re.search(r'([\d,]+\.\d{2})\s*$', text.strip(), re.MULTILINE)
    gstin_m = re.search(r'\b([0-9A-Z]{15})\b', text.replace(" ", ""))
    raw_gstin = gstin_m.group(1) if gstin_m else None
    return {
        "vendor": vendor,
        "date": date_m.group(1) if date_m else None,
        "amount": amount_m.group(1).replace(",", "") if amount_m else None,
        "gstin": try_correct_gstin(raw_gstin),
        "gstin_raw": raw_gstin,
    }

def parse_id(text):
    name_m = re.search(r'Name[:\s]*([A-Za-z ,.]+)', text)
    dob_m = re.search(r'DOB[:\s]*(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4})', text)
    idn_m = re.search(r'ID No[:\s]*([A-Z0-9]{6,12})', text.replace(" ", "").upper()) or \
            re.search(r'\b([A-Z]{5}\d{4}[A-Z]|\d{10})\b', text.replace(" ", ""))
    doc_type = None
    for t in ["PAN CARD", "VOTER ID", "DRIVING LICENCE"]:
        if t.replace(" ", "") in text.replace(" ", "").upper():
            doc_type = t
            break
    return {
        "doc_type": doc_type,
        "name": name_m.group(1).strip() if name_m else None,
        "dob": dob_m.group(1) if dob_m else None,
        "id_number": idn_m.group(1) if idn_m else None,
    }

def parse_statement_from_data(data):
    # Reconstruct rows from word bounding boxes (y-clustering) instead of
    # trusting Tesseract's raw reading order — plain fixed-width text tables
    # get read column-by-column, not row-by-row, under default PSM.
    buckets = {}
    for i in range(len(data['text'])):
        txt = data['text'][i].strip()
        if not txt:
            continue
        key = round(data['top'][i] / 15)
        buckets.setdefault(key, []).append((data['left'][i], txt))
    rows = []
    for k in sorted(buckets):
        words = [w for _, w in sorted(buckets[k])]
        line = " ".join(words)
        nums = re.findall(r'-?[\d,]+\.\d{2}', line)
        date_m = re.search(r'\d{1,2}-\d{1,2}-\d{2,4}', line)
        if date_m and len(nums) >= 2:
            rows.append({"date": date_m.group(0), "amount": nums[-2].replace(",", ""), "balance": nums[-1].replace(",", "")})
    return {"transactions": rows}

# ---------- fuzzy match helpers ----------

def norm(s):
    if s is None:
        return ""
    return re.sub(r'[^A-Za-z0-9.]', '', str(s)).upper()

def field_match(pred, truth):
    return norm(pred) == norm(truth)

def close_amount_match(pred, truth, tol=0.02):
    try:
        return abs(float(pred) - float(truth)) < tol
    except (TypeError, ValueError):
        return False

# ---------- eval ----------

def eval_receipts(gt_list):
    results = []
    for item in gt_list:
        path = os.path.join(OUT, "receipts", item["file"])
        t0 = time.time()
        img = deskew(Image.open(path))
        text = pytesseract.image_to_string(img)
        dt = time.time() - t0
        pred = parse_receipt(text)
        results.append({
            "file": item["file"], "condition": item["condition"], "ocr_seconds": round(dt, 3),
            "vendor_match": field_match(pred["vendor"], item["vendor"]),
            "date_match": field_match(pred["date"], item["date"]),
            "amount_match": close_amount_match(pred["amount"], item["amount"]),
            "gstin_match": field_match(pred["gstin"], item["gstin"]),
        })
    return results

def eval_ids(gt_list):
    results = []
    for item in gt_list:
        path = os.path.join(OUT, "ids", item["file"])
        t0 = time.time()
        img = deskew(Image.open(path))
        text = pytesseract.image_to_string(img)
        dt = time.time() - t0
        pred = parse_id(text)
        results.append({
            "file": item["file"], "condition": item["condition"], "ocr_seconds": round(dt, 3),
            "doc_type_match": pred["doc_type"] == item["doc_type"],
            "name_match": field_match(pred["name"], item["name"]),
            "dob_match": field_match(pred["dob"], item["dob"]),
            "id_number_match": field_match(pred["id_number"], item["id_number"]),
        })
    return results

def eval_statements(gt_list):
    results = []
    for item in gt_list:
        path = os.path.join(OUT, "statements", item["file"])
        t0 = time.time()
        img = deskew(Image.open(path))
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        dt = time.time() - t0
        pred = parse_statement_from_data(data)
        truth_rows = item["transactions"]
        matched = 0
        for tr in truth_rows:
            for pr in pred["transactions"]:
                if pr["date"] == tr["date"] and close_amount_match(pr["amount"], tr["amount"]) and close_amount_match(pr["balance"], tr["balance"]):
                    matched += 1
                    break
        row_recall = matched / len(truth_rows) if truth_rows else 0
        results.append({
            "file": item["file"], "condition": item["condition"], "ocr_seconds": round(dt, 3),
            "rows_total": len(truth_rows), "rows_matched": matched, "row_recall": round(row_recall, 3),
        })
    return results

def summarize(results, keys, name):
    from collections import defaultdict
    by_cond = defaultdict(lambda: defaultdict(list))
    for r in results:
        for k in keys:
            by_cond[r["condition"]][k].append(r[k])
    print(f"\n=== {name} — accuracy by condition (n={len(results)}) ===")
    for cond, kv in sorted(by_cond.items()):
        parts = []
        for k in keys:
            vals = kv[k]
            if isinstance(vals[0], bool):
                rate = sum(vals) / len(vals)
                parts.append(f"{k}={rate:.0%}")
            else:
                avg = sum(vals) / len(vals)
                parts.append(f"{k}_avg={avg:.2f}")
        n_cond = len(kv[keys[0]])
        print(f"  {cond:15s} (n={n_cond}): " + ", ".join(parts))

RESULTS_PATH = os.path.join(OUT, "ocr_results.json")

def load_results():
    if os.path.exists(RESULTS_PATH):
        return json.load(open(RESULTS_PATH))
    return {"receipts": [], "statements": [], "ids": []}

def save_results(res):
    json.dump(res, open(RESULTS_PATH, "w"), indent=2)

if __name__ == "__main__":
    # Usage: python3 run_ocr_eval.py <category> <start> <end>
    #        python3 run_ocr_eval.py summarize
    gt = json.load(open(os.path.join(OUT, "ground_truth.json")))
    res = load_results()

    if sys.argv[1] == "summarize":
        summarize(res["receipts"], ["vendor_match", "date_match", "amount_match", "gstin_match"], "RECEIPTS")
        summarize(res["statements"], ["row_recall"], "STATEMENTS")
        summarize(res["ids"], ["doc_type_match", "name_match", "dob_match", "id_number_match"], "IDS")
        n_total = len(res["receipts"]) + len(res["statements"]) + len(res["ids"])
        print(f"\nTotal processed so far: {n_total} images")
    else:
        cat, start, end = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
        t0 = time.time()
        if cat == "receipts":
            new = eval_receipts(gt["receipts"][start:end])
        elif cat == "statements":
            new = eval_statements(gt["statements"][start:end])
        elif cat == "ids":
            new = eval_ids(gt["ids"][start:end])
        else:
            raise ValueError(cat)
        res[cat].extend(new)
        save_results(res)
        dt = time.time() - t0
        print(f"{cat} [{start}:{end}] done in {dt:.1f}s ({dt/max(1,len(new)):.2f}s/image). "
              f"Running total for {cat}: {len(res[cat])}")
