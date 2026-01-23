import os, hashlib, requests, time, random
import pandas as pd
import torch
from tqdm import tqdm
from PIL import Image
from datetime import datetime, timedelta
from transformers import BlipProcessor, BlipForConditionalGeneration

# --- CONFIGURATION ---
IMAGE_DIR = "gmgbd_dataset_images"
METADATA_CSV = "final_dataset_inat.csv"
TOTAL_TARGET = 25000
BATCH_SIZE = 40 
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
CACHE_PATH = r"C:\huggingface_cache"
MODEL_NAME = "Salesforce/blip-image-captioning-large"

# EXACT columns requested
COLS = ["filename", "scientific_name", "common_name", "latitude", "longitude", "sighting_date", "blip_caption"]

os.makedirs(IMAGE_DIR, exist_ok=True)
processor, model = None, None

# -----------------------------
# 1. Processing logic (AI Vision)
# -----------------------------
def process_batch(records_list):
    global processor, model
    if model is None:
        print(f"📥 Loading BLIP model on {DEVICE}...")
        processor = BlipProcessor.from_pretrained(MODEL_NAME, cache_dir=CACHE_PATH)
        model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME, torch_dtype=torch.float16, cache_dir=CACHE_PATH).to(DEVICE)

    enriched_data = []
    for row in tqdm(records_list, desc="Captioning Batch"):
        fname, sc_name, cm_name, lat, lon, s_date = row
        
        # 🤖 AI Vision Captioning
        try:
            img_path = os.path.join(IMAGE_DIR, fname)
            img = Image.open(img_path).convert('RGB')
            inputs = processor(images=img, return_tensors="pt").to(DEVICE, torch.float16)
            out = model.generate(**inputs, max_length=50)
            blip_cap = processor.decode(out[0], skip_special_tokens=True).strip()
        except Exception as e:
            blip_cap = "wildlife observation"

        enriched_data.append([fname, sc_name, cm_name, lat, lon, s_date, blip_cap])

    # Append to CSV immediately
    pd.DataFrame(enriched_data, columns=COLS).to_csv(METADATA_CSV, mode='a', index=False, header=not os.path.exists(METADATA_CSV))

# -----------------------------
# 2. Fetching Logic (iNaturalist)
# -----------------------------
def fetch_inat_records(count, existing_hashes, page):
    new_records = []
    # Safe date set to 2 days ago to ensure image URLs are fully propagated
    safe_date = (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d')
    url = f"https://api.inaturalist.org/v1/observations?per_page={count}&page={page}&has[]=photos&quality_grade=research&order_by=id&d2={safe_date}"
    
    try:
        res = requests.get(url, timeout=15).json().get("results", [])
        for item in res:
            photo_url = item['photos'][0]['url'].replace("square", "large")
            # Generate unique hash for duplicate prevention
            u_hash = hashlib.sha256(photo_url.encode()).hexdigest()[:16]
            
            if u_hash in existing_hashes:
                continue
            
            # Download Image
            try:
                img_data = requests.get(photo_url, timeout=10).content
                fname = f"img_{u_hash}.jpg"
                with open(os.path.join(IMAGE_DIR, fname), 'wb') as f:
                    f.write(img_data)
                
                # Collect basic metadata
                lat = item['geojson']['coordinates'][1]
                lon = item['geojson']['coordinates'][0]
                sc_name = item.get("taxon", {}).get("name", "Unknown")
                cm_name = item.get("taxon", {}).get("preferred_common_name", sc_name)
                obs_date = item.get("observed_on", safe_date)
                
                new_records.append([fname, sc_name, cm_name, lat, lon, obs_date])
                existing_hashes.add(u_hash)
            except:
                continue
    except Exception as e:
        print(f"Connection issue: {e}")
        time.sleep(5)
        
    return new_records

def main():
    hashes = set()
    if os.path.exists(METADATA_CSV):
        try:
            df = pd.read_csv(METADATA_CSV)
            # Extract hash from existing filenames
            hashes.update(df['filename'].str.replace('img_','').str.replace('.jpg','').tolist())
        except:
            pass
    
    current_count = len(hashes)
    page = (current_count // BATCH_SIZE) + 1
    print(f"🚀 Started! Target: {TOTAL_TARGET} | Current: {current_count} | GPU: {DEVICE}")

    while current_count < TOTAL_TARGET:
        batch = fetch_inat_records(BATCH_SIZE, hashes, page)
        if batch:
            process_batch(batch)
            current_count += len(batch)
        
        page += 1
        # Small sleep to prevent iNat API rate limiting
        time.sleep(0.5)
        
    print(f"🏁 Mission Complete. {current_count} records saved to {METADATA_CSV}")

if __name__ == "__main__":
    main()