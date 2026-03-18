import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

type Section = "pitch" | "dashboard" | "training" | "academy";

interface Position {
  id: string;
  label: string;
  x: number;
  y: number;
  challenges: string;
  lessons: string[];
  advice: string;
  deliverables: string[];
}

const positions: Position[] = [
  {
    id: "gk", label: "Goalkeeper", x: 50, y: 90,
    challenges: "Isolation, last line of defence pressure, decision-making under extreme stress.",
    lessons: ["Trust your instincts and your training", "Leadership from the back — your voice matters", "Mistakes are data, not defeats"],
    advice: "The best goalkeepers have the shortest memory. Let it go, reset, and be ready for the next moment.",
    deliverables: ["Isolation & courage story", "Decision-making under pressure", "Leadership voice narrative"],
  },
  {
    id: "cb", label: "Centre Back", x: 35, y: 76,
    challenges: "Leadership responsibility, communication under pressure, managing physical confrontation.",
    lessons: ["Command your area with confidence", "Calmness is a superpower at the back", "Read the game before it happens"],
    advice: "A great defender wins the battle before the ball arrives — in their head.",
    deliverables: ["Leadership under pressure", "Defensive composure story", "Team communication narrative"],
  },
  {
    id: "cb2", label: "Centre Back", x: 65, y: 76,
    challenges: "Leadership responsibility, communication under pressure, managing physical confrontation.",
    lessons: ["Command your area with confidence", "Calmness is a superpower at the back", "Read the game before it happens"],
    advice: "A great defender wins the battle before the ball arrives — in their head.",
    deliverables: ["Leadership under pressure", "Defensive composure story", "Team communication narrative"],
  },
  {
    id: "lb", label: "Left Back", x: 15, y: 72,
    challenges: "Balancing attack and defence, positional discipline, dealing with wide play pressure.",
    lessons: ["Discipline creates freedom — know your role", "Recovery runs build mental toughness", "Your position is a foundation, not a limitation"],
    advice: "The most underrated players shape the game from the side. Own your lane.",
    deliverables: ["Positional confidence story", "Resilience after mistakes", "Wide play mental strength"],
  },
  {
    id: "rb", label: "Right Back", x: 85, y: 72,
    challenges: "Balancing attack and defence, positional discipline, dealing with wide play pressure.",
    lessons: ["Discipline creates freedom — know your role", "Recovery runs build mental toughness", "Your position is a foundation, not a limitation"],
    advice: "The most underrated players shape the game from the side. Own your lane.",
    deliverables: ["Positional confidence story", "Resilience after mistakes", "Wide play mental strength"],
  },
  {
    id: "cm1", label: "Central Mid", x: 30, y: 54,
    challenges: "Managing the tempo, constant decision-making, box-to-box physical demand.",
    lessons: ["You set the rhythm — own it", "Decisions under fatigue define character", "Protect and create — both with equal pride"],
    advice: "The engine room players rarely get the headlines. The team can't function without them.",
    deliverables: ["Engine room identity story", "Tempo management narrative", "Tireless effort story"],
  },
  {
    id: "cm2", label: "Central Mid", x: 70, y: 54,
    challenges: "Managing the tempo, constant decision-making, box-to-box physical demand.",
    lessons: ["You set the rhythm — own it", "Decisions under fatigue define character", "Protect and create — both with equal pride"],
    advice: "The engine room players rarely get the headlines. The team can't function without them.",
    deliverables: ["Engine room identity story", "Tempo management narrative", "Tireless effort story"],
  },
  {
    id: "cam", label: "Attacking Mid", x: 50, y: 42,
    challenges: "Creative pressure, inconsistency expectations, failing in front of goal.",
    lessons: ["Creativity requires permission to fail", "Your vision is a weapon — trust it", "Moments of magic come from moments of courage"],
    advice: "The most creative players have the thickest skin. Let your imagination run free.",
    deliverables: ["Creative courage story", "Bouncing back narrative", "Vision & playmaking identity"],
  },
  {
    id: "lw", label: "Left Winger", x: 12, y: 35,
    challenges: "1v1 pressure, confidence after misplaced dribbles, speed and agility expectations.",
    lessons: ["Take the dribble — the cross won't take itself", "Confidence is a decision, not a feeling", "Your pace and skill create moments of magic"],
    advice: "Wingers live on the edge of disaster and brilliance. Embrace both.",
    deliverables: ["1v1 courage story", "Confidence decision narrative", "Pace & skill identity"],
  },
  {
    id: "rw", label: "Right Winger", x: 88, y: 35,
    challenges: "1v1 pressure, confidence after misplaced dribbles, speed and agility expectations.",
    lessons: ["Take the dribble — the cross won't take itself", "Confidence is a decision, not a feeling", "Your pace and skill create moments of magic"],
    advice: "Wingers live on the edge of disaster and brilliance. Embrace both.",
    deliverables: ["1v1 courage story", "Confidence decision narrative", "Pace & skill identity"],
  },
  {
    id: "st", label: "Striker", x: 50, y: 18,
    challenges: "Goal drought mental health, pressure to score, isolation at the top of the press.",
    lessons: ["Your job is to want the ball — even when it hurts", "Strikers are defined by how they respond to misses", "Goals are the result of relentless work"],
    advice: "Every great striker has missed hundreds. The ones who make it kept asking for the ball.",
    deliverables: ["Goal drought resilience story", "Striker identity narrative", "Pressure & belief story"],
  },
];

