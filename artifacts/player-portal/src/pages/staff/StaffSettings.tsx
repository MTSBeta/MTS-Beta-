import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";

export default function StaffSettings() {
  const { staffUser } = useStaffAuth();
  const primaryColor = staffUser?.academyPrimaryColor || "#3b82f6";

  return (
    <StaffLayout>
      <div className="space-y-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
            Academy Settings
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Configure your academy portal settings.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-8"
        >
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${primaryColor}20`, color: primaryColor }}
            >
              <Settings size={32} />
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Coming Soon
            </h2>
            <p className="text-white/40 text-sm max-w-md">
              Academy settings including branding customisation, notification preferences,
              and portal configuration will be available in a future update.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-sm font-display font-bold text-white/60 uppercase tracking-wider mb-4">
            Current Academy Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
              <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1 font-display">
                Academy Name
              </div>
              <div className="text-white text-sm font-medium">
                {staffUser?.academyName || "—"}
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
              <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1 font-display">
                Primary Colour
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md border border-white/20"
                  style={{ background: primaryColor }}
                />
                <span className="text-white text-sm font-mono">{primaryColor}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </StaffLayout>
  );
}
