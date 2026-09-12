-- Tables referenced by profile APIs but missing from earlier migrations.

CREATE TABLE IF NOT EXISTS public.addresses (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
	label varchar(100),
	street varchar(255),
	neighborhood varchar(150),
	city varchar(100) NOT NULL,
	province varchar(100) NOT NULL,
	phone varchar(30) NOT NULL,
	recipient_name varchar(150) NOT NULL,
	is_default boolean NOT NULL DEFAULT false,
	postal_code varchar(20),
	reference_point varchar(255),
	latitude double precision,
	longitude double precision,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS addresses_user_id_idx
	ON public.addresses (user_id)
	WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.saved_items (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
	product_id uuid NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
	created_at timestamptz NOT NULL DEFAULT now(),
	UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS saved_items_user_id_idx
	ON public.saved_items (user_id);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
