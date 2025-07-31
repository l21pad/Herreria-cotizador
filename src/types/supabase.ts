export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          logo_url: string | null
          address: string
          state: string
          rfc: string
          phone: string
          email: string
          fiscal_regime: string | null
          cfdi_use: string | null
          payment_method: string | null
          is_pro: boolean
          pro_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          logo_url?: string | null
          address: string
          state: string
          rfc: string
          phone: string
          email: string
          fiscal_regime?: string | null
          cfdi_use?: string | null
          payment_method?: string | null
          is_pro?: boolean
          pro_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          logo_url?: string | null
          address?: string
          state?: string
          rfc?: string
          phone?: string
          email?: string
          fiscal_regime?: string | null
          cfdi_use?: string | null
          payment_method?: string | null
          is_pro?: boolean
          pro_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          profile_id: string
          name: string
          unit: string
          price: number
          stock: number | null
          min_stock: number | null
          category: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          unit: string
          price: number
          stock?: number | null
          min_stock?: number | null
          category?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          unit?: string
          price?: number
          stock?: number | null
          min_stock?: number | null
          category?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          profile_id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          rfc: string | null
          fiscal_regime: string | null
          cfdi_use: string | null
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          rfc?: string | null
          fiscal_regime?: string | null
          cfdi_use?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          rfc?: string | null
          fiscal_regime?: string | null
          cfdi_use?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          profile_id: string
          client_id: string
          quote_number: string
          status: string
          requires_invoice: boolean
          subtotal: number
          tax_amount: number
          total: number
          advance_payment: number
          remaining_payment: number
          discount_percentage: number
          discount_amount: number
          profit_percentage: number
          notes: string | null
          valid_until: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          client_id: string
          quote_number: string
          status?: string
          requires_invoice?: boolean
          subtotal: number
          tax_amount: number
          total: number
          advance_payment: number
          remaining_payment: number
          discount_percentage?: number
          discount_amount?: number
          profit_percentage?: number
          notes?: string | null
          valid_until: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          client_id?: string
          quote_number?: string
          status?: string
          requires_invoice?: boolean
          subtotal?: number
          tax_amount?: number
          total?: number
          advance_payment?: number
          remaining_payment?: number
          discount_percentage?: number
          discount_amount?: number
          profit_percentage?: number
          notes?: string | null
          valid_until?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          quote_id: string
          type: string
          description: string
          width: number | null
          height: number | null
          depth: number | null
          quantity: number
          labor_cost: number
          additional_costs: number
          notes: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          type: string
          description: string
          width?: number | null
          height?: number | null
          depth?: number | null
          quantity: number
          labor_cost: number
          additional_costs?: number
          notes?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          type?: string
          description?: string
          width?: number | null
          height?: number | null
          depth?: number | null
          quantity?: number
          labor_cost?: number
          additional_costs?: number
          notes?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_materials: {
        Row: {
          id: string
          job_id: string
          material_id: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          id?: string
          job_id: string
          material_id: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: {
          id?: string
          job_id?: string
          material_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
        }
      }
      gallery: {
        Row: {
          id: string
          profile_id: string
          title: string
          description: string | null
          category: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          description?: string | null
          category: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          description?: string | null
          category?: string
          image_url?: string
          created_at?: string
        }
      }
      collaborators: {
        Row: {
          id: string
          profile_id: string
          user_id: string | null
          invited_email: string
          status: string
          invited_at: string
          joined_at: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          user_id?: string | null
          invited_email: string
          status?: string
          invited_at?: string
          joined_at?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          user_id?: string | null
          invited_email?: string
          status?: string
          invited_at?: string
          joined_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
