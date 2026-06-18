import { boolean, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { categories } from "./categories";
import { timestamps } from "./timestamps";
import { uuidv7 } from "uuidv7";
import { relations } from "drizzle-orm";
import { productStock } from "./product-stock";
import { productVariants } from "./product-variants";
import { productImages } from "./product-images";
import { messageProducts } from "./message_products";

export const ProductStatus=pgEnum('product_status_enum',['DRAFT','PENDING_REVIEW','ACTIVE','INACTIVE','OUT_OF_STOCK','ARCHIVED','DELETED'])

export const products = pgTable(
  "products",
  {

   id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),

    storeId: uuid("store_id")
      .references(() => stores.id, {
        onDelete: "cascade",
      })
      .notNull(),

    categoryId: uuid("category_id")
      .references(() => categories.id, {
        onDelete: "cascade",
      })
      .notNull(),

    name: varchar("name", {
      length: 255
    }).notNull(),

    slug: varchar("slug", {
      length: 255
    }).unique(),

    isVisible: boolean('is_visible').default(false),

    description: text("description"),

    status: ProductStatus("status").default("DRAFT"),

    ...timestamps
  }
);

export const productsRelations = relations(products, ({ one,many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),

  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),

  stock: one(productStock, {
    fields: [products.id],
    references: [productStock.productId],
  }),
  variants: many(productVariants),
  images: many(productImages),
  messageProducts: many(messageProducts),
}));