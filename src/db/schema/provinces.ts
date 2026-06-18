import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const provinces = pgTable("provinces",{
    id: uuid("id").primaryKey().$defaultFn(() => uuidv7()),
    name: text("name").unique().notNull(),
    slug: text("slug").unique().notNull(),

    createdAt: timestamp("created_at", {
        withTimezone: true
      }).defaultNow(),
    
      updatedAt: timestamp("updated_at", {
        withTimezone: true
      }).defaultNow(),

})