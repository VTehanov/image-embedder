"use client";

import { type Image } from "@prisma/client";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
  const [query, setQuery] = useState("");
  const { data, isLoading } = api.image.getAll.useQuery();
  const { mutate } = api.image.create.useMutation({
    onSuccess: async () => {
      await utils.image.getAll.invalidate();
    },
  });
  const { mutate: submitQuery, data: results } =
    api.image.searchImages.useMutation();

  const searchImages = () => {
    submitQuery({ query });
  };

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

      <div className="flex flex-col">
        <div className="flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={searchImages}>Search</Button>
        </div>

        {results?.length
          ? results.map((r) => <div>{r.metadata?.imageUrl}</div>)
          : null}
      </div>
    </main>
  );
}
