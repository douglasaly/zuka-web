-- Conversations where the buyer has at least one unread store message (for inbox badges / browser alerts).
CREATE OR REPLACE FUNCTION public.count_buyer_unread_conversations(
	p_user_id uuid,
	p_exclude_store_ids uuid[] DEFAULT '{}'::uuid[]
)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
	SELECT COUNT(*)::integer
	FROM public.conversations c
	INNER JOIN public.conversation_participants cp
		ON cp.conversation_id = c.id
		AND cp.user_id = p_user_id
	WHERE c.deleted_at IS NULL
		AND (
			p_exclude_store_ids = '{}'::uuid[]
			OR c.store_id IS NULL
			OR NOT (c.store_id = ANY (p_exclude_store_ids))
		)
		AND EXISTS (
			SELECT 1
			FROM public.messages m
			WHERE m.conversation_id = c.id
				AND m.store_id IS NOT NULL
				AND m.deleted_at IS NULL
				AND (
					cp.last_read_at IS NULL
					OR m.created_at > cp.last_read_at
				)
		);
$$;
