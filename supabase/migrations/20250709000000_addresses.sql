CREATE TABLE public.addresses (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
	label VARCHAR(50) NOT NULL,
	street VARCHAR(255) NOT NULL,
	neighborhood VARCHAR(255) NOT NULL,
	city VARCHAR(255) NOT NULL,
	province_id UUID REFERENCES public.provinces(id),
	is_default BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX addresses_user_id_idx ON public.addresses (user_id)
	WHERE deleted_at IS NULL;
