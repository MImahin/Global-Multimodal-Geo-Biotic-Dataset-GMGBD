import pandas as pd
import torch
from PIL import Image
from transformers import Qwen2_5_VLForConditionalGeneration, AutoProcessor
from tqdm import tqdm
import os
import re


IMAGE_FOLDER = r"images" 
TEST_CSV = "test.csv"
MODEL_ID = "Qwen/Qwen2.5-VL-3B-Instruct"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# 1. Load Model & Processor
print(f"📦 Loading {MODEL_ID} on {DEVICE}...")
model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
    MODEL_ID, torch_dtype="auto", device_map="auto"
)
processor = AutoProcessor.from_pretrained(MODEL_ID)

def evaluate_name(ground_truth, prediction):
    """Standardizes text and checks for Genus/Species matches."""
    # Remove special characters and lowercase
    gt = re.sub(r'[^a-zA-Z ]', '', str(ground_truth).lower()).split()
    pred = re.sub(r'[^a-zA-Z ]', '', str(prediction).lower()).split()
    
    if not pred or not gt: return 0
    
    # Genus Match (First Word)
    genus_match = gt[0] == pred[0]
    
    # Full Match (First + Second Word)
    full_match = (len(pred) >= 2 and len(gt) >= 2 and 
                  gt[0] == pred[0] and gt[1] == pred[1])
    
    if full_match: return 2
    if genus_match: return 1
    return 0

def run_eval():
    # Load Data
    if not os.path.exists(TEST_CSV):
        print(f"❌ Error: {TEST_CSV} not found!")
        return
    
    df = pd.read_csv(TEST_CSV)
    results = []
    
    print(f"🚀 Starting Inference for {len(df)} rows...")

    for index, row in tqdm(df.iterrows(), total=len(df)):
        img_path = os.path.join(IMAGE_FOLDER, str(row['filename']))
        
        # Check if file exists
        if not os.path.isfile(img_path):
            continue 

        try:
            # Load and process image
            image = Image.open(img_path).convert("RGB")
            
            # Non-contextual prompt
            prompt = "Identify the species in this image. Respond with ONLY the scientific name."

            messages = [
                {"role": "user", "content": [
                    {"type": "image", "image": image},
                    {"type": "text", "text": prompt}
                ]}
            ]
            
            # Prepare Inputs
            text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            inputs = processor(text=[text], images=[image], padding=True, return_tensors="pt").to(DEVICE)
            
            # Generate Prediction
            with torch.no_grad():
                generated_ids = model.generate(**inputs, max_new_tokens=20)
            
            # Decode only the newly generated tokens
            generated_ids_trimmed = [
                out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
            ]
            prediction = processor.batch_decode(generated_ids_trimmed, skip_special_tokens=True)[0].strip()

            # Score and Append
            score = evaluate_name(row['scientific_name'], prediction)
            results.append({
                "filename": row['filename'],
                "ground_truth": row['scientific_name'],
                "prediction": prediction,
                "score": score
            })

        except Exception as e:
            print(f"\n⚠️ Error on {row['filename']}: {e}")
            continue

    # --- FINAL CALCULATIONS ---
    if not results:
        print("\n🛑 CRITICAL ERROR: 0 images were processed.")
        print(f"Checked folder: {IMAGE_FOLDER}")
        print("Make sure 'filename' in CSV matches actual files on disk.")
        return

    res_df = pd.DataFrame(results)
    res_df.to_csv("qwen3b_vision_only_results.csv", index=False)
    
    full_acc = (res_df['score'] == 2).mean() * 100
    genus_acc = (res_df['score'] >= 1).mean() * 100
    
    print("\n" + "="*40)
    print(f"📊 SUMMARY: {len(res_df)}/{len(df)} Images Found")
    print(f"✅ Full Species Accuracy: {full_acc:.2f}%")
    print(f"🔍 Genus-Level Accuracy: {genus_acc:.2f}%")
    print("="*40)

if __name__ == "__main__":

    run_eval()
