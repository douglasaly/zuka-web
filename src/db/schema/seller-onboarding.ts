import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { onboardingSteps } from "./onboarding-steps";
import { sellerProfiles } from "./seller-profiles";
import { timestamps } from "./timestamps";

export const sellerOnboardings =
pgTable("seller_onboarding", {

   id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),

  sellerProfileId: uuid("seller_profile_id")
    .references(() => sellerProfiles.id, {
      onDelete: "cascade",
    })
    .notNull()
    .unique(),

  status: varchar("status", {
    length: 50
  }).default("DRAFT"),

  currentStep: varchar("current_step", {
    length: 100
  }),

  submittedAt: timestamp("submitted_at", {
    withTimezone: true
  }),

  approvedAt: timestamp("approved_at", {
    withTimezone: true
  }),

  ...timestamps
});

export const sellerOnboardingsRelations = relations(sellerOnboardings, ({ one, many }) => ({
  sellerProfile: one(sellerProfiles, {
    fields: [sellerOnboardings.sellerProfileId],
    references: [sellerProfiles.id],
  }),
  steps: many(onboardingSteps),
}));