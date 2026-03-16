import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Eye } from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { ClubBadge } from "@/components/ClubBadge";
import { fetchAcademyBranding, updateAcademyBranding } from "@/lib/staffApi";
import type { AcademyConfig } from "@/data/academies";
import { useToast } from "@/hooks/use-toast";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const isValid = HEX_RE.test(value);
  return (
    <div>
      <label className="block text-xs text-white/40 uppercase font-bold tracking-wider mb-2 font-display">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={isValid ? value : "#000000"}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            disabled={disabled}
            className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          maxLength={7}
          className={`flex-1 bg-white/[0.05] border rounded-xl px-4 py-2.5 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all disabled:opacity-40 ${
            isValid || value === ""
              ? "border-white/10 focus:ring-white/20"
              : "border-red-500/50 focus:ring-red-500/30"
          }`}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  multiline?: boolean;
}) {
  const inputClasses =
    "w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-0 transition-all disabled:opacity-40";
  return (
    <div>
      <label className="block text-xs text-white/40 uppercase font-bold tracking-wider mb-2 font-display">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={3}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
}

export default function StaffSettings() {
  const { staffUser, updateStaffUser } = useStaffAuth();
  const { toast } = useToast();
  const isAdmin = staffUser?.role === "academy_admin";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [accentColor, setAccentColor] = useState("");
  const [crestUrl, setCrestUrl] = useState("");
  const [logoText, setLogoText] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [chantUrl, setChantUrl] = useState("");

  useEffect(() => {
    fetchAcademyBranding()
      .then((data) => {
        setPrimaryColor(data.primaryColor);
        setSecondaryColor(data.secondaryColor);
        setAccentColor(data.accentColor || "");
        setCrestUrl(data.crestUrl || "");
        setLogoText(data.logoText);
        setWelcomeMessage(data.welcomeMessage);
        setChantUrl(data.chantUrl || "");
      })
      .catch(() => {
        if (staffUser) {
          setPrimaryColor(staffUser.academyPrimaryColor);
          setSecondaryColor(staffUser.academySecondaryColor);
          setAccentColor(staffUser.academyAccentColor || "");
          setCrestUrl(staffUser.academyCrestUrl || "");
          setLogoText(staffUser.academyLogoText || "");
          setWelcomeMessage(staffUser.academyWelcomeMessage || "");
          setChantUrl(staffUser.academyChantUrl || "");
        }
      })
      .finally(() => setLoading(false));
  }, [staffUser]);

  const previewAcademy: AcademyConfig = {
    id: staffUser?.academyId || 0,
    key: "",
    name: staffUser?.academyName || "Academy",
    shortName: staffUser?.academyName || "Academy",
    logoText: logoText || "ABC",
    tier: "premier-league",
    primaryColor: HEX_RE.test(primaryColor) ? primaryColor : "#3b82f6",
    secondaryColor: HEX_RE.test(secondaryColor) ? secondaryColor : "#FFFFFF",
    accentColor: accentColor && HEX_RE.test(accentColor) ? accentColor : undefined,
    crestUrl: crestUrl || undefined,
    welcomeMessage: welcomeMessage || "",
    chantUrl: chantUrl || undefined,
  };

  const canSave =
    isAdmin &&
    HEX_RE.test(primaryColor) &&
    HEX_RE.test(secondaryColor) &&
    (accentColor === "" || HEX_RE.test(accentColor)) &&
    logoText.length > 0 &&
    logoText.length <= 20 &&
    welcomeMessage.length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const result = await updateAcademyBranding({
        primaryColor,
        secondaryColor,
        accentColor: accentColor || null,
        crestUrl: crestUrl || null,
        logoText,
        welcomeMessage,
        chantUrl: chantUrl || null,
      });

      updateStaffUser({
        academyPrimaryColor: result.primaryColor,
        academySecondaryColor: result.secondaryColor,
        academyAccentColor: result.accentColor,
        academyCrestUrl: result.crestUrl,
        academyLogoText: result.logoText,
        academyWelcomeMessage: result.welcomeMessage,
        academyChantUrl: result.chantUrl,
      });

      toast({
        title: "Settings saved",
        description: "Academy branding has been updated successfully.",
      });
    } catch (err: unknown) {
      toast({
        title: "Failed to save",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const themeColor = staffUser?.academyPrimaryColor || "#3b82f6";

  if (loading) {
    return (
      <StaffLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-white/40" size={32} />
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="space-y-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
            Academy Settings
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {isAdmin
              ? "Customise your academy's branding and portal appearance."
              : "View your academy's branding settings."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-display font-bold text-white/60 uppercase tracking-wider mb-5">
                Colours
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ColorField
                  label="Primary Colour"
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  disabled={!isAdmin}
                />
                <ColorField
                  label="Secondary Colour"
                  value={secondaryColor}
                  onChange={setSecondaryColor}
                  disabled={!isAdmin}
                />
                <ColorField
                  label="Accent Colour (optional)"
                  value={accentColor}
                  onChange={setAccentColor}
                  disabled={!isAdmin}
                />
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-display font-bold text-white/60 uppercase tracking-wider mb-5">
                Badge & Identity
              </h3>
              <div className="space-y-5">
                <TextField
                  label="Logo Text (shown on badge)"
                  value={logoText}
                  onChange={setLogoText}
                  disabled={!isAdmin}
                  placeholder="e.g. AFC"
                />
                <TextField
                  label="Crest URL (optional)"
                  value={crestUrl}
                  onChange={setCrestUrl}
                  disabled={!isAdmin}
                  placeholder="https://example.com/crest.svg"
                />
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-display font-bold text-white/60 uppercase tracking-wider mb-5">
                Content
              </h3>
              <div className="space-y-5">
                <TextField
                  label="Welcome Message"
                  value={welcomeMessage}
                  onChange={setWelcomeMessage}
                  disabled={!isAdmin}
                  placeholder="Welcome to the academy..."
                  multiline
                />
                <TextField
                  label="Club Chant URL (optional)"
                  value={chantUrl}
                  onChange={setChantUrl}
                  disabled={!isAdmin}
                  placeholder="https://example.com/chant.mp3"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Eye size={14} className="text-white/40" />
                <h3 className="text-sm font-display font-bold text-white/60 uppercase tracking-wider">
                  Badge Preview
                </h3>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/5 w-full flex items-center justify-center">
                  <ClubBadge academy={previewAcademy} size={120} />
                </div>
                <p className="text-xs text-white/30 text-center">
                  {crestUrl
                    ? "Showing uploaded crest image. Clear the URL to see the generated badge."
                    : "Generated badge using your colours and logo text."}
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-display font-bold text-white/60 uppercase tracking-wider mb-4">
                Academy Info
              </h3>
              <div className="space-y-3">
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1 font-display">
                    Name
                  </div>
                  <div className="text-white text-sm font-medium">
                    {staffUser?.academyName || "—"}
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1 font-display">
                    Your Role
                  </div>
                  <div className="text-white text-sm font-medium capitalize">
                    {staffUser?.role?.replace(/_/g, " ") || "—"}
                  </div>
                </div>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={handleSave}
                disabled={!canSave || saving}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                style={{ background: themeColor }}
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </StaffLayout>
  );
}
