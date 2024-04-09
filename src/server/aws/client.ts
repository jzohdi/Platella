import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env";
/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: S3Client | undefined;
};
const client =
  globalForDb.client ??
  new S3Client({
    credentials: {
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: env.AWS_ACCESS_KEY_ID,
    },
  });
if (env.NODE_ENV !== "production") globalForDb.client = client;

export { client };
