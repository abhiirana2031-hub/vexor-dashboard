import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Services as ServiceType } from '@/entities';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Card, CardContent } from '@/components/ui/Card';

interface ServiceFormProps {
  service?: ServiceType | null;
  onSave: (data: Partial<ServiceType>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ServiceForm = ({ service, onSave, onCancel, isSaving }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Partial<ServiceType>>({
    serviceName: service?.serviceName || '',
    serviceDescription: service?.serviceDescription || '',
    serviceIcon: service?.serviceIcon || '',
    serviceImage: service?.serviceImage || '',
    serviceDetailedDescription: service?.serviceDetailedDescription || '',
    isFeatured: service?.isFeatured || false,
  });

  const [useIcon, setUseIcon] = useState(!formData.serviceImage && !!formData.serviceIcon);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const DynamicIcon = formData.serviceIcon ? (LucideIcons as any)[formData.serviceIcon] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-6">
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Architecture Title</Label>
            <Input 
              value={formData.serviceName}
              onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
              placeholder="e.g., Quantum Data Analysis"
              className="bg-white/[0.02] border-white/10 rounded-xl"
              required
            />
          </div>

          <div className="md:col-span-2 space-y-4">
             <div className="flex items-center justify-between">
                <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Primary Visual Node</Label>
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                   <button 
                     type="button"
                     onClick={() => setUseIcon(false)}
                     className={`px-4 py-1 text-[8px] font-black uppercase rounded-md transition-all ${!useIcon ? 'bg-secondary text-black shadow-neon-cyan' : 'text-foreground/40'}`}
                   >
                     Image
                   </button>
                   <button 
                     type="button"
                     onClick={() => setUseIcon(true)}
                     className={`px-4 py-1 text-[8px] font-black uppercase rounded-md transition-all ${useIcon ? 'bg-secondary text-black shadow-neon-cyan' : 'text-foreground/40'}`}
                   >
                     Icon
                   </button>
                </div>
             </div>

             {!useIcon ? (
                <ImageUpload 
                  value={formData.serviceImage || ''}
                  onChange={(url) => setFormData({...formData, serviceImage: url})}
                />
             ) : (
                <div className="space-y-4">
                  <Input 
                    value={formData.serviceIcon}
                    onChange={(e) => setFormData({...formData, serviceIcon: e.target.value})}
                    placeholder="Lucide Icon Name (e.g., Cpu, Zap, Activity)"
                    className="bg-white/[0.02] border-white/10 rounded-xl"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['Cpu', 'Zap', 'Activity', 'Shield', 'Layers', 'Globe', 'Database', 'Code'].map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({...formData, serviceIcon: icon})}
                        className={`p-2 rounded-lg border transition-all ${formData.serviceIcon === icon ? 'bg-secondary/20 border-secondary' : 'bg-white/5 border-white/10'}`}
                      >
                        {React.createElement((LucideIcons as any)[icon] || LucideIcons.HelpCircle, { size: 16, className: formData.serviceIcon === icon ? 'text-secondary' : 'text-foreground/40' })}
                      </button>
                    ))}
                  </div>
                </div>
             )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Brief Transmission (Short Description)</Label>
            <Textarea 
              value={formData.serviceDescription}
              onChange={(e) => setFormData({...formData, serviceDescription: e.target.value})}
              placeholder="A quick summary of the service..."
              className="bg-white/[0.02] border-white/10 rounded-xl min-h-[80px]"
              required
            />
          </div>

          <div className="flex items-center space-x-3 md:col-span-2">
            <input 
              type="checkbox" 
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-secondary focus:ring-secondary"
            />
            <Label htmlFor="isFeatured" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 cursor-pointer">Set as Featured Architecture</Label>
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
          <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">Cancel</button>
          <button type="submit" disabled={isSaving} className="futuristic-button px-10">
            <span className="relative z-10">{isSaving ? 'Compiling...' : service ? 'Update Arc' : 'Initialize Arc'}</span>
            <div className="btn-glow" />
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="lg:col-span-2 space-y-6">
        <Label className="text-[9px] font-black uppercase tracking-widest text-secondary pl-4 border-l border-secondary">Real-time Node Preview</Label>
        
        <div className="perspective-1000">
          <motion.div
            initial={false}
            animate={{ rotateY: 0 }}
            className="preserve-3d"
          >
            <Card className="overflow-hidden border-secondary/20 group">
              <div className="h-48 relative overflow-hidden bg-white/[0.02] border-b border-white/5">
                {!useIcon && formData.serviceImage ? (
                  <img src={formData.serviceImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/5 to-transparent">
                    {DynamicIcon ? React.createElement(DynamicIcon, { size: 64, className: "text-secondary animate-pulse" }) : <LucideIcons.HelpCircle size={64} className="text-white/5" />}
                  </div>
                )}
                {formData.isFeatured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-secondary text-black text-[8px] font-black uppercase shadow-neon-cyan">
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-8 space-y-4">
                <h3 className="text-xl font-black text-foreground tracking-tighter uppercase">{formData.serviceName || 'Architecture_Title'}</h3>
                <p className="text-xs text-foreground/40 font-medium italic leading-relaxed">
                  {formData.serviceDescription || 'Initialize mission parameters to preview transmission content...'}
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                   <div className="w-12 h-1 bg-secondary shadow-neon-cyan" />
                   <LucideIcons.ArrowRight className="w-4 h-4 text-secondary/40" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
           <div className="flex justify-between items-center">
              <span className="text-[8px] font-black uppercase text-foreground/20 tracking-widest">Metadata_Status</span>
              <span className="text-[8px] font-black text-secondary uppercase animate-pulse">Synchronizing...</span>
           </div>
           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-secondary"
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
           </div>
        </div>
      </div>
    </div>
  );
};

