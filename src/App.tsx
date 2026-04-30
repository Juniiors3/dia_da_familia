import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo } from './types';
import PhotoFrame from './components/PhotoFrame';
import { 
  Camera, 
  Play, 
  Sparkles,
  Info,
  Heart,
  RefreshCw,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react';

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isPreseting, setIsPresenting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const SAMPLE_PHOTOS: Photo[] = [
    { id: 'sample-1', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000', name: 'Almoço em Família' },
    { id: 'sample-2', url: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1000', name: 'Momentos no Jardim' },
    { id: 'sample-3', url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=1000', name: 'Caminhada Juntos' },
    { id: 'sample-4', url: 'https://images.unsplash.com/photo-1506836462214-5f53106173a7?q=80&w=1000', name: 'Brincadeiras' },
    { id: 'sample-5', url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1000', name: 'Gerações' }
  ];

  const fetchPhotos = useCallback(async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      
      const finalPhotos = data.length > 0 ? data : SAMPLE_PHOTOS;
      
      // Comparação simples para evitar re-renders desnecessários se a lista não mudou
      if (JSON.stringify(finalPhotos) !== JSON.stringify(photos)) {
        setPhotos(finalPhotos);
        
        // Auto-start na primeira vez que detecta fotos
        if (finalPhotos.length > 0 && !hasInitialized) {
          setIsPresenting(true);
          setHasInitialized(true);
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar fotos:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [photos, hasInitialized]);

  // Sincronização automática a cada 10 segundos
  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, [fetchPhotos]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20">
      {/* Aesthetic Header */}
      <nav className="w-full h-24 flex items-center justify-between px-8 lg:px-20 bg-white/50 backdrop-blur-xl border-b border-slate-100 fixed top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <Camera size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-display font-black text-2xl tracking-tighter text-slate-900 leading-none">LumiFrame</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Pasta Local Sincronizada</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm transition-all ${isSyncing ? 'opacity-100 ring-2 ring-primary/20' : 'opacity-60'}`}>
            <RefreshCw size={12} className={isSyncing ? 'animate-spin text-primary' : ''} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {isSyncing ? 'Sincronizando' : 'Monitorando Pasta'}
            </span>
          </div>
          {photos.length > 0 && (
             <button 
                onClick={() => setIsPresenting(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all group"
             >
               <Play size={14} fill="currentColor" className="group-hover:scale-110 transition-transform" />
               Iniciar Slideshow
             </button>
          )}
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Info size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-8 lg:px-20 max-w-7xl mx-auto">
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Exibição Automática</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-display font-medium tracking-tight text-slate-900 leading-[1.1]">
                {photos.length > 0 ? (
                    <>Suas fotos estão <span className="italic text-primary">vivas</span> e sincronizadas.</>
                ) : (
                    <>Aguardando fotos na pasta <span className="italic text-slate-400">/photos</span>.</>
                )}
              </h2>
            </div>
          </motion.div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            {photos.length > 0 ? (
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FolderOpen size={16} className="text-slate-400" />
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arquivos Detectados ({photos.length})</h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <motion.div 
                        key={photo.id} 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-white"
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                           <span className="text-[10px] text-white font-medium truncate uppercase tracking-widest">{photo.name}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-24 px-6 rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-8 animate-pulse">
                        <ImageIcon size={40} />
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-slate-800 mb-4">Pasta Vazia</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                        Coloque arquivos de imagem (.jpg, .png, .webp) na pasta <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">/photos</code> para que a mágica aconteça.
                    </p>
                </div>
            )}
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col gap-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Status do Servidor
                </h3>
                
                <div className="flex flex-col gap-6">
                    {[
                        { label: 'Pasta Alvo', value: '/photos' },
                        { label: 'Frequência', value: 'A cada 10s' },
                        { label: 'Transição', value: 'Ken Burns' },
                        { label: 'Auto-Play', value: 'Ativo' },
                    ].map(item => (
                        <div key={item.label} className="flex justify-between items-center border-b border-slate-50 pb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs font-mono font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded">{item.value}</span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-4 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 overflow-hidden relative group">
                    <Heart size={40} className="absolute -bottom-2 -right-2 text-primary/10 -rotate-12 transition-transform group-hover:scale-125" />
                    <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Mensagem do Sistema</p>
                    <p className="text-xs leading-relaxed text-slate-600 relative z-10 italic">
                        LumiFrame está pronto. Basta adicionar suas memórias na pasta para que a galeria se atualize e o show comece.
                    </p>
                </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Presentation Fullscreen Mode */}
      <AnimatePresence>
        {isPreseting && (
          <PhotoFrame 
            photos={photos} 
            onClose={() => setIsPresenting(false)} 
          />
        )}
      </AnimatePresence>

      <footer className="py-12 px-8 lg:px-20 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
            © 2026 LumiFrame — Criado para amantes da fotografia
        </p>
        <div className="flex gap-6">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors cursor-help">Privacidade</span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors cursor-help">Sobre</span>
        </div>
      </footer>
    </div>
  );
}

