import { relations, sql, type InferSelectModel } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";

//  ============== start common types ============

const varCharUuid = (name: string) => varchar(name, { length: 128 });
export const roleEnum = pgEnum("role", ["viewer", "collaborator", "owner"]);

// =================================================

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `platella_${name}`);

export const users = createTable(
  "user",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar("image", { length: 255 }),
  },
  (table) => ({
    userEmailIdx: index("user_email_idx").on(table.email),
  }),
);

export type DbUser = InferSelectModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  usersToBooks: many(usersToBooks),
}));

export const usersToBooks = createTable(
  "users_to_books",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: varCharUuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.bookId] }),
    userIdx: index("user_to_books_user_idx").on(t.userId),
  }),
);

export type UsersToBooks = InferSelectModel<typeof usersToBooks>;

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// ======== books with permissions =================
export const books = createTable("recipe_books", {
  id: varCharUuid("id")
    .$defaultFn(() => createId())
    .unique()
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
});

export const bookRelations = relations(books, ({ many }) => ({
  usersToBooks: many(usersToBooks),
  booksToImages: many(booksToImages),
}));

export const booksToImages = createTable(
  "books_to_images",
  {
    bookId: varCharUuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    imageId: varCharUuid("image_id")
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.bookId, t.imageId] }),
  }),
);

// ========== images with relations =====================

export const images = createTable("images", {
  id: varCharUuid("id").notNull().unique().primaryKey(),
});

export const imageRelations = relations(images, ({ many }) => ({
  booksToImages: many(booksToImages),
}));
