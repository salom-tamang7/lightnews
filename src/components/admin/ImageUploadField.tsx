"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/actions/upload";

export function ImageUploadField({ defaultValue }: { defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File) {
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.error) setError(result.error);
      if (result.url) setUrl(result.url);
    });
  }

  return (
    <div>
      <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
        Cover image
      </label>
      <input type="hidden" name="coverImage" value={url} />
      {url && (
        <div className="relative w-full aspect-[16/9] mb-2 bg-surface rounded overflow-hidden">
          <Image src={url} alt="Cover preview" fill className="object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        disabled={isPending}
        className="w-full text-sm text-ink-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-hairline file:text-ink file:text-xs"
      />
      {isPending && <p className="text-xs text-ink-faint mt-1">Uploading…</p>}
      {error && <p className="text-xs text-crimson mt-1">{error}</p>}
    </div>
  );
}
