-- Account-scoped UI/settings preferences (buyer + seller + locale/theme).
-- Access goes through Next.js API with service_role; RLS still enabled as defense in depth.

CREATE TABLE user_preferences (
	user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
	prefs JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	deleted_at TIMESTAMPTZ
);

CREATE INDEX user_preferences_prefs_gin_idx ON user_preferences USING gin (prefs);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
