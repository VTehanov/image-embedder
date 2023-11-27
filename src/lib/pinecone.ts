import {
  Pinecone,
  type QueryOptions,
  type RecordMetadata,
  type ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import { nanoid } from "nanoid";
import { env } from "~/env";

const PINECONE_INDEX = "image-embedder";

const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
  environment: env.PINECONE_ENV,
});

export const upsertImage = async (embeddings: number[], imageUrl: string) => {
  const index = pinecone.index(PINECONE_INDEX);
  await index.upsert([
    {
      id: nanoid(),
      values: embeddings,
      metadata: { imageUrl },
    },
  ]);
};

export const getMatchesFromEmbeddings = async (
  embeddings: number[],
  topK: number,
): Promise<ScoredPineconeRecord<RecordMetadata>[]> => {
  const index = pinecone.Index(PINECONE_INDEX);

  const queryRequest: QueryOptions = {
    vector: embeddings,
    topK,
    includeMetadata: true,
  };

  try {
    const queryResult = await index.query(queryRequest);
    return queryResult.matches ?? [];
  } catch (error) {
    throw new Error("e", error as ErrorOptions);
  }
};
