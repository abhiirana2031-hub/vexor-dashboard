import { useState, useEffect } from 'react';
import { BaseCrudService, useMember } from '@/integrations';
import { Projects, Services, TeamMembers, Testimonials, Blogs, UserProfiles, AuditLogs } from '@/entities';
import emailjs from '@emailjs/browser';

/**
 * Custom hook for Admin Dashboard data management.
 * Centralizes all CRUD logic and state.
 */
export const useAdminData = () => {
  const { member, isAuthenticated } = useMember();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeAdminUser, setActiveAdminUser] = useState<UserProfiles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [projects, setProjects] = useState<Projects[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [users, setUsers] = useState<UserProfiles[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogs[]>([]);
  const [siteStats, setSiteStats] = useState<any>({});

  const isAdmin = isAdminLoggedIn || (isAuthenticated && member?.profile?.nickname === 'admin') || (activeAdminUser?.role === 'admin');

  useEffect(() => {
    if (isAdmin) loadAllData();
  }, [isAdmin]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        pRes, 
        sRes, 
        tRes, 
        testRes, 
        eRes, 
        statRes, 
        bRes, 
        uRes, 
        aRes
      ] = await Promise.all([
        BaseCrudService.getAll<Projects>('projects').catch(() => ({ items: [] })),
        BaseCrudService.getAll<Services>('services').catch(() => ({ items: [] })),
        BaseCrudService.getAll<TeamMembers>('teammembers').catch(() => ({ items: [] })),
        BaseCrudService.getAll<Testimonials>('testimonials').catch(() => ({ items: [] })),
        BaseCrudService.getAll<any>('enquiries').catch(() => ({ items: [] })),
        fetch('/api/sitestats').then(r => r.json()).catch(() => ({})),
        BaseCrudService.getAll<Blogs>('blogs').catch(() => ({ items: [] })),
        BaseCrudService.getAll<UserProfiles>('userprofiles').catch(() => ({ items: [] })),
        BaseCrudService.getAll<AuditLogs>('auditlogs').catch(() => ({ items: [] }))
      ]);

      setProjects(pRes.items || []);
      setServices(sRes.items || []);
      setTeamMembers(tRes.items || []);
      setTestimonials(testRes.items || []);
      setEnquiries(eRes.items || []);
      setBlogs(bRes.items || []);
      setUsers(uRes.items || []);
      setAuditLogs(aRes?.items || []);
      setSiteStats(statRes);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAuditLog = async (action: 'CREATE' | 'UPDATE' | 'DELETE', collectionId: string, itemId: string, description: string) => {
    try {
      const actorName = activeAdminUser?.fullName || 'Root Admin';
      const actorId = activeAdminUser?._id || 'root-admin';
      
      const log: AuditLogs = {
        actorId,
        actorName,
        action,
        collectionId,
        itemId,
        description,
        timestamp: new Date()
      };
      await BaseCrudService.create('auditlogs', log);
    } catch (err) {
      console.error('Audit log failed:', err);
    }
  };

  const deleteItem = async (id: string, collectionId: string) => {
    try {
      await BaseCrudService.delete(collectionId, id);
      await createAuditLog('DELETE', collectionId, id, `Terminated record: ${id}`);
      // Optimistic update
      if (collectionId === 'projects') setProjects(p => p.filter(i => i._id !== id));
      if (collectionId === 'services') setServices(p => p.filter(i => i._id !== id));
      if (collectionId === 'blogs') setBlogs(p => p.filter(i => i._id !== id));
      if (collectionId === 'userprofiles') setUsers(p => p.filter(i => i._id !== id));
      if (collectionId === 'testimonials') setTestimonials(p => p.filter(i => i._id !== id));
      if (collectionId === 'teammembers') setTeamMembers(p => p.filter(i => i._id !== id));
      return true;
    } catch (err) {
      console.error('Delete failed:', err);
      return false;
    }
  };

  const refreshData = () => loadAllData();

  const saveItem = async (collectionId: string, data: any, id?: string) => {
    setIsLoading(true);
    try {
      const savedResult = id 
        ? await BaseCrudService.update(collectionId, { ...data, _id: id })
        : await BaseCrudService.create<any>(collectionId, data);
      
      createAuditLog(
        id ? 'UPDATE' : 'CREATE', 
        collectionId, 
        id || (savedResult as any)?._id, 
        `${id ? 'Updated' : 'Created'} entity in ${collectionId}`
      );
      
      // Clear loading immediately so UI resolves
      setIsLoading(false);
      
      // Perform background refresh without blocking the return
      loadAllData();
      return savedResult;
    } catch (err) {
      console.error('Save failed:', err);
      setIsLoading(false);
      return null;
    }
  };

  return {
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
  };
};
