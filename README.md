# GMGBD: Global Multi-modal Geo-Biodiversity Dataset

GMGBD is a high-resolution, enriched dataset designed to bridge the gap between raw citizen science observations and deep ecological insights. By integrating **Vision-Language Models (VLM)** with **Geospatial Remote Sensing**, it provides a contextual understanding of biodiversity that goes beyond simple image classification. [Checkout website](https://mimahin.github.io/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/)

---

## 1. Comparative Analysis

The following table highlights how **GMGBD** evolves the standard of biodiversity datasets compared to other recent industry benchmarks.

| Dataset | What is it? | Official Links | Size | Key Includes |
| :--- | :--- | :--- | :--- | :--- |
| **iNat2021** | The industry baseline for classification. | [Dataset](https://github.com/visipedia/inat_comp/tree/master/2021) / [Paper](https://openaccess.thecvf.com/content/CVPR2021/papers/Van_Horn_Benchmarking_Representation_Learning_for_Natural_World_Image_Collections_CVPR_2021_paper.pdf) | 2.7M images / 10k species | Image, species label, lat/lon. |
| **BioCube** (2025) | Multimodal "data cube" for modeling. | [HuggingFace](https://huggingface.co/datasets/BioDT/BioCube) / [Paper](https://arxiv.org/abs/2505.11568) | ~40k species | Audio, eDNA, low-res climate (0.25°). |
| **CrypticBio** (2025) | Visually confusing species dataset. | [HuggingFace](https://huggingface.co/datasets/gmanolache/CrypticBio) / [Code](https://github.com/georgianagmanolache/crypticbio) | 166M images / 67k species | Taxonomy, misidentification logs. |
| **iNatAg** (2025) | Agricultural-specific biodiversity. | [Dataset](https://github.com/ricber/digital-agriculture-datasets) / [Paper](https://openaccess.thecvf.com/content/CVPR2025W/V4A/html/Jain_iNatAg_Multi-Class_Classification_Models_Enabled_by_a_Large-Scale_Benchmark_Dataset_CVPRW_2025_paper.html) | 4.7M images / 2,959 species | Binary "Crop vs. Weed" labels. |
| **GMGBD (Ours)** | **Contextual "Bio-Vision" dataset.** | [Link](https://github.com/MImahin/Global-Multimodal-Geo-Biotic-Dataset-GMGBD) | **25k target (v1.0)** | **VLM Captions, Precise NDVI, Water Dist.** |

---

## 2. Technical Definition

The **Global Multi-modal Geo-Biodiversity Dataset (GMGBD)** is a high-resolution, enriched dataset that combines citizen science observations with Vision-Language Model (VLM) insights and Earth Engine environmental metrics.

### Key Layers:
* **The Vision Layer:** Utilizes **Salesforce BLIP-Large** to transform a static image into a rich, descriptive natural language sentence.
* **The Geospatial Layer:** Leverages **Google Earth Engine (GEE)** to "time-travel" back to the exact date of the sighting to measure vegetation health (NDVI) and water proximity.
* **The Robustness Layer:** Employs a **multithreaded "Watchdog" system** with an auto-recovery decorator to ensure continuous data collection even during API stalls.

---

## 3. Why GMGBD is Unique and Important

### A. Environmental Precision (The "NDVI" Factor)
While other datasets like BioCube use coarse 0.25° grids (roughly 25km blocks), **GMGBD calculates NDVI and climate at a much finer 1km resolution.**
> **Why it matters:** A species might be in a small green oasis in a desert. A coarse grid would label the area "Dry," but GMGBD's 1km resolution correctly identifies it as "Dense Vegetation."



### B. The "Contextual VLM" Advantage
Most datasets provide a simple label (e.g., *Scientific Name: Panthera leo*). **GMGBD provides a semantic caption: "A lion resting in tall yellow grass under a cloudy sky."**
> **Why it matters:** This allows researchers to train models that understand **behavior and habitat**, not just identification. It moves AI from simple object detection to contextual ecological reasoning.

### C. Automated Hydrological Proximity
GMGBD is one of the few automated pipelines that calculates **Distance to Water (m)** using HydroSHEDS flow accumulation models.
> **Why it matters:** Proximity to water is the primary predictor of animal movement. This makes the dataset significantly more valuable for **Ecological Niche Modeling (ENM)** than standard image-only datasets.

### D. Resilience and Scalability
The implementation of the `@safe_request` decorator and the **Threaded Watchdog** architecture addresses the industry-wide problem of "API Fatigue."
> **Why it matters:** Our methodology ensures a **self-healing pipeline** capable of scaling from 25k to over 1M records without manual oversight.

---
## 4. Technical Toolkit & API Integration

The power of GMGBD lies in its integration of industry-leading APIs and machine learning models. Below are the details of the tools used to fetch, process, and enrich the dataset.

### 1. iNaturalist API (v1)
* **Role:** Primary Biodiversity Data Sourcing.
* **Details:** We utilize the iNaturalist Node API to fetch "Research Grade" observations. This ensures the taxonomic identification is peer-verified.
* **Functionality:** Provides high-resolution image URLs, taxonomic hierarchy (Scientific/Common names), and precise GPS coordinates.
* **API Documentation:** [iNaturalist API v1](https://api.inaturalist.org/v1/docs/)

### 2. Salesforce BLIP-Large (Vision-Language Model)
* **Role:** AI Visual Captioning.
* **Details:** Hosted via Hugging Face, the `blip-image-captioning-large` model (469M parameters) is used to generate natural language descriptions of the wildlife images.
* **Functionality:** Converts raw pixels into descriptive metadata, capturing visual context and behavior.
* **Model Documentation:** [Hugging Face - BLIP Large](https://huggingface.co/Salesforce/blip-image-captioning-large)

### 3. OpenStreetMap (Nominatim API)
* **Role:** Reverse Geocoding.
* **Details:** Used to convert raw Latitude and Longitude into administrative location data.
* **Functionality:** Specifically extracts `country`, `state`, and `city/town/village` using the `jsonv2` format.
* **Technical Note:** Implements a custom `User-Agent` and a 1.2s delay to comply with OSM's usage policy.
* **API Documentation:** [Nominatim Reverse Geocoding](https://nominatim.org/release-docs/latest/api/Reverse/)

### 4. Open-Meteo API
* **Role:** Historical Weather & Elevation Sourcing.
* **Details:** Provides high-resolution historical weather reanalysis.
* **Functionality:** Fetches the `elevation` (m) and the `temperature_2m_mean` (°C) for the specific date and GPS point of the observation.
* **API Documentation:** [Open-Meteo Historical Archive](https://open-meteo.com/en/docs/historical-weather-api)

### 5. Google Earth Engine (GEE)
* **Role:** Planetary-Scale Geospatial Processing.
* **Details:** Used to analyze multi-petabyte environmental datasets via the Python `ee` library.
* **Specific Datasets:**
    * **MODIS (MOD13A1.061):** Used for 16-day composite NDVI (Vegetation health) tracking.
    * **WWF HydroSHEDS (15ACC):** Used to calculate the distance to the nearest stream or water body.
* **API Documentation:** [Google Earth Engine Developers Guide](https://developers.google.com/earth-engine/)

---

## 5. NDVI Classification Logic

The dataset converts raw satellite signal values into ecological categories to describe the habitat. Per the `get_ndvi_pro` implementation, raw values are scaled (divided by 10,000) and categorized as follows:



| NDVI Value Range | Category | Typical Landscape |
| :--- | :--- | :--- |
| **> 0.6** | **Dense** | Tropical rainforests, dense forests, or healthy crops. |
| **0.3 to 0.6** | **Moderate** | Temperate forests, shrublands, or maturing vegetation. |
| **0.1 to 0.3** | **Sparse** | Grasslands, desert scrub, or moisture-stressed plants. |
| **< 0.1** | **Non-Veg** | Water bodies, bare rock, sand, snow, or urban areas. |

---

## 6. System Architecture: The "Safe Request" Watchdog

To handle the massive scale of 25,000+ records, GMGBD utilizes a custom-engineered **Threaded Watchdog** system:

* **@safe_request Decorator:** A heavy-duty wrapper that prevents script hangs. If an API request stalls for more than 45 seconds, the system automatically triggers a 20-second "cool-off" period and resets the connection.
* **Auto-Reset Logic:** The script processes data in batches of 20, re-initializing the Google Earth Engine connection after every batch to prevent socket leakage and memory overloads.


---

## 7. Data Dictionary & Feature Specifications

The **GMGBD** dataset (v1.0) consists of **9,199 verified records** with 100% data completion (0 missing values). Each record represents a multimodal snapshot of a biodiversity event, merging visual descriptions with precise environmental telemetry.

### Feature Overview

| Column | Type | Description | Range / Unique Count |
| :--- | :--- | :--- | :--- |
| **filename** | String | Unique ID for the JPG image file. | 9199 unique (img_*.jpg) |
| **scientific_name** | String | Latin taxonomic name of the species. | 4,775 unique species |
| **common_name** | String | Standard English name of the species. | 4,766 unique names |
| **latitude** | Float | Decimal coordinate (North/South). | -53.11 to 61.77 |
| **longitude** | Float | Decimal coordinate (East/West). | -135.03 to 176.95 |
| **sighting_date** | Date | YYYY-MM-DD format of the observation. | 1,164 unique dates |
| **blip_caption** | Text | AI-generated visual scene description. | 5,371 unique semantic captions |
| **country** | String | High-level administrative territory. | 108 unique countries |
| **state** | String | First-level administrative division. | 717 unique states/provinces |
| **city** | String | Local municipality or "Rural" indicator. | 2,379 unique localities |
| **avg_temp_C** | Float | Mean temperature at time/point of sighting. | -23.9°C to 36.1°C |
| **elevation_m** | Float | Altitude above sea level in meters. | -67.0m to 4,691.0m |
| **NDVI_value** | Float | Quantified vegetation health index. | -0.1937 to 0.9417 |
| **NDVI_Category** | String | Qualitative habitat classification. | 4 Categories (Non-Veg to Dense) |
| **dist_to_water_m** | Float | Distance to the nearest water body. | 0.0m to 20,853.4km |

---

### Insights from the Audit

* **Taxonomic Diversity:** With nearly **4,800 unique species**, the dataset offers a wide representation of global flora and fauna, making it ideal for large-scale species identification tasks.
* **Climatic Breadth:** The temperature range covers extreme environments, from arctic conditions (**-23.9°C**) to tropical heat (**36.1°C**), allowing for climate-resilience studies.
* **Geospatial Reach:** Observations span **108 countries**, providing a truly global context for Vision-Language Models to understand geographic variance in landscapes.
* **VLM Richness:** The **5,371 unique BLIP captions** provide a diverse linguistic foundation for training models to "see" beyond just labels, describing specific actions and environmental backgrounds.






## 8. Model Benchmarking & Evaluation

To demonstrate the utility of the **GMGBD** dataset, we performed a comparative evaluation using two state-of-the-art vision models. We tested their ability to identify species with and without the supplementary environmental context provided by our pipeline.

### Evaluated Models

#### A. [Qwen2.5-VL-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct) (The "Contextual Lift")
    * **Role:** High-performance Vision-Language Model (VLM).
    * **Features:** Native support for high-resolution image understanding and complex reasoning.
    * **Official Link:** [Hugging Face - Qwen2.5-VL-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct)

#### B. [Gemma 3: 4B](https://huggingface.co/google/gemma-3-4b-it) (Baseline Performance)
    * **Role:** Lightweight multimodal model.
    * **Features:** Optimized for local inference and efficient natural world reasoning.
    * **Official Link:** [Hugging Face - Google/Gemma-3-4B](https://huggingface.co/google/gemma-3-4b)

---

### Performance Results (N=500 Samples)

We measured **Full Species Accuracy** (exact match) and **Genus-Level Accuracy** (correct taxonomic group).

#### A. Qwen2.5-VL-3B-Instruct (The "Contextual Lift")
The most significant finding was the "Contextual Lift"—the increase in accuracy when the model was provided with the GMGBD environmental metadata (Location, Temperature, NDVI).

| Scenario | Full Species Accuracy | Genus-Level Accuracy |
| :--- | :--- | :--- |
| **Standard (Image Only)** | 40.40% | 53.20% |
| **With Context (GMGBD Enriched)** | **42.80%** | **54.20%** |



**Experiment Analysis:**
* **Net Species Gain:** +12 images correctly identified only after adding context.
* **Lift:** 5.00% (25 images improved).
* **Noice:** 2.60% (13 images missed).

#### B. Gemma 3:4B (Baseline Performance)
Gemma was tested to establish a baseline for smaller, local multimodal models.

| Metric | Accuracy |
| :--- | :--- |
| **Full Species Accuracy** | 9.60% |
| **Genus-Level Accuracy** | 16.60% |
| **Few-Shot Accuracy** | 9.00% |

---

### Key Findings from Evaluation

1.  **Context Matters:** Providing the model with GMGBD's metadata (e.g., "Observed in Tanzania at 28°C near a water body") helped the model resolve "visually confusing" species that look similar but live in different climates.
2.  **Reduced Noise:** While adding data can sometimes confuse a model, the **Net Gain** was positive in all categories, proving that GMGBD metadata is high-signal and ecologically relevant.
3.  **Benchmark for Future VLMs:** The 42.8% accuracy of Qwen2.5-VL sets a strong baseline for the community to improve upon using the full 25,000-record GMGBD dataset.





---

## 9. Conclusion & Significance

The **Global Multi-modal Geo-Biodiversity Dataset (GMGBD)** represents a shift from "labels" to "context." By ensuring every image is anchored by exact historical weather, vegetation health, and hydrological data, we provide AI models with the "Ecological Context" they currently lack. 

This dataset is uniquely positioned to train the next generation of **Context-Aware VLMs** capable of not only identifying an animal but understanding its relationship with its immediate environment.


---

## 10. How to Cite

If you use the **GMGBD** dataset or the automated pipeline in your research, please use the following citation:

```bibtex
@dataset{gmgbd_2026,
  author = {MImahin},
  title = {Global Multi-modal Geo-Biodiversity Dataset (GMGBD)},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub Repository},
  howpublished = {\url{[https://github.com/MImahin/Global-Multimodal-Geo-Biotic-Dataset-GMGBD](https://github.com/MImahin/Global-Multimodal-Geo-Biotic-Dataset-GMGBD)}}
}


