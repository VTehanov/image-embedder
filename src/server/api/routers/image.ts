import { z } from "zod";
import { getImageDescription } from "~/lib/openai";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const images = await ctx.db.image.findMany();

    return images;
  }),

  create: publicProcedure
    .input(z.object({ url: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [metadata, storedImage] = await Promise.all([
        getImageDescription(input.url),
        ctx.db.image.create({
          data: {
            url: input.url,
          },
        }),
      ]);

      return storedImage;
    }),
});
