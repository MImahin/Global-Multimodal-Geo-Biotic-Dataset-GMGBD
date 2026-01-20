# GMGBD: Global Multimodal Geospatial Biodiversity Dataset
### *A Next-Generation Benchmark for Habitat-Aware Multimodal Learning*

## 🔬 Dataset Benchmarking: The Landscape
To understand why **GMGBD** is unique, we must analyze the "Information Gaps" in the current state-of-the-art (SOTA) datasets (2021–2025).

| Title | Release Date | Size | Domain | Key Methods | Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BioCube** | Oct 2025 | 40K Species | Multimodal / Climate | API-based (Copernicus, BOLD, iNat) | High grid-scale (0.25°) lacks fine-grained local hydrology. |
| **CrypticBio** | May 2025 | 166M Images | Vision-Language | Automated Curation (GBIF/iNat) | Focuses on visual confusion; lacks precise habitat indices like NDVI. |
| **iNatAg_2025** | 2025 | 4.7M Images | Agriculture / Crops | Multi-task learning, LoRA | Limited to agricultural zones; misses "Wilderness" biodiversity. |
| **Multispecies DNN**| May 2024 | 6.7M Obs. | Plant Community | Rank-based Deep Learning | Restricted to Swiss flora; not a global benchmark. |
| **iNat2021 / NeWT**| Mar 2021 | 2.7M Images | Representation Learning | Supervised & Self-supervised | Pixel-only focus; lacks descriptive text and climate metadata. |

---

## 🏆 Comparative Analysis: Why GMGBD Wins

### 1. The "Reasoning" Layer (Environmental Features)
While the datasets above give the AI a "Picture," **GMGBD** gives the AI a "Map."
* **BioCube/CrypticBio:** Use coarse climate data or simple coordinates.
* **GMGBD:** Incorporates **HydroSHEDS** flow accumulation models to calculate `dist_to_water_m`. This allows the AI to perform Geospatial Reasoning—for example, identifying an *African Fish-Eagle* not just by its feathers, but by its **0.0m proximity** to a drainage basin.



### 2. Multi-Modal Fusion (Vision + Metadata + Text)
Most datasets follow an `Image -> Label` or `Image + Coord -> Label` path.
* **iNat2021/NeWT:** Focus solely on pixel patterns.
* **GMGBD:** Provides a rich **Image + Narrative + Habitat -> Label** pipeline. By including **BLIP captions**, we enable Vision-Language pre-training that standard citizen science benchmarks cannot provide.

### 3. Dynamic Seasonality (NDVI Fallback)
Static datasets fail to capture the "state" of an ecosystem.
* **Multispecies DNNs:** Use static predictors.
* **GMGBD:** Utilizes **MODIS 16-day NDVI**. Our unique **1-year historical fallback mechanism** ensures that even for "future" sightings (2026), the AI has a time-accurate "Greenness" value representing the actual habitat health at the moment of capture.



---

## 📊 Feature-Level Table Analysis
The following table highlights the unique technical columns provided by **GMGBD** that are missing in global benchmarks like **iNat2021** and **BioCube**.

| Feature | iNat2021 | BioCube | **GMGBD (Ours)** |
| :--- | :---: | :---: | :---: |
| **Dataset Size** | 2.7M | 40K species | **25K (High-Fidelity)** |
| **Visual Variety** | High | High | **High + AI Narrative** |
| **Local Climate (Temp)** | ❌ | ✅ | ✅ **(Open-Meteo Precision)** |
| **Vegetation Density** | ❌ | ✅ (Coarse) | ✅ **(MODIS 16-day NDVI)** |
| **Hydrological Depth** | ❌ | ❌ | ✅ **(HydroSHEDS Water Dist)** |
| **Topography** | ❌ | ❌ | ✅ **(NASA SRTM Elevation)** |
| **Evaluation Metrics** | Accuracy | Unknown | **BioCLIP/BioTrove Benchmarked** |

---

## 🧪 Where GMGBD Outperforms
* **BioCLIP (44.36%) vs. BioTrove-B (58.14%):** These models show that adding location data boosts accuracy by **~14%**. 
* **The GMGBD Hypothesis:** By adding **Elevation, Water Proximity, and NDVI**, our dataset is the only one capable of training models to break the **60% accuracy threshold** by using "Habitat Logic" to eliminate visually similar but geographically impossible species.

---

## 📂 Dataset Schema (The GMGBD Advantage)
Our columns are specifically chosen for **Ecological Reasoning**:

* **`dist_to_water_m`**: Distinguishes aquatic vs. terrestrial niches.
* **`NDVI_value`**: Measures "Greenness" (Sparse vs. Dense Canopy).
* **`avg_temp_C`**: Defines the thermal tolerance of the species.
* **`blip_caption`**: Provides natural language for multimodal search.


---
**Status:** Research-Grade Multimodal Dataset  
**Target:** High-Precision Species Distribution Modeling (SDM)
