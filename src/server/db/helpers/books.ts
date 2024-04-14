import { getBookByIdAndUser, type getListOfBooks } from "@/lib/db";
import { type PromiseType } from "@/utils/types";
import { TRPCError } from "@trpc/server";

export type ExternalBook = {
  id: string;
  title: string;
  collaborators: { role: string; userId: string }[];
  images: string[];
};
type BookQueryRow = PromiseType<ReturnType<typeof getListOfBooks>>[0];

export function listOfBooksToExternal(
  listOfBooks: PromiseType<ReturnType<typeof getListOfBooks>>,
) {
  const collector = new Map<string, ExternalBook>();
  for (const row of listOfBooks) {
    addRowToCollector(collector, row);
  }
  return [...collector.values()];
}
export type ExternalBookById = {
  id: string;
  title: string;
  collaborators: {
    role: string;
    userId: string;
    email: string;
    name: string;
  }[];
  images: string[];
};

export type BookById = PromiseType<ReturnType<typeof getBookByIdAndUser>>;

// TODO: clean me
function addRowToCollector(
  collector: Map<string, ExternalBook>,
  row: BookQueryRow,
) {
  const { recipe_books, books_to_images, users_to_books } = row;
  if (recipe_books) {
    const { id } = recipe_books;
    if (!id) {
      console.error("book id not found for row: ", row);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create book response.",
      });
    }
    if (!collector.has(id)) {
      const newBook: ExternalBook = {
        id,
        title: recipe_books.title,
        collaborators: [],
        images: [],
      };
      collector.set(id, newBook);
    }
  }

  if (books_to_images) {
    const { imageId, bookId } = books_to_images;
    const book = collector.get(bookId);
    if (!book) {
      console.error(row);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create book response.",
      });
    }
    book.images.push(imageId);
  }
  if (users_to_books) {
    const { userId, role, bookId } = users_to_books;
    const book = collector.get(bookId);
    if (!book) {
      console.error(row);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create book response.",
      });
    }
    book.collaborators.push({ role, userId });
  }
}
