-- Delivery settings for seller store profile (Phase 7)
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS has_delivery boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS delivery_fee integer,
ADD COLUMN IF NOT EXISTS delivery_eta_minutes integer,
ADD COLUMN IF NOT EXISTS delivery_zones text[] DEFAULT '{}';

COMMENT ON COLUMN public.stores.has_delivery IS 'Whether the store offers delivery';
COMMENT ON COLUMN public.stores.delivery_fee IS 'Delivery fee in MZN (whole units)';
COMMENT ON COLUMN public.stores.delivery_eta_minutes IS 'Estimated delivery time in minutes';
COMMENT ON COLUMN public.stores.delivery_zones IS 'Named delivery zones / neighborhoods';
