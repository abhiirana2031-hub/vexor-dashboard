import React, { useState } from 'react';
import { Blogs as BlogType } from '@/entities';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface BlogFormProps {
  blog?: BlogType | null;
  onSave: (data: Partial<BlogType>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const BlogForm = ({ blog, onSave, onCancel, isSaving }: BlogFormProps) => {
  const [formData, setFormData] = useState<Partial<BlogType>>({
    title: blog?.title || '',
    category: blog?.category || '',
    thumbnailImage: blog?.thumbnailImage || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Log Title</Label>
          <Input 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g., Optimizing Neural Networks for 2026"
            className="bg-white/[0.02] border-white/10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Category Tag</Label>
          <Input 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="e.g., AI Research"
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Visual Header (Image URL / Local Upload)</Label>
          <ImageUpload 
            value={formData.thumbnailImage || ''}
            onChange={(url) => setFormData({...formData, thumbnailImage: url})}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Quick Brief (Excerpt)</Label>
          <Textarea 
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            placeholder="A short summary of the log entry..."
            className="bg-white/[0.02] border-white/10 rounded-xl min-h-[80px]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Main Transmission (Content)</Label>
          <Textarea 
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Full log data..."
            className="bg-white/[0.02] border-white/10 rounded-xl min-h-[200px]"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
        <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">Cancel</button>
        <button type="submit" disabled={isSaving} className="futuristic-button px-10">
          <span className="relative z-10">{isSaving ? 'Uploading...' : blog ? 'Update Log' : 'Initialize Log'}</span>
          <div className="btn-glow" />
        </button>
      </div>
    </form>
  );
};
