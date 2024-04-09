import { bookTitle, listOfEmails } from "@/utils/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { createNewBook, findUsersWhereEmailIn } from "@/lib/db";
import { TRPCError } from "@trpc/server";

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
});
