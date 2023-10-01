"use client";
import { useState } from "react";
import NSFWFilter from "nsfw-filter";

export default function BundlrUpload() {
  const [data, setData] = useState("");
  const [file, setFile] = useState<any>();
  const [transaction, setTransaction] = useState("");
  const [isImageSafe, setIsImageSafe] = useState(true); // New state to manage whether the image is safe or not

  async function upload() {
    if (!data) return;
    try {
      setData("");
      const response = await fetch("api/upload", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);
    } catch (err) {
      console.log({ err });
    }
  }

  async function uploadFile() {
    if (!file) return;
    setData("");
    const buffer = await file.arrayBuffer();
    try {
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: buffer,
      });
      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);
    } catch (err) {
      console.log({ err });
    }
  }

  const handleFileChange = async (e: any) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // Check if the image is safe
      const isSafe = await NSFWFilter.isSafe(file);
      setIsImageSafe(isSafe); // Update the isImageSafe state

      if (isSafe) {
        // Only set the file if it is safe
        setFile(file);
      } else {
        console.warn("Uploaded image is not safe");
        // Optionally, you can clear the file input here or show a warning message to the user.
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-between">
      <input
        placeholder="Create a post"
        onChange={(e) => setData(e.target.value)}
        className="px-2 py-1 text-black"
      />
      <button onClick={upload} className="px-12 mt-2 text-black bg-white">
        Upload text
      </button>
      <input type="file" onChange={handleFileChange} />
      {!isImageSafe && (
        <span style={{ color: "red" }}>Uploaded image is not appropriate</span>
      )}
      <button
        onClick={uploadFile}
        className="px-12 mt-2 text-black bg-white"
        disabled={!isImageSafe}
      >
        Upload file
      </button>
      {transaction && (
        <a target="_blank" rel="no-opener" href={transaction}>
          View Arweave Data
        </a>
      )}
    </main>
  );
}
