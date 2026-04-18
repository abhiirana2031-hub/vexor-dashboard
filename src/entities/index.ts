/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: projects
 * Interface for Projects
 */
export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectTitle?: string;
  /** @wixFieldType text */
  projectDescription?: string;
  /** @wixFieldType text */
  technologiesUsed?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  projectImage?: string;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType url */
  projectUrl?: string;
  /** @wixFieldType url */
  repoUrl?: string;
  /** @wixFieldType date */
  completionDate?: Date | string;
  /** @wixFieldType text - User ID of the project creator */
  userId?: string;
  /** @wixFieldType text - Project status: active, completed, on-hold, etc */
  projectStatus?: string;
}


/**
 * Collection ID: services
 * Interface for Services
 */
export interface Services {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  serviceName?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType text */
  detailedDescription?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  serviceImage?: string;
  /** @wixFieldType text */
  slug?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
}


/**
 * Collection ID: blogs
 * Interface for Blog Posts
 */
export interface Blogs {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  slug?: string;
  /** @wixFieldType text */
  excerpt?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  featuredImage?: string;
  /** @wixFieldType text */
  author?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  tags?: string;
  /** @wixFieldType date */
  publishDate?: Date | string;
  /** @wixFieldType boolean */
  isPublished?: boolean;
  /** @wixFieldType number */
  views?: number;
}


/**
 * Collection ID: userprofiles
 * Interface for User Profiles
 */
export interface UserProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType phone */
  phoneNumber?: string;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType password */
  passwordHash?: string;
  /** @wixFieldType text */
  bio?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePhoto?: string;
  /** @wixFieldType text */
  company?: string;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType url */
  websiteUrl?: string;
  /** @wixFieldType boolean */
  isVerified?: boolean;
  /** @wixFieldType text - Login method: email, phone, google */
  loginMethod?: string;
  /** @wixFieldType text - User role: admin, user */
  role?: 'admin' | 'user';
  /** @wixFieldType boolean */
  isAdmin?: boolean;
}


/**
 * Collection ID: userTestimonials
 * Interface for User-Submitted Testimonials
 */
export interface UserTestimonials {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userId?: string;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType text */
  reviewText?: string;
  /** @wixFieldType text */
  clientRoleCompany?: string;
  /** @wixFieldType number */
  rating?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  clientImage?: string;
  /** @wixFieldType boolean */
  isApproved?: boolean;
  /** @wixFieldType date */
  dateSubmitted?: Date | string;
}


/**
 * Collection ID: teammembers
 * Interface for TeamMembers
 */
export interface TeamMembers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType text */
  bio?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePhoto?: string;
  /** @wixFieldType url */
  linkedInUrl?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType date */
  joiningDate?: Date | string;
  /** @wixFieldType number */
  displayOrder?: number;
}


/**
 * Collection ID: testimonials
 * Interface for Testimonials
 */
export interface Testimonials {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType text */
  reviewText?: string;
  /** @wixFieldType text */
  clientRoleCompany?: string;
  /** @wixFieldType number */
  rating?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  clientImage?: string;
  /** @wixFieldType date */
  datePosted?: Date | string;
}

/**
 * Collection ID: auditlogs
 * Interface for Audit Logs
 */
export interface AuditLogs {
  _id?: string;
  _createdDate?: Date;
  /** @wixFieldType text - User ID or Email of the performer */
  actorId: string;
  /** @wixFieldType text - Full Name of the performer */
  actorName: string;
  /** @wixFieldType text - Action: CREATE, UPDATE, DELETE */
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  /** @wixFieldType text - Collection ID affected */
  collectionId: string;
  /** @wixFieldType text - ID of the item affected */
  itemId: string;
  /** @wixFieldType text - Short description of the change */
  description: string;
  /** @wixFieldType date */
  timestamp: Date | string;
}
