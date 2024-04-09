import { isEmail } from "@/utils/email";
import { z } from "zod";

export const listOfEmails = z
  .string()
  .array()
  .optional()
  .refine((val) => {
    if (!val) {
      return true;
    }
    return val.every((email) => {
      return isEmail(email);
    });
  });

export const bookTitle = z
  .string()
  .min(2, {
    message: "Title must be at least 2 characters.",
  })
  .max(255, {
    message: "Title cannot be longer than 255 characters.",
  });
