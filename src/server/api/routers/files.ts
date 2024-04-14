import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "@/server/aws/client";
import { getNewFileName } from "@/utils/file";
import { z } from "zod";

export const filesRouter = createTRPCRouter({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fetch: z.boolean().refine((val) => !!val),
      }),
    )
    .mutation(async ({ ctx }) => {
      const awsClient = client;
      const userId = ctx.session.user.id;
      const { id, fileName } = getNewFileName(userId);
      const command = new PutObjectCommand({
        Bucket: "platella",
        Key: fileName,
        ACL: "public-read",
      });
      const url = await getSignedUrl(awsClient, command, { expiresIn: 3600 });
      return { url, id };
    }),
});
