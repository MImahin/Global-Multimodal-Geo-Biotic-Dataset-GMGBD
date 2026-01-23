import ollama
import pandas as pd
import os


MODEL_NAME = 'gemma3:4b'
# Ensure these paths point to where your images actually are
IMAGE_FOLDER = r'gmgbd_dataset_images' 
INPUT_CSV = 'test.csv' # The file containing the data you just sent
OUTPUT_CSV = 'gemma3_fewshot_results.csv'

# 1. THE "FEW-SHOT" EXAMPLES (The Support Set)
# We use two of your rows as "Teachers"
FEW_SHOT_EXAMPLES = [
    {
        "role": "user", 
        "content": "Identify the species. Context: Wales, UK. Bird sitting on a pole. Temp: 6.2C.", 
        "images": [os.path.join(IMAGE_FOLDER, "img_fa9af424801984ec.jpg")]
    },
    {
        "role": "assistant", 
        "content": "Falco tinnunculus"
    },
    {
        "role": "user", 
        "content": "Identify the species. Context: France. Bug on a white pole. Temp: 15.9C.", 
        "images": [os.path.join(IMAGE_FOLDER, "img_fe1b374f8384744f.jpg")]
    },
    {
        "role": "assistant", 
        "content": "Reduvius personatus"
    }
]

def run_evaluation():
    # Load your data
    # Assuming columns: img_id, species, common_name, lat, long, date, desc, country, etc.
    df = pd.read_csv(INPUT_CSV, header=None)
    
    results = []

    print(f"🚀 Starting Few-Shot Eval with {MODEL_NAME}...")

    for index, row in df.iterrows():
        img_id = row[0]
        true_species = row[1]
        description = row[6]
        country = row[7]
        temp = row[10]
        
        img_path = os.path.join(IMAGE_FOLDER, img_id)
        
        if not os.path.exists(img_path):
            continue

        # 2. CONSTRUCT THE CONTEXTUAL PROMPT
        context_str = f"Location: {country}. Description: {description}. Temperature: {temp}C."
        
        # Combine Examples + Current Target
        messages = FEW_SHOT_EXAMPLES + [
            {
                "role": "user", 
                "content": f"Identify this species. Context: {context_str}. OUTPUT ONLY THE SCIENTIFIC NAME.", 
                "images": [img_path]
            }
        ]

        try:
            response = ollama.chat(
                model=MODEL_NAME,
                messages=messages,
                options={
                    'temperature': 0,  # Lock randomness
                    'top_k': 1         # Pick only the #1 most likely answer
                }
            )
            
            prediction = response['message']['content'].strip().split('\n')[0] # Get first line only
            
            # Logic check (Case insensitive)
            is_correct = 1 if prediction.lower() == true_species.lower() else 0
            
            results.append([img_id, true_species, prediction, is_correct])
            print(f"✅ Processed {img_id}: Predicted {prediction} (Target: {true_species})")

        except Exception as e:
            print(f"❌ Error on {img_id}: {e}")

    # 3. SAVE & SUMMARY
    output_df = pd.DataFrame(results, columns=['Image', 'True', 'Pred', 'Score'])
    output_df.to_csv(OUTPUT_CSV, index=False)
    
    accuracy = (output_df['Score'].sum() / len(output_df)) * 100
    print(f"\n=============================================")
    print(f"📊 FEW-SHOT ACCURACY: {accuracy:.2f}%")
    print(f"=============================================")

if __name__ == "__main__":
    run_evaluation()