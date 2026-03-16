import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, CheckCircle2 } from "lucide-react";

interface PhotoSlot {
  label: string;
  hint: string;
  icon: string;
}

const SLOTS: PhotoSlot[] = [
  { label: "Face photo", hint: "Clear shot of your face — like a headshot", icon: "👤" },
  { label: "Action shot", hint: "You in your kit, training or in a match", icon: "⚽" },
  { label: "Another angle", hint: "Anything else that shows who you are", icon: "📸" },
];

interface LikenessUploaderProps {
  primaryColor: string;
  onPhotosChange?: (photos: (File | null)[]) => void;
}

export function LikenessUploader({ primaryColor, onPhotosChange }: LikenessUploaderProps) {
  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleFile = (index: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newPhotos = [...photos];
    const newPreviews = [...previews];
    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
    newPhotos[index] = file;
    newPreviews[index] = url;
    setPhotos(newPhotos);
    setPreviews(newPreviews);
    onPhotosChange?.(newPhotos);
  };

  const removePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (previews[index]) URL.revokeObjectURL(previews[index]!);
    const newPhotos = [...photos];
    const newPreviews = [...previews];
    newPhotos[index] = null;
    newPreviews[index] = null;
    setPhotos(newPhotos);
    setPreviews(newPreviews);
    onPhotosChange?.(newPhotos);
    if (inputRefs[index].current) inputRefs[index].current!.value = "";
  };

  const filledCount = photos.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
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
            {filledCount}/3
          </motion.div>
        )}
      </div>

      {/* Photo slots */}
      <div className="grid grid-cols-3 gap-3">
        {SLOTS.map((slot, i) => (
          <div key={i} className="flex flex-col gap-2">
            <AnimatePresence mode="wait">
              {previews[i] ? (
                /* Filled slot */
                <motion.div
                  key="filled"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => inputRefs[i].current?.click()}
                  style={{ boxShadow: `0 0 16px ${primaryColor}30` }}
                >
                  <img
                    src={previews[i]!}
                    alt={slot.label}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={20} className="text-white" />
                  </div>
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => removePhoto(i, e)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-all"
                  >
                    <X size={12} />
                  </button>
                  {/* Tick badge */}
                  <div
                    className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: primaryColor }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.2 7.2L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.div>
              ) : (
                /* Empty slot */
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

            {/* Slot label */}
            <p className="text-white/50 text-[10px] text-center font-medium leading-tight">{slot.label}</p>

            <input
              ref={inputRefs[i]}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => handleFile(i, e.target.files?.[0] ?? null)}
            />
          </div>
        ))}
      </div>

      {/* Hint text per slot */}
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
