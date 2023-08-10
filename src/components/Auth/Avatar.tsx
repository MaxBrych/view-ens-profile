import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Avatar({ walletAddress, url, size, onUpload }: any) {
  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: any) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

  const uploadAvatar = async (event: any) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${walletAddress}`; // Using the wallet address as the filename
      const filePath = `${fileName}.${fileExt}`; // Including file extension

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center my-4">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="border border-gray-300 rounded-full "
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="bg-center bg-no-repeat bg-cover border border-gray-300 rounded-full bg-profil-pfp"
          style={{ height: size, width: size }}
        />
      )}
      <div
        className="flex items-center justify-center h-8 px-6 mt-2 text-sm font-bold text-center border border-gray-500 rounded-full cursor-pointer "
        style={{ width: size }}
      >
        <label htmlFor="single">{uploading ? "Uploading ..." : "Change"}</label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
