import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { sellerOnboardings } from "./seller-onboarding";
import { stores } from "./stores";
import { timestamps } from "./timestamps";
import { users } from "./users";

export const StatusEnum = pgEnum('status_enum',['PENDING','VERIFIED','DENIED'])


export const sellerProfiles = pgTable("seller_profiles", {

  id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull()
    .unique(),

  status: StatusEnum("status").default("PENDING").notNull(),

  verifiedAt: timestamp("verified_at", {
    withTimezone: true
  }),

  onboardedAt: timestamp("onboarded_at", {
    withTimezone: true
  }),

  ...timestamps
});

export const sellerProfilesRelations = relations(sellerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [sellerProfiles.userId],
    references: [users.id],
  }),
  onboarding: one(sellerOnboardings, {
    fields: [sellerProfiles.id],
    references: [sellerOnboardings.sellerProfileId],
  }),
  stores: many(stores),
}));