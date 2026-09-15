-- Lock down sensitive tables exposed via PostgREST anon/authenticated roles.
-- Next.js API uses service_role (bypasses RLS). Policies deny direct client access.

-- orders: permissive "Service role manages orders" applied to all roles (missing TO clause)
DROP POLICY IF EXISTS "Service role manages orders" ON public.orders;
CREATE POLICY "orders_no_direct_access"
  ON public.orders
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- order_items: no RLS at all
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "order_items_no_direct_access" ON public.order_items;
CREATE POLICY "order_items_no_direct_access"
  ON public.order_items
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- reviews stack: same permissive-policy mistake
DROP POLICY IF EXISTS "Service role manages store_ratings" ON public.store_ratings;
CREATE POLICY "store_ratings_no_direct_access"
  ON public.store_ratings
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Service role manages product_ratings" ON public.product_ratings;
CREATE POLICY "product_ratings_no_direct_access"
  ON public.product_ratings
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Service role manages reviews" ON public.reviews;
CREATE POLICY "reviews_no_direct_access"
  ON public.reviews
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Service role manages review_products" ON public.review_products;
CREATE POLICY "review_products_no_direct_access"
  ON public.review_products
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- KYC documents: no RLS — file_url/back_file_url leak identity docs
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "verification_documents_no_direct_access" ON public.verification_documents;
CREATE POLICY "verification_documents_no_direct_access"
  ON public.verification_documents
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- notifications: no RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_no_direct_access" ON public.notifications;
CREATE POLICY "notifications_no_direct_access"
  ON public.notifications
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- messaging: no RLS on private buyer/seller threads
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversations_no_direct_access" ON public.conversations;
CREATE POLICY "conversations_no_direct_access"
  ON public.conversations
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversation_participants_no_direct_access" ON public.conversation_participants;
CREATE POLICY "conversation_participants_no_direct_access"
  ON public.conversation_participants
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_no_direct_access" ON public.messages;
CREATE POLICY "messages_no_direct_access"
  ON public.messages
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

ALTER TABLE public.message_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "message_products_no_direct_access" ON public.message_products;
CREATE POLICY "message_products_no_direct_access"
  ON public.message_products
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- RBAC tables: no RLS — anon could grant itself admin via user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_roles_no_direct_access" ON public.user_roles;
CREATE POLICY "user_roles_no_direct_access"
  ON public.user_roles
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "roles_no_direct_access" ON public.roles;
CREATE POLICY "roles_no_direct_access"
  ON public.roles
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "permissions_no_direct_access" ON public.permissions;
CREATE POLICY "permissions_no_direct_access"
  ON public.permissions
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "role_permissions_no_direct_access" ON public.role_permissions;
CREATE POLICY "role_permissions_no_direct_access"
  ON public.role_permissions
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
