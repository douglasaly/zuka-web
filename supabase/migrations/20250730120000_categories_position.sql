-- Category sort order for seller/admin category management (Phase 5)
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;

COMMENT ON COLUMN public.categories.position IS 'Display order within the same parent (lower first)';

CREATE INDEX IF NOT EXISTS idx_categories_parent_position
ON public.categories (parent_id, position)
WHERE deleted_at IS NULL;
