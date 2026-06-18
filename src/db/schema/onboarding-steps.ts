import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { sellerOnboardings } from "./seller-onboarding";
import { timestamps } from "./timestamps";

export const onboardingSteps =
pgTable("seller_onboarding_steps", {

 id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),

  onboardingId: uuid("onboarding_id")
    .references(
      () => sellerOnboardings.id
    )
    .notNull(),

  step: varchar("step", {
    length: 100
  }).notNull(),

  data: jsonb("data"),

  completed: boolean("completed")
    .default(false),

  ...timestamps
});

export const onboardingStepsRelations = relations(onboardingSteps, ({ one }) => ({
  onboarding: one(sellerOnboardings, {
    fields: [onboardingSteps.onboardingId],
    references: [sellerOnboardings.id],
  }),
}));