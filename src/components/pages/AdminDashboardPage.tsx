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
import { ScannerView } from '@/components/admin/TabViews/ScannerView';
import { ActivityLogManager } from '@/components/admin/TabViews/ActivityLogManager';
import { CommandPopup } from '@/components/admin/Dialogs/CommandPopup';
import { BaseCrudService } from '@/integrations';

// Original UI (Simplified for reuse or placeholders)
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
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
    auditLogs,
    enquiries,
    siteStats,
    deleteItem,
    saveItem,
    refreshData,
    member,
    setActiveAdminUser
  } = useAdminData();

  const [activeTab, setActiveTab] = useState('stats');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

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
    const collectionMap: Record<string, string> = {
      'users': 'userprofiles',
      'team': 'teammembers',
    };
    const collectionId = collectionMap[activeTab] || activeTab;

    const savedItem = await saveItem(collectionId, data, idToUpdate);
    const success = !!savedItem;
    // Handle the fact that saveItem might return the item directly or a result object
    const finalId = idToUpdate || (savedItem as any)?._id;
    
    // Cross-Collection logic for Neural Profiles mapping to Projects
    if (success && activeTab === 'users' && assignedProjectIds && finalId) {
       try {
           const allProjs = await BaseCrudService.getAll<any>('projects');
           for (const proj of allProjs.items) {
               const shouldOwn = assignedProjectIds.includes(proj._id);
               const currentlyOwns = proj.userId === finalId;
               
               if (shouldOwn && !currentlyOwns) {
                   await BaseCrudService.update('projects', { ...proj, userId: finalId });
               } else if (!shouldOwn && currentlyOwns) {
                   await BaseCrudService.update('projects', { ...proj, userId: null });
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

  const handleDelete = (id: string, collectionId: string, label: string) => {
     confirmAction(
        `Confirm Deletion: ${label}`,
        `Are you certain you wish to purge this entity from the neural matrix? This action is irreversible.`,
        () => {
           deleteItem(id, collectionId);
           setConfirmDialog(p => ({ ...p, isOpen: false }));
        }
     );
  };

  // Handle Admin Login (RBAC Logic)
  const handleAdminLogin = async () => {
    setIsSaving(true);
    setLoginError('');
    try {
      // Since we can't query by email directly, we fetch all users and find the match
      // Note: In a production app, this should be handled by a dedicated auth endpoint
      const res = await BaseCrudService.getAll<UserProfiles>('userprofiles');
      const usersList = res.items;
      
      let matchedUser = usersList.find(u => 
        u.email === adminLoginForm.email && 
        u.passwordHash === adminLoginForm.password
      );

      // FALLBACK: If no database user found, check hardcoded credentials for initial setup
      const FALLBACK_ADMIN_EMAIL = 'abhayrana8272@gmail.com';
      const FALLBACK_ADMIN_PASS = 'vexor@#005';

      if (!matchedUser && adminLoginForm.email === FALLBACK_ADMIN_EMAIL && adminLoginForm.password === FALLBACK_ADMIN_PASS) {
        setIsAdminLoggedIn(true);
        return;
      }

      if (!matchedUser) {
        setLoginError('Neural handshake failed: Invalid credentials.');
        setIsSaving(false);
        return;
      }

      if (matchedUser.role !== 'admin') {
        setLoginError('Access Denied: Insufficient clearance level.');
        setIsSaving(false);
        return;
      }

      // Success
      setActiveAdminUser(matchedUser);
      setIsAdminLoggedIn(true);
    } catch (err) {
      setLoginError('Matrix synchronization failure. Please try again.');
    } finally {
      setIsSaving(false);
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
                 <div className="w-24 h-24 rounded-3xl bg-black/40 border border-secondary/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <img src="/vexor-logo.png" alt="Vexor Logo" className="w-16 h-16 object-contain" />
                 </div>
                 <h1 className="font-heading text-4xl font-black text-foreground tracking-tighter uppercase italic">Neural_Access</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Secure Command Uplink Required</p>
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
    <div className="h-screen w-screen bg-[#03050a] flex items-center justify-center relative overflow-hidden font-paragraph">
      {/* Global Background Elements */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-secondary/5 blur-[150px] pointer-events-none" />

      {/* FULL SCREEN DASHBOARD CONTAINER */}
      <div className="w-full h-full bg-background flex relative z-10 overflow-hidden">
        
        {/* LEFT SIDEBAR - Desktop */}
        <aside className="w-80 flex-shrink-0 hidden lg:block z-40 relative border-r border-white/5">
          <Sidebar onSetActiveTab={setActiveTab} activeTab={activeTab} />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
          {/* TOPBAR */}
          <Topbar member={member} onToggleSidebar={() => setIsMobileMenuOpen(true)} />

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-8 relative custom-scrollbar">
            <div className="relative z-10 mx-auto w-full max-w-[85%] animate-in fade-in zoom-in-95 duration-500">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-96 flex flex-col items-center justify-center gap-6"
                  >
                     <LoadingSpinner />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">Syncing Matrix Streams...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'stats' && <StatsOverview siteStats={siteStats} />}
                    
                    {activeTab === 'projects' && (
                      <ProjectManager 
                        projects={projects} 
                        onAddNew={() => handleAddNew()}
                        onEdit={handleEdit}
                        onDelete={(id) => handleDelete(id, 'projects', 'Operational Project')}
                      />
                    )}

                    {activeTab === 'services' && (
                      <ServiceManager 
                        services={services}
                        onAddNew={() => handleAddNew()}
                        onEdit={handleEdit}
                        onDelete={(id) => handleDelete(id, 'services', 'Core Service')}
                      />
                    )}

                    {activeTab === 'blogs' && (
                      <BlogManager 
                        blogs={blogs}
                        onAddNew={() => handleAddNew()}
                        onEdit={handleEdit}
                        onDelete={(id) => handleDelete(id, 'blogs', 'Data Log Entry')}
                      />
                    )}

                    {activeTab === 'users' && (
                      <UserManager 
                        users={users}
                        onAddNew={() => handleAddNew()}
                        onEdit={handleEdit}
                        onDelete={(id) => handleDelete(id, 'userprofiles', 'Neural Profile')}
                      />
                    )}

                    {activeTab === 'team' && (
                      <TeamManager 
                        team={teamMembers}
                        onAddNew={() => handleAddNew()}
                        onEdit={handleEdit}
                        onDelete={(id) => handleDelete(id, 'teammembers', 'Squad Operative')}
                      />
                    )}

                    {activeTab === 'testimonials' && (
                      <TestimonialManager 
                        testimonials={testimonials}
                        onAddNew={() => handleAddNew()}
                        onEdit={handleEdit}
                        onDelete={(id) => handleDelete(id, 'testimonials', 'Client Feedback')}
                      />
                    )}

                    {activeTab === 'enquiries' && (
                      <EnquiryManager enquiries={enquiries} />
                    )}

                    {activeTab === 'scanner' && (
                      <ScannerView />
                    )}

                    {activeTab === 'auditlogs' && (
                      <ActivityLogManager logs={auditLogs} />
                    )}

                    {!['stats', 'projects', 'services', 'blogs', 'enquiries', 'team', 'users', 'testimonials', 'scanner', 'auditlogs'].includes(activeTab) && (
                      <div className="glass-card p-20 text-center opacity-20 font-black uppercase tracking-[0.5em] text-xs">
                         View Node: {activeTab.toUpperCase()} Offline
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden" 
            />
            <motion.aside 
               initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-y-0 left-0 w-80 z-[101] lg:hidden border-r border-white/5 bg-[#03050a]"
            >
               <Sidebar onSetActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} activeTab={activeTab} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* NEURAL COMMAND POPUP (CUSTOM UI) */}
      <CommandPopup 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(p => ({ ...p, isOpen: false }))}
      />

      {/* CRUD DIALOGS */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl glass-card bg-[#03050a]/90 backdrop-blur-2xl border-white/5 max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-foreground tracking-tighter uppercase mb-4 italic">
              {selectedItem ? `Update_Node: ${activeTab.toUpperCase()}` : `Initialize_New_Node: ${activeTab.toUpperCase()}`}
            </DialogTitle>
          </DialogHeader>
          
          {activeTab === 'projects' && (
             <ProjectForm project={selectedItem} onSave={(data) => handleSave(data)} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}

          {activeTab === 'services' && (
             <ServiceForm service={selectedItem} onSave={(data) => handleSave(data)} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}

          {activeTab === 'blogs' && (
             <BlogForm blog={selectedItem} onSave={(data) => handleSave(data)} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}

          {activeTab === 'users' && (
             <UserForm user={selectedItem} onSave={(data, pids) => handleSave(data, pids)} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}

          {activeTab === 'team' && (
             <TeamForm member={selectedItem} onSave={(data) => handleSave(data)} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}

          {activeTab === 'testimonials' && (
             <TestimonialForm testimonial={selectedItem} onSave={(data) => handleSave(data)} onCancel={() => setIsDialogOpen(false)} isSaving={isSaving} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
