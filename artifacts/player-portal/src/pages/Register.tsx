import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PitchPositionPicker } from "@/components/PitchPositionPicker";
import { usePlayerContext } from "@/context/PlayerContext";
import { useRegisterPlayer } from "@workspace/api-client-react";

const registerSchema = z.object({
  playerName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(6, "Must be at least 6").max(21, "Must be under 21"),
  shirtNumber: z.coerce.number().min(1, "Invalid number").max(99, "Invalid number"),
  accessCode: z.string().min(3, "Code required"),
  position: z.string().min(1, "Tap your position on the pitch above")
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, setPlayerData } = usePlayerContext();

  if (!selectedAcademy) {
    navigate("/");
    return null;
  }

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { position: "" }
  });

  const { mutate: registerPlayer, isPending } = useRegisterPlayer({
    mutation: {
      onSuccess: (data) => {
        setPlayerData(data);
        navigate("/welcome");
      },
      onError: (err) => {
        console.error("Registration failed", err);
      }
    }
  });

  const onSubmit = (data: RegisterFormData) => {
    registerPlayer({
      data: {
        playerName: data.playerName,
        age: data.age,
        shirtNumber: data.shirtNumber,
        academyKey: selectedAcademy.key,
        position: data.position
      }
    });
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl font-black text-white mb-3 font-display"
              style={{ backgroundColor: selectedAcademy.primaryColor }}
            >
              {selectedAcademy.abbreviation}
            </div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-wide">
              Create Your Profile
            </h1>
            <p className="text-white/50 text-sm mt-1">{selectedAcademy.name} · Player Portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="e.g. Marcus Rashford"
              {...register("playerName")}
              error={errors.playerName?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                placeholder="14"
                {...register("age")}
                error={errors.age?.message}
              />
              <Input
                label="Shirt Number"
                type="number"
                placeholder="10"
                {...register("shirtNumber")}
                error={errors.shirtNumber?.message}
              />
            </div>

            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <PitchPositionPicker
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.position?.message}
                />
              )}
            />

            <Input
              label="Academy Access Code"
              placeholder="Provided by your coach"
              {...register("accessCode")}
              error={errors.accessCode?.message}
            />

            <Button type="submit" className="w-full mt-2" isLoading={isPending}>
              Begin My Story
            </Button>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}
