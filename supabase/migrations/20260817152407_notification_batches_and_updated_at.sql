-- Admin notification batches (GROUP BY in SQL) + missing updated_at triggers.

ALTER TABLE public.notifications
	ADD COLUMN IF NOT EXISTS batch_id UUID NULL,
	ADD COLUMN IF NOT EXISTS sender_user_id UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
	ADD COLUMN IF NOT EXISTS sender_store_id UUID NULL REFERENCES public.stores(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS notifications_batch_id_idx
	ON public.notifications (batch_id)
	WHERE deleted_at IS NULL;

CREATE OR REPLACE FUNCTION public.list_notification_batches(p_limit integer DEFAULT 50)
RETURNS TABLE (
	id uuid,
	title text,
	body text,
	type public.notification_type,
	created_at timestamptz,
	recipient_count bigint,
	read_count bigint
)
LANGUAGE sql
STABLE
AS $$
	SELECT
		COALESCE(n.batch_id, n.id) AS id,
		(ARRAY_AGG(n.title ORDER BY n.created_at DESC))[1] AS title,
		(ARRAY_AGG(n.body ORDER BY n.created_at DESC))[1] AS body,
		(ARRAY_AGG(n.type ORDER BY n.created_at DESC))[1] AS type,
		MAX(n.created_at) AS created_at,
		COUNT(*)::bigint AS recipient_count,
		COUNT(n.read_at)::bigint AS read_count
	FROM public.notifications n
	WHERE n.deleted_at IS NULL
	GROUP BY COALESCE(n.batch_id, n.id)
	ORDER BY MAX(n.created_at) DESC
	LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 50), 100));
$$;

REVOKE ALL ON FUNCTION public.list_notification_batches(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_notification_batches(integer) TO service_role;

CREATE OR REPLACE FUNCTION public.search_store_order_ids(
	p_store_id uuid,
	p_term text,
	p_limit integer DEFAULT 200
)
RETURNS TABLE (id uuid)
LANGUAGE sql
STABLE
AS $$
	WITH term AS (
		SELECT left(
			trim(both FROM regexp_replace(coalesce(p_term, ''), '[%_*,.()]', ' ', 'g')),
			80
		) AS q
	)
	SELECT o.id
	FROM public.orders o
	LEFT JOIN public.users u ON u.id = o.buyer_id
	CROSS JOIN term t
	WHERE o.store_id = p_store_id
		AND o.deleted_at IS NULL
		AND t.q <> ''
		AND (
			o.id::text ILIKE '%' || t.q || '%'
			OR coalesce(u.email, '') ILIKE '%' || t.q || '%'
			OR coalesce(u.first_name, '') ILIKE '%' || t.q || '%'
			OR coalesce(u.last_name, '') ILIKE '%' || t.q || '%'
			OR concat_ws(' ', u.first_name, u.last_name) ILIKE '%' || t.q || '%'
			OR EXISTS (
				SELECT 1
				FROM public.order_items oi
				JOIN public.products p ON p.id = oi.product_id
				WHERE oi.order_id = o.id
					AND p.name ILIKE '%' || t.q || '%'
			)
		)
	ORDER BY o.created_at DESC
	LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 200), 500));
$$;

REVOKE ALL ON FUNCTION public.search_store_order_ids(uuid, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_store_order_ids(uuid, text, integer) TO service_role;

DROP TRIGGER IF EXISTS seller_profiles_set_updated_at ON public.seller_profiles;
CREATE TRIGGER seller_profiles_set_updated_at
	BEFORE UPDATE ON public.seller_profiles
	FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS seller_onboarding_set_updated_at ON public.seller_onboarding;
CREATE TRIGGER seller_onboarding_set_updated_at
	BEFORE UPDATE ON public.seller_onboarding
	FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS product_images_set_updated_at ON public.product_images;
CREATE TRIGGER product_images_set_updated_at
	BEFORE UPDATE ON public.product_images
	FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
