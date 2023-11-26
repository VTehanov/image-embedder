import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  sampleImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(() => null),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
