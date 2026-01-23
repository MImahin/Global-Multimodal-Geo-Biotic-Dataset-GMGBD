'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Activity,
  Zap
} from 'lucide-react';

// Main Component Wrapper to handle Next.js Suspense requirements
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading GMGBD...</div>}>
      <GMGBDContent />
    </Suspense>
  );
}

function GMGBDContent() {
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisualization, setSelectedVisualization] = useState<{
    title: string;
    src: string;
    description: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visualizations = [
    { id: 1, category: 'Global Distribution', title: 'Interactive Temperature Map', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/map_temperature.html', type: 'html', description: 'Interactive global heatmap showing wildlife observations scaled by ambient temperature.' },
    { id: 2, category: 'Global Distribution', title: 'Interactive Habitat Map (NDVI)', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/map_habitat_ndvi.html', type: 'html', description: 'Interactive map displaying observations categorized by vegetation density layers.' },
    { id: 3, category: 'Global Distribution', title: 'Scatter & Hexbin Density', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Observation by scatter and hexbin map.png', type: 'image', description: 'Point density analysis showing hotspots of biodiversity data collection.' },
    { id: 4, category: 'Global Distribution', title: 'Global Wildlife Distribution', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Global Distribution of Wildlife Observations.png', type: 'image', description: 'Static overview of all 9,199 records across continents.' },
    { id: 5, category: 'Statistical Distributions', title: 'Feature Distributions', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Distributions.png', type: 'image', description: 'Histograms showing the spread of elevation, temperature, and NDVI values.' },
    { id: 6, category: 'Statistical Distributions', title: 'NDVI Category Breakdown', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/ndvi_distribution.png', type: 'image', description: 'Frequency of observations across different vegetation health categories.' },
    { id: 7, category: 'Correlation & Relationships', title: 'Elevation vs. Temperature', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/elevation_temp_correlation.png', type: 'image', description: 'Regression analysis showing the environmental lapse rate within the dataset.' },
    { id: 8, category: 'Correlation & Relationships', title: 'Numerical Correlation Matrix', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Correlation Matrix of Numerical Features.png', type: 'image', description: 'Heatmap showing dependencies between all geospatial and climatic variables.' },
    { id: 9, category: 'Correlation & Relationships', title: 'Temp vs. Vegetation Index', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Relationship- Temperature vs Vegetation Index (NDVI).png', type: 'image', description: 'Correlation between thermal layers and vegetation health.' },
    { id: 10, category: 'Temporal Patterns', title: 'Monthly Seasonality', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Observations by Month (Seasonality).png', type: 'image', description: 'Temporal analysis of when observations were recorded throughout the year.' },
    { id: 11, category: 'Temporal Patterns', title: 'Seasonal Distribution Peaks', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Monthly Distributions (Seasonal Peaks).png', type: 'image', description: 'Density plots of environmental variables categorized by month.' },
    { id: 12, category: 'Species Analysis', title: 'Temperature Niche (Top 5)', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Temperature Niche for Top 5 Species.png', type: 'image', description: 'The thermal range and preference for the most frequently observed species.' },
    { id: 13, category: 'Frequency Analysis', title: 'Top 10 Frequencies', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Top 10 Frequencys.png', type: 'image', description: 'Count of the most common species identified in the dataset.' },
    { id: 14, category: 'Frequency Analysis', title: 'Country Distribution', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/country_distribution.png', type: 'image', description: 'Geographic breakdown of data contribution by nation.' },
    { id: 15, category: 'Data Quality', title: 'Outlier Analysis', src: '/Global-Multimodal-Geo-Biotic-Dataset-GMGBD/plots/Outlier Analysis (Symmetric Scale).png', type: 'image', description: 'Statistical cleaning showing the removal of environmental noise and sensor errors.' }
  ];

  const ndviLogic = [
    { range: '> 0.6', category: 'Dense', landscape: 'Tropical rainforests, healthy crops.' },
    { range: '0.3 - 0.6', category: 'Moderate', landscape: 'Temperate forests, shrublands.' },
    { range: '0.1 - 0.3', category: 'Sparse', landscape: 'Grasslands, desert scrub.' },
    { range: '< 0.1', category: 'Non-Veg', landscape: 'Water, rock, snow, urban.' },
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
    { column: 'avg_temp_C', type: 'Float', description: 'Mean temperature at sighting', badge: 'Climate' },
    { column: 'elevation_m', type: 'Float', description: 'Altitude in meters', badge: 'Geospatial' },
    { column: 'NDVI_value', type: 'Float', description: 'Vegetation health index (-1 to 1)', badge: 'Vegetation' },
    { column: 'NDVI_Category', type: 'String', description: 'Habitat classification (Dense to Non-Veg)', badge: 'Vegetation' },
    { column: 'dist_to_water_m', type: 'Float', description: 'Distance to water (HydroSHEDS)', badge: 'Hydrology' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-10 h-10 text-primary p-2 bg-primary/20 rounded-lg" />
            <span className="text-xl font-bold text-primary tracking-tight">GMGBD</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#overview" className="text-sm font-medium hover:text-primary transition-colors">Overview</a>
            <a href="#toolkit" className="text-sm font-medium hover:text-primary transition-colors">Architecture</a>
            <a href="#results" className="text-sm font-medium hover:text-primary transition-colors">Benchmarks</a>
            <a href="#visualizations" className="text-sm font-medium hover:text-primary transition-colors">Gallery</a>
          </nav>
          <a href="https://github.com/MImahin/Global-Multimodal-Geo-Biotic-Dataset-GMGBD" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center gap-2 border border-primary/20 hover:bg-primary/20 transition-all">
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
      </header>

      <section id="overview" className="relative min-h-[75vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center pt-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">High-Resolution Bio-Vision v1.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">Moving AI from Identification to <span className="text-primary">Context</span></h1>
          <p className="text-xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Bridging raw citizen science with planetary telemetry. GMGBD integrates <strong>Vision-Language Models</strong> with <strong>Geospatial Remote Sensing</strong> to resolve visually cryptic species.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://drive.google.com/drive/folders/1pebye8kjIpsRZ9OVfoqGwK1kh1dH2wSH" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Download Dataset</a>
            <a href="#visualizations" className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-primary/50 text-primary font-bold hover:bg-primary/5 transition-all">Interactive Gallery</a>
          </div>
        </div>
      </section>

      <section id="toolkit" className="py-24 px-4 bg-secondary/5 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">System Architecture</h2>
            <p className="text-lg text-foreground/60 max-w-3xl leading-relaxed">The GMGBD pipeline is engineered for resilience, using a <strong>Threaded Watchdog</strong> system with auto-recovery to handle massive API scale.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/40 transition-all">
              <Cpu className="text-primary w-8 h-8 mb-4" />
              <h3 className="font-bold mb-2 text-sm">BLIP-Large VLM</h3>
              <p className="text-xs text-foreground/70">Transforms static images into rich semantic captions describing behavior and habitat.</p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/40 transition-all">
              <Layers className="text-primary w-8 h-8 mb-4" />
              <h3 className="font-bold mb-2 text-sm">Google Earth Engine</h3>
              <p className="text-xs text-foreground/70">"Time-travels" to sighting dates to measure precise 1km-resolution NDVI & Hydrology.</p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/40 transition-all">
              <Shield className="text-primary w-8 h-8 mb-4" />
              <h3 className="font-bold mb-2 text-sm">SafeRequest Watchdog</h3>
              <p className="text-xs text-foreground/70">Auto-recovery decorators prevent script hangs during API stalls (45s timeout).</p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl hover:border-primary/40 transition-all">
              <Zap className="text-primary w-8 h-8 mb-4" />
              <h3 className="font-bold mb-2 text-sm">Open-Meteo API</h3>
              <p className="text-xs text-foreground/70">Historical weather reanalysis fetching temperature and elevation for every GPS point.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Contextual Lift</h2>
              <p className="text-foreground/60 mb-8 leading-relaxed text-sm">
                By providing <strong>Qwen2.5-VL</strong> with GMGBD environmental context, we observed a significant increase in taxonomic accuracy.
              </p>
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="text-3xl font-black text-primary mb-1">+5.00%</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-60">Total Accuracy Lift</div>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                 <h3 className="text-xl font-bold mb-6">Species Accuracy</h3>
                 <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span>Image Only</span><span className="font-bold">40.4%</span></div>
                      <div className="w-full bg-secondary h-2 rounded-full"><div className="bg-muted-foreground h-full rounded-full" style={{width: '40.4%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-primary"><span>With GMGBD Context</span><span className="font-bold">42.8%</span></div>
                      <div className="w-full bg-primary/20 h-2 rounded-full"><div className="bg-primary h-full rounded-full" style={{width: '42.8%'}}></div></div>
                    </div>
                 </div>
               </div>
               <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                 <h3 className="text-xl font-bold mb-6">Genus Accuracy</h3>
                 <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span>Standard Baseline</span><span className="font-bold">53.2%</span></div>
                      <div className="w-full bg-secondary h-2 rounded-full"><div className="bg-muted-foreground h-full rounded-full" style={{width: '53.2%'}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-primary"><span>Enhanced Baseline</span><span className="font-bold">54.2%</span></div>
                      <div className="w-full bg-primary/20 h-2 rounded-full"><div className="bg-primary h-full rounded-full" style={{width: '54.2%'}}></div></div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-secondary/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">NDVI Habitat Logic</h2>
          <div className="bg-card border border-border rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/20 font-bold">
                <tr>
                  <th className="px-6 py-4">NDVI Range</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {ndviLogic.map((n, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-6 py-4 font-mono text-primary font-bold">{n.range}</td>
                    <td className="px-6 py-4 font-bold">{n.category}</td>
                    <td className="px-6 py-4 text-foreground/60">{n.landscape}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="visualizations" className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Interactive Gallery</h2>
          <p className="text-lg opacity-60">Deep-dive into 9,199 verified records and environmental telemetry.</p>
        </div>
        <div className="max-w-6xl mx-auto space-y-20">
          {['Global Distribution', 'Statistical Distributions', 'Correlation & Relationships', 'Temporal Patterns', 'Species Analysis', 'Frequency Analysis', 'Data Quality'].map((category) => (
            <div key={category}>
              <h3 className="text-sm font-black mb-8 text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-8 h-[2px] bg-primary"></span> {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visualizations.filter(v => v.category === category).map((vis) => (
                  <button
                    key={vis.id}
                    onClick={() => setSelectedVisualization(vis)}
                    className="text-left bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{vis.title}</h4>
                      <ExternalLink className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-all" />
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed line-clamp-2">{vis.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${vis.type === 'html' ? 'bg-green-500' : 'bg-blue-400'}`}></span>
                       <span className="text-[10px] font-bold uppercase opacity-40">{vis.type === 'html' ? 'Interactive' : 'Static'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedVisualization && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedVisualization(null)}>
          <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{selectedVisualization.title}</h3>
                <p className="text-sm text-foreground/60">{selectedVisualization.description}</p>
              </div>
              <button onClick={() => setSelectedVisualization(null)} className="p-2 hover:bg-secondary rounded-full transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-muted/20 p-4">
              {selectedVisualization.type === 'html' ? (
                <iframe src={selectedVisualization.src} className="w-full h-[60vh] bg-white rounded-xl shadow-lg border-0" title={selectedVisualization.title} />
              ) : (
                <img src={selectedVisualization.src} alt={selectedVisualization.title} className="max-w-full h-auto object-contain rounded-xl mx-auto shadow-lg" />
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="py-24 border-t border-border bg-secondary/10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">GMGBD Project</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">Multimodal benchmark for global wildlife and environmental reanalysis.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary/80">BibTeX Citation</h4>
            <pre className="text-[10px] bg-card p-4 rounded-xl border border-border overflow-x-auto font-mono text-primary shadow-inner">
              @dataset{'{'}gmgbd_2026,{"\n"}
              {"  "}author = {'{'}MImahin{'}'},{"\n"}
              {"  "}title = {'{'}Global Multi-modal Geo-Biodiversity Dataset{'}'},{"\n"}
              {"  "}year = {'{'}2026{'}'}{"\n"}
              {'}'}
            </pre>
          </div>
          <div className="flex flex-col gap-3 lg:text-right">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary/80">Resources</h4>
            <a href="https://github.com/MImahin" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors flex items-center lg:justify-end gap-2">Source Code <Github className="w-4 h-4" /></a>
            <a href="https://drive.google.com/drive/folders/1pebye8kjIpsRZ9OVfoqGwK1kh1dH2wSH" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors flex items-center lg:justify-end gap-2">Raw Dataset <Database className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
