import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Projects as ProjectType } from '@/entities';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';

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
    clientName: project?.clientName || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Title */}
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

        {/* Tech Stack */}
        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Core Engine / Tech Stack</Label>
          <Input 
            value={formData.technologiesUsed}
            onChange={(e) => setFormData({...formData, technologiesUsed: e.target.value})}
            placeholder="React, Tailwind, Astro"
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        {/* Image URL / Local Upload */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Visual Node (Image URL / Local Upload)</Label>
          <ImageUpload 
            value={formData.projectImage || ''}
            onChange={(url) => setFormData({...formData, projectImage: url})}
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Mission Parameters (Description)</Label>
          <Textarea 
            value={formData.projectDescription}
            onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
            placeholder="Describe the project mission and results..."
            className="bg-white/[0.02] border-white/10 rounded-xl min-h-[120px]"
          />
        </div>

        {/* Live Link */}
        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Neural Deployment Link (Live)</Label>
          <Input 
            value={formData.projectUrl}
            onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
            placeholder="https://..."
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        {/* Repo Link */}
        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Source Code Repository (GitHub)</Label>
          <Input 
            value={formData.repoUrl}
            onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
            placeholder="https://github.com/..."
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        {/* Client */}
        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Partner Organization (Client)</Label>
          <Input 
            value={formData.clientName}
            onChange={(e) => setFormData({...formData, clientName: e.target.value})}
            placeholder="Project Partner"
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        {/* Status */}
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
      </div>

      <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
        <button 
          type="button"
          onClick={onCancel}
          className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-all"
        >
          Cancel Operation
        </button>
        <button 
          type="submit"
          disabled={isSaving}
          className="futuristic-button px-10"
        >
          <span className="relative z-10">
            {isSaving ? 'Synchronizing...' : project ? 'Update Node' : 'Initialize Node'}
          </span>
          <div className="btn-glow" />
        </button>
      </div>
    </form>
  );
};
