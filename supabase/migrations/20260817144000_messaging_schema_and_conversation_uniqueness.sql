-- Evolve messaging schema for fresh installs (must run before count_store_unread_conversations).
-- Also enforces one active conversation per store+buyer pair.

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_status') THEN
		CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read');
	END IF;
END $$;

ALTER TABLE public.conversations
	ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products (id),
	ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.stores (id),
	ADD COLUMN IF NOT EXISTS last_message_at timestamptz,
	ADD COLUMN IF NOT EXISTS last_message_id uuid,
	ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES public.users (id);

ALTER TABLE public.conversation_participants
	ADD COLUMN IF NOT EXISTS last_read_at timestamptz,
	ADD COLUMN IF NOT EXISTS joined_at timestamptz DEFAULT now();

ALTER TABLE public.messages
	ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.users (id),
	ADD COLUMN IF NOT EXISTS store_id uuid REFERENCES public.stores (id),
	ADD COLUMN IF NOT EXISTS status public.message_status DEFAULT 'sent';

UPDATE public.messages
SET user_id = sender_id
WHERE user_id IS NULL
	AND sender_id IS NOT NULL;

ALTER TABLE public.messages
	ALTER COLUMN sender_id DROP NOT NULL;

UPDATE public.conversations c
SET buyer_id = picked.buyer_id,
	store_id = COALESCE(c.store_id, picked.store_id)
FROM (
	SELECT
		c2.id AS conversation_id,
		cp.user_id AS buyer_id,
		s.id AS store_id
	FROM public.conversations c2
	INNER JOIN public.conversation_participants cp
		ON cp.conversation_id = c2.id
	INNER JOIN public.stores s
		ON s.owner_id <> cp.user_id
	INNER JOIN public.conversation_participants cp_owner
		ON cp_owner.conversation_id = c2.id
		AND cp_owner.user_id = s.owner_id
	WHERE c2.buyer_id IS NULL
) picked
WHERE c.id = picked.conversation_id;

WITH ranked AS (
	SELECT
		id,
		ROW_NUMBER() OVER (
			PARTITION BY store_id, buyer_id
			ORDER BY
				last_message_at DESC NULLS LAST,
				created_at DESC
		) AS rn
	FROM public.conversations
	WHERE deleted_at IS NULL
		AND store_id IS NOT NULL
		AND buyer_id IS NOT NULL
)
UPDATE public.conversations c
SET deleted_at = now(),
	updated_at = now()
FROM ranked r
WHERE c.id = r.id
	AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_store_buyer_conversation
	ON public.conversations (store_id, buyer_id)
	WHERE deleted_at IS NULL
		AND store_id IS NOT NULL
		AND buyer_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.mark_conversation_read(
	p_conversation_id uuid,
	p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
	UPDATE public.conversation_participants
	SET last_read_at = now()
	WHERE conversation_id = p_conversation_id
		AND user_id = p_user_id;
END;
$$;
