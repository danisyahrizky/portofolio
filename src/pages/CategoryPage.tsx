import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjects, urlFor } from '../lib/sanity';
import { ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Injeksi Tipe Data Polimorfik
type VisualAsset = {
  _type: 'image' | 'file';
  _key?: string;
  asset: {
    _ref: string;
    url?: string; // URL ini didapat dari ekspansi GROQ (asset->url)
  };
};

type Project = {
  _id: string;
  title: string;
  category: string;
  mainCover: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  description: string;
  link?: string; 
  behanceLink?: string;
  visualAssets?: VisualAsset[]; // Menggantikan 'images'
};

export function CategoryPage() {
  const { categoryId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeGallery, setActiveGallery] = useState<Project | null>(null);
  
  // 2. State Layar Penuh Diubah Menjadi Objek
  const [fullscreenAsset, setFullscreenAsset] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const categoryName = categoryId ? decodeURIComponent(categoryId) : undefined;
        const data = await fetchProjects(categoryName);
        setProjects(data);
      } catch (error) {
        console.error("GAGAL FETCH:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId]);

  useEffect(() => {
    if (activeGallery || fullscreenAsset) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeGallery, fullscreenAsset]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-black uppercase tracking-widest animate-pulse bg-bg-dark text-bg-light">
        Loading Data...
      </div>
    );
  }

  return (
    <>
      {/* HALAMAN UTAMA */}
      <div className="min-h-screen pt-24 md:pt-32 px-4 md:px-12 pb-24 overflow-x-hidden w-full bg-bg-dark text-bg-light relative">
        <div className="max-w-7xl mx-auto w-full">
          <Link to="/#project" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-accent-blood transition-colors mb-12 md:mb-16">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          
          <h1 className="text-4xl md:text-[80px] font-black tracking-tighter uppercase mb-12 md:mb-16 border-b-2 border-accent-blood pb-6 md:pb-8 leading-none break-words w-full">
            {decodeURIComponent(categoryId || '')}
          </h1>

          <div className="space-y-16 md:space-y-32 w-full">
            {projects.length === 0 ? (
              <p className="text-xl md:text-2xl font-medium opacity-50">No projects found in this category.</p>
            ) : (
              projects.map((project, index) => (
                <motion.div 
                  key={project._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-16 items-center w-full`}
                >
                  <div className="w-full md:w-1/2 aspect-[4/3] border-4 border-current relative overflow-hidden group shadow-[4px_4px_0px_0px_#660000] md:shadow-[8px_8px_0px_0px_#660000] dark:shadow-[4px_4px_0px_0px_#FFFAFA] dark:md:shadow-[8px_8px_0px_0px_#FFFAFA]">
                    <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 transition-opacity z-10 duration-500 pointer-events-none" />
                    
                    {project.mainCover ? (
                      <img 
                        src={urlFor(project.mainCover).url()} 
                        alt={project.title}
                        onClick={() => setFullscreenAsset({ url: urlFor(project.mainCover).url(), type: 'image' })}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105 cursor-zoom-in relative z-20"
                      />
                    ) : (
                      <div className="w-full h-full bg-bg-light/10 flex items-center justify-center font-bold text-xs uppercase opacity-50">
                        NO COVER DATA
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col justify-center min-w-0">
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-4 md:mb-6 break-words">
                      {project.title}
                    </h2>
                    <p className="text-xs md:text-sm opacity-80 leading-relaxed mb-6 md:mb-8 max-w-lg break-words">
                      {project.description}
                    </p>

                    {project.category === 'Frontend Development' ? (
                      <div className="flex flex-wrap items-center gap-6 mt-4 w-full">
                        {project.link && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="w-full sm:w-auto border-2 border-accent-blood bg-bg-light text-bg-dark hover:bg-bg-dark hover:text-bg-light dark:bg-bg-dark dark:text-bg-light dark:hover:bg-bg-light dark:hover:text-bg-dark px-8 py-4 md:py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 md:hover:shadow-[4px_4px_0px_0px_#660000] md:hover:-translate-y-1 md:hover:-translate-x-1 active:shadow-[2px_2px_0px_0px_#660000] active:-translate-y-0.5 active:-translate-x-0.5 flex justify-center items-center"
                          >
                            VISIT SITE
                          </a>
                        )}

                        {project.behanceLink && (
                          <a 
                            href={project.behanceLink}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="w-full sm:w-auto border-none bg-transparent text-static-light/25 hover:text-accent-blood py-4 md:py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 flex justify-center items-center shrink-0 cursor-pointer"
                          >
                            Case Study
                          </a>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveGallery(project)}
                        className="w-full md:w-auto self-start border-2 border-accent-blood bg-bg-light text-bg-dark hover:bg-bg-dark hover:text-bg-light dark:bg-bg-dark dark:text-bg-light dark:hover:bg-bg-light dark:hover:text-bg-dark px-8 py-4 md:py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 md:hover:shadow-[4px_4px_0px_0px_#660000] md:hover:-translate-y-1 md:hover:-translate-x-1 active:shadow-[2px_2px_0px_0px_#660000] active:-translate-y-0.5 active:-translate-x-0.5 flex justify-center items-center mt-2 cursor-pointer"
                      >
                        VIEW ARTWORKS
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* GALERI MODAL */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-bg-dark text-bg-light overflow-y-auto"
          >
            <div className="min-h-screen w-full relative p-4 md:p-12 flex flex-col items-center">
              
              <div className="w-full max-w-[90rem] flex justify-between items-center mb-8 sticky top-0 md:top-4 bg-bg-dark/90 backdrop-blur-md p-3 md:p-4 border-4 border-current z-10 shadow-[6px_6px_0px_0px_var(--color-accent-blood)]">
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter truncate pr-4">
                  {activeGallery.title} // ASSETS
                </h2>
                <button 
                  onClick={() => setActiveGallery(null)}
                  className="p-1 md:p-2 hover:bg-accent-blood hover:text-static-light border-2 border-transparent hover:border-current transition-all cursor-pointer shrink-0"
                >
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
              </div>

              <div className="w-full max-w-[90rem] pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                
                {/* 3. Logika Rendering Polimorfik (Gambar vs Video) */}
                {activeGallery.visualAssets && activeGallery.visualAssets.length > 0 ? (
                  activeGallery.visualAssets.map((asset, idx) => {
                    const isVideo = asset._type === 'file';
                    const assetUrl = isVideo ? asset.asset?.url : urlFor(asset).url();

                    if (!assetUrl) return null; // Keamanan fail-safe jika URL kosong

                    return (
                      <div key={asset._key || idx} className="w-full flex flex-col gap-3 md:gap-4">
                        <span className="font-sans font-bold text-[10px] md:text-xs uppercase opacity-50 tracking-widest border-b-2 border-current pb-2">
                          Visual 0{idx + 1} {isVideo ? '[VIDEO]' : ''}
                        </span>
                        
                        {isVideo ? (
                          <video 
                            src={assetUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            onClick={() => setFullscreenAsset({ url: assetUrl, type: 'video' })}
                            className="w-full h-auto border-4 border-current cursor-zoom-in transition-all duration-300 hover:border-accent-blood hover:shadow-[8px_8px_0px_0px_var(--color-accent-blood)] md:hover:-translate-y-1.5 md:hover:-translate-x-1.5 bg-bg-light/5"
                          />
                        ) : (
                          <img 
                            src={assetUrl}
                            alt={`Graphic ${idx + 1}`}
                            onClick={() => setFullscreenAsset({ url: assetUrl, type: 'image' })}
                            className="w-full h-auto border-4 border-current cursor-zoom-in transition-all duration-300 hover:border-accent-blood hover:shadow-[8px_8px_0px_0px_var(--color-accent-blood)] md:hover:-translate-y-1.5 md:hover:-translate-x-1.5 bg-bg-light/5"
                          />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full py-24 text-center font-bold text-xl md:text-3xl uppercase opacity-50 tracking-widest col-span-full">
                    [ No Additional Graphics Uploaded ]
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODAL LAYAR PENUH (Gambar & Video) */}
      <AnimatePresence>
        {fullscreenAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setFullscreenAsset(null)}
            className="fixed inset-0 z-[110] bg-[#050505]/95 backdrop-blur-lg flex justify-center items-center p-4 cursor-zoom-out"
          >
            <button className="absolute top-6 right-6 md:top-10 md:right-10 text-white opacity-50 hover:opacity-100 transition-opacity z-50">
              <X size={32} />
            </button>
            
            {fullscreenAsset.type === 'video' ? (
              <video 
                src={fullscreenAsset.url} 
                autoPlay
                loop
                muted
                playsInline
                className="max-w-full max-h-full object-contain shadow-2xl drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              />
            ) : (
              <img 
                src={fullscreenAsset.url} 
                alt="Fullscreen Zoom" 
                className="max-w-full max-h-full object-contain shadow-2xl drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}