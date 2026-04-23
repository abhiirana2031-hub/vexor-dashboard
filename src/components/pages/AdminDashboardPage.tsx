import { useState, useEffect } from 'react';
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
import { TransmissionPopup } from '@/components/admin/TransmissionPopup';
import { BaseCrudService } from '@/integrations';

// Original UI (Simplified for reuse or placeholders)
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, UserCircle, Activity, ShieldCheck, Zap } from 'lucide-react';

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
  const [dbProbeResult, setDbProbeResult] = useState<any>(null);
  const [isProbing, setIsProbing] = useState(false);
  const [showTransmissionSuccess, setShowTransmissionSuccess] = useState(false);

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  };

  const handleDbProbe = async () => {
    setIsProbing(true);
    try {
      const res = await fetch('/api/db-diagnostics');
      const data = await res.json();
      setDbProbeResult(data);
    } catch (err: any) {
      setDbProbeResult({ status: 'error', error: err.message });
    } finally {
      setIsProbing(false);
    }
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
    const finalId = idToUpdate || (savedItem as any)?._id;
    
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
      setShowTransmissionSuccess(true);
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
    
    // 1. Check Hardcoded Fallback Credentials First (Ensures access during DB sync issues)
    const FALLBACK_ADMIN_EMAIL = 'abhayrana8272@gmail.com';
    const FALLBACK_ADMIN_PASS = 'vexor@#005';

    if (adminLoginForm.email.trim() === FALLBACK_ADMIN_EMAIL && adminLoginForm.password.trim() === FALLBACK_ADMIN_PASS) {
      setIsAdminLoggedIn(true);
      setIsSaving(false);
      return;
    }

    try {
      // 2. Database Sync Attempt
      const res = await BaseCrudService.getAll<UserProfiles>('userprofiles');
      const usersList = res.items;
      
      let matchedUser = usersList.find(u => 
        u.email === adminLoginForm.email.trim() && 
        u.passwordHash === adminLoginForm.password.trim()
      );

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
    } catch (err: any) {
      console.error('Login sync error:', err);
      setLoginError(`Matrix synchronization failure: ${err.message || 'Unknown protocol error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#03050a] flex items-center justify-center p-4 overflow-hidden relative">
         <div className="absolute inset-0 cyber-grid opacity-10" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 blur-[150px] " />
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-md relative z-10"
         >
            <div className="glass-card p-12 space-y-10 border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                 <span className="text-[7px] font-mono tracking-widest uppercase">Build_ID: 2024-04-20_2225_STABLE</span>
               </div>

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
                     <span className="relative z-10">{isSaving ? 'UPLOADING PROTOCOLS...' : 'INITIALIZE ACCESS'}</span>
                     <div className="btn-glow" />
                  </button>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <details className="cursor-pointer group">
                      <summary className="text-[9px] uppercase font-bold tracking-[0.2em] text-foreground/20 group-hover:text-secondary/40 transition-colors list-none text-center">
                        Diagnostics Terminal
                      </summary>
                      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-[10px] font-mono leading-relaxed">
                        <div className="flex justify-between">
                          <span className="text-foreground/40">IDENT_PROBE:</span>
                          <span className={adminLoginForm.email.trim() === 'abhayrana8272@gmail.com' ? 'text-[#39FF14]' : 'text-destructive'}>
                            {adminLoginForm.email.trim() === 'abhayrana8272@gmail.com' ? 'TOKEN_MATCH' : 'MISMATCH'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/40">CRYPT_PROBE:</span>
                          <span className={adminLoginForm.password.trim() === 'vexor@#005' ? 'text-[#39FF14]' : 'text-destructive'}>
                            {adminLoginForm.password.trim() === 'vexor@#005' ? 'PASS_MATCH' : 'MISMATCH'}
                          </span>
                        </div>
                        <div className="pt-2 text-foreground/20 italic border-t border-white/5 uppercase text-[8px] tracking-widest text-center">
                          Build_Stamp: 2024-04-20_2225_STABLE
                        </div>
                      </div>
                    </details>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#03050a] relative overflow-hidden font-paragraph">
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-secondary/5 blur-[150px] pointer-events-none" />

      <div className="fixed inset-0 bg-background flex z-10 overflow-hidden">
        <aside className="w-80 flex-shrink-0 hidden lg:block z-40 relative border-r border-white/5">
          <Sidebar onSetActiveTab={setActiveTab} activeTab={activeTab} />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
          <Topbar member={member} onToggleSidebar={() => setIsMobileMenuOpen(true)} />

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-8 relative custom-scrollbar">
            <div className="relative z-10 mx-auto w-full lg:max-w-[80vw] animate-in fade-in zoom-in-95 duration-500">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-96 flex flex-col items-center justify-center gap-8"
                  >
                     <LoadingSpinner />
                     <div className="text-center space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">Syncing Matrix Streams...</p>
                       <button 
                         onClick={handleDbProbe}
                         disabled={isProbing}
                         className="px-6 py-2 rounded-full border border-white/5 text-[8px] font-black uppercase tracking-widest text-foreground/20 hover:text-secondary hover:border-secondary transition-all"
                       >
                         {isProbing ? 'Probing...' : 'Probe Neural Database'}
                       </button>
                     </div>

                     {dbProbeResult && (
                       <div className="max-w-md w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-[9px] font-mono leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex justify-between border-b border-white/5 pb-2 mb-4">
                            <span className="text-secondary uppercase">System Probe Result</span>
                            <button onClick={() => setDbProbeResult(null)} className="text-foreground/20 hover:text-white">Close</button>
                          </div>
                          
                          <div className="space-y-4 mb-4">
                             <div>
                               <label className="text-foreground/20 uppercase block">Database_Status</label>
                               <span className={dbProbeResult.status === 'connected' ? 'text-secondary' : 'text-destructive'}>
                                 {dbProbeResult.status?.toUpperCase()}
                               </span>
                             </div>
                             <div>
                               <label className="text-foreground/20 uppercase block">Active_Node</label>
                               <span className="text-foreground/60">{dbProbeResult.activeDatabase || 'UNKNOWN'}</span>
                             </div>
                             <div>
                               <label className="text-foreground/20 uppercase block">Connection_String (Masked)</label>
                               <span className="text-foreground/40 break-all">{dbProbeResult.config?.uri_masked || 'NOT_FOUND'}</span>
                             </div>
                          </div>

                          <pre className="text-foreground/60 whitespace-pre-wrap bg-white/5 p-4 rounded-xl border border-white/5 max-h-40 overflow-y-auto custom-scrollbar uppercase">
                            {JSON.stringify(dbProbeResult.collectionsFound || dbProbeResult.error, null, 2)}
                          </pre>
                          
                          {dbProbeResult.status === 'error' && (
                             <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl space-y-2">
                                <p className="font-black">CRITICAL Handshake Failure</p>
                                <p className="text-[7px]">Possible Cause: MongoDB Atlas Firewall is blocking Vercel. Log in to Atlas, go to "Network Access" and add IP "0.0.0.0/0".</p>
                             </div>
                          )}

                          {dbProbeResult.status === 'connected' && (!dbProbeResult.collectionsFound || dbProbeResult.collectionsFound.length === 0) && (
                            <div className="mt-4 p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl space-y-2">
                              <p className="font-black">WARNING: NODE_EMPTY</p>
                              <p className="text-[7px]">Connected to cluster but database "{dbProbeResult.activeDatabase}" has 0 documents. Check your MONGODB_DB in Vercel settings.</p>
                            </div>
                          )}
                       </div>
                     )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* CRITICAL FIX: Changed siteStats={siteStats} to stats={siteStats} to match StatsOverview component signature */}
                    {activeTab === 'stats' && <StatsOverview stats={siteStats} />}
                    
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

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

      <CommandPopup 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(p => ({ ...p, isOpen: false }))}
      />

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
      <TransmissionPopup 
        isOpen={showTransmissionSuccess} 
        onClose={() => setShowTransmissionSuccess(false)} 
      />
    </div>
  );
}
