import { publicAssetUrl } from "@/lib/publicAssetUrl";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { PitchPositionPicker } from "@/components/PitchPositionPicker";
import { usePlayerContext } from "@/context/PlayerContext";
import { useRegisterPlayer } from "@workspace/api-client-react";

const schema = z.object({
  playerName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(6, "Must be at least 6").max(21, "Must be 21 or under"),
  shirtNumber: z.coerce.number().min(1, "Invalid").max(99, "Invalid"),
  position: z.string().min(1, "Tap your position on the pitch above"),
  secondPosition: z.string().optional(),
  accessCode: z.string().min(3, "Access code required"),
});

type FormData = z.infer<typeof schema>;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1.5">{children}</p>;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-400 text-xs mt-1">{msg}</p>;
}

export default function Register() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, setPlayerData } = usePlayerContext();

  if (!selectedAcademy) { navigate("/"); return null; }

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { position: "", secondPosition: "" },
  });

  const primaryPosition = watch("position");

  const { mutate, isPending, isError } = useRegisterPlayer({
    mutation: {
      onSuccess: (data) => {
        setPlayerData(data);
        navigate(data.age <= 8 ? "/welcome-u9" : "/welcome");
      },
    },
  });

  const onSubmit = (data: FormData) => {
    mutate({ data: {
      playerName: data.playerName,
      age: data.age,
      shirtNumber: data.shirtNumber,
      academyKey: selectedAcademy.key,
      position: data.position,
      secondPosition: data.secondPosition || undefined,
      accessCode: data.accessCode,
    }});
  };

  const isLight = (() => {
    const r = parseInt(selectedAcademy.primaryColor.slice(1, 3), 16);
    const g = parseInt(selectedAcademy.primaryColor.slice(3, 5), 16);
    const b = parseInt(selectedAcademy.primaryColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  })();
  const btnText = isLight ? "#000" : "#fff";

  const inputClass = "w-full bg-white/6 border border-white/12 rounded-2xl px-4 py-4 text-white text-base placeholder:text-white/25 focus:outline-none focus:border-white/35 transition-colors";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={publicAssetUrl("images/hero-bg.png")} alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      {/* Topbar */}
      <div className="relative z-10 flex items-center px-4 h-12 border-b border-white/5">
        <button onClick={() => navigate("/auth")} className="flex items-center gap-1 text-white/40 hover:text-white/70 text-sm transition-colors min-h-[44px] px-1 -ml-1">
          <ChevronLeft size={18} />
          Back
        </button>
        <div className="flex-1 flex justify-center">
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Create Profile</span>
        </div>
        {selectedAcademy.crestUrl ? (
          <img
            src={selectedAcademy.crestUrl}
            alt={selectedAcademy.shortName}
            className="w-6 h-6 object-contain shrink-0"
            loading="lazy"
          />
        ) : (
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: selectedAcademy.primaryColor }}
          >
            {selectedAcademy.logoText}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-32">
        <div className="max-w-sm mx-auto px-4 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <p className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">
                Tell us about<br />
                <span style={{ color: selectedAcademy.primaryColor }}>yourself</span>
              </p>
              <p className="text-white/35 text-sm mt-2">{selectedAcademy.name} · Player Portal</p>
            </div>

            {/* Full name */}
            <div>
              <FieldLabel>Full name</FieldLabel>
              <input
                {...register("playerName")}
                type="text"
                placeholder="e.g. Marcus Rashford"
                className={`${inputClass} ${errors.playerName ? "border-red-500/50" : ""}`}
                autoCapitalize="words"
              />
              <FieldError msg={errors.playerName?.message} />
            </div>

            {/* Age + Shirt (side by side on mobile still OK — short fields) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Age</FieldLabel>
                <input
                  {...register("age")}
                  type="number"
                  inputMode="numeric"
                  placeholder="14"
                  className={`${inputClass} ${errors.age ? "border-red-500/50" : ""}`}
                />
                <FieldError msg={errors.age?.message} />
              </div>
              <div>
                <FieldLabel>Shirt #</FieldLabel>
                <input
                  {...register("shirtNumber")}
                  type="number"
                  inputMode="numeric"
                  placeholder="10"
                  className={`${inputClass} ${errors.shirtNumber ? "border-red-500/50" : ""}`}
                />
                <FieldError msg={errors.shirtNumber?.message} />
              </div>
            </div>

            {/* Primary position picker */}
            <div>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <PitchPositionPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.position?.message}
                    label="Primary Position"
                    accent="amber"
                  />
                )}
              />
            </div>

            {/* Second position picker (optional) */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Second Position</p>
                <span className="text-white/25 text-xs">(optional)</span>
              </div>
              <p className="text-white/30 text-xs mb-3">Some players are versatile — tap a second position if that's you.</p>
              <Controller
                name="secondPosition"
                control={control}
                render={({ field }) => (
                  <PitchPositionPicker
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabledId={primaryPosition}
                    label=""
                    accent="sky"
                  />
                )}
              />
            </div>

            {/* Access code */}
            <div>
              <FieldLabel>Coach Access Code</FieldLabel>
              <input
                {...register("accessCode")}
                type="text"
                placeholder="Provided by your coach"
                className={`${inputClass} ${errors.accessCode ? "border-red-500/50" : ""}`}
              />
              <FieldError msg={errors.accessCode?.message} />
            </div>

            {isError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">Registration failed. Check your access code and try again.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)", paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
        <div className="max-w-sm mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all disabled:opacity-50 font-display"
            style={{ background: selectedAcademy.primaryColor, color: btnText, boxShadow: `0 8px 32px ${selectedAcademy.primaryColor}60` }}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating profile…
              </span>
            ) : "Begin My Story →"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
