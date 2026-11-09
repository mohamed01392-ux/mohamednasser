export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "agent" | "admin";
export type PropertyStatus = "pending" | "published" | "rejected" | "archived";
export type PropertyPurpose = "sale" | "rent";
export type PropertyType =
  | "apartment"
  | "villa"
  | "duplex"
  | "townhouse"
  | "penthouse"
  | "chalet"
  | "studio"
  | "commercial"
  | "land";

export type FinishingType =
  | "core_and_shell"
  | "semi_finished"
  | "finished"
  | "super_lux"
  | "ultra_super_lux"
  | "furnished";

export type InquiryType = "inquiry" | "viewing" | "contact";
export type InquiryStatus = "new" | "contacted" | "closed";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  purpose: PropertyPurpose;
  property_type: PropertyType;
  governorate: string;
  district: string;
  compound: string | null;
  address: string | null;
  area: number;
  bedrooms: number;
  bathrooms: number;
  finishing: FinishingType;
  featured: boolean;
  amenities: string[];
  status: PropertyStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
  profiles?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  property?: Property;
}

export interface Inquiry {
  id: string;
  property_id: string | null;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  type: InquiryType;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
  property?: Property;
}
