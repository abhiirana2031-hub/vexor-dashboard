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
              const roleDisplay = user.role === 'admin' ? 'Strategic Commandant' : 'Standard Operative';
              const lastActive = 'Active recently'; 

              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card flex p-6 gap-6 items-center border-white/5 group relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-secondary/40 transition-all overflow-hidden relative">
                     {user.profilePhoto ? (
                        <img src={user.profilePhoto} alt="profile" className="w-full h-full object-cover transition-all group-hover:scale-110" />
                     ) : (
                        <UserCircle className="w-8 h-8 text-foreground/20 group-hover:text-secondary/60" />
                     )}
                     
                     {user.isVerified && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#39FF14] rounded-full border-2 border-[#03050a] flex items-center justify-center">
                           <ShieldCheck className="w-3 h-3 text-black" />
                        </div>
                     )}
                  </div>

                  <div className="flex-1 space-y-1 overflow-hidden">
                     <div className="flex items-center gap-3">
                        <h3 className="font-heading text-lg font-black tracking-tighter text-foreground uppercase truncate italic">{name}</h3>
                        {user.role === 'admin' && (
                           <span className="px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20 text-[7px] font-black uppercase text-secondary">Admin</span>
                        )}
                     </div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40">{roleDisplay}</p>
                     <div className="flex items-center gap-2 pt-2 text-foreground/20 text-[9px] font-bold uppercase tracking-widest">
                        <Activity className="w-2.5 h-2.5 text-secondary animate-pulse" />
                        <span className="truncate">{lastActive}</span>
                     </div>
                  </div>

                 <div className="absolute right-6 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
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
