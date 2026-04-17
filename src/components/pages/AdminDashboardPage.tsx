import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '@/hooks/useAdminData';

// Modular UI Components
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';
import { StatsOverview } from '@/components/admin/StatsOverview';

// Tab View Modules
import { ProjectManager } from '@/components/admin/TabViews/ProjectManager';
import { ProjectForm } from '@/components/admin/Dialogs/ProjectForm';
import { ServiceManager } from '@/components/admin/TabViews/ServiceManager';
import { ServiceForm } from '@/components/admin/Dialogs/ServiceForm';
import { BlogManager } from '@/components/admin/TabViews/BlogManager';
import { BlogForm } from '@/components/admin/Dialogs/BlogForm';
import { EnquiryManager } from '@/components/admin/TabViews/EnquiryManager';
import { TeamManager } from '@/components/admin/TabViews/TeamManager';
import { TeamForm } from '@/components/admin/Dialogs/TeamForm';
import { UserManager } from '@/components/admin/TabViews/UserManager';
import { UserForm } from '@/components/admin/Dialogs/UserForm';
import { TestimonialManager } from '@/components/admin/TabViews/TestimonialManager';
import { TestimonialForm } from '@/components/admin/Dialogs/TestimonialForm';
import { BaseCrudService } from '@/integrations';

