import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, X, ChevronRight, User } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAdminListPlayers, useAdminGetPlayer } from "@workspace/api-client-react";

export default function Admin() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const { data: players, isLoading: listLoading, error: listError } = useAdminListPlayers(
    { passcode }, 
    { query: { enabled: isAuthenticated, retry: false } }
  );

  const { data: profile, isLoading: profileLoading } = useAdminGetPlayer(
    selectedPlayerId || "", 
    { passcode },
    { query: { enabled: !!selectedPlayerId && isAuthenticated } }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim()) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated || listError) {
    return (
      <Layout hideLogo>
        <div className="w-full max-w-md mx-auto mt-20">
          <div className="glass-panel p-8 rounded-3xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-2">Admin Access</h1>
              <p className="text-white/60 text-sm">Enter the portal passcode to review player submissions.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (listError) setIsAuthenticated(false);
                }}
                error={listError ? "Invalid passcode" : undefined}
              />
              <Button type="submit" className="w-full">Access Dashboard</Button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideLogo>
      <div className="w-full max-w-6xl mx-auto pt-8 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-black text-white uppercase">Player Submissions</h1>
          <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)}>Logout</Button>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 bg-black/40">
          {listLoading ? (
            <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-white/50" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/60">
                    <th className="p-4 font-semibold">Player</th>
                    <th className="p-4 font-semibold">Academy</th>
                    <th className="p-4 font-semibold">Position</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Parent</th>
                    <th className="p-4 font-semibold text-center">Coach</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {players?.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedPlayerId(p.id)}>
                      <td className="p-4 font-medium text-white">{p.playerName} <span className="text-white/40 text-sm ml-2">Age {p.age}</span></td>
                      <td className="p-4 text-white/80">{p.academyName}</td>
                      <td className="p-4 text-white/80">{p.position}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {p.parentSubmitted ? <span className="text-green-400 font-bold">✓</span> : <span className="text-white/20">-</span>}
                      </td>
                      <td className="p-4 text-center">
                        {p.coachSubmitted ? <span className="text-green-400 font-bold">✓</span> : <span className="text-white/20">-</span>}
                      </td>
                      <td className="p-4 text-right">
                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white inline-block" />
                      </td>
                    </tr>
                  ))}
                  {players?.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-white/40">No player submissions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Full Profile */}
        <AnimatePresence>
          {selectedPlayerId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setSelectedPlayerId(null)}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative z-10 flex flex-col bg-zinc-950/90"
              >
                <div className="sticky top-0 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center z-20">
                  <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                    <User className="text-[var(--academy-primary,white)]" />
                    Player Profile
                  </h2>
                  <button onClick={() => setSelectedPlayerId(null)} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                    <X />
                  </button>
                </div>

                <div className="p-6 md:p-8">
                  {profileLoading ? (
                    <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-white/50" /></div>
                  ) : profile ? (
                    <div className="space-y-10">
                      {/* Demographics */}
                      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Name</div>
                          <div className="font-medium text-white">{profile.player.playerName}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Academy</div>
                          <div className="font-medium text-white">{profile.player.academyName}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Position</div>
                          <div className="font-medium text-white">{profile.player.position}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Age / No.</div>
                          <div className="font-medium text-white">{profile.player.age} yrs / #{profile.player.shirtNumber}</div>
                        </div>
                      </section>

                      {/* Journey Responses */}
                      <section>
                        <h3 className="text-xl font-display font-bold text-white mb-4 border-b border-white/10 pb-2">Player Journey</h3>
                        {profile.journeyResponses.length > 0 ? (
                          <div className="space-y-6">
                            {Array.from(new Set(profile.journeyResponses.map(r => r.stage))).map(stage => (
                              <div key={stage} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h4 className="text-lg font-display font-bold text-[var(--academy-primary,white)] capitalize mb-4">{stage.replace('-', ' ')}</h4>
                                <div className="space-y-4">
                                  {profile.journeyResponses.filter(r => r.stage === stage).map(r => (
                                    <div key={r.questionNumber}>
                                      <p className="text-sm font-semibold text-white/80 mb-1">Q{r.questionNumber}. {r.questionText}</p>
                                      <p className="text-white/90 italic pl-4 border-l-2 border-white/20">{r.answerText}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white/40 italic">No journey responses recorded.</p>
                        )}
                      </section>

                      {/* Parent Responses */}
                      <section>
                        <h3 className="text-xl font-display font-bold text-white mb-4 border-b border-white/10 pb-2">Parent Perspective</h3>
                        {profile.parentResponses.length > 0 ? (
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                            {profile.parentResponses.map(r => (
                              <div key={r.questionNumber}>
                                <p className="text-sm font-semibold text-white/80 mb-1">Q{r.questionNumber}. {r.questionText}</p>
                                <p className="text-white/90 italic pl-4 border-l-2 border-white/20">{r.answerText}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white/40 italic">Awaiting parent submission. Link: .../parent/{profile.player.parentCode}</p>
                        )}
                      </section>

                      {/* Coach Responses */}
                      <section>
                        <h3 className="text-xl font-display font-bold text-white mb-4 border-b border-white/10 pb-2">Coach Assessment</h3>
                        {profile.coachResponses.length > 0 ? (
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                            {profile.coachResponses.map(r => (
                              <div key={r.questionNumber}>
                                <p className="text-sm font-semibold text-white/80 mb-1">Q{r.questionNumber}. {r.questionText}</p>
                                <p className="text-white/90 italic pl-4 border-l-2 border-white/20">{r.answerText}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white/40 italic">Awaiting coach submission. Link: .../coach/{profile.player.coachCode}</p>
                        )}
                      </section>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
