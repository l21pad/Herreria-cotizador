export interface User {
  id: string;
  email: string;
  role: 'admin' | 'collaborator';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  business_name: string;
  logo_url?: string;
  address: string;
  state: string;
  rfc: string;
  phone: string;
  email: string;
  fiscal_regime?: string;
  cfdi_use?: string;
  payment_method?: string;
  is_pro: boolean;
  pro_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  profile_id: string;
  name: string;
  unit: string;
  price: number;
  stock?: number;
  min_stock?: number;
  category?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  profile_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  rfc?: string;
  fiscal_regime?: string;
  cfdi_use?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  profile_id: string;
  client_id: string;
  quote_number: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  requires_invoice: boolean;
  subtotal: number;
  tax_amount: number;
  total: number;
  advance_payment: number;
  remaining_payment: number;
  discount_percentage: number;
  discount_amount: number;
  profit_percentage: number;
  notes?: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  jobs?: Job[];
}

export interface Job {
  id: string;
  quote_id: string;
  type: string;
  description: string;
  width?: number;
  height?: number;
  depth?: number;
  quantity: number;
  labor_cost: number;
  additional_costs: number;
  notes?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  job_materials?: JobMaterial[];
}

export interface JobMaterial {
  id: string;
  job_id: string;
  material_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  material?: Material;
}

export interface Gallery {
  id: string;
  profile_id: string;
  title: string;
  description?: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface Report {
  period: string;
  total_quotes: number;
  total_sales: number;
  total_profit: number;
  most_used_materials: Array<{
    material_name: string;
    quantity_used: number;
  }>;
  top_clients: Array<{
    client_name: string;
    total_spent: number;
  }>;
}

export interface Collaborator {
  id: string;
  profile_id: string;
  user_id: string;
  invited_email: string;
  status: 'pending' | 'active' | 'inactive';
  invited_at: string;
  joined_at?: string;
  user?: User;
}

// Estados de México
export const MEXICAN_STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Coahuila',
  'Colima',
  'Ciudad de México',
  'Durango',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'México',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas'
] as const;

export type MexicanState = typeof MEXICAN_STATES[number];

// Categorías de trabajos
export const JOB_CATEGORIES = [
  'Puertas',
  'Ventanas',
  'Rejas',
  'Portones',
  'Escaleras',
  'Barandales',
  'Estructuras',
  'Otros'
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];

// Categorías de galería
export const GALLERY_CATEGORIES = [
  'Puertas',
  'Ventanas',
  'Rejas',
  'Portones',
  'Escaleras',
  'Barandales',
  'Estructuras',
  'Decorativo',
  'Otros'
] as const;

export type GalleryCategory = typeof GALLERY_CATEGORIES[number];
