import {
    pgTable,
    serial,
    timestamp,
    integer,
    text,
    pgEnum,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
    "draft",
    "sent",
    "paid",
    "overdue",
    "void",
]);

export const Invoices = pgTable("invoices", {
    id: serial("id").primaryKey().notNull(),
    createTs: timestamp("createTs").defaultNow().notNull(),
    amount: integer("amount").notNull(),
    description: text("description").notNull(),
    status: statusEnum("status").notNull(),
});
