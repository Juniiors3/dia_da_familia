import React, { useRef } from 'react';
import { Camera, Upload, FolderOpen, Images, Trash2 } from 'lucide-react';
import { Photo } from '../types';

interface ImageUploaderProps {
  onPhotosAdded: (newPhotos: Photo[]) => void;
  photos: Photo[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function ImageUploader({ onPhotosAdded, photos, onRemove, onClear }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const newPhotos: Photo[] = [];
    let processed = 0;

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push({
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          name: file.name
        });
        processed++;
        if (processed === files.length) {
          onPhotosAdded(newPhotos);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white/50 hover:bg-white hover:border-primary/50 transition-all group relative overflow-hidden">
        <input 
          type="file" 
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-8 ring-primary/5 group-hover:scale-110 transition-transform">
          <FolderOpen size={36} />
        </div>
        
        <h3 className="text-xl font-display font-semibold text-slate-800 mb-2">Selecione suas memórias</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          Clique ou arraste imagens de uma pasta local para começar sua apresentação.
        </p>
        
        <div className="mt-8 flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest pointer-events-none">
            <Images size={14} /> {photos.length} fotos carregadas
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Galeria Recente</h4>
            <button 
              onClick={onClear}
              className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
            >
              Limpar tudo
            </button>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <img 
                  src={photo.url} 
                  alt={photo.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => onRemove(photo.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
