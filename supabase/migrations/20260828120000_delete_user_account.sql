-- Soft-delete a user account and owned store data (used by POST /api/auth/delete-account).
CREATE OR REPLACE FUNCTION public.delete_user_account(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_now timestamptz := now();
BEGIN
	IF p_user_id IS NULL THEN
		RAISE EXCEPTION 'user id is required';
	END IF;

	-- Hide owned stores and their catalog from the marketplace.
	UPDATE public.products p
	SET
		deleted_at = v_now,
		updated_at = v_now,
		status = 'DELETED',
		is_visible = false
	FROM public.stores s
	WHERE p.store_id = s.id
		AND s.owner_id = p_user_id
		AND p.deleted_at IS NULL;

	UPDATE public.stores
	SET
		deleted_at = v_now,
		updated_at = v_now,
		status = 'INACTIVE'
	WHERE owner_id = p_user_id
		AND deleted_at IS NULL;

	-- Remove team memberships for this user.
	UPDATE public.store_members
	SET
		deleted_at = v_now,
		updated_at = v_now,
		status = 'removed'
	WHERE user_id = p_user_id
		AND deleted_at IS NULL;

	UPDATE public.user_preferences
	SET deleted_at = v_now, updated_at = v_now
	WHERE user_id = p_user_id
		AND deleted_at IS NULL;

	DELETE FROM public.saved_items
	WHERE user_id = p_user_id;

	UPDATE public.addresses
	SET deleted_at = v_now, updated_at = v_now
	WHERE user_id = p_user_id
		AND deleted_at IS NULL;

	-- Anonymize and soft-delete the user row.
	UPDATE public.users
	SET
		deleted_at = v_now,
		updated_at = v_now,
		status = 'DELETED',
		email = NULL,
		first_name = NULL,
		last_name = NULL,
		avatar_url = NULL,
		phone_number = NULL
	WHERE id = p_user_id
		AND deleted_at IS NULL;
END;
$$;
