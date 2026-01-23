'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  Eye,
  Globe,
  Shield,
  ChevronDown,
  ExternalLink,
  Search,
  TrendingUp,
  Github,
  ArrowUpRight,
  Database,
  Cpu,
  Map,
  Wind,
  Layers,
} from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisualization, setSelectedVisualization] = useState<{
    title: string;
    src: string;
    alt?: string;
    description: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visualizations = [
    { id: 1, category: 'Global Distribution', title: 'Interactive Temperature Map', src: '/plots/map_temperature.html', type: 'html', description: 'Interactive global heatmap showing wildlife observations scaled by ambient temperature.' },
    { id: 2, category: 'Global Distribution', title: 'Interactive Habitat Map (NDVI)', src: '/plots/map_habitat_ndvi.html', type: 'html', description: 'Interactive map displaying observations categorized by vegetation density layers.' },
    { id: 3, category: 'Global Distribution', title: 'Scatter & Hexbin Density', src: '/plots/Observation by scatter and hexbin map.png', type: 'image', description: 'Point density analysis showing hotspots of biodiversity data collection.' },
    { id: 4, category: 'Global Distribution', title: 'Global Wildlife Distribution', src: '/plots/Global Distribution of Wildlife Observations.png', type: 'image', description: 'Static overview of all 9,199 records across continents.' },
    { id: 5, category: 'Statistical Distributions', title: 'Feature Distributions', src: '/plots/Distributions.png', type: 'image', description: 'Histograms showing the spread of elevation, temperature, and NDVI values.' },
    { id: 6, category: 'Statistical Distributions', title: 'NDVI Category Breakdown', src: '/plots/ndvi_distribution.png', type: 'image', description: 'Frequency of observations across different vegetation health categories.' },
    { id: 7, category: 'Correlation & Relationships', title: 'Elevation vs. Temperature', src: '/plots/elevation_temp_correlation.png', type: 'image', description: 'Regression analysis showing the environmental lapse rate within the dataset.' },
    { id: 8, category: 'Correlation & Relationships', title: 'Numerical Correlation Matrix', src: '/plots/Correlation Matrix of Numerical Features.png', type: 'image', description: 'Heatmap showing dependencies between all geospatial and climatic variables.' },
    { id: 9, category: 'Correlation & Relationships', title: 'Temp vs. Vegetation Index', src: '/plots/Relationship- Temperature vs Vegetation Index (NDVI).png', type: 'image', description: 'Correlation between thermal layers and vegetation health.' },
    { id: 10, category: 'Temporal Patterns', title: 'Monthly Seasonality', src: '/plots/Observations by Month (Seasonality).png', type: 'image', description: 'Temporal analysis of when observations were recorded throughout the year.' },
    { id: 11, category: 'Temporal Patterns', title: 'Seasonal Distribution Peaks', src: '/plots/Monthly Distributions (Seasonal Peaks).png', type: 'image', description: 'Density plots of environmental variables categorized by month.' },
    { id: 12, category: 'Species Analysis', title: 'Temperature Niche (Top 5)', src: '/plots/Temperature Niche for Top 5 Species.png', type: 'image', description: 'The thermal range and preference for the most frequently observed species.' },
    { id: 13, category: 'Frequency Analysis', title: 'Top 10 Frequencies', src: '/plots/Top 10 Frequencys.png', type: 'image', description: 'Count of the most common species identified in the dataset.' },
    { id: 14, category: 'Frequency Analysis', title: 'Country Distribution', src: '/plots/country_distribution.png', type: 'image', description: 'Geographic breakdown of data contribution by nation.' },
    { id: 15, category: 'Data Quality', title: 'Outlier Analysis', src: '/plots/Outlier Analysis (Symmetric Scale).png', type: 'image', description: 'Statistical cleaning showing the removal of environmental noise and sensor errors.' }
  ];

  const dataFeatures = [
    { column: 'filename', type: 'String', description: 'Unique ID for the JPG image file', badge: 'ID' },
    { column: 'scientific_name', type: 'String', description: 'Latin taxonomic name', badge: 'Taxonomy' },
    { column: 'common_name', type: 'String', description: 'Standard English name', badge: 'Taxonomy' },
    { column: 'latitude', type: 'Float', description: 'Decimal coordinate (N/S)', badge: 'Geospatial' },
    { column: 'longitude', type: 'Float', description: 'Decimal coordinate (E/W)', badge: 'Geospatial' },
    { column: 'sighting_date', type: 'Date', description: 'YYYY-MM-DD format', badge: 'Temporal' },
    { column: 'blip_caption', type: 'Text', description: 'AI-generated scene description', badge: 'Vision' },
    { column: 'country', type: 'String', description: 'Administrative territory', badge: 'Location' },
    { column: 'state', type: 'String', description: 'First-level division', badge: 'Location' },
    { column: 'city', type: 'String', description: 'Local municipality', badge: 'Location' },
    { column: 'avg_temp_C', type: 'Float', description: 'Mean temperature at sighting', badge: 'Climate' },
    { column: 'elevation_m', type: 'Float', description: 'Altitude in meters', badge: 'Geospatial' },
    { column: 'NDVI_value', type: 'Float', description: 'Vegetation health index', badge: 'Vegetation' },
    { column: 'NDVI_Category', type: 'String', description: 'Habitat classification', badge: 'Vegetation' },
    { column: 'dist_to_water_m', type: 'Float', description: 'Distance to water', badge: 'Hydrology' },
  ];

  const benchmarks = [
    { name: 'iNat2021', description: 'Industry baseline', size: '2.7M images', includes: 'Image, label', highlight: false },
    { name: 'BioCube (2025)', description: 'Multimodal cube', size: '~40k species', includes: 'Audio, eDNA', highlight: false },
    { name: 'CrypticBio (2025)', description: 'Confusing species', size: '166M images', includes: 'Logs', highlight: false },
    { name: 'iNatAg (2025)', description: 'Agricultural', size: '4.7M images', includes: 'Crop labels', highlight: false },
    { name: 'GMGBD (Ours)', description: 'Contextual Bio-Vision', size: '25k target', includes: 'VLM Captions, NDVI', highlight: true },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-10 h-10 text-primary p-2 bg-primary/20 rounded-lg" />
            <span className="text-xl font-bold text-primary tracking-tight">GMGBD</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#overview" className="text-sm font-medium hover:text-primary transition-colors">Overview</a>
            <a href="#toolkit" className="text-sm font-medium hover:text-primary transition-colors">Toolkit</a>
            <a href="#benchmarks" className="text-sm font-medium hover:text-primary transition-colors">Comparison</a>
            <a href="#visualizations" className="text-sm font-medium hover:text-primary transition-colors">Visualizations</a>
          </nav>
          <a href="https://github.com/MImahin/Global-Multimodal-Geo-Biotic-Dataset-GMGBD" target="_blank" className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center gap-2 border border-primary/20 hover:bg-primary/20 transition-all">
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center pt-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Ecological AI Advancement</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">Moving AI from Identification to <span className="text-primary">Context</span></h1>
          <p className="text-xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">GMGBD integrates Vision-Language Models with Geospatial Remote Sensing to resolve visually confusing species.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://drive.google.com/drive/folders/1pebye8kjIpsRZ9OVfoqGwK1kh1dH2wSH" target="_blank" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Explore Dataset (G-Drive)</a>
            <a href="#visualizations" className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-primary/50 text-primary font-bold hover:bg-primary/5 transition-all">Interactive Maps</a>
          </div>
        </div>
      </section>

      {/* Technical Toolkit Section */}
      <section id="toolkit" className="py-24 px-4 bg-secondary/5 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Technical Toolkit & API Integration</h2>
            <p className="text-lg text-foreground/60 max-w-3xl leading-relaxed">The power of GMGBD lies in its integration of industry-leading APIs and machine learning models used to fetch, process, and enrich the dataset.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/40 transition-colors">
              <Database className="text-primary w-10 h-10 mb-6" />
              <h3 className="text-xl font-bold mb-3">1. iNaturalist API (v1)</h3>
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">Primary Biodiversity Data Sourcing. We fetch <strong>"Research Grade"</strong> observations ensuring peer-verified taxonomy, high-res image URLs, and GPS coordinates.</p>
              <a href="https://api.inaturalist.org/v1/docs/" target="_blank" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline tracking-widest uppercase">API Documentation <ExternalLink className="w-3 h-3" /></a>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/40 transition-colors">
              <Cpu className="text-primary w-10 h-10 mb-6" />
              <h3 className="text-xl font-bold mb-3">2. Salesforce BLIP-Large</h3>
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">AI Visual Captioning. The <strong>blip-image-captioning-large</strong> model (469M params) converts raw pixels into natural language behavior and scene metadata.</p>
              <a href="https://huggingface.co/Salesforce/blip-image-captioning-large" target="_blank" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline tracking-widest uppercase">Model Documentation <ExternalLink className="w-3 h-3" /></a>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/40 transition-colors">
              <Map className="text-primary w-10 h-10 mb-6" />
              <h3 className="text-xl font-bold mb-3">3. OpenStreetMap (Nominatim)</h3>
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">Reverse Geocoding. Extracts country, state, and city labels using <strong>jsonv2</strong> format with policy-compliant request delays.</p>
              <a href="https://nominatim.org/release-docs/latest/api/Reverse/" target="_blank" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline tracking-widest uppercase">Nominatim API <ExternalLink className="w-3 h-3" /></a>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/40 transition-colors">
              <Wind className="text-primary w-10 h-10 mb-6" />
              <h3 className="text-xl font-bold mb-3">4. Open-Meteo & GEE</h3>
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">Environmental Layers. Historical weather reanalysis, MODIS NDVI tracking, and WWF HydroSHEDS for hydrology distance calculation.</p>
              <a href="https://open-meteo.com/en/docs/historical-weather-api" target="_blank" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline tracking-widest uppercase">Data Documentation <ExternalLink className="w-3 h-3" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Comparison / Benchmarks Section */}
      <section id="benchmarks" className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">How GMGBD Stands Apart</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Comparison with industry standards and 2025-2026 biodiversity baselines.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/20 border-b border-border text-xs font-bold uppercase tracking-wider">
                  <th className="px-8 py-6">Dataset</th>
                  <th className="px-8 py-6">Description</th>
                  <th className="px-8 py-6">Scale</th>
                  <th className="px-8 py-6">Key Modalities</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.map((b, i) => (
                  <tr key={i} className={`border-b border-border transition-colors ${b.highlight ? 'bg-primary/[0.03]' : 'hover:bg-secondary/5'}`}>
                    <td className={`px-8 py-6 font-bold ${b.highlight ? 'text-primary' : ''}`}>{b.name}</td>
                    <td className="px-8 py-6 text-sm opacity-70 leading-relaxed">{b.description}</td>
                    <td className="px-8 py-6 text-sm opacity-70">{b.size}</td>
                    <td className="px-8 py-6 text-sm font-medium">{b.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Results Dashboard */}
      <section className="py-24 px-4 bg-secondary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">Contextual Lift Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-card border border-border rounded-2xl p-10 shadow-sm">
               <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">Species Accuracy <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Qwen2.5-VL</span></h3>
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-sm mb-2 font-medium"><span>Image Only (Baseline)</span><span className="font-bold">40.40%</span></div>
                   <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden"><div className="bg-muted-foreground h-full rounded-full" style={{width: '40.4%'}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-2 font-medium text-primary"><span>With GMGBD Context Metadata</span><span className="font-bold">42.80%</span></div>
                   <div className="w-full bg-primary/20 h-3 rounded-full overflow-hidden"><div className="bg-primary h-full rounded-full" style={{width: '42.8%'}}></div></div>
                 </div>
                 <div className="pt-8 flex items-center justify-between border-t border-border mt-6">
                   <div className="flex items-center gap-2 text-primary">
                     <ArrowUpRight className="w-6 h-6" />
                     <span className="text-sm font-bold uppercase tracking-widest">Accuracy Lift</span>
                   </div>
                   <span className="text-4xl font-black text-primary">+5.00%</span>
                 </div>
               </div>
             </div>
             <div className="bg-card border border-border rounded-2xl p-10 shadow-sm">
               <h3 className="text-2xl font-bold mb-8">Genus-Level Performance</h3>
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-sm mb-2 font-medium"><span>Standard Identification</span><span className="font-bold">53.20%</span></div>
                   <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden"><div className="bg-muted-foreground h-full rounded-full" style={{width: '53.2%'}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-2 font-medium text-primary"><span>Enhanced with GMGBD Context</span><span className="font-bold">54.20%</span></div>
                   <div className="w-full bg-primary/20 h-3 rounded-full overflow-hidden"><div className="bg-primary h-full rounded-full" style={{width: '54.2%'}}></div></div>
                 </div>
                 <div className="p-6 bg-primary/5 rounded-xl text-sm mt-8 border border-primary/10 leading-relaxed italic">
                   "Key Finding: Contextual metadata helps resolve visually confusing species that live in distinct climatic niches or different habitat types."
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Data Dictionary */}
      <section id="data" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Data Dictionary</h2>
              <p className="text-foreground/60 max-w-xl">Comprehensive guide to the 15 environmental and taxonomic columns.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input 
                type="text" 
                placeholder="Search features..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/20 outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/20 border-b border-border">
                <tr>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[10px]">Column Name</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[10px]">Type</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[10px]">Technical Description</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-[10px]">Scope</th>
                </tr>
              </thead>
              <tbody>
                {dataFeatures.filter(f => f.column.toLowerCase().includes(searchTerm.toLowerCase())).map((f, i) => (
                  <tr key={i} className="border-b border-border hover:bg-primary/[0.01] transition-colors">
                    <td className="px-6 py-5 font-mono text-primary font-bold">{f.column}</td>
                    <td className="px-6 py-5"><span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase tracking-tight">{f.type}</span></td>
                    <td className="px-6 py-5 text-foreground/80 leading-relaxed">{f.description}</td>
                    <td className="px-6 py-5"><span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-[10px] font-bold uppercase tracking-tight">{f.badge}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Visualizations Gallery */}
      <section id="visualizations" className="py-24 px-4 bg-secondary/5">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Visualization Gallery</h2>
          <p className="text-lg opacity-60">Deep-dive into the ecological insights extracted from GMGBD.</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {['Global Distribution', 'Statistical Distributions', 'Correlation & Relationships', 'Temporal Patterns', 'Species Analysis', 'Frequency Analysis', 'Data Quality'].map((category) => (
            <div key={category}>
              <h3 className="text-xl font-black mb-8 text-primary/80 uppercase tracking-[0.2em] border-l-4 border-primary pl-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visualizations.filter(v => v.category === category).map((vis) => (
                  <button
                    key={vis.id}
                    onClick={() => setSelectedVisualization(vis)}
                    className="text-left bg-card border border-border rounded-2xl p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">{vis.title}</h4>
                      <ExternalLink className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all flex-shrink-0" />
                    </div>
                    <p className="text-sm opacity-60 leading-relaxed line-clamp-2">{vis.description}</p>
                    <div className="mt-6 flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${vis.type === 'html' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-blue-400'}`}></span>
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                         {vis.type === 'html' ? 'Interactive Map' : 'Statistical Plot'}
                       </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Modal */}
      {selectedVisualization && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedVisualization(null)}>
          <div className="bg-card border border-border rounded-[2rem] shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col scale-in-center" onClick={e => e.stopPropagation()}>
            <div className="p-10 border-b border-border flex justify-between items-center bg-card/50">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{selectedVisualization.type === 'html' ? 'Dynamic Folium Map' : 'Static Distribution Plot'}</span>
                <h3 className="text-3xl font-bold tracking-tight">{selectedVisualization.title}</h3>
                <p className="text-foreground/60">{selectedVisualization.description}</p>
              </div>
              <button onClick={() => setSelectedVisualization(null)} className="p-4 hover:bg-secondary rounded-2xl transition-all border border-border group active:scale-95">
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-muted/30 p-4">
              {selectedVisualization.type === 'html' ? (
                <div className="w-full h-[60vh] md:h-[65vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <iframe 
                    src={selectedVisualization.src} 
                    className="w-full h-full border-0"
                    title={selectedVisualization.title}
                  />
                </div>
              ) : (
                <img 
                  src={selectedVisualization.src} 
                  alt={selectedVisualization.title} 
                  className="max-w-full h-auto object-contain rounded-xl mx-auto shadow-2xl"
                />
              )}
            </div>

            <div className="p-8 border-t border-border flex justify-center bg-card/50">
              <button onClick={() => setSelectedVisualization(null)} className="px-12 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">Close Analysis</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-24 border-t border-border bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-primary" />
              <span className="font-bold text-3xl tracking-tighter">GMGBD</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">A comprehensive multi-modal dataset bridging the gap between computer vision and planetary health reanalysis.</p>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-lg uppercase tracking-wider text-primary/80">Citation Code</h4>
            <pre className="text-[10px] bg-card p-6 rounded-2xl border border-border overflow-x-auto font-mono text-primary shadow-inner">
              @dataset{'{'}gmgbd_2026,{"\n"}
              {"  "}author = {'{'}MImahin{'}'},{"\n"}
              {"  "}title = {'{'}GMGBD{'}'},{"\n"}
              {"  "}year = {'{'}2026{'}'}{"\n"}
              {'}'}
            </pre>
          </div>
          <div className="space-y-6 md:text-right">
            <h4 className="font-bold text-lg uppercase tracking-wider text-primary/80">Access Links</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="https://github.com/MImahin" target="_blank" className="hover:text-primary transition-colors flex items-center md:justify-end gap-2 font-bold">Source Repository <Github className="w-5 h-5" /></a>
              <a href="https://drive.google.com/drive/folders/1pebye8kjIpsRZ9OVfoqGwK1kh1dH2wSH" target="_blank" className="hover:text-primary transition-colors flex items-center md:justify-end gap-2 font-bold">Google Drive Data <Database className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-20 pt-8 border-t border-border/50 text-center text-[10px] opacity-30 font-black tracking-[0.4em] uppercase">
          © 2026 Global Multi-modal Geo-Biodiversity Project.
        </div>
      </footer>
    </div>
  );
}