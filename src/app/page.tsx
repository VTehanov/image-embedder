"use client";

import { type Image } from "@prisma/client";
import { UploadButton } from "~/components/uploadthing";
import { api } from "~/trpc/react";

const ImageGrid = ({ images }: { images: Image[] }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="h-48 w-48 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image.url})`,
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const utils = api.useUtils();
  const { mutate } = api.image.create.useMutation({
    onSuccess: async () => {
      await utils.image.getAll.invalidate();
    },
  });
  const { data } = api.image.getAll.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <UploadButton
        endpoint="sampleImage"
        onClientUploadComplete={(res) => {
          if (res[0]?.url) {
            mutate({ url: res[0].url });
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      {data ? <ImageGrid images={data} /> : null}
    </main>
  );
}