// Original UI (Simplified for reuse or placeholders)
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    isAdmin,
    setIsAdminLoggedIn,
    isLoading,
    projects,
    services,
    teamMembers,
    testimonials,
    blogs,
    users,
    enquiries,
    siteStats,
    deleteItem,
    saveItem,
    refreshData,
    member
  } = useAdminData();

  const [activeTab, setActiveTab] = useState('stats');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any, assignedProjectIds?: string[]) => {
    setIsSaving(true);
    let idToUpdate = selectedItem?._id;
    
    // Save the primary item
    const success = await saveItem(activeTab, data, idToUpdate);
    
    // Cross-Collection logic for Neural Profiles mapping to Projects
    if (success && activeTab === 'users' && assignedProjectIds) {
       // We must update the `userId` field on every project.
       // Note: In a production app with thousands of projects, this should be done via a custom backend API.
       // Since this is a CMS, we update the matched projects.
       try {
           const allProjs = await BaseCrudService.getAll<any>('projects');
           for (const proj of allProjs.items) {
               const shouldOwn = assignedProjectIds.includes(proj._id);
               const currentlyOwns = proj.userId === idToUpdate;
               
               if (shouldOwn && !currentlyOwns) {
                   await BaseCrudService.update('projects', proj._id, { ...proj, userId: idToUpdate });
               } else if (!shouldOwn && currentlyOwns) {
                   await BaseCrudService.update('projects', proj._id, { ...proj, userId: null });
               }
           }
       } catch (err) {
           console.error('Failed to sync project assignments', err);
       }
    }
    
    if (success) {
      setIsDialogOpen(false);
      setSelectedItem(null);
    }
    setIsSaving(false);
  };

  // Handle Admin Login (Mocked logic from original file)
  const handleAdminLogin = () => {
    const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL || 'abhayrana8272@gmail.com';
    const ADMIN_PASSWORD = import.meta.env.PUBLIC_ADMIN_PASSWORD || 'vexor@#005';
    
    if (adminLoginForm.email === ADMIN_EMAIL && adminLoginForm.password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
    } else {
      setLoginError('Invalid transmission credentials.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#03050a] flex items-center justify-center p-4 overflow-hidden relative">
         {/* Cyber Ambience */}
         <div className="absolute inset-0 cyber-grid opacity-10" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 blur-[150px] " />
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-md relative z-10"
         >
           <div className="glass-card p-12 space-y-10 border-white/5">
              <div className="text-center space-y-4">
                 <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-6">
                    <div className="w-4 h-4 bg-secondary shadow-neon-cyan animate-pulse" />
                 </div>
                 <h1 className="font-heading text-4xl font-black text-foreground tracking-tighter uppercase">Root_Access</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">Secure Signal Verification Required</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Identity</label>
                    <input 
                      type="email" 
                      placeholder="Admin Email"
                      value={adminLoginForm.email}
                      onChange={(e) => setAdminLoginForm({...adminLoginForm, email: e.target.value})}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 focus:border-secondary/40 outline-none transition-all text-sm font-medium"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 pl-4 border-l border-secondary">Encryption Key</label>
                    <input 
                      type="password" 
                      placeholder="Admin Password"
                      value={adminLoginForm.password}
                      onChange={(e) => setAdminLoginForm({...adminLoginForm, password: e.target.value})}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 focus:border-secondary/40 outline-none transition-all text-sm font-medium"
                    />
                 </div>
                 {loginError && <p className="text-[10px] text-destructive font-black uppercase tracking-widest text-center">{loginError}</p>}
                 
                 <button 
                   onClick={handleAdminLogin}
                   className="futuristic-button w-full py-5"
                 >
                    <span className="relative z-10">INITIALIZE ACCESS</span>
                    <div className="btn-glow" />
                 </button>
              </div>
           </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#03050a] text-foreground selection:bg-secondary/30 overflow-hidden font-paragraph">
      {/* LEFT SIDEBAR - Desktop */}
      <aside className="w-80 flex-shrink-0 hidden lg:block z-40 relative">
        <Sidebar onSetActiveTab={setActiveTab} activeTab={activeTab} />
      </aside>

      {/* LEFT SIDEBAR - Mobile (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
            />
            <motion.aside 
               initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden border-r border-white/5 bg-[#03050a]"
            >
               <Sidebar onSetActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} activeTab={activeTab} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full w-full">
        {/* TOPBAR */}
        <Topbar member={member} onToggleSidebar={() => setIsMobileMenuOpen(true)} />

        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-12 pb-24">
            
            {/* View Orchestrator */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-96 flex items-center justify-center"
                >
                   <div className="flex flex-col items-center gap-6">
                      <LoadingSpinner />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">Syncing Matrix Streams...</p>
                   </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeTab === 'stats' && <StatsOverview stats={{ 
                    projects: projects.length, 
                    users: users.length, 
                    enquiries: enquiries.length,
                    blogs: blogs.length
                  }} />}

                  {activeTab === 'projects' && (
                    <ProjectManager 
                      projects={projects} 
                      onAddNew={handleAddNew}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'projects')}
                    />
                  )}

                  {activeTab === 'services' && (
                    <ServiceManager 
                      services={services} 
                      onAddNew={() => setIsDialogOpen(true)}
                      onEdit={() => setIsDialogOpen(true)}
                      onDelete={(id) => deleteItem(id, 'services')}
                    />
                  )}

                  {activeTab === 'blogs' && (
                    <BlogManager 
                      blogs={blogs} 
                      onAddNew={() => setIsDialogOpen(true)}
                      onEdit={() => setIsDialogOpen(true)}
                      onDelete={(id) => deleteItem(id, 'blogs')}
                    />
                  )}

                  {activeTab === 'enquiries' && (
                    <EnquiryManager 
                      enquiries={enquiries} 
                      onDelete={(id) => deleteItem(id, 'enquiries')}
                      onUpdateEnquiry={(id, updates) => {
                         const enquiry = enquiries.find(e => e._id === id);
                         if (enquiry) saveItem('enquiries', { ...enquiry, ...updates }, id);
                      }}
                    />
                  )}

                  {activeTab === 'team' && (
                    <TeamManager 
                      team={teamMembers} 
                      onAddNew={handleAddNew}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'teammembers')}
                    />
                  )}

                  {activeTab === 'users' && (
                    <UserManager 
                      users={users} 
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'userprofiles')}
                    />
                  )}

                  {activeTab === 'testimonials' && (
                    <TestimonialManager 
                      testimonials={testimonials} 
                      onAddNew={handleAddNew}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteItem(id, 'testimonials')}
                    />
                  )}

                  {/* Placeholder for other tabs */}
                  {!['stats', 'projects', 'services', 'blogs', 'enquiries', 'team', 'users', 'testimonials'].includes(activeTab) && (
                    <div className="glass-card p-20 text-center opacity-20 font-black uppercase tracking-[0.5em] text-xs">
                       View Node: {activeTab.toUpperCase()} Offline
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Floating Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 blur-[150px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] -z-10 rounded-full" />
      </main>

      {/* CRUD DIALOG PLACEHOLDER */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSelectedItem(null);
      }}>
        <DialogContent className="glass-card border-white/5 bg-[#05070d]/90 w-[95vw] md:w-full md:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase">
              {selectedItem ? 'Update Node' : 'Initialize Node'}
            </DialogTitle>
          </DialogHeader>
          
          {activeTab === 'projects' && (
             <ProjectForm project={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'services' && (
             <ServiceForm service={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'blogs' && (
             <BlogForm blog={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'team' && (
             <TeamForm member={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'users' && (
             <UserForm user={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {activeTab === 'testimonials' && (
             <TestimonialForm testimonial={selectedItem} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
          {!['projects', 'services', 'blogs', 'team', 'users', 'testimonials'].includes(activeTab) && (
            <div className="py-12 text-center space-y-6">
               <LoadingSpinner />
               <p className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">
                  CRUD Interface Modularization for {activeTab.toUpperCase()} in Progress...
               </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
