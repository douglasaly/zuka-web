import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { stores } from "./stores";
import { timestamps } from "./timestamps";
import { uuidv7 } from "uuidv7";
import { relations } from "drizzle-orm";

export const documentStatusEnum = pgEnum("document_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "ID_CARD",
  "PASSPORT",
  "DRIVER_LICENSE",
  "PROOF_OF_ADDRESS",
  "BUSINESS_LICENSE",
  "OTHER",
]);

export const verificationDocuments = pgTable("verification_documents", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),

  ownerId: uuid("owner_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  storeId: uuid("store_id").references(() => stores.id, {
    onDelete: "cascade",
  }),

  type: documentTypeEnum("type").notNull(),

  status: documentStatusEnum("status").default("PENDING").notNull(),

  fileUrl: text("file_url").notNull(),

  backFileUrl: text("back_file_url"), 

  metadata: text("metadata"),

  rejectionReason: text("rejection_reason"),

  reviewedAt: timestamp("reviewed_at", {
    withTimezone: true,
  }),

  ...timestamps,
});

export const verificationDocumentsRelations = relations(
  verificationDocuments,
  ({ one }) => ({
    owner: one(users, {
      fields: [verificationDocuments.ownerId],
      references: [users.id],
    }),

    store: one(stores, {
      fields: [verificationDocuments.storeId],
      references: [stores.id],
    }),
  })
);