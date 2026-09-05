-- Orders: columns and enum values required by checkout and order APIs

ALTER TYPE public.order_status_enum ADD VALUE IF NOT EXISTS 'CONTACTED';

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.conversations (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_orders_conversation_id
  ON public.orders (conversation_id)
  WHERE deleted_at IS NULL;

COMMENT ON COLUMN public.orders.conversation_id IS
  'Buyer-store chat thread linked when the order is created.';
COMMENT ON COLUMN public.orders.deleted_at IS
  'Soft-delete; excluded from buyer/seller order lists when set.';
COMMENT ON COLUMN public.orders.notes IS
  'Seller notes, e.g. cancellation reason.';
