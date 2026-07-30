-- Remove product stock and variants (no inventory model)
-- Manual apply only — do not run automatically.
-- Note: OUT_OF_STOCK remains on product_status_enum (Postgres cannot drop enum values safely).

-- Reclassify any OUT_OF_STOCK products before dropping inventory tables
UPDATE public.products
SET status = 'INACTIVE',
    is_visible = false,
    updated_at = now()
WHERE status = 'OUT_OF_STOCK'
  AND deleted_at IS NULL;

DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.product_stock CASCADE;
