import { z } from "zod";
import { embedText, getImageDescription } from "~/lib/openai";
import { getMatchesFromEmbeddings, upsertImage } from "~/lib/pinecone";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const images = await ctx.db.image.findMany();

    return images;
  }),

  create: publicProcedure
    .input(z.object({ url: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [storedImage] = await Promise.all([
        ctx.db.image.create({
          data: {
            url: input.url,
          },
        }),
        embedImage(input.url),
      ]);

      return storedImage;
    }),

  searchImages: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const embeddedQuery = await embedText(input.query);
      const results = await getMatchesFromEmbeddings(embeddedQuery, 5);

      return results;
    }),
});

const embedImage = async (url: string) => {
  const imageDescription = await getImageDescription(url);
  const embeddedMetadata = await embedText(imageDescription!);
  await upsertImage(embeddedMetadata, url);
};
