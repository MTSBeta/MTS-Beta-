import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/api$/, "/api");

interface PhotoSlot {
  label: string;
  hint: string;
  icon: string;
  imageType: string;
}

const SLOTS: PhotoSlot[] = [
  { label: "Face photo",    hint: "Clear shot of your face — like a headshot",      icon: "👤", imageType: "likeness_face"   },
  { label: "Action shot",   hint: "You in your kit, training or in a match",         icon: "⚽", imageType: "likeness_action" },
  { label: "Another angle", hint: "Anything else that shows who you are",             icon: "📸", imageType: "likeness_other"  },
];

export interface LikenessUploadContext {
  playerId: string;
  playerCode: string;
  playerName: string;
  academyName: string;
}

interface PhotoState {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  driveLink?: string;
  error?: string;
}

interface LikenessUploaderProps {
  primaryColor: string;
  uploadContext?: LikenessUploadContext;
  onPhotosChange?: (photos: (File | null)[]) => void;
}

export function LikenessUploader({ primaryColor, uploadContext, onPhotosChange }: LikenessUploaderProps) {
  const [photos, setPhotos] = useState<(PhotoState | null)[]>([null, null, null]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const uploadToServer = async (file: File, slotIndex: number): Promise<void> => {
    const slot = SLOTS[slotIndex];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("image_type", slot.imageType);
    formData.append("upload_source", "welcome_screen");

    if (uploadContext) {
      formData.append("player_id",       uploadContext.playerId);
      formData.append("player_code",     uploadContext.playerCode);
      formData.append("player_name",     uploadContext.playerName);
      formData.append("academy_name",    uploadContext.academyName);
      formData.append("contributor_role", "player");
      formData.append("contributor_name", uploadContext.playerName);
    }

    const res = await fetch(`${API_BASE}/images/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Upload failed");
    }

    const data = await res.json();
    setPhotos(prev => {
      const next = [...prev];
      if (next[slotIndex]) {
        next[slotIndex] = { ...next[slotIndex]!, status: "done", driveLink: data.driveFileLink };
      }
      return next;
    });
  };

  const handleFile = async (index: number, file: File | null) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);

    setPhotos(prev => {
      const next = [...prev];
      if (next[index]?.preview) URL.revokeObjectURL(next[index]!.preview);
      next[index] = { file, preview, status: uploadContext ? "uploading" : "done" };
      return next;
    });

    onPhotosChange?.(photos.map((p, i) => i === index ? file : p?.file ?? null));

    if (uploadContext) {
      try {
        await uploadToServer(file, index);
      } catch (err: any) {
        setPhotos(prev => {
          const next = [...prev];
          if (next[index]) next[index] = { ...next[index]!, status: "error", error: err.message };
          return next;
        });
      }
    }
  };

  const removePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = photos[index];
    if (prev?.preview) URL.revokeObjectURL(prev.preview);
    setPhotos(p => { const n = [...p]; n[index] = null; return n; });
    onPhotosChange?.(photos.map((p, i) => i === index ? null : p?.file ?? null));
    if (inputRefs[index].current) inputRefs[index].current!.value = "";
  };

  const filledCount = photos.filter(Boolean).length;
  const doneCount = photos.filter(p => p?.status === "done").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white font-bold text-base">Your photos</p>
          <p className="text-white/45 text-xs mt-0.5 max-w-xs leading-relaxed">
            We'll use these to create an illustration of you for your story. No other use — just for the book.
          </p>
        </div>
        {filledCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-green-400 text-xs font-semibold shrink-0"
          >
            <CheckCircle2 size={14} />
            {uploadContext ? `${doneCount}/${filledCount} saved` : `${filledCount}/3`}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SLOTS.map((slot, i) => {
          const photo = photos[i];
          return (
            <div key={i} className="flex flex-col gap-2">
              <AnimatePresence mode="wait">
                {photo ? (
                  <motion.div
                    key="filled"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                    onClick={() => inputRefs[i].current?.click()}
                    style={{ boxShadow: `0 0 16px ${primaryColor}30` }}
                  >
                    <img src={photo.preview} alt={slot.label} className="w-full h-full object-cover" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={20} className="text-white" />
                    </div>

                    {/* Remove button */}
                    {photo.status !== "uploading" && (
                      <button
                        type="button"
                        onClick={(e) => removePhoto(i, e)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-all z-10"
                      >
                        <X size={12} />
                      </button>
                    )}

                    {/* Status badge */}
                    <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
                      style={{ background: photo.status === "error" ? "#ef4444" : photo.status === "done" ? primaryColor : "rgba(0,0,0,0.5)" }}>
                      {photo.status === "uploading" && (
                        <Loader2 size={10} className="text-white animate-spin" />
                      )}
                      {photo.status === "done" && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4.2 7.2L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {photo.status === "error" && (
                        <AlertCircle size={10} className="text-white" />
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="empty"
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => inputRefs[i].current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-white/15 hover:border-white/35 bg-white/3 hover:bg-white/6 flex flex-col items-center justify-center gap-2 transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{slot.icon}</span>
                    <Camera size={14} className="text-white/25 group-hover:text-white/50 transition-colors" />
                  </motion.button>
                )}
              </AnimatePresence>

              <p className="text-white/50 text-[10px] text-center font-medium leading-tight">{slot.label}</p>

              {/* Retry on error */}
              {photo?.status === "error" && (
                <button
                  type="button"
                  onClick={() => uploadToServer(photo.file, i)}
                  className="text-red-400 text-[9px] text-center underline leading-tight"
                >
                  Retry upload
                </button>
              )}

              <input
                ref={inputRefs[i]}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => handleFile(i, e.target.files?.[0] ?? null)}
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SLOTS.map((slot, i) => (
          <p key={i} className="text-white/25 text-[9px] text-center leading-tight">{slot.hint}</p>
        ))}
      </div>

      {filledCount > 0 && filledCount < 3 && (
        <p className="text-white/35 text-xs text-center">
          {3 - filledCount} more photo{3 - filledCount !== 1 ? "s" : ""} recommended — but you can continue now.
        </p>
      )}
      {filledCount === 3 && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-400/80 text-xs text-center flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 size={12} />
          All 3 photos added — perfect for illustration.
        </motion.p>
      )}
    </div>
  );
}
