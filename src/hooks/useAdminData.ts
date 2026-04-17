import { useState, useEffect } from 'react';
import { BaseCrudService, useMember } from '@/integrations';
import { Projects, Services, TeamMembers, Testimonials, Blogs, UserProfiles } from '@/entities';
import emailjs from '@emailjs/browser';

/**
 * Custom hook for Admin Dashboard data management.
 * Centralizes all CRUD logic and state.
 */
export const useAdminData = () => {
  const { member, isAuthenticated } = useMember();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [projects, setProjects] = useState<Projects[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [users, setUsers] = useState<UserProfiles[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [siteStats, setSiteStats] = useState<any>({});

  const isAdmin = isAdminLoggedIn || (isAuthenticated && member?.profile?.nickname === 'admin');

  useEffect(() => {
    if (isAdmin) loadAllData();
  }, [isAdmin]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [pRes, sRes, tRes, testRes, eRes, statRes, bRes, uRes] = await Promise.all([
        BaseCrudService.getAll<Projects>('projects'),
        BaseCrudService.getAll<Services>('services'),
        BaseCrudService.getAll<TeamMembers>('teammembers'),
        BaseCrudService.getAll<Testimonials>('testimonials'),
        BaseCrudService.getAll<any>('enquiries').catch(() => ({ items: [] })),
        fetch('/api/sitestats').then(r => r.json()).catch(() => ({})),
        BaseCrudService.getAll<Blogs>('blogs').catch(() => ({ items: [] })),
        BaseCrudService.getAll<UserProfiles>('userprofiles').catch(() => ({ items: [] }))
      ]);

      setProjects(pRes.items);
      setServices(sRes.items);
      setTeamMembers(tRes.items);
      setTestimonials(testRes.items);
      setEnquiries(eRes.items || []);
      setBlogs(bRes.items || []);
      setUsers(uRes.items || []);
      setSiteStats(statRes);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string, collectionId: string) => {
    try {
      await BaseCrudService.delete(collectionId, id);
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
      if (id) {
        // Ensure the ID is part of the data object for the service
        await BaseCrudService.update(collectionId, { ...data, _id: id });
      } else {
        await BaseCrudService.create(collectionId, data);
      }
      await loadAllData();
      return true;
    } catch (err) {
      console.error('Save failed:', err);
      return false;
    } finally {
      setIsLoading(false);
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
    enquiries,
    siteStats,
    deleteItem,
    saveItem,
    refreshData,
    member
  };
};
