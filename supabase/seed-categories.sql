-- Zuka marketplace categories (safe to re-run)
-- Supabase SQL Editor → paste → Run

INSERT INTO public.categories (id, name, slug)
VALUES
  (gen_random_uuid(), 'Eletrônicos', 'eletronicos'),
  (gen_random_uuid(), 'Moda e Vestuário', 'moda-e-vestuario'),
  (gen_random_uuid(), 'Capulanas e Tecidos', 'capulanas-e-tecidos'),
  (gen_random_uuid(), 'Casa e Decoração', 'casa-e-decoracao'),
  (gen_random_uuid(), 'Móveis', 'moveis'),
  (gen_random_uuid(), 'Beleza e Cuidados Pessoais', 'beleza-cuidados-pessoais'),
  (gen_random_uuid(), 'Esportes e Lazer', 'esportes-lazer'),
  (gen_random_uuid(), 'Alimentos e Bebidas', 'alimentos-e-bebidas'),
  (gen_random_uuid(), 'Livros e Educação', 'livros-educacao'),
  (gen_random_uuid(), 'Automóveis e Motos', 'automoveis-motos'),
  (gen_random_uuid(), 'Saúde e Bem-estar', 'saude-bem-estar'),
  (gen_random_uuid(), 'Tecnologia e Acessórios', 'tecnologia-acessorios'),
  (gen_random_uuid(), 'Bebé e Criança', 'bebe-e-crianca'),
  (gen_random_uuid(), 'Animais e Pet', 'animais-e-pet'),
  (gen_random_uuid(), 'Serviços', 'servicos')
ON CONFLICT (slug) DO NOTHING;
