import pandas as pd
import requests
import os
import time
import ee
from tqdm import tqdm
from datetime import datetime, timedelta
import concurrent.futures

# --- CONFIGURATION ---
INPUT_CSV = "final_dataset_inat.csv"
OUTPUT_CSV = "gmgbd_final_pro_ultimate.csv"
GEE_PROJECT = 'get your project id'

import concurrent.futures

def safe_request(func):
    """Heavy-duty Watchdog with 'Cool-off' period."""
    def wrapper(*args, **kwargs):
        retry_delay = 5
        while True:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(func, *args, **kwargs)
                try:
                    return future.result(timeout=45) # Shorter timeout to catch hangs faster
                except (concurrent.futures.TimeoutError, Exception) as e:
                    print(f"\n⏳ {func.__name__} stalled. Waiting 20s to reset connection...")
                    # This 20s sleep is critical to clear the 'dead' connection
                    time.sleep(20) 
                    retry_delay = min(retry_delay + 5, 60)
    return wrapper

@safe_request
def get_ndvi_pro(point, date_str):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')

    base_year = date_obj.year
    if base_year < 2000:
        base_year = 2000
 
    for i in range(5):
        current_year = base_year - i
        if current_year < 2000: break # Stop if we go before satellite launch
        
        target_date = date_obj.replace(year=current_year)
        start = (target_date - timedelta(days=16)).strftime('%Y-%m-%d')
        end = (target_date + timedelta(days=16)).strftime('%Y-%m-%d')
        
        try:
            coll = ee.ImageCollection("MODIS/061/MOD13A1").filterDate(start, end).select('NDVI')
            
            # Optimization: Only proceed if there's an image
            if coll.size().getInfo() > 0:
                img = coll.median()
                # Use a 500m buffer to avoid single-pixel 'no crs' errors
                area = point.buffer(500).bounds()
                stats = img.reduceRegion(
                    reducer=ee.Reducer.mean(), # Mean is more stable than First
                    geometry=area,
                    scale=1000,
                    crs='EPSG:4326',
                    bestEffort=True
                ).getInfo()
                
                val = stats.get('NDVI')
                if val is not None:
                    ndvi = round(val / 10000.0, 4)
                    cat = "Dense" if ndvi > 0.6 else "Moderate" if ndvi > 0.3 else "Sparse" if ndvi > 0.1 else "Non-Veg"
                    return ndvi, cat
        except:
            continue # Try the next year if GEE errors out
            
    return None, "No Data"
@safe_request
def get_location_pro(lat, lon):
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {"lat": lat, "lon": lon, "format": "jsonv2", "accept-language": "en", "addressdetails": 1}
    headers = {'User-Agent': 'WildlifeMeta_AutoRecovery_v9'}
    res = requests.get(url, params=params, headers=headers, timeout=20).json()
    addr = res.get('address', {})
    city = (addr.get('city') or addr.get('town') or addr.get('village') or addr.get('county') or "Rural")
    return addr.get('country', 'Unknown'), addr.get('state', city), city

@safe_request
def get_water_dist_pro(point):
    acc = ee.Image("WWF/HydroSHEDS/15ACC")
    streams = acc.gt(100) 
    dist_img = streams.fastDistanceTransform(512).sqrt().multiply(450)
    stats = dist_img.reduceRegion(reducer=ee.Reducer.first(), geometry=point, scale=450, crs='EPSG:4326').getInfo()
    val = stats.get('distance')
    return round(float(val), 2) if val is not None else None

@safe_request
def get_climate_pro(lat, lon, date):
    e_url = f"https://api.open-meteo.com/v1/elevation?latitude={lat}&longitude={lon}"
    elev = requests.get(e_url, timeout=15).json().get('elevation', [0])[0]
    w_url = "https://archive-api.open-meteo.com/v1/archive"
    w_params = {"latitude": lat, "longitude": lon, "start_date": date, "end_date": date, "daily": "temperature_2m_mean", "timezone": "auto"}
    w_res = requests.get(w_url, params=w_params, timeout=15).json()
    temp = w_res['daily']['temperature_2m_mean'][0]
    return float(temp), float(elev)

def main():
    # --- BATCH SETTINGS ---
    BATCH_SIZE = 20  # Restart every 20 rows
    
    print("🚀 Script starting with Auto-Reset every 20 rows...")

    while True:
        # 1. Initialize/Re-initialize GEE
        try:
            ee.Initialize(project=GEE_PROJECT)
        except Exception as e:
            print(f"Auth issue: {e}. Retrying...")
            time.sleep(5)
            continue

        # 2. Check what is finished
        if os.path.exists(OUTPUT_CSV):
            done = set(pd.read_csv(OUTPUT_CSV)['filename'].astype(str).tolist())
        else:
            done = set()

        df_raw = pd.read_csv(INPUT_CSV)
        to_process = df_raw[~df_raw['filename'].astype(str).isin(done)]
        
        # If no more rows are left, break the while loop
        if len(to_process) == 0:
            print("✅ All rows processed successfully!")
            break

        # 3. Take only the next batch (20 rows)
        batch = to_process.head(BATCH_SIZE)
        print(f"\n🔄 New Session: Processing next {len(batch)} rows... ({len(done)} total done)")

        for _, row in tqdm(batch.iterrows(), total=len(batch)):
            lat, lon, date = row['latitude'], row['longitude'], row['sighting_date']
            point = ee.Geometry.Point(lon, lat)

            # Standard Execution
            country, state, city = get_location_pro(lat, lon)
            temp, elev = get_climate_pro(lat, lon, date)
            ndvi_val, ndvi_cat = get_ndvi_pro(point, date)
            water_dist = get_water_dist_pro(point)

            final_row = {**row.to_dict(), "country": country, "state": state, "city": city,
                         "avg_temp_C": temp, "elevation_m": elev, "NDVI_value": ndvi_val, 
                         "NDVI_Category": ndvi_cat, "dist_to_water_m": water_dist}

            pd.DataFrame([final_row]).to_csv(OUTPUT_CSV, mode='a', index=False, header=not os.path.exists(OUTPUT_CSV))
            
            # Short sleep between rows
            time.sleep(1.2)

        print(f"\n🧼 Batch of {BATCH_SIZE} complete. Resetting GEE & Connections...")
        # Brief pause to let the OS clear the sockets before the next 'ee.Initialize'
        time.sleep(5)

if __name__ == "__main__":
    main()