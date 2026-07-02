CREATE TYPE notification_type AS ENUM (
	'message',
	'order',
	'offer',
	'follow',
	'review',
	'promotion',
	'system'
);

CREATE TABLE notifications (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

	type notification_type NOT NULL,
	title VARCHAR(255) NOT NULL,
	body TEXT NOT NULL,
	link VARCHAR(500) NULL,

	read_at TIMESTAMPTZ NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX notifications_user_id_idx ON notifications (user_id);
CREATE INDEX notifications_user_unread_idx ON notifications (user_id)
	WHERE read_at IS NULL AND deleted_at IS NULL;
CREATE INDEX notifications_user_created_idx
ON notifications (user_id, created_at DESC)
WHERE deleted_at IS NULL;