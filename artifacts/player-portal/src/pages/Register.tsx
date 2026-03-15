import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { usePlayerContext } from "@/context/PlayerContext";
import { POSITIONS } from "@/data/positions";
import { useRegisterPlayer } from "@workspace/api-client-react";

const registerSchema = z.object({
  playerName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(6, "Must be at least 6").max(21, "Must be under 21"),
  shirtNumber: z.coerce.number().min(1, "Invalid number").max(99, "Invalid number"),
  accessCode: z.string().min(3, "Code required"),
  position: z.string().min(1, "Position required")
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, setPlayerData } = usePlayerContext();
  
  // If no academy selected, bounce back
  if (!selectedAcademy) {
    navigate("/");
    return null;
  }

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="glass-panel rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Registration</h1>
            <p className="text-white/60">Enter your details to begin your story.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="e.g. Marcus Rashford"
              {...register("playerName")}
              error={errors.playerName?.message}
            />
            
            <div className="grid grid-cols-2 gap-5">
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

            <div className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-white/80 uppercase tracking-wider font-display ml-1">
                Primary Position
              </label>
              <select
                className={`flex h-12 w-full rounded-xl glass-input px-4 text-base font-medium appearance-none ${errors.position ? 'border-red-500/50' : ''}`}
                {...register("position")}
              >
                <option value="" className="bg-zinc-900">Select Position</option>
                {POSITIONS.map(pos => (
                  <option key={pos.id} value={pos.id} className="bg-zinc-900">
                    {pos.id} - {pos.displayName}
                  </option>
                ))}
              </select>
              {errors.position && <span className="text-xs text-red-400 font-medium ml-1">{errors.position.message}</span>}
            </div>

            <Input
              label="Academy Access Code"
              placeholder="Provided by coach"
              {...register("accessCode")}
              error={errors.accessCode?.message}
            />

            <Button type="submit" className="w-full mt-8" isLoading={isPending}>
              Create Profile
            </Button>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
}
