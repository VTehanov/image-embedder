"use client";

import { type Image } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";
import { UploadButton } from "~/components/uploadthing";
import { api } from "~/trpc/react";

const ImageGrid = ({
  images,
  isLoading = true,
}: {
  images: Image[];
  isLoading: boolean;
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {isLoading ? (
        <>
          <Skeleton className="relative top-[-3px] h-full w-full !rounded-none" />
          <Skeleton className="relative top-[-3px] h-full w-full !rounded-none" />
          <Skeleton className="relative top-[-3px] h-full w-full !rounded-none" />
        </>
      ) : null}
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
  const { data, isLoading } = api.image.getAll.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <UploadButton
        endpoint="sampleImage"
        onClientUploadComplete={(res) => {
          if (res[0]?.url) {
            mutate({ url: res[0].url });
            toast.success("Uploaded successfully!");
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      {data ? <ImageGrid isLoading={isLoading} images={data} /> : null}
    </main>
  );
}
