"use client";

import { supabase } from "@/utils/supabase";
import { useState } from "react";

export default function New() {
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const productName = formData.get("productName") as string;
    const files = formData.getAll("images") as File[];

    const uploadedUrls: string[] = [];

    try {
      // 1. Loop through files and upload them to Supabase Storage
      for (const file of files) {
        if (!file || file.size === 0) continue;

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36)}.${fileExt}`;
        const filePath = `product-images/${fileName}`; // Path inside your bucket

        const { error: uploadError } = await supabase.storage
          .from("your-bucket-name") // Replace with your actual bucket name
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get the Public URL for the uploaded file
        const { data } = supabase.storage
          .from("your-bucket-name")
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      // 3. Insert the product record with the ImageUrl array into Supabase
      const { error: dbError } = await supabase.from("product").insert({
        name: productName,
        ImageUrl: uploadedUrls, // Supabase accepts a standard JavaScript array for TEXT[] columns
      });

      if (dbError) throw dbError;

      alert("Product and images uploaded successfully!");
      e.currentTarget.reset();
    } catch (error: any) {
      console.error("Upload failed:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-base-100 shadow-xl rounded-box"
    >
      <h2 className="text-xl font-bold">Add New Product</h2>

      <div className="form-control">
        <label className="label font-medium">Product Name</label>
        <input
          type="text"
          name="productName"
          placeholder="e.g. Wireless Headphones"
          required
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label font-medium">Product Images (Multiple)</label>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          required
          className="file-input file-input-bordered w-full"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="btn btn-primary mt-2 w-full"
      >
        {uploading ? "Uploading Images..." : "Save Product"}
      </button>
    </form>
  );
}
