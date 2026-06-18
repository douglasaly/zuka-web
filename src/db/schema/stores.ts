import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { categories } from "./categories";
import { products } from "./products";
import { provinces } from "./provinces";
import { sellerProfiles } from "./seller-profiles";
import { storeFollowers } from "./store-followers";
import { timestamps } from "./timestamps";
import { users } from "./users";

export const storeStatus = pgEnum("store_status",['ACTIVE','INACTIVE','BANNED',"PENDING","SUSPENDED"])

export const stores = pgTable("stores", {

  id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),

   ownerId: uuid("owner_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(), 
  sellerProfileId: uuid(
    "seller_profile_id"
  )
    .references(
      () => sellerProfiles.id,
      {
        onDelete: "cascade",
      }
    )
    .notNull(),
  name: varchar("name", {
    length: 150
  }).notNull(),
  email: text("email").unique(),

  state: text("state").notNull(),

mainStoreCategoryId: uuid("main_store_category_id")
  .references(() => categories.id, {
    onDelete: "set null",
  }),
    provinceId: uuid("province_id").references(() => provinces.id, {
    onDelete: "set null",
  }).notNull(),

  slug: varchar("slug", {
    length: 180
  })
    .notNull()
    .unique(),

  description: text("description"),

logoUrl: text("logo_url"),

  bannerUrl: text("banner_url"),

  verifiedAt: timestamp("verified_at", {
      withTimezone: true
    }),

  status: storeStatus("status").default("PENDING"),

  ...timestamps
});

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, {
    fields: [stores.ownerId],
    references: [users.id],
  }),
  sellerProfile: one(sellerProfiles, {
    fields: [stores.sellerProfileId],
    references: [sellerProfiles.id],
  }),

  mainStoreCategory: one(categories, {
    fields: [stores.mainStoreCategoryId],
    references: [categories.id],
  }),

  province: one(provinces, {
    fields: [stores.provinceId],
    references: [provinces.id],
  }),

  followers: many(storeFollowers),

  products: many(products),
}));