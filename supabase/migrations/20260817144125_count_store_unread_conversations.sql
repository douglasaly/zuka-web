CREATE OR REPLACE FUNCTION public.count_store_unread_conversations(
	p_store_id uuid,
	p_owner_id uuid
)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
	SELECT COUNT(*)::integer
	FROM public.conversations c
	INNER JOIN public.conversation_participants cp
		ON cp.conversation_id = c.id
		AND cp.user_id = p_owner_id
	WHERE c.store_id = p_store_id
		AND c.deleted_at IS NULL
		AND EXISTS (
			SELECT 1
			FROM public.messages m
			WHERE m.conversation_id = c.id
				AND m.store_id IS NULL
				AND m.deleted_at IS NULL
				AND (
					cp.last_read_at IS NULL
					OR m.created_at > cp.last_read_at
				)
		);
$$;
