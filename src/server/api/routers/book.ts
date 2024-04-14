import { bookTitle, listOfEmails } from "@/utils/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import {
  createNewBook,
  findUsersWhereEmailIn,
  getBookByIdAndUser,
  getListOfBooks,
} from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { BookById, listOfBooksToExternal } from "@/server/db/helpers/books";

async function requireCollaboratorsExist(collaborators?: string[]) {
  if (!collaborators) {
    return;
  }
  const result = await findUsersWhereEmailIn(collaborators);
  if (result.length !== collaborators.length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "One or more collaborators entered does not exist.",
    });
  }
  return result;
}

export const createBookInput = z.object({
  title: bookTitle,
  collaborators: listOfEmails,
  coverKey: z.string(),
});

export type CreateBookInput = z.infer<typeof createBookInput>;

export const bookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBookInput)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const collaborators = await requireCollaboratorsExist(
        input.collaborators,
      );
      const newBook = await createNewBook(
        input.title,
        input.coverKey,
        userId,
        collaborators,
      );
      return newBook;
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const listBooks = await getListOfBooks(userId);

    return listOfBooksToExternal(listBooks);
  }),
  get: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const bookData = await getBookByIdAndUser(
        input.bookId,
        ctx.session.user.id,
      );
      const combinedBookData = mergeBookData(bookData, input.bookId);
      return combinedBookData;
    }),
});

function mergeBookData(bookData: BookById, bookId: string) {
  const newBook = {
    id: bookId,
    title: String(bookData[0]?.recipe_books?.title),
    users: parseUsersFromBook(bookData, bookId),
    images: bookData
      .map(({ books_to_images }) => books_to_images?.imageId)
      .filter((imageId) => !!imageId) as string[],
  };

  return newBook;
}

/**
 * want [{ id: (user_id), role: string, email: string }]
 */
type UserRole = { id: string; role: string; email: string };
function parseUsersFromBook(bookData: BookById, bookId: string) {
  const users = new Map<string, UserRole>();
  return [
    ...bookData
      .map(({ users_to_books, user }) => ({ users_to_books, user }))
      .filter(({ users_to_books }) => users_to_books?.bookId === bookId)
      .reduce((prev, { user, users_to_books }) => {
        const userId = user?.id;
        if (userId && !prev.has(userId)) {
          const newUser: UserRole = {
            id: userId,
            role: users_to_books?.role ?? "",
            email: user.email,
          };
          prev.set(userId, newUser);
        }
        return prev;
      }, users)
      .values(),
  ];
}
