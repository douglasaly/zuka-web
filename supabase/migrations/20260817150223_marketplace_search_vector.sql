-- Full-text search for marketplace lookup (products, stores, categories).
-- Generated tsvector + GIN so GET /api/search can use textSearch instead of ILIKE '%term%'.

ALTER TABLE public.products
	ADD COLUMN IF NOT EXISTS search_vector tsvector
	GENERATED ALWAYS AS (
		to_tsvector(
			'portuguese',
			coalesce(name, '') || ' ' || coalesce(description, '')
		)
	) STORED;

CREATE INDEX IF NOT EXISTS idx_products_search_vector
	ON public.products
	USING GIN (search_vector)
	WHERE deleted_at IS NULL;

ALTER TABLE public.stores
	ADD COLUMN IF NOT EXISTS search_vector tsvector
	GENERATED ALWAYS AS (
		to_tsvector(
			'portuguese',
			coalesce(name, '') || ' ' || coalesce(description, '')
		)
	) STORED;

CREATE INDEX IF NOT EXISTS idx_stores_search_vector
	ON public.stores
	USING GIN (search_vector)
	WHERE deleted_at IS NULL;

ALTER TABLE public.categories
	ADD COLUMN IF NOT EXISTS search_vector tsvector
	GENERATED ALWAYS AS (
		to_tsvector('portuguese', coalesce(name, ''))
	) STORED;

CREATE INDEX IF NOT EXISTS idx_categories_search_vector
	ON public.categories
	USING GIN (search_vector)
	WHERE deleted_at IS NULL;
