import { eq } from "drizzle-orm";
import { db } from ".";
import { users } from "./schema";

export async function getUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email));
}
