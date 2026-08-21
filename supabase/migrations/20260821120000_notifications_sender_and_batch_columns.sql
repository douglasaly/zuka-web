-- Safety migration for environments that applied list_notification_batches
-- before batch/sender columns existed on notifications.

ALTER TABLE public.notifications
	ADD COLUMN IF NOT EXISTS batch_id UUID NULL,
	ADD COLUMN IF NOT EXISTS sender_user_id UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
	ADD COLUMN IF NOT EXISTS sender_store_id UUID NULL REFERENCES public.stores(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS notifications_batch_id_idx
	ON public.notifications (batch_id)
	WHERE deleted_at IS NULL;
