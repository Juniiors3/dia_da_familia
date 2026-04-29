import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo } from './types';
import ImageUploader from './components/ImageUploader';
import PhotoFrame from './components/PhotoFrame';
import { 
  Camera, 
  Play, 
  Sparkles,
  Info,
  Heart,
  RefreshCw
} from 'lucide-react';

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isPreseting, setIsPresenting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchPhotos = useCallback(async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos(data);
      
      // Auto-start se houver fotos e ainda não estiver apresentando
      if (data.length > 0 && !isPreseting) {
        setIsPresenting(true);
      }
    } catch (error) {
      console.error("Erro ao sincronizar fotos:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [isPreseting]);

  // Sincronização automática a cada 10 segundos
  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, [fetchPhotos]);

  const addPhotos = useCallback((newPhotos: Photo[]) => {
    // Para fotos enviadas via uploader (Blob/Base64)
    setPhotos(prev => [...prev, ...newPhotos]);
    if (newPhotos.length > 0) setIsPresenting(true);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearPhotos = useCallback(() => {
    setPhotos([]);
  }, []);

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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Vibe Digital</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border border-slate-100 transition-opacity ${isSyncing ? 'opacity-100' : 'opacity-40'}`}>
            <RefreshCw size={12} className={isSyncing ? 'animate-spin text-primary' : ''} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Sincronizando...</span>
          </div>
          {photos.length > 0 && (
             <button 
                onClick={() => setIsPresenting(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all group"
             >
               <Play size={14} fill="currentColor" className="group-hover:scale-110 transition-transform" />
               Começar Show
             </button>
          )}
          <div className="h-6 w-px bg-slate-200" />
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
                <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Inspirador & Visual</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-display font-medium tracking-tight text-slate-900 leading-[1.1]">
                Transforme sua tela em um <span className="italic text-primary">santuário</span> de memórias.
              </h2>
            </div>
          </motion.div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <ImageUploader 
              photos={photos} 
              onPhotosAdded={addPhotos} 
              onRemove={removePhoto} 
              onClear={clearPhotos}
            />
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Como funciona</h3>
                <ol className="flex flex-col gap-6">
                    {[
                        { num: '01', text: 'Selecione uma pasta ou várias fotos do seu dispositivo.' },
                        { num: '02', text: 'Nossa IA escolhe citações inspiradoras para cada momento.' },
                        { num: '03', text: 'Inicie o modo apresentação e relaxe com transições suaves.' }
                    ].map(item => (
                        <li key={item.num} className="flex gap-4 items-start">
                            <span className="text-xs font-black font-mono text-primary bg-primary/5 px-2 py-1 rounded-md">{item.num}</span>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                        </li>
                    ))}
                </ol>
                
                <div className="mt-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden relative">
                    <Heart size={40} className="absolute -bottom-2 -right-2 text-slate-200 -rotate-12" />
                    <p className="text-xs font-medium text-slate-600 relative z-10 italic">
                        "LumiFrame foi criado para trazer calma e beleza ao seu ambiente de trabalho ou casa."
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

