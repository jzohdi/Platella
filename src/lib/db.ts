import { db } from "@/server/db";
import {
  type DbUser,
  books,
  booksToImages,
  images,
  roleEnum,
  users,
  usersToBooks,
  type UsersToBooks,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";

export async function findUsersWhereEmailIn(emails: string[]) {
  return await db
    .select()
    .from(users)
    .where(sql`${users.email} in (${emails.join(", ")})`);
}

export async function createNewBook(
  title: string,
  coverKey: string,
  userId: string,
  collaborators?: DbUser[],
) {
  const createdBooks = await db.insert(books).values({ title }).returning();
  const newBook = createdBooks.at(0);
  if (createdBooks.length !== 1 || !newBook) {
    console.error("books length is not 1: ", createdBooks.length);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
  await db.insert(images).values({ id: coverKey });
  await db
    .insert(booksToImages)
    .values({ bookId: newBook.id, imageId: coverKey });
  if (collaborators) {
    const insertCollaboratorRecords: UsersToBooks[] = collaborators.map(
      (c) => ({
        role: roleEnum.enumValues[1],
        bookId: newBook.id,
        userId: c.id,
      }),
    );
    insertCollaboratorRecords.push({
      role: roleEnum.enumValues[2],
      bookId: newBook.id,
      userId,
    });
    await db.insert(usersToBooks).values(insertCollaboratorRecords);
  }
  return newBook;
}