const trainingPaths = [
  { position: "Goalkeeper", focus: "Courage & Decision-Making", stories: 4, color: "#1e3a8a" },
  { position: "Defenders", focus: "Leadership & Communication", stories: 6, color: "#2563eb" },
  { position: "Midfielders", focus: "Resilience & Tempo", stories: 5, color: "#7c3aed" },
  { position: "Wingers", focus: "Confidence & 1v1", stories: 4, color: "#f97316" },
  { position: "Strikers", focus: "Belief & Mental Bounce-Back", stories: 5, color: "#ef4444" },
];

export default function FootballMatrix() {
  const [activeSection, setActiveSection] = useState<Section>("pitch");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => { setEnquiryOpen(false); setFormSubmitted(false); }, 2500);
  };

  return (
    <PublicLayout>
      {/* Header bar */}
      <div
        className="sticky top-[60px] z-40 border-b border-white/10"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
              <i className="ri-football-line text-yellow-400"></i>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">MeTime Stories{" "}
                <span className="text-yellow-400">Football Academies</span>
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">Interactive Position Matrix</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["pitch", "dashboard", "training", "academy"] as Section[]).map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                  activeSection === s ? "bg-yellow-400 text-gray-900" : "text-gray-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => setEnquiryOpen(true)}
              className="ml-2 px-4 py-1.5 bg-yellow-400 text-gray-900 rounded-lg text-xs font-semibold hover:bg-yellow-300 transition-colors hidden sm:flex items-center gap-1"
            >
              <i className="ri-mail-line"></i> Enquire
            </button>
          </div>
        </div>
      </div>

      {/* Pitch section */}
      {activeSection === "pitch" && (
        <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Click Any Position to Explore</h2>
              <p className="text-gray-400 text-sm">Each position has a tailored mental performance story programme.</p>
            </div>

            {/* Football pitch SVG */}
            <div className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-white/10" style={{ backgroundColor: "#166534" }}>
              <svg viewBox="0 0 100 110" className="w-full">
                {/* Pitch markings */}
                <rect x="5" y="5" width="90" height="100" rx="2" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
                <line x1="5" y1="55" x2="95" y2="55" stroke="white" strokeWidth="0.5" opacity="0.4" />
                <circle cx="50" cy="55" r="9" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
                <rect x="30" y="5" width="40" height="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
                <rect x="30" y="90" width="40" height="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
                <rect x="37" y="5" width="26" height="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
                <rect x="37" y="97" width="26" height="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
                <circle cx="50" cy="10" r="1" fill="white" opacity="0.5" />
                <circle cx="50" cy="100" r="1" fill="white" opacity="0.5" />
                {/* Position dots */}
                {positions.map((pos) => (
                  <g key={pos.id} onClick={() => setSelectedPosition(pos)} className="cursor-pointer">
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="4"
                      fill={selectedPosition?.id === pos.id ? "#fbbf24" : "white"}
                      opacity={0.9}
                      className="hover:opacity-100"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 7}
                      textAnchor="middle"
                      fontSize="3"
                      fill="white"
                      opacity={0.8}
                    >
                      {pos.label.split(" ")[0]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <p className="text-center text-gray-500 text-xs mt-3">
              {selectedPosition ? `Viewing: ${selectedPosition.label}` : "Tap a position on the pitch"}
            </p>

            {/* Position detail panel */}
            {selectedPosition && (
              <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">{selectedPosition.label}</h3>
                    <p className="text-gray-400 text-sm">Position-specific story programme</p>
                  </div>
                  <button onClick={() => setSelectedPosition(null)} className="text-gray-500 hover:text-white">
                    <i className="ri-close-line text-lg"></i>
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Challenges</p>
                    <p className="text-gray-200 text-sm leading-relaxed mb-4">{selectedPosition.challenges}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Story Lessons</p>
                    <ul className="space-y-1.5">
                      {selectedPosition.lessons.map((l) => (
                        <li key={l} className="flex items-start gap-2 text-sm text-gray-200">
                          <i className="ri-arrow-right-line text-yellow-400 flex-shrink-0 mt-0.5"></i>
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Coach's Advice</p>
                    <blockquote className="text-gray-200 text-sm italic border-l-4 border-yellow-400 pl-3 mb-4 leading-relaxed">
                      {selectedPosition.advice}
                    </blockquote>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Story Deliverables</p>
                    <div className="space-y-2">
                      {selectedPosition.deliverables.map((d) => (
                        <div key={d} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                          <i className="ri-book-2-line text-yellow-400 text-sm"></i>
                          <span className="text-sm text-gray-200">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="px-6 py-2.5 bg-yellow-400 text-gray-900 font-semibold rounded-xl text-sm hover:bg-yellow-300 transition-colors"
                  >
                    Request {selectedPosition.label} Story Programme
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard section */}
      {activeSection === "dashboard" && (
        <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
          <div className="max-w-5xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-white mb-2">Academy Dashboard</h2>
            <p className="text-gray-400 mb-8">A live overview of your academy's story engagement and player wellbeing.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { num: "42", label: "Active Players", icon: "ri-user-line", color: "#3b82f6" },
                { num: "28", label: "Stories Delivered", icon: "ri-book-open-line", color: "#10b981" },
                { num: "94%", label: "Read Rate", icon: "ri-eye-line", color: "#f97316" },
                { num: "4.8/5", label: "Parent Rating", icon: "ri-star-line", color: "#fbbf24" },
              ].map(({ num, label, icon, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mx-auto mb-3" style={{ backgroundColor: `${color}20`, color }}>
                    <i className={icon}></i>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{num}</div>
                  <p className="text-gray-400 text-xs">{label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Recent Story Deliveries</h3>
              <div className="space-y-3">
                {[
                  { name: "Marcus R.", position: "Striker", story: "The Goal Drought", status: "Read", time: "2 hours ago" },
                  { name: "Jamie T.", position: "Goalkeeper", story: "Courage in the Box", status: "Delivered", time: "1 day ago" },
                  { name: "Kofi A.", position: "Centre Back", story: "Holding the Line", status: "Read", time: "2 days ago" },
                  { name: "Luca M.", position: "Left Winger", story: "Take the Dribble", status: "Read", time: "3 days ago" },
                ].map(({ name, position, story, status, time }) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center text-xs font-bold text-blue-300">
                        {name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{name} · {position}</p>
                        <p className="text-xs text-gray-400">"{story}"</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${status === "Read" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                        {status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training section */}
      {activeSection === "training" && (
        <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
          <div className="max-w-5xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-white mb-2">Position-Based Training Paths</h2>
            <p className="text-gray-400 mb-8">Tailored story programmes for each position group, aligned to key mental performance themes.</p>
            <div className="space-y-4">
              {trainingPaths.map(({ position, focus, stories, color }) => (
                <div key={position} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: color }}>
                      {position[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{position}</h3>
                      <p className="text-sm text-gray-400">{focus}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{stories}</div>
                    <p className="text-xs text-gray-500">stories</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Academy section */}
      {activeSection === "academy" && (
        <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
          <div className="max-w-5xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-white mb-2">Academy Ecosystem</h2>
            <p className="text-gray-400 mb-8">How Me Time Stories integrates across your entire academy structure.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "ri-football-line", title: "Players", desc: "Receive personalised stories aligned to their position, personality, and current developmental challenges.", color: "#fbbf24" },
                { icon: "ri-parent-line", title: "Parents", desc: "Read alongside their children at home, deepening family-club bonds and pastoral engagement.", color: "#3b82f6" },
                { icon: "ri-group-line", title: "Coaches", desc: "Stories reinforce coaching values and culture. Wellbeing data surfaces in the staff dashboard.", color: "#10b981" },
                { icon: "ri-psychology-line", title: "Sports Psychologists", desc: "Complement existing mental performance programmes with narrative-based therapeutic content.", color: "#8b5cf6" },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4" style={{ backgroundColor: `${color}20`, color }}>
                    <i className={icon}></i>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-semibold text-lg rounded-xl hover:bg-yellow-300 transition-colors"
              >
                Enquire About the Academy Programme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry modal */}
      {enquiryOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => { setEnquiryOpen(false); setFormSubmitted(false); }} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              <i className="ri-close-line"></i>
            </button>
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-4"><i className="ri-check-line"></i></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
                <p className="text-gray-600">We'll be in touch within 2 business days.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Academy Programme Enquiry</h3>
                <p className="text-gray-500 text-sm mb-5">Tell us about your academy and we'll arrange a demo.</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
                  <input required type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Work email" />
                  <input required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Academy / Club name" />
                  <select required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select your league</option>
                    <option>Premier League</option>
                    <option>EFL Championship</option>
                    <option>League One</option>
                    <option>League Two</option>
                    <option>Other</option>
                  </select>
                  <button type="submit" className="w-full py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:bg-yellow-300 transition-colors">
                    Send Enquiry
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
