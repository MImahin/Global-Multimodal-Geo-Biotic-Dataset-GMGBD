# GMGBD: Global Multi-modal Geo-Biodiversity Dataset

GMGBD is a high-resolution, enriched dataset designed to bridge the gap between raw citizen science observations and deep ecological insights. By integrating **Vision-Language Models (VLM)** with **Geospatial Remote Sensing**, it provides a contextual understanding of biodiversity that goes beyond simple image classification.

---

## 1. Comparative Analysis

The following table highlights how **GMGBD** evolves the standard of biodiversity datasets compared to other recent industry benchmarks.

| Dataset | What is it? | How was it made? | Size | Key Includes |
| :--- | :--- | :--- | :--- | :--- |
| **iNat2021** | The industry baseline for species classification. | Automated export from iNaturalist "Research Grade" records. | 2.7M images / 10k species | Image, species label, lat/lon. No deep environmental context. |
| **BioCube** (2025) | A multimodal "data cube" for ecological modeling. | API integration of GBIF, ERA5 (Climate), and BOLD (eDNA). | ~40k species | Audio, eDNA, and low-res climate (0.25° grid). |
| **CrypticBio** (2025) | Dataset for "visually confusing" (cryptic) species. | Mined real-world misidentifications from iNat history. | 166M images / 67k species | Taxonomic hierarchy and spatiotemporal context to help AI distinguish look-alikes. |
| **iNatAg** (2025) | Agricultural-specific biodiversity. | Curated iNaturalist data filtered for crops and weeds. | 4.7M images / 2,959 species | Binary "Crop vs. Weed" labels and Swin Transformer benchmarks. |
| **GMGBD (Ours)** | **A contextual "Bio-Vision" dataset.** | **VLM + GEE + Threaded Watchdog Automation.** | **25k target (current)** | **AI Visual Captions (BLIP), Historical Temp, Precise NDVI, Distance to Water.** |

---

## 2. Technical Definition

The **Global Multi-modal Geo-Biodiversity Dataset (GMGBD)** is a high-resolution, enriched dataset that combines citizen science observations with Vision-Language Model (VLM) insights and Earth Engine environmental metrics.

### Key Layers:
* **The Vision Layer:** Utilizes **Salesforce BLIP-Large** to transform a static image into a rich, descriptive natural language sentence.
* **The Geospatial Layer:** Leverages **Google Earth Engine (GEE)** to "time-travel" back to the exact date of the sighting to measure vegetation health (NDVI) and water proximity.
* **The Robustness Layer:** Employs a **multithreaded "Watchdog" system** with an auto-recovery decorator to ensure continuous data collection even during API stalls or connection resets.

---

## 3. Why GMGBD is Unique and Important

### A. Environmental Precision (The "NDVI" Factor)
While other datasets like BioCube use coarse 0.25° grids (roughly 25km blocks), **GMGBD calculates NDVI and climate at a much finer 1km resolution.**
> **Why it matters:** A species might be in a small green oasis in a desert. A coarse grid would label the area "Dry," but GMGBD's precision correctly identifies it as "Dense Vegetation."



### B. The "Contextual VLM" Advantage
Most datasets provide a simple label (e.g., *Scientific Name: Panthera leo*). **GMGBD provides a semantic caption: "A lion resting in tall yellow grass under a cloudy sky."**
> **Why it matters:** This allows researchers to train models that understand **behavior and habitat**, not just identification. It moves AI from simple object detection to contextual ecological reasoning.

### C. Automated Hydrological Proximity
GMGBD is one of the few automated pipelines that calculates **Distance to Water (m)** using HydroSHEDS flow accumulation models.
> **Why it matters:** Proximity to water is the primary predictor of animal movement and survival. This makes the dataset significantly more valuable for **Ecological Niche Modeling (ENM)** than standard image-only datasets.

### D. Resilience and Scalability
The implementation of the `@safe_request` decorator and the **Threaded Watchdog** architecture addresses the industry-wide problem of "API Fatigue."
> **Why it matters:** Most research scripts crash during large-scale operations. Our methodology ensures a **self-healing pipeline** capable of scaling from 25k to over 1M records without manual oversight.
