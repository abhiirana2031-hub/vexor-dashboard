import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload = ({ value, onChange, label = "Upload Image" }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File exceeds 5MB memory limit.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload via API.');

      const data = await res.json();
      if (data.url) {
        onChange(data.url); // Inform parent form of the new local uploaded URL
      }
    } catch (err) {
      console.error(err);
      setError('Matrix transfer failed. Try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Value / Preview */}
      <div className="flex gap-4 items-center w-full">
         <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /uploads/..."
            className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-secondary transition-colors font-mono text-sm h-[42px]"
         />
         <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
         />
         <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`h-[42px] px-6 rounded-xl flex items-center justify-center gap-2 border transition-all ${
               isUploading 
               ? 'bg-secondary/20 border-secondary/40 text-secondary' 
               : 'bg-white/[0.03] border-white/10 hover:border-secondary hover:bg-secondary/10 hover:text-secondary'
            }`}
         >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
               {isUploading ? 'Transferring' : 'Upload Local'}
            </span>
         </button>
      </div>

      {error && (
         <p className="text-[10px] text-destructive font-bold tracking-wider flex items-center gap-2">
            <X className="w-3 h-3" /> {error}
         </p>
      )}

      {/* Visual Feedback */}
      {value && !error && (value.startsWith('/uploads/') || value.includes('/uploads/')) && (
         <p className="text-[10px] text-neon-green font-bold tracking-wider flex items-center gap-2 mt-2">
            <CheckCircle2 className="w-3 h-3" /> Secure local link established successfully.
         </p>
      )}
    </div>
  );
};
