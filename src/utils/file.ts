import { createId } from "@paralleldrive/cuid2";

export function getNewFileName(userId: string) {
  const id = createId();
  return { fileName: `${userId}/${id}`, id };
}
