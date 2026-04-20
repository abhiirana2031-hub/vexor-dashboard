import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Layers, ExternalLink, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Image } from '@/components/ui/image';
import { Projects as ProjectType } from '@/entities';

interface ProjectManagerProps {
  projects: ProjectType[];
  onAddNew: () => void;
  onEdit: (project: ProjectType) => void;
  onDelete: (id: string) => void;
}

export const ProjectManager = ({ projects, onAddNew, onEdit, onDelete }: ProjectManagerProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tighter mb-1 uppercase">Neural Deployments</h2>
          <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Manage industrial projects</p>
        </div>
        <button 
          onClick={onAddNew}
          className="futuristic-button group"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            Initialize New Node
          </span>
          <div className="btn-glow" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {projects.map((project, idx) => {
            const title = project.projectTitle || (project as any).title || "Confidential Project";
            const image = project.projectImage || (project as any).image;
            const tech = (project.technologiesUsed || (project as any).technologies)?.split(',')[0] || "Innovation";

            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card-hover group p-0 overflow-hidden border-white/5"
              >
                {/* Media Layer */}
                <div className="relative h-48 overflow-hidden bg-white/[0.02]">
                  {image ? (
                    <Image
                      src={image}
                      alt={title}
                      width={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="w-12 h-12 text-white/5" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="px-4 py-1.5 rounded-full glass-effect border-white/10 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${project.projectStatus === 'active' ? 'bg-secondary animate-pulse shadow-neon-cyan' : 'bg-foreground/20'}`} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-foreground/60">{project.projectStatus || 'ARCHIVED'}</span>
                    </div>
                  </div>

                  {/* Quick Actions Hover Overlay */}
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                    <button 
                      onClick={() => onEdit(project)}
                      className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/40 text-secondary flex items-center justify-center hover:bg-secondary hover:text-black transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(project._id)}
                      className="w-12 h-12 rounded-xl bg-destructive/20 border border-destructive/40 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {project.projectUrl && (
                      <a 
                        href={project.projectUrl} target="_blank" rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info Layer */}
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-3">
                     <Activity className="w-3 h-3 text-secondary/40" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
                      {tech}
                     </span>
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tighter group-hover:text-secondary transition-colors truncate">
                    {title}
                  </h3>
                </div>
                
                {/* Scanning Sweep */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent group-hover:animate-scanner" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
