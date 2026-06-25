CREATE TYPE public.order_status_enum AS ENUM (
  'PENDING',
  'SHIPPING',
  'COMPLETED',
  'CANCELLED'
);

ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS phone varchar(30),
ADD COLUMN IF NOT EXISTS whatsapp varchar(30);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY NOT NULL,
  buyer_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  status public.order_status_enum DEFAULT 'PENDING' NOT NULL,
  total integer NOT NULL,
  currency varchar(3) DEFAULT 'MZN' NOT NULL,
  item_count integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY NOT NULL,
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  quantity integer DEFAULT 1 NOT NULL,
  unit_price integer NOT NULL,
  currency varchar(3) DEFAULT 'MZN' NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_orders_buyer_id ON public.orders (buyer_id);
CREATE INDEX idx_orders_store_id ON public.orders (store_id);
CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages orders" ON public.orders
FOR ALL USING (true) WITH CHECK (true);
