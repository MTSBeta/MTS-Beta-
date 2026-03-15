import { useState, useRef } from "react";
import { Image, Video, X, Plus, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaFile {
  localUrl: string;
  file: File;
  type: "image" | "video";
  uploaded: boolean;
  objectPath?: string;
}

interface MediaUploaderProps {
  onMediaChange: (objectPaths: string[]) => void;
  existingUrls?: string[];
}

async function uploadFile(file: File): Promise<string> {
  // Request presigned URL
  const res = await fetch("/api/storage/uploads/request-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  });
  const { uploadURL, objectPath } = await res.json();

  // Upload directly to storage
  await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return objectPath as string;
}

export function MediaUploader({ onMediaChange, existingUrls = [] }: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const newFiles: MediaFile[] = selected.map((f) => ({
      localUrl: URL.createObjectURL(f),
      file: f,
      type: f.type.startsWith("video/") ? "video" : "image",
      uploaded: false,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setUploading(true);

    // Upload all new files
    const uploadedPaths: string[] = [...existingUrls];
    const updatedFiles = [...files, ...newFiles];

    for (let i = 0; i < newFiles.length; i++) {
      try {
        const path = await uploadFile(newFiles[i].file);
        newFiles[i].objectPath = path;
        newFiles[i].uploaded = true;
        uploadedPaths.push(path);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    setFiles(updatedFiles.map((f) => {
      const updated = newFiles.find((nf) => nf.localUrl === f.localUrl);
      return updated ?? f;
    }));

    setUploading(false);
    onMediaChange(uploadedPaths.filter(Boolean));

    // Reset input
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    const paths = updated.filter((f) => f.objectPath).map((f) => f.objectPath!);
    onMediaChange([...existingUrls, ...paths]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {files.map((f, idx) => (
            <motion.div
              key={f.localUrl}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 bg-white/5"
            >
              {f.type === "image" ? (
                <img src={f.localUrl} alt="receipt" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/10">
                  <Video size={20} className="text-white/60" />
                </div>
              )}
              {!f.uploaded && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 rounded-full flex items-center justify-center text-white/80 hover:text-red-400 transition-colors"
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-16 h-16 rounded-lg border border-dashed border-white/20 hover:border-white/40 bg-white/3 hover:bg-white/8 flex flex-col items-center justify-center gap-1 text-white/40 hover:text-white/70 transition-all"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          ) : (
            <>
              <Plus size={16} />
              <span className="text-[9px] font-medium">Receipt</span>
            </>
          )}
        </button>
      </div>

      {files.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-white/60 hover:text-white text-sm font-medium w-fit"
        >
          <Image size={16} className="text-blue-400" />
          Add photo or video
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
