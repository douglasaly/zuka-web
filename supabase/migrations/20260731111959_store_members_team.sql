-- Store team members (upgrade of 20250710090000_store_members)
-- Apply manually. Do not edit src/lib/supabase/types.ts from this change.
-- After applying: run `yarn db:seed:rbac` so store_owner|manager|staff|viewer
-- roles and role_permissions (member.*, product.*, …) exist for requireSellerStore.

-- ── Role enum ───────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'store_member_role'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.store_member_role AS ENUM (
      'owner',
      'manager',
      'staff',
      'viewer'
    );
  END IF;
END $$;

-- ── Membership status ───────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'store_member_status'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.store_member_status AS ENUM (
      'pending',
      'active',
      'removed'
    );
  END IF;
END $$;

-- ── Table (create if missing) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.store_members (
  id uuid PRIMARY KEY NOT NULL,
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  role public.store_member_role NOT NULL DEFAULT 'staff',
  status public.store_member_status NOT NULL DEFAULT 'pending',
  invited_by uuid REFERENCES public.users (id) ON DELETE SET NULL,
  invited_at timestamptz NOT NULL DEFAULT now(),
  joined_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- ── Columns if legacy table already exists ────────────────────────────────
ALTER TABLE public.store_members
  ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES public.users (id) ON DELETE SET NULL;

ALTER TABLE public.store_members
  ADD COLUMN IF NOT EXISTS status public.store_member_status;

-- Backfill status before enforcing NOT NULL
UPDATE public.store_members
SET status = CASE
  WHEN deleted_at IS NOT NULL THEN 'removed'::public.store_member_status
  WHEN joined_at IS NOT NULL THEN 'active'::public.store_member_status
  ELSE 'pending'::public.store_member_status
END
WHERE status IS NULL;

ALTER TABLE public.store_members
  ALTER COLUMN status SET DEFAULT 'pending'::public.store_member_status;

ALTER TABLE public.store_members
  ALTER COLUMN status SET NOT NULL;

-- Migrate role varchar → enum when needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'store_members'
      AND column_name = 'role'
      AND udt_name <> 'store_member_role'
  ) THEN
    ALTER TABLE public.store_members
      ALTER COLUMN role DROP DEFAULT;

    ALTER TABLE public.store_members
      ALTER COLUMN role TYPE public.store_member_role
      USING (
        CASE lower(role::text)
          WHEN 'owner' THEN 'owner'::public.store_member_role
          WHEN 'manager' THEN 'manager'::public.store_member_role
          WHEN 'viewer' THEN 'viewer'::public.store_member_role
          ELSE 'staff'::public.store_member_role
        END
      );

    ALTER TABLE public.store_members
      ALTER COLUMN role SET DEFAULT 'staff'::public.store_member_role;
  END IF;
END $$;

ALTER TABLE public.store_members
  ALTER COLUMN invited_at SET DEFAULT now();

ALTER TABLE public.store_members
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.store_members
  ALTER COLUMN updated_at SET DEFAULT now();

-- ── Soft-delete friendly uniqueness ───────────────────────────────────────
ALTER TABLE public.store_members
  DROP CONSTRAINT IF EXISTS store_members_store_id_user_id_key;

DROP INDEX IF EXISTS public.store_members_store_id_user_id_key;
DROP INDEX IF EXISTS public.idx_store_members_store_user_active;

CREATE UNIQUE INDEX idx_store_members_store_user_active
  ON public.store_members (store_id, user_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_store_members_store_id
  ON public.store_members (store_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_store_members_user_id
  ON public.store_members (user_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_store_members_status
  ON public.store_members (store_id, status)
  WHERE deleted_at IS NULL;

-- ── updated_at trigger ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS store_members_set_updated_at ON public.store_members;
CREATE TRIGGER store_members_set_updated_at
BEFORE UPDATE ON public.store_members
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ── Backfill store owners as active owner members ─────────────────────────
INSERT INTO public.store_members (
  id,
  store_id,
  user_id,
  role,
  status,
  invited_by,
  invited_at,
  joined_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  s.id,
  s.owner_id,
  'owner'::public.store_member_role,
  'active'::public.store_member_status,
  s.owner_id,
  coalesce(s.created_at, now()),
  coalesce(s.created_at, now()),
  now(),
  now()
FROM public.stores s
WHERE s.deleted_at IS NULL
  AND s.owner_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.store_members m
    WHERE m.store_id = s.id
      AND m.user_id = s.owner_id
      AND m.deleted_at IS NULL
  );

-- ── RLS (API uses service_role; keep table locked for anon/authenticated) ─
ALTER TABLE public.store_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "store_members_no_direct_access" ON public.store_members;
CREATE POLICY "store_members_no_direct_access"
  ON public.store_members
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.store_members IS
  'Store team membership. Owner is always represented; staff invited by email/user id. Soft-delete via deleted_at.';
