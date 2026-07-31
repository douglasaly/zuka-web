-- =============================================================================
-- Reviews: avaliação do pedido (loja) + produtos do pedido
-- Phase 9 — Avaliações
--
-- Escopo:
--   • Só pedidos COMPLETED (gate: orders.review_eligible)
--   • reviews          → rating + body opcional (atendimento da loja)
--   • review_products  → rating + body opcional por produto do pedido
--   • 1 review activa por (order, buyer); N linhas de produto por review
--   • Agregados: store_ratings + product_ratings
-- =============================================================================

-- ── Orders: review gate ──────────────────────────────────────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_by uuid REFERENCES public.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS review_eligible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

COMMENT ON COLUMN public.orders.review_eligible IS
  'True after COMPLETED until the buyer submits the order review.';
COMMENT ON COLUMN public.orders.reviewed_at IS
  'Set when the order review (reviews row) is created.';

-- ── store_ratings (replace legacy view with materialised table) ──────────────
DROP VIEW IF EXISTS public.store_ratings CASCADE;

CREATE TABLE IF NOT EXISTS public.store_ratings (
  store_id uuid PRIMARY KEY REFERENCES public.stores (id) ON DELETE CASCADE,
  rating_avg numeric(3, 2) NOT NULL DEFAULT 0
    CONSTRAINT store_ratings_avg_check CHECK (
      rating_avg >= 0 AND rating_avg <= 5
    ),
  rating_count integer NOT NULL DEFAULT 0
    CONSTRAINT store_ratings_count_check CHECK (rating_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.store_ratings IS
  'Agregado da loja a partir de reviews.rating (atendimento).';

DROP TRIGGER IF EXISTS store_ratings_set_updated_at ON public.store_ratings;
CREATE TRIGGER store_ratings_set_updated_at
BEFORE UPDATE ON public.store_ratings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.store_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages store_ratings" ON public.store_ratings;
CREATE POLICY "Service role manages store_ratings"
ON public.store_ratings
FOR ALL
USING (true)
WITH CHECK (true);

-- ── product_ratings ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_ratings (
  product_id uuid PRIMARY KEY REFERENCES public.products (id) ON DELETE CASCADE,
  rating_avg numeric(3, 2) NOT NULL DEFAULT 0
    CONSTRAINT product_ratings_avg_check CHECK (
      rating_avg >= 0 AND rating_avg <= 5
    ),
  rating_count integer NOT NULL DEFAULT 0
    CONSTRAINT product_ratings_count_check CHECK (rating_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.product_ratings IS
  'Agregado do produto a partir de review_products.rating.';

DROP TRIGGER IF EXISTS product_ratings_set_updated_at ON public.product_ratings;
CREATE TRIGGER product_ratings_set_updated_at
BEFORE UPDATE ON public.product_ratings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.product_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages product_ratings" ON public.product_ratings;
CREATE POLICY "Service role manages product_ratings"
ON public.product_ratings
FOR ALL
USING (true)
WITH CHECK (true);

-- ── reviews (loja / atendimento do pedido) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY NOT NULL,
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  rating smallint NOT NULL,
  body text NULL,
  store_reply text NULL,
  store_replied_at timestamptz NULL,
  is_visible boolean NOT NULL DEFAULT true,
  flagged_at timestamptz NULL,
  flagged_reason text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL,
  CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)
);

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS store_reply text NULL,
  ADD COLUMN IF NOT EXISTS store_replied_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS flagged_reason text NULL;

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_rating_check;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_order_buyer_unique;
DROP INDEX IF EXISTS reviews_order_buyer_unique;
DROP INDEX IF EXISTS idx_reviews_order_buyer_active;

CREATE UNIQUE INDEX idx_reviews_order_buyer_active
  ON public.reviews (order_id, buyer_id)
  WHERE deleted_at IS NULL;

COMMENT ON TABLE public.reviews IS
  'Avaliação do atendimento da loja neste pedido: 1 activa por (order, buyer).';
COMMENT ON COLUMN public.reviews.rating IS
  'Nota 1–5 do atendimento / experiência com a loja.';
COMMENT ON COLUMN public.reviews.body IS
  'Comentário opcional sobre como correu o atendimento.';
COMMENT ON COLUMN public.reviews.store_reply IS
  'Resposta opcional da loja à avaliação do pedido.';

CREATE INDEX IF NOT EXISTS idx_reviews_store_id ON public.reviews (store_id);
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON public.reviews (buyer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews (order_id);

CREATE INDEX IF NOT EXISTS idx_reviews_store_created
  ON public.reviews (store_id, created_at DESC)
  WHERE deleted_at IS NULL AND is_visible = true;

CREATE INDEX IF NOT EXISTS idx_reviews_store_visible
  ON public.reviews (store_id)
  WHERE is_visible = true AND deleted_at IS NULL;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages reviews" ON public.reviews;
CREATE POLICY "Service role manages reviews"
ON public.reviews
FOR ALL
USING (true)
WITH CHECK (true);

-- ── review_products (avaliação por produto do pedido) ────────────────────────
CREATE TABLE IF NOT EXISTS public.review_products (
  id uuid PRIMARY KEY NOT NULL,
  review_id uuid NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  rating smallint NOT NULL,
  body text NULL,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL,
  CONSTRAINT review_products_rating_check CHECK (rating >= 1 AND rating <= 5)
);

COMMENT ON TABLE public.review_products IS
  'Avaliação de um produto pertencente ao pedido da review pai.';
COMMENT ON COLUMN public.review_products.rating IS
  'Nota 1–5 do produto.';
COMMENT ON COLUMN public.review_products.body IS
  'Comentário opcional sobre o produto.';

DROP INDEX IF EXISTS idx_review_products_review_product_active;
CREATE UNIQUE INDEX idx_review_products_review_product_active
  ON public.review_products (review_id, product_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_review_products_product_id
  ON public.review_products (product_id);

CREATE INDEX IF NOT EXISTS idx_review_products_review_id
  ON public.review_products (review_id);

CREATE INDEX IF NOT EXISTS idx_review_products_product_created
  ON public.review_products (product_id, created_at DESC)
  WHERE deleted_at IS NULL AND is_visible = true;

ALTER TABLE public.review_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages review_products" ON public.review_products;
CREATE POLICY "Service role manages review_products"
ON public.review_products
FOR ALL
USING (true)
WITH CHECK (true);

-- ── Aggregate: store ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.refresh_store_rating_for_store(p_store_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_avg numeric(3, 2);
  v_count integer;
BEGIN
  SELECT
    COALESCE(ROUND(AVG(rating)::numeric, 2), 0),
    COUNT(*)::integer
  INTO v_avg, v_count
  FROM public.reviews
  WHERE store_id = p_store_id
    AND deleted_at IS NULL
    AND is_visible = true;

  INSERT INTO public.store_ratings (store_id, rating_avg, rating_count, updated_at)
  VALUES (p_store_id, v_avg, v_count, now())
  ON CONFLICT (store_id) DO UPDATE
  SET
    rating_avg = EXCLUDED.rating_avg,
    rating_count = EXCLUDED.rating_count,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_refresh_store_ratings()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_store_rating_for_store(OLD.store_id);
    RETURN OLD;
  END IF;

  PERFORM public.refresh_store_rating_for_store(NEW.store_id);

  IF TG_OP = 'UPDATE'
    AND OLD.store_id IS DISTINCT FROM NEW.store_id THEN
    PERFORM public.refresh_store_rating_for_store(OLD.store_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_store_ratings ON public.reviews;
CREATE TRIGGER trg_refresh_store_ratings
AFTER INSERT OR DELETE OR UPDATE OF rating, store_id, is_visible, deleted_at
ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.trg_refresh_store_ratings();

-- ── Aggregate: product (respeita visibilidade da review pai) ─────────────────
CREATE OR REPLACE FUNCTION public.refresh_product_rating_for_product(p_product_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_avg numeric(3, 2);
  v_count integer;
BEGIN
  SELECT
    COALESCE(ROUND(AVG(rp.rating)::numeric, 2), 0),
    COUNT(*)::integer
  INTO v_avg, v_count
  FROM public.review_products rp
  INNER JOIN public.reviews r ON r.id = rp.review_id
  WHERE rp.product_id = p_product_id
    AND rp.deleted_at IS NULL
    AND rp.is_visible = true
    AND r.deleted_at IS NULL
    AND r.is_visible = true;

  INSERT INTO public.product_ratings (product_id, rating_avg, rating_count, updated_at)
  VALUES (p_product_id, v_avg, v_count, now())
  ON CONFLICT (product_id) DO UPDATE
  SET
    rating_avg = EXCLUDED.rating_avg,
    rating_count = EXCLUDED.rating_count,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_refresh_product_ratings()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_product_rating_for_product(OLD.product_id);
    RETURN OLD;
  END IF;

  PERFORM public.refresh_product_rating_for_product(NEW.product_id);

  IF TG_OP = 'UPDATE'
    AND OLD.product_id IS DISTINCT FROM NEW.product_id THEN
    PERFORM public.refresh_product_rating_for_product(OLD.product_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_product_ratings ON public.review_products;
CREATE TRIGGER trg_refresh_product_ratings
AFTER INSERT OR DELETE OR UPDATE OF rating, product_id, is_visible, deleted_at
ON public.review_products
FOR EACH ROW
EXECUTE FUNCTION public.trg_refresh_product_ratings();

-- When parent review visibility / soft-delete changes, refresh all child products
CREATE OR REPLACE FUNCTION public.trg_reviews_cascade_visibility()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  r record;
BEGIN
  IF TG_OP = 'UPDATE'
    AND (
      OLD.deleted_at IS DISTINCT FROM NEW.deleted_at
      OR OLD.is_visible IS DISTINCT FROM NEW.is_visible
    ) THEN
    -- Soft-delete / hide children with the parent
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
      UPDATE public.review_products
      SET
        deleted_at = NEW.deleted_at,
        is_visible = false,
        updated_at = now()
      WHERE review_id = NEW.id
        AND deleted_at IS NULL;
    ELSIF NEW.is_visible IS DISTINCT FROM OLD.is_visible THEN
      UPDATE public.review_products
      SET
        is_visible = NEW.is_visible,
        updated_at = now()
      WHERE review_id = NEW.id
        AND deleted_at IS NULL;
    END IF;

    FOR r IN
      SELECT DISTINCT product_id
      FROM public.review_products
      WHERE review_id = NEW.id
    LOOP
      PERFORM public.refresh_product_rating_for_product(r.product_id);
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reviews_cascade_visibility ON public.reviews;
CREATE TRIGGER trg_reviews_cascade_visibility
AFTER UPDATE OF deleted_at, is_visible ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.trg_reviews_cascade_visibility();

-- ── Soft-delete helpers ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.soft_delete_review()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
    NEW.is_visible := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_soft_delete_review ON public.reviews;
CREATE TRIGGER trg_soft_delete_review
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.soft_delete_review();

DROP TRIGGER IF EXISTS trg_soft_delete_review_product ON public.review_products;
CREATE TRIGGER trg_soft_delete_review_product
BEFORE UPDATE ON public.review_products
FOR EACH ROW
EXECUTE FUNCTION public.soft_delete_review();

DROP TRIGGER IF EXISTS trg_reviews_updated_at ON public.reviews;
CREATE TRIGGER trg_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_review_products_updated_at ON public.review_products;
CREATE TRIGGER trg_review_products_updated_at
BEFORE UPDATE ON public.review_products
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ── Close eligibility when order review is created ───────────────────────────
CREATE OR REPLACE FUNCTION public.trg_reviews_close_eligibility()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.orders
  SET
    review_eligible = false,
    reviewed_at = COALESCE(reviewed_at, now()),
    updated_at = now()
  WHERE id = NEW.order_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reviews_close_eligibility ON public.reviews;
CREATE TRIGGER trg_reviews_close_eligibility
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.trg_reviews_close_eligibility();

-- ── Seed empty aggregates ────────────────────────────────────────────────────
INSERT INTO public.store_ratings (store_id, rating_avg, rating_count)
SELECT s.id, 0, 0
FROM public.stores s
WHERE s.deleted_at IS NULL
ON CONFLICT (store_id) DO NOTHING;

INSERT INTO public.product_ratings (product_id, rating_avg, rating_count)
SELECT p.id, 0, 0
FROM public.products p
WHERE p.deleted_at IS NULL
ON CONFLICT (product_id) DO NOTHING;
