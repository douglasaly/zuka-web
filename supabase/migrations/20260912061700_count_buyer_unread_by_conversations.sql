-- Buyer inbox unread counts without loading every store message row.
CREATE OR REPLACE FUNCTION public.count_buyer_unread_by_conversations(
	p_user_id uuid,
	p_conversation_ids uuid[]
)
RETURNS TABLE(conversation_id uuid, unread_count integer)
LANGUAGE sql
STABLE
AS $$
	SELECT
		m.conversation_id,
		COUNT(*)::integer AS unread_count
	FROM public.messages m
	INNER JOIN public.conversation_participants cp
		ON cp.conversation_id = m.conversation_id
		AND cp.user_id = p_user_id
	WHERE m.conversation_id = ANY(p_conversation_ids)
		AND m.store_id IS NOT NULL
		AND m.deleted_at IS NULL
		AND (
			cp.last_read_at IS NULL
			OR m.created_at > cp.last_read_at
		)
	GROUP BY m.conversation_id;
$$;
