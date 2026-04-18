import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, User, Linkedin, Mail } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { TeamMembers as TeamType } from '@/entities';

interface TeamManagerProps {
  team: TeamType[];
  onAddNew: () => void;
  onEdit: (member: TeamType) => void;
  onDelete: (id: string) => void;
}

export const TeamManager = ({ team, onAddNew, onEdit, onDelete }: TeamManagerProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 uppercase">Squad Matrix</h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Manage neural squad operatives</p>
        </div>
        <button 
          onClick={onAddNew}
          className="futuristic-button group"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            Initialize Operative
          </span>
          <div className="btn-glow" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-4">
        <AnimatePresence mode="popLayout">
          {team.sort((a, b) => {
             const orderA = a.displayOrder !== undefined && a.displayOrder !== null ? a.displayOrder : 999;
             const orderB = b.displayOrder !== undefined && b.displayOrder !== null ? b.displayOrder : 999;
             return orderA - orderB;
          }).map((member, idx) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card-hover group p-0 overflow-hidden border-white/5"
            >
              <div className="relative h-64 overflow-hidden bg-white/[0.02] flex items-center justify-center p-6">
                {member.profilePhoto ? (
                  <Image
                    src={member.profilePhoto}
                    alt={member.fullName || 'Operative'}
                    width={400}
                    className="w-full h-full object-cover rounded-3xl transition-all duration-700"
                  />
                ) : (
                  <User className="w-20 h-20 text-white/5" />
                )}

                {/* Edit/Delete Overlay */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-4">
                     <button 
                       onClick={() => onEdit(member)}
                       className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/40 text-secondary flex items-center justify-center hover:bg-secondary hover:text-black transition-all"
                     >
                       <Edit2 className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => onDelete(member._id)}
                       className="w-12 h-12 rounded-xl bg-destructive/20 border border-destructive/40 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
                  {(member.linkedInUrl || member.email) && (
                     <div className="flex items-center gap-4 mt-2">
                        {member.linkedInUrl && (
                           <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition-colors">
                              <Linkedin className="w-5 h-5" />
                           </a>
                        )}
                        {member.email && (
                           <a href={`mailto:${member.email}`} className="text-white hover:text-secondary transition-colors">
                              <Mail className="w-5 h-5" />
                           </a>
                        )}
                     </div>
                  )}
                </div>
              </div>

              <div className="p-8 text-center space-y-2">
                 <h3 className="text-xl font-black text-foreground tracking-tighter truncate">{member.fullName || 'Unknown Object'}</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{member.jobTitle || 'Role Undefined'}</p>
                 <p className="text-sm text-foreground/40 font-medium line-clamp-2 pt-2">{member.bio || 'No bio parameters established.'}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
