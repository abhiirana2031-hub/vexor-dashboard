import React, { useState, useEffect } from 'react';
import { UserProfiles as UserType, Projects } from '@/entities';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { BaseCrudService } from '@/integrations';

interface UserFormProps {
  user?: UserType | null;
  onSave: (data: Partial<UserType>, assignedProjectIds: string[]) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const UserForm = ({ user, onSave, onCancel, isSaving }: UserFormProps) => {
  const [formData, setFormData] = useState<Partial<UserType>>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    passwordHash: '',
    googleId: user?.googleId || '',
    nickname: user?.nickname || '',
    bio: user?.bio || '',
    profilePhoto: user?.profilePhoto || '',
    role: user?.role || 'user',
    isVerified: user?.isVerified || false,
  });
  
  const [availableProjects, setAvailableProjects] = useState<Projects[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    // Sync formData when user changes
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      passwordHash: '',
      googleId: user?.googleId || '',
      nickname: user?.nickname || '',
      bio: user?.bio || '',
      profilePhoto: user?.profilePhoto || '',
      role: user?.role || 'user',
      isVerified: user?.isVerified || false,
    });

    // Fetch all projects to let the admin assign them to this user
    BaseCrudService.getAll<Projects>('projects')
      .then(res => {
         setAvailableProjects(res.items);
         // Find which projects already belong to this user
         if (user?._id) {
            const owned = res.items.filter(p => p.userId === user._id).map(p => p._id);
            setSelectedProjectIds(owned);
         }
      })
      .catch(console.error)
      .finally(() => setIsLoadingProjects(false));
  }, [user]);

  const toggleProject = (id: string) => {
     setSelectedProjectIds(prev => 
        prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
     );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData };
    if (!submissionData.passwordHash) {
      delete submissionData.passwordHash;
    }
    onSave(submissionData, selectedProjectIds);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Read Only System ID */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-destructive">System Identity Token (Immutable _id)</Label>
          <Input 
            value={user?._id || 'Pending Generation...'}
            disabled
            className="bg-black/50 border-white/5 rounded-xl font-mono text-foreground/50 opacity-50 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Neural Profile Name</Label>
          <Input 
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            placeholder="e.g., Administrator"
            className="bg-white/[0.02] border-white/10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Comms Channel (Email)</Label>
          <Input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="admin@vexor.tech"
            className="bg-white/[0.02] border-white/10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Authentication Key (Update Password)</Label>
          <Input 
            type="password"
            value={formData.passwordHash}
            onChange={(e) => setFormData({...formData, passwordHash: e.target.value})}
            placeholder="Leave blank to keep current security key..."
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
          {user?.googleId && (
             <p className="text-[10px] text-secondary font-bold uppercase tracking-widest pt-2">Note: This profile uses Google OAuth. Password edits may not apply.</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Access Clearance (Role)</Label>
          <select 
            value={formData.role || 'user'}
            onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-secondary transition-colors text-sm font-medium appearance-none"
          >
            <option value="user" className="bg-[#03050a]">Standard Operative (User)</option>
            <option value="admin" className="bg-[#03050a]">Strategic Commandant (Admin)</option>
          </select>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest pt-2">Warning: Admins gain full neural bypass over all system collections.</p>
        </div>

        <div className="flex items-center space-x-3 md:col-span-2">
          <input 
            type="checkbox" 
            id="isVerified"
            checked={formData.isVerified}
            onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
            className="w-4 h-4 rounded border-white/10 bg-white/5 text-secondary focus:ring-secondary"
          />
          <Label htmlFor="isVerified" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 cursor-pointer">Verified Neural Profile</Label>
        </div>

        {/* Project Assignment */}
        <div className="space-y-4 md:col-span-2 pt-4 border-t border-white/5">
           <div>
              <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary block mb-4">Project Assignments</Label>
              <p className="text-xs text-foreground/40">Select projects to assign ownership to this Neural Profile.</p>
           </div>
           
           {isLoadingProjects ? (
              <p className="text-xs text-foreground/40 animate-pulse">Loading mission files...</p>
           ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[250px] overflow-y-auto no-scrollbar outline-none p-1">
                 {availableProjects.map(project => {
                    const isSelected = selectedProjectIds.includes(project._id);
                    return (
                       <div 
                         key={project._id}
                         onClick={() => toggleProject(project._id)}
                         className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            isSelected ? 'bg-secondary/10 border-secondary shadow-neon-cyan' : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                         }`}
                       >
                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'border-secondary bg-secondary text-black' : 'border-white/20'}`}>
                             {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-sm font-bold truncate flex-1">{project.projectTitle || (project as any).title || 'Unknown'}</span>
                       </div>
                    );
                 })}
              </div>
           )}
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
        <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">Cancel</button>
        <button type="submit" disabled={isSaving} className="futuristic-button px-10">
          <span className="relative z-10">{isSaving ? 'Processing...' : user ? 'Update Profile' : 'Initialize Profile'}</span>
          <div className="btn-glow" />
        </button>
      </div>
    </form>
  );
};
