import React, { useState, useEffect } from 'react';
import { TeamMembers as TeamType } from '@/entities';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface TeamFormProps {
  member?: TeamType | null;
  onSave: (data: Partial<TeamType>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const TeamForm = ({ member, onSave, onCancel, isSaving }: TeamFormProps) => {
  const [formData, setFormData] = useState<Partial<TeamType>>({
    fullName: member?.fullName || '',
    jobTitle: member?.jobTitle || '',
    profilePhoto: member?.profilePhoto || '',
    bio: member?.bio || '',
    linkedInUrl: member?.linkedInUrl || '',
    email: member?.email || '',
    displayOrder: member?.displayOrder || 0,
  });

  useEffect(() => {
    setFormData({
      fullName: member?.fullName || '',
      jobTitle: member?.jobTitle || '',
      profilePhoto: member?.profilePhoto || '',
      bio: member?.bio || '',
      linkedInUrl: member?.linkedInUrl || '',
      email: member?.email || '',
      displayOrder: member?.displayOrder || 0,
    });
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Operative Name</Label>
          <Input 
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            placeholder="e.g., Alex Chen"
            className="bg-white/[0.02] border-white/10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Designation (Role)</Label>
          <Input 
            value={formData.jobTitle}
            onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
            placeholder="e.g., Lead Neural Architect"
            className="bg-white/[0.02] border-white/10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Visual Identity (Image URL / Local Upload)</Label>
          <ImageUpload 
            value={formData.profilePhoto || ''}
            onChange={(url) => setFormData({...formData, profilePhoto: url})}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Display Index (Numbering Order)</Label>
          <Input 
            type="number"
            value={formData.displayOrder}
            onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
            placeholder="e.g., 1, 2, 3..."
            className="bg-white/[0.02] border-white/10 rounded-xl font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">LinkedIn Profile Link</Label>
          <Input 
            value={formData.linkedInUrl}
            onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})}
            placeholder="https://linkedin.com/in/..."
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Contact Signal (Email)</Label>
          <Input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="operative@vexor.tech"
            className="bg-white/[0.02] border-white/10 rounded-xl"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Bio Parameters</Label>
          <Textarea 
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            placeholder="Operative background and specialization..."
            className="bg-white/[0.02] border-white/10 rounded-xl min-h-[120px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
        <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">Cancel</button>
        <button type="submit" disabled={isSaving} className="futuristic-button px-10">
          <span className="relative z-10">{isSaving ? 'Processing...' : member ? 'Update Operative' : 'Initialize Operative'}</span>
          <div className="btn-glow" />
        </button>
      </div>
    </form>
  );
};
