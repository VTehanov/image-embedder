"use client";

import { UploadButton } from "~/components/uploadthing";

const ImageGrid = () => {
  const image = (
    <div
      className="h-48 w-48 bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1700740760502-f28b1769c8d3?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    />
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      {image}
      {image}
      {image}
      {image}
      {image}
      {image}
      {image}
      {image}
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <UploadButton
        endpoint="sampleImage"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      <ImageGrid />
    </main>
  );
}
