// Types for Supabase Database Tables

export interface GlobalConfig {
  id: number;
  role: string;
  headline: string;
  about_me_content: string;
  cv_url: string | null;
  hero_bg_url: string | null;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  tech_stack: string[];
  repo_url: string | null;
  live_url: string | null;
  display_order: number;
  created_at: string;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  is_main: boolean;
  display_order: number;
}

export interface Education {
  id: number;
  institution: string;
  degree_or_course: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  certificate_url: string | null;
  display_order: number;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  display_order: number;
}

export interface ContactLink {
  id: number;
  platform: string;
  url: string;
  icon_name: string;
  display_order: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}
