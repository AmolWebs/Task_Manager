import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // "call", "email", "meeting"
  priority: text("priority").notNull(), // "high", "medium", "low"
  associatedRecord: text("associated_record"),
  assignedTo: text("assigned_to"),
  dueDate: timestamp("due_date").notNull(),
  notes: text("notes"),
  completed: boolean("completed").notNull().default(false),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
