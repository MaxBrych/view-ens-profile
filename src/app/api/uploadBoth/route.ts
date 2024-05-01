import { NextResponse, NextRequest } from "next/server";
import getIrys from "@/utils/getIrys";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as any;
  const message = formData.get("message") as string;
  const address = formData.get("address") as string; // Assuming address is part of the form data

  const irys = await getIrys();

  // Create a JSON object for the metadata
  const metadata = {
    message,
    image: file, // Assuming 'file' contains the image data
  };

  // Convert the metadata to a Blob and then to a File
  const fileToUpload = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  const fileObject = new File([fileToUpload], "metadata.json", {
    type: "application/json",
  });

  // Define the tags, including the updated AppName tag
  const tags = [
    { name: "Content-Type", value: "application/json" },
    { name: "AppName", value: "Flippr" },
    { name: "address", value: address },
  ];

  try {
    const response = await irys.uploadFile(fileObject, { tags });
    console.log(`File uploaded ==> https://gateway.irys.xyz/${response.id}`);
    return NextResponse.json({
      txId: `https://gateway.irys.xyz/${response.id}`,
    });
  } catch (e) {
    console.error("Error uploading file ", e);
    return NextResponse.json({ error: "Failed to upload file" });
  }
}
