import React, { useState } from 'react';
import { Testimonials as TestimonialType } from '@/entities';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface TestimonialFormProps {
  testimonial?: TestimonialType | null;
  onSave: (data: Partial<TestimonialType>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const TestimonialForm = ({ testimonial, onSave, onCancel, isSaving }: TestimonialFormProps) => {
  const [formData, setFormData] = useState<Partial<TestimonialType>>({
    clientName: testimonial?.clientName || '',
    clientRole: testimonial?.clientRole || '',
    clientPhoto: testimonial?.clientPhoto || '',
    rating: testimonial?.rating || 5,
    testimonialText: testimonial?.testimonialText || '',
    companyName: (testimonial as any)?.companyName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Client Name</Label>
          <Input 
            value={formData.clientName}
            onChange={(e) => setFormData({...formData, clientName: e.target.value})}
            placeholder="e.g., Sarah Jenkins"
            className="bg-white/[0.02] border-white/10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Client Designation (Role)</Label>
          <Input 
            value={formData.clientRole}
            onChange={(e) => setFormData({...formData, clientRole: e.target.value})}
            placeholder="e.g., CEO"
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Corporate Entity (Company)</Label>
          <Input 
            value={formData.companyName}
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            placeholder="e.g., Nexus Corp"
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Performance Rating</Label>
          <div className="flex gap-2 p-3 bg-white/[0.02] border border-white/10 rounded-xl w-fit">
             {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({...formData, rating: num})}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                   <Star className={`w-6 h-6 ${num <= (formData.rating || 5) ? 'text-[#e9f243] fill-[#e9f243]' : 'text-white/10 fill-white/10'}`} />
                </button>
             ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Client Avatar (Image URL / Local Upload)</Label>
          <ImageUpload 
            value={formData.clientPhoto || ''}
            onChange={(url) => setFormData({...formData, clientPhoto: url})}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Feedback Transmission (Review)</Label>
          <Textarea 
            value={formData.testimonialText}
            onChange={(e) => setFormData({...formData, testimonialText: e.target.value})}
            placeholder="Client's review..."
            className="bg-white/[0.02] border-white/10 rounded-xl min-h-[120px]"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
        <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">Cancel</button>
        <button type="submit" disabled={isSaving} className="futuristic-button px-10">
          <span className="relative z-10">{isSaving ? 'Saving...' : testimonial ? 'Update Feedback' : 'Initialize Feedback'}</span>
          <div className="btn-glow" />
        </button>
      </div>
    </form>
  );
};
