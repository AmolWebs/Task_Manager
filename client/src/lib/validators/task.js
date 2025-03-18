import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task name is required"),
  type: z.enum(["call", "email", "meeting", "task"], {
    required_error: "Task type is required",
  }),
  priority: z.enum(["high", "medium", "low"], {
    required_error: "Priority is required",
  }),
  associatedRecord: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  dueTime: z.string().min(1, "Due time is required"),
  notes: z.string().optional(),
});