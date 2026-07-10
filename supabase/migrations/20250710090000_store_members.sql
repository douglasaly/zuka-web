CREATE TABLE public.store_members (
  id uuid PRIMARY KEY NOT NULL,
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  role varchar(50) NOT NULL DEFAULT 'staff',
  invited_at timestamptz DEFAULT now(),
  joined_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (store_id, user_id)
);

CREATE INDEX idx_store_members_store_id ON public.store_members (store_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_store_members_user_id ON public.store_members (user_id) WHERE deleted_at IS NULL;
