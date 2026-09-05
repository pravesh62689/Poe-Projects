import os, json, random, string, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from faker import Faker

random.seed(42)
fake = Faker('en_IN')
Faker.seed(42)

OUT = "/home/claude/testdata"
os.makedirs(OUT, exist_ok=True)

PRINT_FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "/usr/share/fonts/truetype/google-fonts/Poppins-Regular.ttf",
]
HAND_FONT_PATHS = [
    "/usr/share/fonts/truetype/fifthhorseman/dkg.ttf",
    "/usr/share/fonts/opentype/dancingscript/DancingScript-Regular.otf",
    "/usr/share/fonts/truetype/kristi/Kristi.ttf",
    "/usr/share/fonts/truetype/klee/KleeOne-Regular.ttf",
    "/usr/share/fonts/truetype/rufscript/Rufscript010.ttf",
]

def font(path, size):
    return ImageFont.truetype(path, size)

# ---------- GSTIN checksum (real algorithm) ----------
GST_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def gstin_checksum(gstin14):
    total = 0
    for i, ch in enumerate(gstin14):
        factor = 2 if i % 2 == 1 else 1
        code_point = GST_ALPHABET.index(ch)
        product = code_point * factor
        product = (product // 36) + (product % 36)
        total += product
    check_code_point = (36 - (total % 36)) % 36
    return GST_ALPHABET[check_code_point]

def gen_gstin():
    state_code = f"{random.randint(1,37):02d}"
    pan = "".join(random.choices(string.ascii_uppercase, k=5)) + \
          "".join(random.choices(string.digits, k=4)) + \
          random.choice(string.ascii_uppercase)
    entity_code = random.choice("123456789")
    base14 = state_code + pan + entity_code + "Z"
    check = gstin_checksum(base14)
    return base14 + check

# ---------- degradation pipeline ----------
def degrade(img, condition):
    if condition == "clean":
        return img
    if condition == "rotated":
        angle = random.choice([-18, -12, -7, 7, 12, 18, 90, 180])
        return img.rotate(angle, expand=True, fillcolor="white")
    if condition == "blurred":
        return img.filter(ImageFilter.GaussianBlur(radius=random.uniform(1.5, 3.5)))
    if condition == "noisy":
        import numpy as np
        arr = np.array(img.convert("RGB")).astype(np.int16)
        noise = np.random.normal(0, random.uniform(18, 35), arr.shape)
        arr = np.clip(arr + noise, 0, 255).astype("uint8")
        return Image.fromarray(arr)
    if condition == "low_contrast":
        from PIL import ImageEnhance
        img = ImageEnhance.Brightness(img).enhance(random.uniform(1.4, 1.8))
        img = ImageEnhance.Contrast(img).enhance(random.uniform(0.35, 0.55))
        return img
    if condition == "handwritten":
        return img  # handled at text-render stage, not post-process
    return img

CONDITIONS_WEIGHTS = [
    ("clean", 0.28), ("rotated", 0.15), ("blurred", 0.15),
    ("noisy", 0.15), ("low_contrast", 0.12), ("handwritten", 0.15),
]

def pick_condition():
    r = random.random(); c = 0
    for cond, w in CONDITIONS_WEIGHTS:
        c += w
        if r <= c:
            return cond
    return "clean"

# ---------- RECEIPT ----------
ITEMS = ["Masala Chai","Samosa","Paneer Tikka","Cold Drink","Bread","Milk 1L",
         "Notebook","Pen Set","Rice 5kg","Atta 5kg","Detergent","Biscuits",
         "Toothpaste","Soap","Shampoo","Mobile Recharge","Vada Pav","Dosa"]

def generate_receipt(idx, condition):
    vendor = (fake.company() + random.choice([" Store", " Traders", " Kirana", " Mart", " Enterprises"]))[:30]
    date = fake.date_between(start_date="-2y", end_date="today").strftime("%d/%m/%Y")
    n_items = random.randint(2, 6)
    lines = []
    total = 0.0
    for _ in range(n_items):
        name = random.choice(ITEMS)
        price = round(random.uniform(15, 850), 2)
        total += price
        lines.append(f"{name:<20}{price:>8.2f}")
    total = round(total, 2)
    gstin = gen_gstin()
    use_hw = condition == "handwritten"
    fpaths = HAND_FONT_PATHS if use_hw else PRINT_FONT_PATHS
    fp = random.choice(fpaths)
    size = random.randint(30, 34) if use_hw else random.randint(22, 26)

    W, H = (760, 800) if use_hw else (560, 760)
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    y = 30
    def line(txt, sz=None, bold=False):
        nonlocal y
        f = font(fp, sz or size)
        d.text((30, y), txt, font=f, fill="black")
        y += (sz or size) + 10

    line(vendor, size + 4)
    line(f"Date: {date}")
    line("-" * 34)
    for l in lines:
        line(l)
    line("-" * 34)
    line(f"TOTAL: Rs {total:.2f}", size + 2)
    line(f"GSTIN: {gstin}")

    img = degrade(img, condition)
    fname = f"receipt_{idx:04d}_{condition}.png"
    img.save(os.path.join(OUT, "receipts", fname))
    return {"file": fname, "category": "receipt", "condition": condition,
            "vendor": vendor, "date": date, "amount": f"{total:.2f}", "gstin": gstin}

# ---------- BANK STATEMENT ----------
DESCS = ["UPI/Zomato/Payment","NEFT/Salary Credit","ATM Withdrawal","POS/Amazon/Purchase",
         "IMPS/Rent Transfer","UPI/Swiggy/Payment","Interest Credit","Cheque Deposit",
         "UPI/Electricity Bill","Mobile Recharge","POS/Reliance/Purchase","UPI/Grocery Store"]

def generate_statement(idx, condition):
    n_tx = random.randint(6, 14)
    balance = round(random.uniform(8000, 150000), 2)
    rows = []
    for _ in range(n_tx):
        date = fake.date_between(start_date="-90d", end_date="today").strftime("%d-%m-%Y")
        desc = random.choice(DESCS)
        amt = round(random.uniform(-9000, 15000), 2)
        balance = round(balance + amt, 2)
        rows.append({"date": date, "description": desc, "amount": f"{amt:.2f}", "balance": f"{balance:.2f}"})

    use_hw = condition == "handwritten"
    fpaths = HAND_FONT_PATHS if use_hw else PRINT_FONT_PATHS
    fp = random.choice(fpaths)
    size = random.randint(22, 26) if use_hw else 18

    W = 1100 if use_hw else 900
    H = (50 * (n_tx + 2)) if use_hw else (40 * (n_tx + 2))
    H += 80
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    y = 20
    hf = font(fp, size + 4)
    d.text((20, y), f"Statement — {fake.company()} Bank", font=hf, fill="black"); y += size + 20
    d.text((20, y), f"{'Date':<12}{'Description':<30}{'Amount':>12}{'Balance':>14}", font=font(fp, size), fill="black")
    y += size + 10
    for r in rows:
        txt = f"{r['date']:<12}{r['description']:<30}{r['amount']:>12}{r['balance']:>14}"
        d.text((20, y), txt, font=font(fp, size), fill="black")
        y += size + 8

    img = degrade(img, condition)
    fname = f"statement_{idx:04d}_{condition}.png"
    img.save(os.path.join(OUT, "statements", fname))
    return {"file": fname, "category": "statement", "condition": condition, "transactions": rows}

# ---------- ID DOCUMENT ----------
DOC_TYPES = ["PAN CARD", "VOTER ID", "DRIVING LICENCE"]

def gen_pan():
    return "".join(random.choices(string.ascii_uppercase, k=5)) + \
           "".join(random.choices(string.digits, k=4)) + \
           random.choice(string.ascii_uppercase)

def generate_id(idx, condition):
    doc_type = random.choice(DOC_TYPES)
    name = fake.name().upper()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=70).strftime("%d/%m/%Y")
    id_number = gen_pan() if doc_type == "PAN CARD" else "".join(random.choices(string.digits, k=10))

    use_hw = condition == "handwritten"
    fpaths = HAND_FONT_PATHS if use_hw else PRINT_FONT_PATHS
    fp = random.choice(fpaths)
    size = random.randint(28, 32) if use_hw else 24

    W, H = (760, 420) if use_hw else (640, 400)
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    d.rectangle([10, 10, W-10, H-10], outline="black", width=3)
    y = 40
    def line(txt, sz=None):
        nonlocal y
        f = font(fp, sz or size)
        d.text((40, y), txt, font=f, fill="black")
        y += (sz or size) + 16
    line(doc_type, size + 4)
    line(f"Name: {name}")
    line(f"DOB: {dob}")
    line(f"ID No: {id_number}")

    img = degrade(img, condition)
    fname = f"id_{idx:04d}_{condition}.png"
    img.save(os.path.join(OUT, "ids", fname))
    return {"file": fname, "category": "id", "condition": condition,
            "doc_type": doc_type, "name": name, "dob": dob, "id_number": id_number}

# ---------- driver ----------
def run(n_per_category):
    for sub in ["receipts", "statements", "ids"]:
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)
    gt = {"receipts": [], "statements": [], "ids": []}
    for i in range(n_per_category):
        gt["receipts"].append(generate_receipt(i, pick_condition()))
        gt["statements"].append(generate_statement(i, pick_condition()))
        gt["ids"].append(generate_id(i, pick_condition()))
    with open(os.path.join(OUT, "ground_truth.json"), "w") as f:
        json.dump(gt, f, indent=2)
    return gt

if __name__ == "__main__":
    import sys
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    gt = run(n)
    print(f"Generated {n} per category = {n*3} images total")
