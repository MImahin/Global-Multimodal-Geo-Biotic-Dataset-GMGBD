# GMGBD: Global Multi-modal Geo-Biodiversity Dataset

GMGBD is a high-resolution, enriched dataset designed to bridge the gap between raw citizen science observations and deep ecological insights. By integrating **Vision-Language Models (VLM)** with **Geospatial Remote Sensing**, it provides a contextual understanding of biodiversity that goes beyond simple image classification.

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
