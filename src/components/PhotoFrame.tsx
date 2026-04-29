import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Photo, Quote, INSPIRATIONAL_QUOTES } from '../types';
import { X, Play, Pause, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';

interface PhotoFrameProps {
  photos: Photo[];
  onClose: () => void;
}

export default function PhotoFrame({ photos, onClose }: PhotoFrameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    // Change quote every 2 photos
    if (currentIndex % 2 === 0) {
      setQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
    }
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(nextPhoto, 8000); // 8 seconds per photo
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, photos.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    if (currentIndex >= photos.length && photos.length > 0) {
      setCurrentIndex(0);
    }
  }, [photos.length, currentIndex]);

  const currentPhoto = photos[currentIndex] || photos[0];
  const currentQuote = INSPIRATIONAL_QUOTES[quoteIndex];

  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* HUD Overlay */}
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-[60] bg-gradient-to-b from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-white font-medium text-sm">LumiFrame</h2>
            <span className="text-white/40 text-[10px] uppercase tracking-widest leading-none">
              Em Reprodução • {currentIndex + 1} de {photos.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <main className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background blurred splash */}
            <div 
              className="absolute inset-0 bg-center bg-cover scale-110 blur-3xl opacity-30 saturate-150"
              style={{ backgroundImage: `url(${currentPhoto.url})` }}
            />
            
            {/* Ken Burns Effect Image */}
            <motion.div 
                className="w-full h-full relative z-10 overflow-hidden"
                initial={{ scale: 1 }}
                animate={{ scale: 1.1, x: [0, 20, -20, 0], y: [0, -10, 10, 0] }}
                transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            >
              <img 
                src={currentPhoto.url} 
                alt={currentPhoto.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Quote Overlay */}
        <div className="absolute inset-x-0 bottom-24 z-20 flex flex-col items-center px-12 pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuote.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="flex flex-col items-center text-center max-w-3xl"
                >
                    <div className="w-12 h-0.5 bg-white/30 mb-8 rounded-full" />
                    <p className="text-white font-display text-4xl lg:text-5xl italic font-light leading-snug drop-shadow-2xl">
                        "{currentQuote.text}"
                    </p>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mt-8">
                        — {currentQuote.author}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
      </main>

      {/* Navigation Buttons (Bottom) */}
      <footer className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-12 z-[60] opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={prevPhoto}
          className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex gap-1.5">
            {photos.slice(0, Math.min(photos.length, 10)).map((_, i) => (
                <div 
                    key={i} 
                    className={`h-0.5 rounded-full transition-all duration-500 bg-white ${
                        i === currentIndex ? 'w-12 opacity-100' : 'w-4 opacity-20'
                    }`}
                />
            ))}
        </div>

        <button
          onClick={nextPhoto}
          className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md"
        >
          <ChevronRight size={32} />
        </button>
      </footer>
    </div>
  );
}
