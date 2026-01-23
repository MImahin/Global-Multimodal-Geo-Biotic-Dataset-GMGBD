import pandas as pd
from ollama import Client
from tqdm import tqdm
import os
import re


IMAGE_FOLDER = r"images" 
TEST_CSV = "test.csv"
MODEL_NAME = "gemma3:4b"


client = Client(host='http://127.0.0.1:11434')

def evaluate_name(ground_truth, prediction):
    """Checks for Genus (1st word) and Full Species match."""
    # Clean string: keep only letters and spaces, lowercase
    gt = re.sub(r'[^a-zA-Z ]', '', str(ground_truth).lower()).split()

    pred = re.sub(r'[^a-zA-Z ]', '', str(prediction).lower()).split()
    
    if not pred or not gt: return 0
    
    genus_match = gt[0] == pred[0]
    full_match = (len(pred) >= 2 and len(gt) >= 2 and 
                  gt[0] == pred[0] and gt[1] == pred[1])
    
    if full_match: return 2
    if genus_match: return 1
    return 0

def run_gemma_ollama_eval():
    if not os.path.exists(TEST_CSV):
        print(f"❌ {TEST_CSV} not found.")
        return

    df = pd.read_csv(TEST_CSV)
    
    # Path Diagnostic: Check if first image exists
    first_img = os.path.join(IMAGE_FOLDER, str(df.iloc[0]['filename']))
    if not os.path.exists(first_img):
        print(f"❌ PATH ERROR: Cannot find first image at: {first_img}")
        print("Please verify the IMAGE_FOLDER path.")
        return

    results = []
    print(f"🚀 Starting Gemma 3:4B (Ollama) with Context...")

    for index, row in tqdm(df.iterrows(), total=len(df)):
        img_path = os.path.join(IMAGE_FOLDER, str(row['filename']))
        
        if not os.path.exists(img_path):
            continue

        # Construct the contextual prompt using your metadata
        prompt = (
            f"Identify the species in this image.\n"
            f"ENVIRONMENTAL CONTEXT:\n"
            f"- Location: {row['city']}, {row['country']}\n"
            f"- Elevation: {row['elevation_m']}m | Temp: {row['avg_temp_C']}C\n"
            f"- Vegetation: {row['NDVI_Category']}\n"
            f"Respond with ONLY the scientific name."
        )

        try:
            # Request inference from local Ollama server
            response = client.chat(
                model=MODEL_NAME,
                messages=[{
                    'role': 'user',
                    'content': prompt,
                    'images': [img_path]
                }],options={'temperature': 0}
            )
            
            prediction = response['message']['content'].strip()
            
            # Post-processing: Remove common LLM prefixes or markdown
            prediction = prediction.replace('*', '').replace('_', '').split('\n')[0]
            # Remove "Scientific name: " if the model ignores the "ONLY" instruction
            prediction = re.sub(r'^(Scientific name|The species is|Species):\s*', '', prediction, flags=re.IGNORECASE)

            score = evaluate_name(row['scientific_name'], prediction)
            results.append({
                "filename": row['filename'],
                "ground_truth": row['scientific_name'],
                "prediction": prediction,
                "score": score
            })

        except Exception as e:
            print(f"Error on {row['filename']}: {e}")
            continue

    # --- SAVE & SUMMARY ---
    if not results:
        print("🛑 No results. The loop did not process any images.")
        return

    res_df = pd.DataFrame(results)
    res_df.to_csv("gemma3_ollama_context_results.csv", index=False)
    
    full_acc = (res_df['score'] == 2).mean() * 100
    genus_acc = (res_df['score'] >= 1).mean() * 100

    print("\n" + "="*45)
    print(f"📊 GEMMA 3:4B (OLLAMA) CONTEXT SUMMARY")
    print(f"✅ Full Species Accuracy: {full_acc:.2f}%")
    print(f"🔍 Genus-Level Accuracy:  {genus_acc:.2f}%")
    print("="*45)

if __name__ == "__main__":

    run_gemma_ollama_eval()
