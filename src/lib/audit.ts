import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export async function logAction(userId: number, action: string, details: any) {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      details,
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
}
