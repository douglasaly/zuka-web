-- =============================================================================
-- store_contact_events: cliques WhatsApp / Ligar (interesse nos anúncios)
-- =============================================================================

CREATE TYPE public.contact_event_type AS ENUM ('whatsapp', 'call');

CREATE TABLE public.store_contact_events (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
	product_id uuid REFERENCES public.products (id) ON DELETE SET NULL,
	type public.contact_event_type NOT NULL,
	source varchar(20) NOT NULL
		CONSTRAINT store_contact_events_source_check
		CHECK (source IN ('product', 'store')),
	user_id uuid REFERENCES public.users (id) ON DELETE SET NULL,
	created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.store_contact_events IS
	'Cliques em WhatsApp/Ligar a partir da plataforma (anónimos ou autenticados).';

CREATE INDEX store_contact_events_store_type_created_idx
	ON public.store_contact_events (store_id, type, created_at DESC);

ALTER TABLE public.store_contact_events ENABLE ROW LEVEL SECURITY;
