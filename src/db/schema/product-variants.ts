import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  numeric,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { products } from "./products";
import { stores } from "./stores";
import { timestamps } from "./timestamps";

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    storeId: uuid("store_id")
      .references(() => stores.id, {
        onDelete: "cascade",
      })
      .notNull(),

    productId: uuid("product_id")
      .references(() => products.id, {
        onDelete: "cascade",
      })
      .notNull(),

    sku: varchar("sku", { length: 120 }).notNull(),

    price: numeric("price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    stock: integer("stock").default(0),

    attributes: jsonb("attributes"),

    ...timestamps,
  },
  (table) => [
 uniqueIndex("store_sku_unique").on(
      table.storeId,
      table.sku
    ),
  ]
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);