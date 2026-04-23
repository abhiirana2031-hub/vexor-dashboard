import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Projects as ProjectType } from '@/entities';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Card, CardContent } from '@/components/ui/Card';
import { Globe, Github, Box, Activity, CheckCircle2 } from 'lucide-react';

interface ProjectFormProps {
  project?: ProjectType | null;
  onSave: (data: Partial<ProjectType>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ProjectForm = ({ project, onSave, onCancel, isSaving }: ProjectFormProps) => {
  const [formData, setFormData] = useState<Partial<ProjectType>>({
    projectTitle: project?.projectTitle || '',
    projectDescription: project?.projectDescription || '',
    technologiesUsed: project?.technologiesUsed || '',
    projectImage: project?.projectImage || '',
    projectUrl: project?.projectUrl || '',
    repoUrl: project?.repoUrl || '',
    projectStatus: project?.projectStatus || 'active',
    clientName: project?.clientName || '',
    isFeatured: (project as any)?.isFeatured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-6">
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Deployment Name</Label>
            <Input 
              value={formData.projectTitle}
              onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
              placeholder="e.g., Cyber-Neural Interface"
              className="bg-white/[0.02] border-white/10 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Core Engine / Tech Stack</Label>
            <Input 
              value={formData.technologiesUsed}
              onChange={(e) => setFormData({...formData, technologiesUsed: e.target.value})}
              placeholder="React, Tailwind, Astro"
              className="bg-white/[0.02] border-white/10 rounded-xl"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Visual Node (Image Node)</Label>
            <ImageUpload 
              value={formData.projectImage || ''}
              onChange={(url) => setFormData({...formData, projectImage: url})}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Mission Parameters (Description)</Label>
            <Textarea 
              value={formData.projectDescription}
              onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
              placeholder="Describe the project mission..."
              className="bg-white/[0.02] border-white/10 rounded-xl min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Deployment Link</Label>
            <Input 
              value={formData.projectUrl}
              onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
              placeholder="https://..."
              className="bg-white/[0.02] border-white/10 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Source Code Repository</Label>
            <Input 
              value={formData.repoUrl}
              onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
              placeholder="https://github.com/..."
              className="bg-white/[0.02] border-white/10 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Deployment Status</Label>
            <select 
              value={formData.projectStatus}
              onChange={(e) => setFormData({...formData, projectStatus: e.target.value})}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 focus:border-secondary outline-none text-sm"
            >
              <option value="active">ACTIVE</option>
              <option value="completed">COMPLETED</option>
              <option value="on-hold">ON HOLD</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 mt-8">
            <input 
              type="checkbox" 
              id="isFeaturedProj"
              checked={(formData as any).isFeatured}
              onChange={(e) => setFormData({...formData, isFeatured: e.target.checked} as any)}
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-secondary focus:ring-secondary"
            />
            <Label htmlFor="isFeaturedProj" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 cursor-pointer">Featured Project</Label>
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
          <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-all">Cancel</button>
          <button type="submit" disabled={isSaving} className="futuristic-button px-10">
            <span className="relative z-10">{isSaving ? 'Synchronizing...' : project ? 'Update Node' : 'Initialize Node'}</span>
            <div className="btn-glow" />
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="lg:col-span-2 space-y-6">
        <Label className="text-[9px] font-black uppercase tracking-widest text-secondary pl-4 border-l border-secondary">Neural Deployment Preview</Label>
        
        <Card className="overflow-hidden border-secondary/20 group">
          <div className="h-56 relative overflow-hidden bg-white/[0.02] border-b border-white/5">
            {formData.projectImage ? (
              <img src={formData.projectImage} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/5 to-transparent">
                <Box size={64} className="text-white/5 animate-pulse" />
              </div>
            )}
            {(formData as any).isFeatured && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-secondary text-black text-[8px] font-black uppercase shadow-neon-cyan z-10 flex items-center gap-1">
                <CheckCircle2 size={10} />
                Featured
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#03050a] to-transparent opacity-60" />
            <div className="absolute bottom-4 left-6">
               <p className="text-[8px] font-black text-secondary uppercase tracking-[0.3em] mb-1">{formData.projectStatus}</p>
               <h3 className="text-xl font-black text-white tracking-tighter uppercase">{formData.projectTitle || 'Deployment_Title'}</h3>
            </div>
          </div>
          <CardContent className="p-8 space-y-4">
            <p className="text-xs text-foreground/40 font-medium italic leading-relaxed line-clamp-3">
              {formData.projectDescription || 'Define mission parameters to generate neural preview...'}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-2">
               {formData.technologiesUsed?.split(',').map((tech, i) => (
                  <span key={i} className="text-[8px] font-black uppercase px-2 py-1 bg-white/5 border border-white/5 rounded text-foreground/40">{tech.trim()}</span>
               ))}
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-4">
               <Globe className="w-4 h-4 text-secondary/40" />
               <Github className="w-4 h-4 text-secondary/40" />
               <div className="flex-1" />
               <Activity className="w-4 h-4 text-secondary animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
