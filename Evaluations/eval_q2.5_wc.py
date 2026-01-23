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

def evaluate_name(ground_truth, prediction):
    gt = re.sub(r'[^a-zA-Z ]', '', str(ground_truth).lower()).split()
    pred = re.sub(r'[^a-zA-Z ]', '', str(prediction).lower()).split()
    if not pred or not gt: return 0
    genus_match = gt[0] == pred[0]
    full_match = (len(pred) >= 2 and len(gt) >= 2 and gt[0] == pred[0] and gt[1] == pred[1])
    if full_match: return 2
    if genus_match: return 1
    return 0

def run_context_eval():
    if not os.path.exists(TEST_CSV):
        print(f"❌ Cannot find {TEST_CSV}")
        return

    df = pd.read_csv(TEST_CSV)
    
    
    first_img = os.path.join(IMAGE_FOLDER, str(df.iloc[0]['filename']))
    if not os.path.exists(first_img):
        print(f"❌ PATH ERROR: Looked for the first image at: {first_img}")
        print("Please fix IMAGE_FOLDER in the script.")
        return

    print(f"📦 Loading {MODEL_ID}...")
    model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
        MODEL_ID, torch_dtype="auto", device_map="auto"
    )
    processor = AutoProcessor.from_pretrained(MODEL_ID)
    
    results = []
    print(f"🚀 Processing {len(df)} images with Context...")

    for index, row in tqdm(df.iterrows(), total=len(df)):
        img_path = os.path.join(IMAGE_FOLDER, str(row['filename']))
        
        if not os.path.exists(img_path):
            continue 

        try:
            image = Image.open(img_path).convert("RGB")
            
            # Formatted Contextual Prompt
            prompt = (
                f"Identify the species in this image.\n"
                f"CONTEXT:\n"
                f"- Location: {row['city']}, {row['country']}\n"
                f"- Elevation: {row['elevation_m']}m, Temp: {row['avg_temp_C']}C\n"
                f"- Vegetation: {row['NDVI_Category']}\n"
                f"Provide ONLY the scientific name."
            )

            messages = [{"role": "user", "content": [
                {"type": "image", "image": image},
                {"type": "text", "text": prompt}
            ]}]
            
            text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            inputs = processor(text=[text], images=[image], padding=True, return_tensors="pt").to(DEVICE)
            
            with torch.no_grad():
                generated_ids = model.generate(**inputs, max_new_tokens=20)
            
            generated_ids_trimmed = [out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)]
            prediction = processor.batch_decode(generated_ids_trimmed, skip_special_tokens=True)[0].strip()

            score = evaluate_name(row['scientific_name'], prediction)
            results.append({
                "filename": row['filename'],
                "score": score
            })

        except Exception as e:
            print(f"Error on {row['filename']}: {e}")

    # --- FINAL SAFETY CHECK ---
    if not results:
        print("\n🛑 No results captured. Loop failed.")
        return

    res_df = pd.DataFrame(results)
    res_df.to_csv("qwen3b_WITH_CONTEXT_results.csv", index=False)
    
    print("\n" + "="*40)
    print(f"📊 CONTEXTUAL SUMMARY")
    print(f"✅ Full Species Accuracy: {(res_df['score'] == 2).mean() * 100:.2f}%")
    print(f"🔍 Genus-Level Accuracy: {(res_df['score'] >= 1).mean() * 100:.2f}%")
    print("="*40)

if __name__ == "__main__":

    run_context_eval()
