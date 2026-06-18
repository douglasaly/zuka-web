import { db } from "@/db";
import { categories } from "@/db/schema/categories";

export const categoriesSeed = [
  {
    name: "Eletrônicos",
    slug: "eletronicos",
  },
  {
    name: "Moda e Vestuário",
    slug: "moda-e-vestuario",
  },
  {
    name: "Casa e Decoração",
    slug: "casa-e-decoracao",
  },
  {
    name: "Beleza e Cuidados Pessoais",
    slug: "beleza-e-cuidados-pessoais",
  },
  {
    name: "Esportes e Lazer",
    slug: "esportes-e-lazer",
  },
  {
    name: "Alimentos e Bebidas",
    slug: "alimentos-e-bebidas",
  },
  {
    name: "Livros e Educação",
    slug: "livros-e-educacao",
  },
  {
    name: "Automóveis e Motos",
    slug: "automoveis-e-motos",
  },
  {
    name: "Saúde e Bem-estar",
    slug: "saude-e-bem-estar",
  },
  {
    name: "Tecnologia e Acessórios",
    slug: "tecnologia-e-acessorios",
  },
];


async function seed(){
    try {
         console.log("🔗 Seeding categories")

        await db.insert(categories).values(categoriesSeed)

    console.log("✔️ Categories seeded successfully")

    process.exit(0)

    } catch (error) {
        console.error(error)
    }
}
seed()