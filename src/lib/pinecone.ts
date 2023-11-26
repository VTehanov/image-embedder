import { Pinecone } from "@pinecone-database/pinecone";
import { nanoid } from "nanoid";
import { env } from "~/env";

const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
  environment: env.PINECONE_ENV,
});

export const upsertImage = async (embeddings: number[], imageUrl: string) => {
  const index = pinecone.index("image-embedder");
  await index.upsert([
    {
      id: nanoid(),
      values: embeddings,
      metadata: { imageUrl },
    },
  ]);
};
