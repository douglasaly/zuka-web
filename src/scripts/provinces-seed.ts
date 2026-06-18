import { db } from "@/db";
import { provinces } from "@/db/schema/provinces";

export const mozambiqueProvinces = [
  {
    name: "Maputo Cidade",
    slug: "maputo-cidade",
  },
  {
    name: "Maputo Província",
    slug: "maputo-provincia",
  },
  {
    name: "Gaza",
    slug: "gaza",
  },
  {
    name: "Inhambane",
    slug: "inhambane",
  },
  {
    name: "Sofala",
    slug: "sofala",
  },
  {
    name: "Manica",
    slug: "manica",
  },
  {
    name: "Tete",
    slug: "tete",
  },
  {
    name: "Zambézia",
    slug: "zambezia",
  },
  {
    name: "Nampula",
    slug: "nampula",
  },
  {
    name: "Cabo Delgado",
    slug: "cabo-delgado",
  },
  {
    name: "Niassa",
    slug: "niassa",
  },
];

async function provincesSeed (){
    try {
    console.log("🔗 Seeding provinces")

    await db.insert(provinces).values(mozambiqueProvinces);

    console.log("✔️ Province seeded successfully")
    process.exit(0)
} catch (error) {
    console.error(error)
}
}

provincesSeed()

