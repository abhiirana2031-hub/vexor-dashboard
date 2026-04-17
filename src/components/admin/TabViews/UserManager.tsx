import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, UserCircle, Activity } from 'lucide-react';
import { UserProfiles as UserType } from '@/entities';

interface UserManagerProps {
  users: UserType[];
  onDelete: (id: string) => void;
  onEdit?: (user: UserType) => void;
}

export const UserManager = ({ users, onDelete, onEdit }: UserManagerProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 uppercase">Neural Profiles</h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">View and manage registered access tokens</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {users.map((user, idx) => {
             // Fallbacks matching UserProfiles schema
             const name = user.fullName || (user as any).nickname || 'Classified User';
             const role = user.jobTitle || 'Standard Access';
             const lastActive = 'Active recently'; // Hardcoded for demo/simplicity

             return (
               <motion.div
                 key={user._id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ delay: idx * 0.05 }}
                 className="glass-card flex p-6 gap-6 items-center border-white/5 group relative overflow-hidden"
               >
                 <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-secondary/40 transition-colors overflow-hidden">
                    {user.profilePhoto ? (
                       <img src={user.profilePhoto} alt="profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-80" />
                    ) : (
                       <UserCircle className="w-8 h-8 text-foreground/40 group-hover:text-secondary" />
                    )}
                 </div>

                 <div className="flex-1 space-y-1 overflow-hidden">
                    <h3 className="font-heading text-lg font-black tracking-tight text-foreground truncate">{name}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary">{role}</p>
                    <div className="flex items-center gap-2 pt-2 text-foreground/40 text-xs">
                       <Activity className="w-3 h-3 text-neon-green animate-pulse" />
                       <span className="truncate">{lastActive}</span>
                    </div>
                 </div>

                 <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                    <button 
                      onClick={() => onEdit && onEdit(user)}
                      className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center hover:bg-secondary text-secondary hover:text-black transition-colors"
                      title="Edit Profile"
                    >
                      <UserCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(user._id)}
                      className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center hover:bg-destructive text-destructive hover:text-white transition-colors"
                      title="Terminate Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               </motion.div>
             );
          })}
        </AnimatePresence>
        
        {users.length === 0 && (
           <div className="col-span-full h-64 glass-effect rounded-[2rem] flex items-center justify-center border-white/5">
              <p className="text-[10px] uppercase font-black tracking-widest text-foreground/20">No active neural tokens found</p>
           </div>
        )}
      </div>
    </div>
  );
};
