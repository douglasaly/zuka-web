-- Zuka marketplace initial schema for Supabase (PostgreSQL)

CREATE TYPE public.product_status_enum AS ENUM (
  'DRAFT',
  'PENDING_REVIEW',
  'ACTIVE',
  'INACTIVE',
  'OUT_OF_STOCK',
  'ARCHIVED',
  'DELETED'
);

CREATE TYPE public.status_enum AS ENUM ('PENDING', 'VERIFIED', 'DENIED');

CREATE TYPE public.store_status AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'BANNED',
  'PENDING',
  'SUSPENDED'
);

CREATE TYPE public.document_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TYPE public.document_type AS ENUM (
  'ID_CARD',
  'PASSPORT',
  'DRIVER_LICENSE',
  'PROOF_OF_ADDRESS',
  'BUSINESS_LICENSE',
  'OTHER'
);

CREATE TYPE public.on_boarding_status_enum AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED'
);

CREATE TABLE public.users (
  id uuid PRIMARY KEY NOT NULL,
  firebase_uid varchar(128) NOT NULL UNIQUE,
  email varchar(255) UNIQUE,
  first_name varchar(100),
  last_name varchar(100),
  avatar_url varchar(500),
  phone_number varchar(30),
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  status varchar(30) DEFAULT 'ACTIVE',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.categories (
  id uuid PRIMARY KEY NOT NULL,
  parent_id uuid REFERENCES public.categories (id) ON DELETE SET NULL,
  name varchar(150) NOT NULL,
  slug varchar(180) NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.provinces (
  id uuid PRIMARY KEY NOT NULL,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.roles (
  id uuid PRIMARY KEY NOT NULL,
  name varchar(100) NOT NULL UNIQUE,
  description varchar(255)
);

CREATE TABLE public.permissions (
  id uuid PRIMARY KEY NOT NULL,
  key varchar(150) NOT NULL UNIQUE,
  description varchar(255)
);

CREATE TABLE public.role_permissions (
  role_id uuid NOT NULL REFERENCES public.roles (id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions (id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.user_roles (
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.roles (id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE public.seller_profiles (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL UNIQUE REFERENCES public.users (id) ON DELETE CASCADE,
  status public.status_enum DEFAULT 'PENDING' NOT NULL,
  verified_at timestamptz,
  onboarded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.seller_onboarding (
  id uuid PRIMARY KEY NOT NULL,
  seller_profile_id uuid NOT NULL UNIQUE REFERENCES public.seller_profiles (id) ON DELETE CASCADE,
  status public.on_boarding_status_enum DEFAULT 'DRAFT' NOT NULL,
  current_step varchar(100),
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.seller_onboarding_steps (
  id uuid PRIMARY KEY NOT NULL,
  onboarding_id uuid NOT NULL REFERENCES public.seller_onboarding (id) ON DELETE CASCADE,
  step varchar(100) NOT NULL,
  data jsonb,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.stores (
  id uuid PRIMARY KEY NOT NULL,
  owner_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  seller_profile_id uuid NOT NULL REFERENCES public.seller_profiles (id) ON DELETE CASCADE,
  name varchar(150) NOT NULL,
  email text UNIQUE,
  state text NOT NULL,
  main_store_category_id uuid REFERENCES public.categories (id) ON DELETE SET NULL,
  province_id uuid REFERENCES public.provinces (id) ON DELETE SET NULL,
  slug varchar(180) NOT NULL UNIQUE,
  description text,
  logo_url text,
  banner_url text,
  verified_at timestamptz,
  status public.store_status DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY NOT NULL,
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories (id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  slug varchar(255) UNIQUE,
  is_visible boolean DEFAULT false,
  description text,
  status public.product_status_enum DEFAULT 'DRAFT',
  price integer NOT NULL,
  discount_price integer,
  currency varchar(3) DEFAULT 'MZN',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.product_images (
  id uuid PRIMARY KEY NOT NULL,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  url text NOT NULL,
  position integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  alt text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.product_stock (
  id uuid PRIMARY KEY NOT NULL,
  product_id uuid NOT NULL UNIQUE REFERENCES public.products (id) ON DELETE CASCADE,
  quantity integer DEFAULT 0 NOT NULL,
  reserved integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY NOT NULL,
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  sku varchar(120) NOT NULL,
  price numeric(12, 2) NOT NULL,
  stock integer DEFAULT 0,
  attributes jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.store_followers (
  id uuid PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  followed_at timestamptz DEFAULT now()
);

CREATE TABLE public.conversations (
  id uuid PRIMARY KEY NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.conversation_participants (
  conversation_id uuid NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY NOT NULL,
  conversation_id uuid NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.message_products (
  id uuid PRIMARY KEY NOT NULL,
  message_id uuid NOT NULL REFERENCES public.messages (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE
);

CREATE TABLE public.verification_documents (
  id uuid PRIMARY KEY NOT NULL,
  owner_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  store_id uuid REFERENCES public.stores (id) ON DELETE CASCADE,
  type public.document_type NOT NULL,
  status public.document_status DEFAULT 'PENDING' NOT NULL,
  file_url text NOT NULL,
  back_file_url text,
  metadata text,
  rejection_reason text,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE UNIQUE INDEX store_sku_unique ON public.product_variants (store_id, sku);
CREATE UNIQUE INDEX unique_user_store_follow ON public.store_followers (user_id, store_id);
CREATE INDEX idx_store_followers_user ON public.store_followers (user_id);
CREATE INDEX idx_store_followers_store ON public.store_followers (store_id);
CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants (user_id);
CREATE INDEX idx_message_products_unique ON public.message_products (message_id, product_id);
CREATE UNIQUE INDEX idx_product_primary_image ON public.product_images (product_id, is_primary)
WHERE is_primary = true;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER categories_set_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER stores_set_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON public.categories
FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Public read provinces" ON public.provinces
FOR SELECT USING (true);

CREATE POLICY "Public read active stores" ON public.stores
FOR SELECT USING (deleted_at IS NULL AND status = 'ACTIVE');

CREATE POLICY "Public read visible products" ON public.products
FOR SELECT USING (deleted_at IS NULL AND is_visible = true);

CREATE POLICY "Public read product images" ON public.product_images
FOR SELECT USING (deleted_at IS NULL);
