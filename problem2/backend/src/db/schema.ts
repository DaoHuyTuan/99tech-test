import { decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tokens = pgTable("tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  symbol: text("symbol").notNull().unique(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const pricings = pgTable("pricings", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: uuid("token_id")
    .notNull()
    .unique()
    .references(() => tokens.id, { onDelete: "cascade" }),
  basePrice: decimal("base_price", { precision: 18, scale: 8 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tokensRelations = relations(tokens, ({ many }) => ({
  pricings: many(pricings),
}));

export const pricingsRelations = relations(pricings, ({ one }) => ({
  token: one(tokens, {
    fields: [pricings.tokenId],
    references: [tokens.id],
  }),
}));
