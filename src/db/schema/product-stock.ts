import { relations } from "drizzle-orm";
import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { products } from "./products";
import { timestamps } from "./timestamps";

export const productStock = pgTable("product_stock", {
   id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),

     productId: uuid("product_id")
    .notNull()
    .unique()
    .references(() => products.id, {
      onDelete: "cascade",
    }),

  quantity: integer("quantity").notNull().default(0),

  reserved: integer("reserved").notNull().default(0),

  ...timestamps
 
});


export const productStockRelations = relations(
  productStock,
  ({ one }) => ({
    product: one(products, {
      fields: [productStock.productId],
      references: [products.id],
    }),
  })
);