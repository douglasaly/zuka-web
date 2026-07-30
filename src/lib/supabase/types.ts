export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string
          deleted_at: string | null
          id: string
          is_default: boolean
          label: string | null
          latitude: number | null
          longitude: number | null
          neighborhood: string | null
          phone: string
          postal_code: string | null
          province: string
          recipient_name: string
          reference_point: string | null
          street: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          phone: string
          postal_code?: string | null
          province: string
          recipient_name: string
          reference_point?: string | null
          street?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          phone?: string
          postal_code?: string | null
          province?: string
          recipient_name?: string
          reference_point?: string | null
          street?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          parent_id: string | null
          position: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id: string
          name: string
          parent_id?: string | null
          position?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          position?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          last_message_at: string | null
          last_message_id: string | null
          product_id: string | null
          store_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id: string
          last_message_at?: string | null
          last_message_id?: string | null
          product_id?: string | null
          store_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_id?: string | null
          product_id?: string | null
          store_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      message_products: {
        Row: {
          id: string
          message_id: string
          product_id: string
        }
        Insert: {
          id: string
          message_id: string
          product_id: string
        }
        Update: {
          id?: string
          message_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_products_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          deleted_at: string | null
          id: string
          status: Database["public"]["Enums"]["message_status"]
          store_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          deleted_at?: string | null
          id: string
          status?: Database["public"]["Enums"]["message_status"]
          store_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["message_status"]
          store_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          batch_id: string | null
          body: string
          created_at: string
          deleted_at: string | null
          id: string
          link: string | null
          read_at: string | null
          sender_store_id: string | null
          sender_user_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          batch_id?: string | null
          body: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          sender_store_id?: string | null
          sender_user_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          batch_id?: string | null
          body?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          sender_store_id?: string | null
          sender_user_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_sender_store_id_fkey"
            columns: ["sender_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_user_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          currency?: string
          id: string
          order_id: string
          product_id: string
          quantity?: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          completed_at: string | null
          completed_by: string | null
          conversation_id: string | null
          created_at: string | null
          currency: string
          deleted_at: string | null
          id: string
          item_count: number
          notes: string | null
          review_eligible: boolean
          status: Database["public"]["Enums"]["order_status_enum"]
          store_id: string
          total: number
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          completed_at?: string | null
          completed_by?: string | null
          conversation_id?: string | null
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          id: string
          item_count?: number
          notes?: string | null
          review_eligible?: boolean
          status?: Database["public"]["Enums"]["order_status_enum"]
          store_id: string
          total: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          completed_at?: string | null
          completed_by?: string | null
          conversation_id?: string | null
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          id?: string
          item_count?: number
          notes?: string | null
          review_eligible?: boolean
          status?: Database["public"]["Enums"]["order_status_enum"]
          store_id?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          description: string | null
          id: string
          key: string
        }
        Insert: {
          description?: string | null
          id: string
          key: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          is_primary: boolean | null
          position: number | null
          product_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id: string
          is_primary?: boolean | null
          position?: number | null
          product_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_primary?: boolean | null
          position?: number | null
          product_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_stock: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          product_id: string
          quantity: number
          reserved: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id: string
          product_id: string
          quantity?: number
          reserved?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          reserved?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_stock_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json | null
          created_at: string | null
          deleted_at: string | null
          id: string
          price: number
          product_id: string
          sku: string
          stock: number | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          id: string
          price: number
          product_id: string
          sku: string
          stock?: number | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          price?: number
          product_id?: string
          sku?: string
          stock?: number | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          created_at: string | null
          currency: string | null
          deleted_at: string | null
          description: string | null
          discount_price: number | null
          id: string
          is_visible: boolean | null
          name: string
          price: number
          slug: string | null
          status: Database["public"]["Enums"]["product_status_enum"] | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          currency?: string | null
          deleted_at?: string | null
          description?: string | null
          discount_price?: number | null
          id: string
          is_visible?: boolean | null
          name: string
          price: number
          slug?: string | null
          status?: Database["public"]["Enums"]["product_status_enum"] | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          currency?: string | null
          deleted_at?: string | null
          description?: string | null
          discount_price?: number | null
          id?: string
          is_visible?: boolean | null
          name?: string
          price?: number
          slug?: string | null
          status?: Database["public"]["Enums"]["product_status_enum"] | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      provinces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          buyer_id: string
          created_at: string
          deleted_at: string | null
          flagged_at: string | null
          id: string
          is_visible: boolean
          order_id: string
          rating: number
          store_id: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          buyer_id: string
          created_at?: string
          deleted_at?: string | null
          flagged_at?: string | null
          id?: string
          is_visible?: boolean
          order_id: string
          rating: number
          store_id: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          buyer_id?: string
          created_at?: string
          deleted_at?: string | null
          flagged_at?: string | null
          id?: string
          is_visible?: boolean
          order_id?: string
          rating?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_onboarding: {
        Row: {
          approved_at: string | null
          created_at: string | null
          current_step: string | null
          deleted_at: string | null
          id: string
          seller_profile_id: string
          status: Database["public"]["Enums"]["on_boarding_status_enum"]
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          current_step?: string | null
          deleted_at?: string | null
          id: string
          seller_profile_id: string
          status?: Database["public"]["Enums"]["on_boarding_status_enum"]
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          current_step?: string | null
          deleted_at?: string | null
          id?: string
          seller_profile_id?: string
          status?: Database["public"]["Enums"]["on_boarding_status_enum"]
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_onboarding_seller_profile_id_fkey"
            columns: ["seller_profile_id"]
            isOneToOne: true
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_onboarding_steps: {
        Row: {
          completed: boolean | null
          created_at: string | null
          data: Json | null
          deleted_at: string | null
          id: string
          onboarding_id: string
          step: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          data?: Json | null
          deleted_at?: string | null
          id: string
          onboarding_id: string
          step: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          data?: Json | null
          deleted_at?: string | null
          id?: string
          onboarding_id?: string
          step?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_onboarding_steps_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "seller_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          onboarded_at: string | null
          status: Database["public"]["Enums"]["status_enum"]
          updated_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id: string
          onboarded_at?: string | null
          status?: Database["public"]["Enums"]["status_enum"]
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          onboarded_at?: string | null
          status?: Database["public"]["Enums"]["status_enum"]
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      store_followers: {
        Row: {
          followed_at: string | null
          id: string
          store_id: string
          user_id: string
        }
        Insert: {
          followed_at?: string | null
          id: string
          store_id: string
          user_id: string
        }
        Update: {
          followed_at?: string | null
          id?: string
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_followers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_followers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          banner_url: string | null
          created_at: string | null
          deleted_at: string | null
          delivery_eta_minutes: number | null
          delivery_fee: number | null
          delivery_zones: string[] | null
          description: string | null
          email: string | null
          has_delivery: boolean | null
          id: string
          logo_url: string | null
          main_store_category_id: string | null
          name: string
          owner_id: string
          phone: string | null
          province_id: string | null
          seller_profile_id: string
          slug: string
          state: string
          status: Database["public"]["Enums"]["store_status"] | null
          updated_at: string | null
          verified_at: string | null
          whatsapp: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivery_eta_minutes?: number | null
          delivery_fee?: number | null
          delivery_zones?: string[] | null
          description?: string | null
          email?: string | null
          has_delivery?: boolean | null
          id: string
          logo_url?: string | null
          main_store_category_id?: string | null
          name: string
          owner_id: string
          phone?: string | null
          province_id?: string | null
          seller_profile_id: string
          slug: string
          state: string
          status?: Database["public"]["Enums"]["store_status"] | null
          updated_at?: string | null
          verified_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          delivery_eta_minutes?: number | null
          delivery_fee?: number | null
          delivery_zones?: string[] | null
          description?: string | null
          email?: string | null
          has_delivery?: boolean | null
          id?: string
          logo_url?: string | null
          main_store_category_id?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          province_id?: string | null
          seller_profile_id?: string
          slug?: string
          state?: string
          status?: Database["public"]["Enums"]["store_status"] | null
          updated_at?: string | null
          verified_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_main_store_category_id_fkey"
            columns: ["main_store_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_seller_profile_id_fkey"
            columns: ["seller_profile_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_verified: boolean | null
          firebase_uid: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          phone_verified: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          firebase_uid: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_verified?: boolean | null
          firebase_uid?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      verification_documents: {
        Row: {
          back_file_url: string | null
          created_at: string | null
          deleted_at: string | null
          file_url: string
          id: string
          metadata: string | null
          owner_id: string
          rejection_reason: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["document_status"]
          store_id: string | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string | null
        }
        Insert: {
          back_file_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          file_url: string
          id: string
          metadata?: string | null
          owner_id: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          store_id?: string | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
        }
        Update: {
          back_file_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          file_url?: string
          id?: string
          metadata?: string | null
          owner_id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          store_id?: string | null
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_documents_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      store_ratings: {
        Row: {
          average_rating: number | null
          review_count: number | null
          store_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      complete_order: {
        Args: { p_completed_by: string; p_order_id: string }
        Returns: undefined
      }
      delete_user_account: { Args: { p_user_id: string }; Returns: undefined }
      mark_conversation_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      document_status: "PENDING" | "APPROVED" | "REJECTED"
      document_type:
        | "ID_CARD"
        | "PASSPORT"
        | "DRIVER_LICENSE"
        | "PROOF_OF_ADDRESS"
        | "BUSINESS_LICENSE"
        | "OTHER"
      message_status: "sent" | "delivered" | "read"
      notification_type:
        | "message"
        | "order"
        | "offer"
        | "follow"
        | "review"
        | "promotion"
        | "system"
      on_boarding_status_enum: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED"
      order_status_enum:
        | "PENDING"
        | "SHIPPING"
        | "COMPLETED"
        | "CANCELLED"
        | "CONTACTED"
      product_status_enum:
        | "DRAFT"
        | "PENDING_REVIEW"
        | "ACTIVE"
        | "INACTIVE"
        | "OUT_OF_STOCK"
        | "ARCHIVED"
        | "DELETED"
      status_enum: "PENDING" | "VERIFIED" | "DENIED"
      store_status: "ACTIVE" | "INACTIVE" | "BANNED" | "PENDING" | "SUSPENDED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      document_status: ["PENDING", "APPROVED", "REJECTED"],
      document_type: [
        "ID_CARD",
        "PASSPORT",
        "DRIVER_LICENSE",
        "PROOF_OF_ADDRESS",
        "BUSINESS_LICENSE",
        "OTHER",
      ],
      message_status: ["sent", "delivered", "read"],
      notification_type: [
        "message",
        "order",
        "offer",
        "follow",
        "review",
        "promotion",
        "system",
      ],
      on_boarding_status_enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
      order_status_enum: [
        "PENDING",
        "SHIPPING",
        "COMPLETED",
        "CANCELLED",
        "CONTACTED",
      ],
      product_status_enum: [
        "DRAFT",
        "PENDING_REVIEW",
        "ACTIVE",
        "INACTIVE",
        "OUT_OF_STOCK",
        "ARCHIVED",
        "DELETED",
      ],
      status_enum: ["PENDING", "VERIFIED", "DENIED"],
      store_status: ["ACTIVE", "INACTIVE", "BANNED", "PENDING", "SUSPENDED"],
    },
  },
} as const
