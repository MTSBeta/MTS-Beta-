import { useState } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

type Section = "pitch" | "training" | "academy";

interface Position {
  id: string;
  label: string;
  abbr: string;
  x: number;
  y: number;
  color: string;
  identity: string;
  tension: string;
  arc: [string, string][];
  themes: string[];
  storyTitle: string;
  storyAngle: string;
  inputs: { icon: string; source: string; desc: string }[];
  deliverables: string[];
}

const positions: Position[] = [
  {
    id: "gk", label: "Goalkeeper", abbr: "GK", x: 50, y: 90, color: "#f59e0b",
    identity: "The last line of defence. The only player who sees the entire pitch and carries every goal against personally.",
    tension: "Isolation is constant — the goalkeeper stands alone while play unfolds ahead. Every mistake is visible, irreversible, and remembered. The pressure of one error undoing eleven players' work creates a psychological weight unlike any other position.",
    arc: [["Carrying the blame", "Owning the moment"], ["Fear of mistakes", "Shortest memory on the pitch"], ["Invisible leader", "The voice that holds the team"]],
    themes: ["Isolation", "Courage", "Resilience", "Leadership from behind", "Decision-making under pressure"],
    storyTitle: "The Last Save",
    storyAngle: "[Child's name] is the goalkeeper in the biggest match of the season. In the 89th minute, the ball comes to them alone. The story follows not the save itself — but the 45 minutes of self-belief that made it possible.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they feel before and after a mistake" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their shot-stopping strengths and positioning instincts" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "What resilience looks like at home" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Club identity and goalkeeper culture" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Goalkeeper identity journal insert", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "cb", label: "Centre Back", abbr: "CB", x: 35, y: 76, color: "#8b5cf6",
    identity: "The team's backbone. Defenders who command the line are part general, part psychologist — managing space, people, and pressure simultaneously.",
    tension: "Centre-backs are judged on what doesn't happen. Their excellence is invisible until it fails. The burden of leadership — organising teammates, making split-second decisions, absorbing the blame for goals — demands a composure beyond their years.",
    arc: [["Reactive under pressure", "Composed before the ball arrives"], ["Shouting at teammates", "Leading with calm authority"], ["Defined by one mistake", "Defined by consistent standards"]],
    themes: ["Composure", "Communication", "Leadership", "Defending as identity", "Team responsibility"],
    storyTitle: "Holding the Line",
    storyAngle: "[Child's name]'s team is under constant pressure in the second half. The striker they're marking is bigger, faster, and louder. The story follows how [Child's name] finds the quiet in the chaos — and discovers that true defenders don't react. They prepare.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they communicate under pressure" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their reading of the game and leadership style" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they handle setbacks off the pitch" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Defensive culture and team-first identity" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Defender's leadership card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "cb2", label: "Centre Back", abbr: "CB", x: 65, y: 76, color: "#8b5cf6",
    identity: "The team's backbone. Defenders who command the line are part general, part psychologist — managing space, people, and pressure simultaneously.",
    tension: "Centre-backs are judged on what doesn't happen. Their excellence is invisible until it fails. The burden of leadership — organising teammates, making split-second decisions, absorbing the blame for goals — demands a composure beyond their years.",
    arc: [["Reactive under pressure", "Composed before the ball arrives"], ["Shouting at teammates", "Leading with calm authority"], ["Defined by one mistake", "Defined by consistent standards"]],
    themes: ["Composure", "Communication", "Leadership", "Defending as identity", "Team responsibility"],
    storyTitle: "Holding the Line",
    storyAngle: "[Child's name]'s team is under constant pressure in the second half. The striker they're marking is bigger, faster, and louder. The story follows how [Child's name] finds the quiet in the chaos — and discovers that true defenders don't react. They prepare.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they communicate under pressure" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their reading of the game and leadership style" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they handle setbacks off the pitch" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Defensive culture and team-first identity" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Defender's leadership card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "lb", label: "Left Back", abbr: "LB", x: 14, y: 72, color: "#06b6d4",
    identity: "The disciplined runner. Full-backs are the most athletically demanding role on the pitch — required to defend, recover, attack, and repeat without recognition.",
    tension: "Full-backs rarely receive credit. They make the runs that aren't on the highlights reel, cover the spaces no-one watches, and must immediately reset after going forward. The psychological challenge is finding pride in work that's largely invisible.",
    arc: [["Running unseen", "Owning the overlap"], ["Frustrated by limited recognition", "Driven by the team's need"], ["Disciplined by obligation", "Disciplined by identity"]],
    themes: ["Discipline", "Unseen effort", "Athletic identity", "Positional pride", "Resilience after transition"],
    storyTitle: "The Longest Run",
    storyAngle: "[Child's name] makes a 70-metre run down the flank in the 72nd minute. Nobody notices. The team wins because of it. The story is about the kind of player who does the right thing when no-one is watching — and why that makes them extraordinary.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "What motivates them when they go unrecognised" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their work rate, stamina, and positional awareness" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they show up consistently off-pitch" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Team-first culture and work ethic standards" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Full-back identity card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "rb", label: "Right Back", abbr: "RB", x: 86, y: 72, color: "#06b6d4",
    identity: "The disciplined runner. Full-backs are the most athletically demanding role on the pitch — required to defend, recover, attack, and repeat without recognition.",
    tension: "Full-backs rarely receive credit. They make the runs that aren't on the highlights reel, cover the spaces no-one watches, and must immediately reset after going forward. The psychological challenge is finding pride in work that's largely invisible.",
    arc: [["Running unseen", "Owning the overlap"], ["Frustrated by limited recognition", "Driven by the team's need"], ["Disciplined by obligation", "Disciplined by identity"]],
    themes: ["Discipline", "Unseen effort", "Athletic identity", "Positional pride", "Resilience after transition"],
    storyTitle: "The Longest Run",
    storyAngle: "[Child's name] makes a 70-metre run down the flank in the 72nd minute. Nobody notices. The team wins because of it. The story is about the kind of player who does the right thing when no-one is watching — and why that makes them extraordinary.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "What motivates them when they go unrecognised" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their work rate, stamina, and positional awareness" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they show up consistently off-pitch" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Team-first culture and work ethic standards" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Full-back identity card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "dm", label: "Defensive Mid", abbr: "DM", x: 50, y: 63, color: "#10b981",
    identity: "The shield in front of the defence. The player who does the work that allows others to shine — intercepting, covering, recycling, protecting.",
    tension: "The defensive midfielder is rarely celebrated. They break up play that never becomes a threat and recycle possession that never becomes a highlight. The identity question — 'am I a destroyer or a creator?' — sits at the heart of their developmental challenge.",
    arc: [["Defined by what they stop", "Valued for what they enable"], ["Playing in others' shadows", "Being the foundation everyone stands on"], ["Self-doubt about creative limitation", "Confidence in specialist identity"]],
    themes: ["Identity", "Specialist pride", "Unseen value", "Protecting teammates", "Emotional regulation"],
    storyTitle: "The Foundation",
    storyAngle: "[Child's name] makes 11 interceptions in a 0-0 draw. No-one mentions them at the final whistle. But in the dressing room, the captain walks over. The story explores what it means to be the reason your team stays in the game — when the scoreboard shows nothing.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they define their own footballing identity" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their positional intelligence and defensive reads" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they handle being unsung at home" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "The academy's approach to specialist roles" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Midfielder identity profile card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "cm1", label: "Central Mid", abbr: "CM", x: 30, y: 52, color: "#10b981",
    identity: "The engine room. Central midfielders are the most complete players on the pitch — they are expected to defend, create, press, and lead, often simultaneously.",
    tension: "Box-to-box midfielders carry an enormous cognitive and emotional load. They must make more decisions per game than any other outfield position. Fatigue, indecision, and inconsistency are constant threats — and there's no hiding place.",
    arc: [["Overwhelmed by responsibility", "Energised by complexity"], ["Decision fatigue mid-game", "Composure built through routine"], ["Playing for approval", "Playing to their own standard"]],
    themes: ["Mental endurance", "Decision-making", "Box-to-box identity", "Leading by example", "Recovery and reset"],
    storyTitle: "90 Minutes",
    storyAngle: "[Child's name] is running on empty in the second half. Their legs say stop. Their team needs one more run. The story follows what happens in the mind of a central midfielder when the body says no — and how the decision they make defines their season.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they feel during high-intensity periods" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their decision-making patterns and tempo" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they rest and recover mentally" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Academy culture around effort and workload" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Midfield engine identity card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "cm2", label: "Central Mid", abbr: "CM", x: 70, y: 52, color: "#10b981",
    identity: "The engine room. Central midfielders are the most complete players on the pitch — they are expected to defend, create, press, and lead, often simultaneously.",
    tension: "Box-to-box midfielders carry an enormous cognitive and emotional load. They must make more decisions per game than any other outfield position. Fatigue, indecision, and inconsistency are constant threats — and there's no hiding place.",
    arc: [["Overwhelmed by responsibility", "Energised by complexity"], ["Decision fatigue mid-game", "Composure built through routine"], ["Playing for approval", "Playing to their own standard"]],
    themes: ["Mental endurance", "Decision-making", "Box-to-box identity", "Leading by example", "Recovery and reset"],
    storyTitle: "90 Minutes",
    storyAngle: "[Child's name] is running on empty in the second half. Their legs say stop. Their team needs one more run. The story follows what happens in the mind of a central midfielder when the body says no — and how the decision they make defines their season.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they feel during high-intensity periods" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their decision-making patterns and tempo" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they rest and recover mentally" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Academy culture around effort and workload" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Midfield engine identity card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "cam", label: "Attacking Mid", abbr: "AM", x: 50, y: 40, color: "#f97316",
    identity: "The creative heartbeat. The number 10 sees the game one step ahead — and carries the responsibility of making something out of nothing when the team needs it most.",
    tension: "Creative players face a uniquely cruel pressure: their best qualities require permission to fail. Taking the ambitious pass, attempting the unexpected run, backing their vision — all of these invite public failure. Without psychological safety, creativity dies.",
    arc: [["Shrinking under expectation", "Backing their own vision"], ["Trying to be consistent", "Embracing their beautiful inconsistency"], ["Playing what's safe", "Playing what's possible"]],
    themes: ["Creative identity", "Permission to fail", "Imagination as strength", "Pressure from expectation", "Self-expression in sport"],
    storyTitle: "The Pass Nobody Else Saw",
    storyAngle: "[Child's name] sees a pass in training that nobody else thinks is on. The coach shakes their head. They try it anyway — and it works. The story explores what it means to trust your own vision in a sport that sometimes punishes the extraordinary.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "What they see on the pitch that others don't" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their creative patterns and decision timing" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they express creativity beyond football" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "The academy's philosophy on risk-taking" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Creative player identity card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "lw", label: "Left Winger", abbr: "LW", x: 11, y: 33, color: "#ef4444",
    identity: "The duellist. Wingers live by the 1v1 — they are the players who take on opponents in the most exposed, high-visibility area of the pitch and accept the risk every time.",
    tension: "Losing a dribble in front of the crowd, the coach, and your teammates is one of the most demoralising moments in youth football. Wingers must develop a psychological immunity to public failure — taking on the next man even after the last one won.",
    arc: [["Afraid to take on the defender", "Addicted to the duel"], ["Confidence as a feeling", "Confidence as a decision"], ["Avoiding the risky moment", "Seeking it out"]],
    themes: ["Confidence", "1v1 identity", "Recovering from a bad touch", "Speed and skill", "Courage under spotlight"],
    storyTitle: "One More Time",
    storyAngle: "[Child's name] loses three dribbles in a row in the first half. Their coach tells them to keep going. In the 78th minute, they take on their marker one more time. The story is about what it takes to try again — and what that courage looks like to everyone watching.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they rebuild after a mistake in a duel" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their technical strengths and dribbling patterns" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they respond to embarrassment at home" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Academy stance on risk-taking in the final third" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Winger confidence card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "rw", label: "Right Winger", abbr: "RW", x: 89, y: 33, color: "#ef4444",
    identity: "The duellist. Wingers live by the 1v1 — they are the players who take on opponents in the most exposed, high-visibility area of the pitch and accept the risk every time.",
    tension: "Losing a dribble in front of the crowd, the coach, and your teammates is one of the most demoralising moments in youth football. Wingers must develop a psychological immunity to public failure — taking on the next man even after the last one won.",
    arc: [["Afraid to take on the defender", "Addicted to the duel"], ["Confidence as a feeling", "Confidence as a decision"], ["Avoiding the risky moment", "Seeking it out"]],
    themes: ["Confidence", "1v1 identity", "Recovering from a bad touch", "Speed and skill", "Courage under spotlight"],
    storyTitle: "One More Time",
    storyAngle: "[Child's name] loses three dribbles in a row in the first half. Their coach tells them to keep going. In the 78th minute, they take on their marker one more time. The story is about what it takes to try again — and what that courage looks like to everyone watching.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they rebuild after a mistake in a duel" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their technical strengths and dribbling patterns" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they respond to embarrassment at home" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Academy stance on risk-taking in the final third" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Winger confidence card", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
  {
    id: "st", label: "Striker", abbr: "ST", x: 50, y: 16, color: "#ec4899",
    identity: "The hero the team points to — and the player who carries the weight of every missed chance alone. Strikers are defined not by their goals, but by how they respond to the drought.",
    tension: "A goal drought in youth football can shatter a child's confidence with frightening speed. The striker's psychology is uniquely exposed: the team relies on them to score, but the game withholds the outcome despite maximum effort. Managing that gap between effort and result is the central challenge.",
    arc: [["Defined by the last miss", "Defined by the next attempt"], ["Waiting for confidence to return", "Choosing to believe now"], ["Isolated by expectation", "Energised by responsibility"]],
    themes: ["Belief under drought", "Striker identity", "Resilience after failure", "Hunger and mentality", "Pressure from visibility"],
    storyTitle: "The Striker Who Kept Asking",
    storyAngle: "[Child's name] hasn't scored in seven games. Their teammates are watching. Their parents are watching. The coaches are reassigning the penalty. The story follows what happens in the week before the match — and what [Child's name] does in training that nobody sees.",
    inputs: [
      { icon: "ri-user-voice-line", source: "Player Voice", desc: "How they feel during a goal drought" },
      { icon: "ri-whistle-line", source: "Coach Insight", desc: "Their movement patterns and finishing mentality" },
      { icon: "ri-home-heart-line", source: "Parent Contribution", desc: "How they process the pressure of expectation" },
      { icon: "ri-building-4-line", source: "Academy Values", desc: "Academy culture around individual scoring metrics" },
    ],
    deliverables: ["Personalised 24-page illustrated story", "Striker belief journal", "Coach conversation guide", "Parent read-aloud version", "Digital + print edition"],
  },
];

const GLASS = {
  backdropFilter: "blur(20px)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
};

const GLASS_STRONG = {
  backdropFilter: "blur(24px)",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
};

export default function FootballMatrix() {
  const [activeSection, setActiveSection] = useState<Section>("pitch");
  const [selected, setSelected] = useState<Position | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => { setEnquiryOpen(false); setFormSubmitted(false); }, 2800);
  };

  const TABS: { id: Section; label: string; icon: string }[] = [
    { id: "pitch",    label: "Position Matrix", icon: "ri-football-line" },
    { id: "training", label: "Story Paths",     icon: "ri-git-branch-line" },
    { id: "academy",  label: "Academy Fit",     icon: "ri-building-4-line" },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 50% 0%, #0f1f3a 0%, #090d1a 45%, #04060d 100%)" }}>

        {/* Scan-line texture */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.022) 3px, rgba(0,0,0,0.022) 4px)" }} />

        {/* Floodlight beams — top corners */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-20 -left-20 w-[600px] h-[700px] opacity-[0.06]"
            style={{ background: "linear-gradient(155deg, #e0f0ff 0%, transparent 55%)", filter: "blur(50px)", transform: "rotate(-10deg)" }} />
          <div className="absolute -top-20 -right-20 w-[600px] h-[700px] opacity-[0.06]"
            style={{ background: "linear-gradient(205deg, #e0f0ff 0%, transparent 55%)", filter: "blur(50px)", transform: "rotate(10deg)" }} />
          <div className="absolute top-1/2 left-0 right-0 h-px opacity-[0.04]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)" }} />
        </div>

        {/* ── Sticky header ── */}
        <div className="sticky top-[60px] z-40" style={{ backdropFilter: "blur(24px)", background: "rgba(4,6,13,0.90)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <img
                src={publicAssetUrl("images/metime-logo-animated.gif")}
                alt="Me Time Stories"
                className="h-9 w-auto object-contain"
                style={{ filter: "drop-shadow(0 0 8px rgba(251,191,36,0.35))" }}
              />
              <div className="h-5 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#f97316" }}>
                Football Academy Matrix
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {TABS.map(({ id, label, icon }) => (
                <button key={id} onClick={() => setActiveSection(id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={activeSection === id
                    ? { background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.30)" }
                    : { color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }}
                >
                  <i className={icon}></i>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <button onClick={() => setEnquiryOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 0 16px rgba(249,115,22,0.30)" }}>
              <i className="ri-mail-send-line"></i> Request Programme
            </button>
          </div>
        </div>

        {/* ── CINEMATIC STADIUM HERO ── */}
        {activeSection === "pitch" && (
          <div className="relative w-full overflow-hidden" style={{ height: selected ? 100 : 340, transition: "height 0.5s ease" }}>
            {/* Stadium photo */}
            <img
              src={publicAssetUrl("images/stadiums/manchester-city.jpg")}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 35%", filter: "saturate(0.5) brightness(0.45)" }}
            />
            {/* Scan-line overlay on the image */}
            <div className="absolute inset-0"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)" }} />
            {/* Gradient fade top → bottom */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to bottom, rgba(4,6,13,0.55) 0%, rgba(4,6,13,0.05) 35%, rgba(4,6,13,0.75) 75%, rgba(4,6,13,1) 100%)"
            }} />
            {/* Floodlight glow */}
            <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(200,230,255,0.06) 0%, transparent 65%)" }} />

            {/* Content: full hero when no position selected */}
            {!selected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.20em] px-4 py-1.5 rounded-full mb-4"
                  style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.30)", color: "#f97316", backdropFilter: "blur(8px)" }}>
                  <i className="ri-football-line"></i> Position-Aware Story Framework
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.80)" }}>
                  Every Player. Every Position.
                  <br />
                  <span style={{ background: "linear-gradient(90deg, #f97316, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Made the Hero of Their Role.
                  </span>
                </h1>
                <p className="text-sm max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.50)" }}>
                  Select any position on the pitch below to explore its personalised story programme.
                </p>
              </div>
            )}

            {/* Slim position strip when selected */}
            {selected && (
              <div className="absolute inset-0 flex items-center px-6">
                <button onClick={() => setSelected(null)}
                  className="flex items-center gap-2 text-xs font-semibold mr-6 transition-all hover:text-white"
                  style={{ color: "rgba(255,255,255,0.40)" }}>
                  <i className="ri-arrow-left-line"></i> All Positions
                </button>
                <div className="h-5 w-px mr-4" style={{ background: "rgba(255,255,255,0.15)" }} />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mr-3"
                  style={{ background: `${selected.color}25`, border: `1px solid ${selected.color}50`, color: selected.color }}>
                  {selected.abbr}
                </div>
                <span className="text-sm font-black text-white mr-2">{selected.label}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>— Story Programme</span>
              </div>
            )}
          </div>
        )}

        {/* ── PITCH SECTION ── */}
        {activeSection === "pitch" && (
          <div className="max-w-7xl mx-auto px-4 pb-16">
            {selected && <div className="pt-6" />}

            <div className={`grid gap-8 items-start ${selected ? "lg:grid-cols-[340px_1fr]" : "lg:grid-cols-[380px_1fr]"}`}>

              {/* ── PITCH SVG ── */}
              <div className="sticky top-[120px]">
                <div className="rounded-3xl overflow-hidden"
                  style={{ boxShadow: "0 0 80px rgba(22,101,52,0.25), 0 32px 64px rgba(0,0,0,0.60)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg viewBox="0 0 100 115" className="w-full block"
                    style={{ background: "linear-gradient(180deg, #14532d 0%, #166534 25%, #16a34a 50%, #166534 75%, #14532d 100%)" }}>
                    {/* Turf stripes */}
                    {[0,1,2,3,4,5,6].map(i => (
                      <rect key={i} x="5" y={5 + i * 15} width="90" height="15"
                        fill={i % 2 === 0 ? "rgba(0,0,0,0.07)" : "transparent"} />
                    ))}
                    {/* Pitch outline */}
                    <rect x="5" y="5" width="90" height="105" rx="1.5" fill="none" stroke="rgba(255,255,255,0.60)" strokeWidth="0.7" />
                    {/* Halfway */}
                    <line x1="5" y1="57.5" x2="95" y2="57.5" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                    {/* Centre circle */}
                    <circle cx="50" cy="57.5" r="10" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                    <circle cx="50" cy="57.5" r="0.9" fill="rgba(255,255,255,0.80)" />
                    {/* Penalty areas */}
                    <rect x="28" y="5" width="44" height="17" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="0.55" />
                    <rect x="28" y="93" width="44" height="17" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="0.55" />
                    {/* 6-yard boxes */}
                    <rect x="38" y="5" width="24" height="8" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="0.5" />
                    <rect x="38" y="102" width="24" height="8" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="0.5" />
                    {/* Penalty spots */}
                    <circle cx="50" cy="17" r="0.9" fill="rgba(255,255,255,0.65)" />
                    <circle cx="50" cy="98" r="0.9" fill="rgba(255,255,255,0.65)" />
                    {/* Arcs */}
                    <path d="M 37 22 A 10 10 0 0 0 63 22" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
                    <path d="M 37 93 A 10 10 0 0 1 63 93" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
                    {/* Corner arcs */}
                    <path d="M 5 8 A 3 3 0 0 0 8 5"   fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
                    <path d="M 92 5 A 3 3 0 0 0 95 8"  fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
                    <path d="M 5 107 A 3 3 0 0 1 8 110"  fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
                    <path d="M 92 110 A 3 3 0 0 1 95 107" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />

                    {/* Position nodes */}
                    {positions.map((pos) => {
                      const isActive = selected?.id === pos.id;
                      return (
                        <g key={pos.id} onClick={() => setSelected(isActive ? null : pos)}
                          className="cursor-pointer" style={{ transition: "all 0.2s" }}>
                          {/* Outer glow when active */}
                          {isActive && (
                            <circle cx={pos.x} cy={pos.y} r="9"
                              fill="none" stroke={pos.color} strokeWidth="0.8" opacity="0.40"
                              style={{ filter: `drop-shadow(0 0 4px ${pos.color})` }} />
                          )}
                          {/* Hit area */}
                          <circle cx={pos.x} cy={pos.y} r="7" fill="transparent" />
                          {/* Badge background */}
                          <circle cx={pos.x} cy={pos.y} r={isActive ? 5 : 4}
                            fill={isActive ? pos.color : "rgba(255,255,255,0.15)"}
                            stroke={isActive ? pos.color : "rgba(255,255,255,0.50)"}
                            strokeWidth="0.6"
                            style={{ filter: isActive ? `drop-shadow(0 0 6px ${pos.color})` : "none", transition: "all 0.25s" }}
                          />
                          {/* Abbr label */}
                          <text x={pos.x} y={pos.y + 0.9} textAnchor="middle" fontSize="2.6"
                            fill={isActive ? "#0a0500" : "rgba(255,255,255,0.90)"}
                            fontWeight="700" style={{ fontFamily: "system-ui, sans-serif" }}>
                            {pos.abbr}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Hint text */}
                <p className="text-center mt-3 text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                  {selected ? `Viewing: ${selected.label} Programme` : "Select any position to explore its story programme"}
                </p>

                {/* Position colour legend */}
                {!selected && (
                  <div className="mt-4 rounded-2xl p-4" style={GLASS}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Position Groups</p>
                    <div className="space-y-2">
                      {[
                        { label: "Goalkeeper", color: "#f59e0b" },
                        { label: "Defenders", color: "#8b5cf6" },
                        { label: "Full Backs", color: "#06b6d4" },
                        { label: "Midfielders", color: "#10b981" },
                        { label: "Wingers", color: "#ef4444" },
                        { label: "Attacking Mid", color: "#f97316" },
                        { label: "Striker", color: "#ec4899" },
                      ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── POSITION DETAIL PANEL ── */}
              <div>
                {!selected ? (
                  /* ── Empty state: Proof points ── */
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { num: "11", label: "Positions", sub: "Every role on the pitch" },
                        { num: "8", label: "Framework Sections", sub: "Per position programme" },
                        { num: "4", label: "Stakeholders", sub: "Player, coach, parent, academy" },
                      ].map(({ num, label, sub }) => (
                        <div key={label} className="rounded-2xl p-5 text-center" style={GLASS}>
                          <div className="text-2xl font-black mb-0.5" style={{ color: "#fbbf24" }}>{num}</div>
                          <div className="text-xs font-bold text-white mb-1">{label}</div>
                          <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>{sub}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl p-6" style={GLASS}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.30)" }}>What Each Position Programme Includes</p>
                      <div className="space-y-3">
                        {[
                          { icon: "ri-user-star-line", label: "Position Identity", desc: "Who this player is and what their role demands" },
                          { icon: "ri-thunder-line",   label: "Hero Tension",      desc: "The emotional pressure unique to that position" },
                          { icon: "ri-arrow-up-circle-line", label: "Hero Arc", desc: "The psychological journey from struggle to growth" },
                          { icon: "ri-book-marked-line", label: "Story Themes",    desc: "The developmental themes explored in narrative" },
                          { icon: "ri-movie-2-line",    label: "Story Angle",      desc: "A vivid, specific story built around that child's role" },
                          { icon: "ri-team-line",       label: "Multi-Stakeholder Inputs", desc: "Player voice, coach insight, parent contribution, academy values" },
                          { icon: "ri-gift-line",       label: "Programme Deliverables", desc: "Exactly what the academy and player receive" },
                        ].map(({ icon, label, desc }) => (
                          <div key={label} className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs"
                              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.20)", color: "#f97316" }}>
                              <i className={icon}></i>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">{label}</p>
                              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl p-5 flex items-center justify-between gap-4" style={{ ...GLASS, borderColor: "rgba(249,115,22,0.20)" }}>
                      <div>
                        <p className="text-sm font-bold text-white">Ready to see a position in depth?</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Select any player position on the pitch.</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-400 flex-shrink-0">
                        <i className="ri-arrow-left-line text-sm"></i>
                        <span className="text-xs font-semibold">Tap a dot</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Rich Position Programme View ── */
                  <div className="space-y-4">

                    {/* Position header */}
                    <div className="rounded-2xl p-6" style={{ ...GLASS_STRONG, borderColor: `${selected.color}30`, boxShadow: `0 0 40px ${selected.color}10` }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black"
                            style={{ background: `${selected.color}20`, border: `1px solid ${selected.color}40`, color: selected.color }}>
                            {selected.abbr}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>Position Programme</p>
                            <h2 className="text-xl font-black" style={{ color: selected.color }}>{selected.label}</h2>
                          </div>
                        </div>
                        <button onClick={() => setSelected(null)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
                          style={{ color: "rgba(255,255,255,0.30)" }}>
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
                        <span className="px-2 py-0.5 rounded-full" style={{ background: `${selected.color}15`, border: `1px solid ${selected.color}30`, color: selected.color }}>
                          Story Programme
                        </span>
                        <span>•</span>
                        <span>24 personalised pages</span>
                        <span>•</span>
                        <span>4 stakeholder inputs</span>
                      </div>
                    </div>

                    {/* 1 — Position Identity */}
                    <div className="rounded-2xl p-5" style={GLASS}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)" }}>
                          <span className="font-black text-[10px]">01</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)" }}>Position Identity</p>
                      </div>
                      <p className="text-sm leading-relaxed font-medium" style={{ color: "rgba(255,255,255,0.82)" }}>
                        {selected.identity}
                      </p>
                    </div>

                    {/* 2 — Hero Tension */}
                    <div className="rounded-2xl p-5" style={{ ...GLASS, borderColor: "rgba(239,68,68,0.18)", background: "rgba(239,68,68,0.04)" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                          style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
                          <span className="font-black text-[10px]">02</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#f87171" }}>Hero Tension</p>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                        {selected.tension}
                      </p>
                    </div>

                    {/* 3 — Hero Arc */}
                    <div className="rounded-2xl p-5" style={{ ...GLASS, borderColor: "rgba(16,185,129,0.18)", background: "rgba(16,185,129,0.03)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
                          <span className="font-black text-[10px]">03</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#34d399" }}>Hero Arc</p>
                      </div>
                      <div className="space-y-2.5">
                        {selected.arc.map(([from, to], i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 px-3 py-2 rounded-xl text-xs text-center font-semibold"
                              style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.18)", color: "#fca5a5" }}>
                              {from}
                            </div>
                            <i className="ri-arrow-right-line flex-shrink-0 text-sm" style={{ color: "#34d399" }}></i>
                            <div className="flex-1 px-3 py-2 rounded-xl text-xs text-center font-semibold"
                              style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.18)", color: "#6ee7b7" }}>
                              {to}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4 — Story Themes */}
                    <div className="rounded-2xl p-5" style={GLASS}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)" }}>
                          <span className="font-black text-[10px]">04</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)" }}>Story Themes</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selected.themes.map((t) => (
                          <span key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: `${selected.color}15`, border: `1px solid ${selected.color}30`, color: selected.color }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 5 — Story Angle */}
                    <div className="rounded-2xl p-5" style={{ ...GLASS, borderColor: "rgba(251,191,36,0.20)", background: "rgba(251,191,36,0.04)" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                          <span className="font-black text-[10px]">05</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#fbbf24" }}>Example Story</p>
                      </div>
                      <div className="mb-3">
                        <p className="text-base font-black mb-1" style={{ color: "#fef3c7" }}>"{selected.storyTitle}"</p>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontStyle: "italic" }}>
                        {selected.storyAngle}
                      </p>
                    </div>

                    {/* 6 — Inputs We Use */}
                    <div className="rounded-2xl p-5" style={GLASS}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)" }}>
                          <span className="font-black text-[10px]">06</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)" }}>How We Build This Story</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {selected.inputs.map(({ icon, source, desc }) => (
                          <div key={source} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <div className="flex items-center gap-2 mb-1.5">
                              <i className={`${icon} text-sm`} style={{ color: selected.color }}></i>
                              <p className="text-[11px] font-bold text-white">{source}</p>
                            </div>
                            <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 7 — Programme Deliverables */}
                    <div className="rounded-2xl p-5" style={GLASS}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)" }}>
                          <span className="font-black text-[10px]">07</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)" }}>Programme Deliverables</p>
                      </div>
                      <div className="space-y-2">
                        {selected.deliverables.map((d) => (
                          <div key={d} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <i className="ri-checkbox-circle-line flex-shrink-0 text-sm" style={{ color: selected.color }}></i>
                            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.70)" }}>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 8 — CTAs */}
                    <div className="rounded-2xl p-5 space-y-3" style={{ ...GLASS, borderColor: `${selected.color}25` }}>
                      <div className="mb-1">
                        <p className="text-sm font-bold text-white mb-0.5">Ready to make {selected.label} players the heroes of their position?</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Speak to our team about piloting this programme at your academy.</p>
                      </div>
                      <button onClick={() => setEnquiryOpen(true)}
                        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.01]"
                        style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 20px rgba(249,115,22,0.30)" }}>
                        <i className="ri-send-plane-line"></i> Request {selected.label} Programme
                      </button>
                      <button onClick={() => setEnquiryOpen(true)}
                        className="w-full py-2.5 rounded-xl font-semibold text-xs transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.50)" }}>
                        <i className="ri-file-text-line"></i> View Sample Story Pathway
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STORY PATHS SECTION ── */}
        {activeSection === "training" && (
          <>
          {/* Stadium banner */}
          <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
            <img src={publicAssetUrl("images/stadiums/liverpool.jpg")} alt="" aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 40%", filter: "saturate(0.4) brightness(0.40)" }} />
            <div className="absolute inset-0"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,6,13,0.50) 0%, rgba(4,6,13,0.10) 40%, rgba(4,6,13,0.85) 80%, rgba(4,6,13,1) 100%)" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.20em] px-4 py-1.5 rounded-full mb-3"
                style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.30)", color: "#f97316", backdropFilter: "blur(8px)" }}>
                <i className="ri-git-branch-line"></i> Developmental Story Paths
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.80)" }}>
                Position-Grouped Story Programmes
              </h2>
              <p className="text-sm max-w-xl" style={{ color: "rgba(255,255,255,0.45)" }}>31 story titles. 7 position groups. Every player made the hero of their role.</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
              <p className="text-sm max-w-xl" style={{ color: "rgba(255,255,255,0.38)" }}>
                Each position group has its own psychological theme cluster — ensuring every player receives a story built around the specific developmental demands of their role.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                { group: "Goalkeepers",     theme: "Courage & Decision-Making",         tension: "Isolation, last-line pressure, visible mistakes",   arc: "From absorbed blame → shortest memory on the pitch",  stories: 4, color: "#f59e0b", icon: "ri-shield-user-line" },
                { group: "Defenders",       theme: "Leadership & Composure",            tension: "Team responsibility, communication, physical demands", arc: "From reactive panic → composure before the ball arrives", stories: 5, color: "#8b5cf6", icon: "ri-shield-star-line" },
                { group: "Full Backs",      theme: "Discipline & Unseen Effort",        tension: "Lack of recognition, dual role demands",              arc: "From running unseen → owning the overlap",             stories: 4, color: "#06b6d4", icon: "ri-run-line" },
                { group: "Midfielders",     theme: "Mental Endurance & Decision-Making", tension: "Cognitive overload, box-to-box fatigue",             arc: "From decision fatigue → composure built through routine", stories: 6, color: "#10b981", icon: "ri-flashlight-line" },
                { group: "Wingers",         theme: "Confidence & 1v1 Identity",         tension: "Public failure after dribbles, spotlight pressure",   arc: "From afraid of the duel → addicted to the duel",        stories: 4, color: "#ef4444", icon: "ri-speed-up-line" },
                { group: "Attacking Mids",  theme: "Creative Courage",                  tension: "Permission to fail, expectation vs expression",       arc: "From playing safe → backing their vision",              stories: 3, color: "#f97316", icon: "ri-lightbulb-line" },
                { group: "Strikers",        theme: "Belief Under Drought",              tension: "Goal drought, isolated expectation, public scrutiny",  arc: "From defined by the last miss → defined by the next attempt", stories: 5, color: "#ec4899", icon: "ri-focus-3-line" },
              ].map(({ group, theme, tension, arc, stories, color, icon }) => (
                <div key={group} className="rounded-2xl p-5" style={GLASS}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}35`, color }}>
                      <i className={icon}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white text-sm">{group}</h3>
                          <p className="text-xs font-semibold mt-0.5" style={{ color }}>{theme}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-2xl font-black" style={{ color }}>{stories}</span>
                          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>stories</p>
                        </div>
                      </div>
                      <p className="text-[11px] mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>
                        <strong style={{ color: "rgba(255,255,255,0.45)" }}>Tension:</strong> {tension}
                      </p>
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                        <strong style={{ color: "rgba(255,255,255,0.45)" }}>Arc:</strong> {arc}
                      </p>
                      <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-1 rounded-full" style={{ width: `${(stories / 6) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ ...GLASS, borderColor: "rgba(249,115,22,0.18)" }}>
              <div>
                <p className="font-bold text-white mb-0.5">See the complete story pathway for your squad</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>31 story titles across 7 position groups — available as pilot or full programme.</p>
              </div>
              <button onClick={() => setEnquiryOpen(true)}
                className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 16px rgba(249,115,22,0.28)" }}>
                Discuss Your Programme →
              </button>
            </div>
          </div>
          </>
        )}

        {/* ── ACADEMY FIT SECTION ── */}
        {activeSection === "academy" && (
          <>
          {/* Stadium banner */}
          <div className="relative w-full overflow-hidden" style={{ height: 240 }}>
            <img src={publicAssetUrl("images/stadiums/arsenal.jpg")} alt="" aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 30%", filter: "saturate(0.4) brightness(0.38)" }} />
            <div className="absolute inset-0"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,6,13,0.50) 0%, rgba(4,6,13,0.10) 40%, rgba(4,6,13,0.85) 80%, rgba(4,6,13,1) 100%)" }} />
            {/* Premier League + EFL logos as trust marks */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <img src={publicAssetUrl("logos/premier-league-logo.png")} alt="Premier League" className="h-8 w-auto opacity-40" style={{ filter: "brightness(0) invert(1)" }} />
              <div className="h-5 w-px opacity-20" style={{ background: "white" }} />
              <img src={publicAssetUrl("logos/efl-championship-logo.png")} alt="EFL Championship" className="h-8 w-auto opacity-40" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-12">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.20em] px-4 py-1.5 rounded-full mb-3"
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.30)", color: "#a78bfa", backdropFilter: "blur(8px)" }}>
                <i className="ri-building-4-line"></i> Academy Integration Framework
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.80)" }}>
                How Me Time Stories Fits<br />Into Your Academy
              </h2>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
              <p className="text-sm max-w-xl" style={{ color: "rgba(255,255,255,0.38)" }}>
                Our story programme is not a bolt-on. It is a position-aware, player-aware development layer that works alongside your coaching, pastoral, and wellbeing infrastructure.
              </p>
            </div>

            {/* Hub-and-spoke layout: left cards → portal hub ← right cards */}
            <div className="mb-6">
              {/* Desktop hub layout */}
              <div className="hidden md:grid gap-4 items-stretch" style={{ gridTemplateColumns: "1fr 220px 1fr" }}>

                {/* LEFT column: Players + Coaches */}
                <div className="flex flex-col gap-4">
                  {[
                    { icon: "ri-football-line", title: "Players", desc: "Each player receives a story personalised to their position, personality, and current developmental challenge — making them the hero of their specific role.", color: "#fbbf24", img: "academy-1.jpg", input: "Position · Dreams · Personality" },
                    { icon: "ri-whistle-line",   title: "Coaches", desc: "Coach insight drives the story. We capture what the coach sees in each player and weave it into the narrative — then provide a conversation guide to support the debrief.", color: "#10b981", img: "academy-5.jpg", input: "Coaching Insight · Debrief Guide" },
                  ].map(({ icon, title, desc, color, img, input }) => (
                    <div key={title} className="rounded-2xl overflow-hidden relative flex-1"
                      style={{ border: `1px solid ${color}22`, boxShadow: `0 0 24px ${color}08`, minHeight: 200 }}>
                      <img src={publicAssetUrl(`images/academy/${img}`)} alt="" aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: "saturate(0.3) brightness(0.28)" }} />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(4,6,13,0.88) 0%, rgba(4,6,13,0.68) 100%)` }} />
                      <div className="relative p-5 h-full flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base mb-3"
                            style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>
                            <i className={icon}></i>
                          </div>
                          <h3 className="font-bold text-white text-sm mb-1.5">{title}</h3>
                          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>{desc}</p>
                        </div>
                        {/* Contribution tag */}
                        <div className="mt-3 flex items-center gap-1.5">
                          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${color}50)` }} />
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                            {input}
                          </span>
                          <i className="ri-arrow-right-line text-xs" style={{ color: `${color}80` }}></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CENTER hub: Player Portal */}
                <div className="flex flex-col items-center justify-center relative py-4">
                  {/* Vertical connector line */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-px h-full" style={{ background: "linear-gradient(to bottom, transparent 5%, rgba(249,115,22,0.20) 30%, rgba(249,115,22,0.20) 70%, transparent 95%)" }} />
                  </div>

                  {/* Central portal node */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Top arrow from left */}
                    <div className="flex items-center gap-1 mb-4">
                      <div className="w-8 h-px" style={{ background: "rgba(249,115,22,0.30)" }} />
                      <i className="ri-arrow-down-line text-[10px]" style={{ color: "rgba(249,115,22,0.40)" }}></i>
                    </div>

                    {/* Portal card */}
                    <div className="rounded-3xl flex flex-col items-center px-4 py-5 w-full"
                      style={{
                        background: "linear-gradient(160deg, rgba(249,115,22,0.12) 0%, rgba(251,191,36,0.08) 100%)",
                        border: "1.5px solid rgba(249,115,22,0.30)",
                        boxShadow: "0 0 40px rgba(249,115,22,0.15), 0 0 80px rgba(249,115,22,0.06)",
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      {/* Logo */}
                      <img
                        src={publicAssetUrl("images/metime-logo-animated.gif")}
                        alt="Me Time Stories"
                        className="h-8 w-auto object-contain mb-3"
                        style={{ filter: "drop-shadow(0 2px 8px rgba(249,115,22,0.40))" }}
                      />

                      {/* Portal screen mockup */}
                      <div className="w-full rounded-xl overflow-hidden mb-3"
                        style={{ background: "rgba(0,0,0,0.50)", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "4/3" }}>
                        {/* Fake portal UI */}
                        <div className="p-2 h-full flex flex-col gap-1.5">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#f97316" }} />
                            <div className="h-1 rounded flex-1" style={{ background: "rgba(255,255,255,0.10)" }} />
                          </div>
                          {/* Player row */}
                          {["#fbbf24", "#10b981", "#3b82f6"].map((c, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c}22` }}>
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `${c}40` }} />
                              <div className="flex-1 flex flex-col gap-0.5">
                                <div className="h-1 rounded" style={{ background: `${c}50`, width: ["70%","55%","80%"][i] }} />
                                <div className="h-0.5 rounded" style={{ background: "rgba(255,255,255,0.10)", width: ["50%","65%","45%"][i] }} />
                              </div>
                              <div className="h-3 w-5 rounded flex-shrink-0" style={{ background: `${c}30` }} />
                            </div>
                          ))}
                          {/* Story icon */}
                          <div className="mt-auto flex items-center justify-center gap-1.5 py-1 rounded-lg"
                            style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.20), rgba(251,191,36,0.15))", border: "1px solid rgba(249,115,22,0.25)" }}>
                            <i className="ri-book-2-line text-[8px]" style={{ color: "#fbbf24" }}></i>
                            <span className="text-[7px] font-bold" style={{ color: "#fbbf24" }}>Story Created</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: "#f97316" }}>Player Portal</p>
                      <p className="text-[9px] text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                        All inputs collected.<br />One story built.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mt-4">
                      <i className="ri-arrow-down-line text-[10px]" style={{ color: "rgba(249,115,22,0.40)" }}></i>
                      <div className="w-8 h-px" style={{ background: "rgba(249,115,22,0.30)" }} />
                    </div>

                    {/* Book output */}
                    <div className="mt-3 flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl w-full"
                      style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.22)" }}>
                      <i className="ri-book-open-fill text-lg" style={{ color: "#fbbf24" }}></i>
                      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#fbbf24" }}>The Story</p>
                      <p className="text-[8px] text-center" style={{ color: "rgba(255,255,255,0.30)" }}>Personalised. Printed. Delivered.</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT column: Parents + Sports Psychologists */}
                <div className="flex flex-col gap-4">
                  {[
                    { icon: "ri-home-heart-line",  title: "Parents", desc: "Stories are read at home together. They reinforce academy values in the family environment and deepen parent-club engagement in a structured, meaningful way.", color: "#3b82f6", img: "academy-3.jpg", input: "Family Context · Home Values" },
                    { icon: "ri-mental-health-line", title: "Sports Psychologists", desc: "Our stories complement existing mental performance work. Position-specific psychological themes are aligned to each club's current wellbeing framework and referral structures.", color: "#8b5cf6", img: "academy-7.jpg", input: "Mental Themes · Wellbeing Framework" },
                  ].map(({ icon, title, desc, color, img, input }) => (
                    <div key={title} className="rounded-2xl overflow-hidden relative flex-1"
                      style={{ border: `1px solid ${color}22`, boxShadow: `0 0 24px ${color}08`, minHeight: 200 }}>
                      <img src={publicAssetUrl(`images/academy/${img}`)} alt="" aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: "saturate(0.3) brightness(0.28)" }} />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(225deg, rgba(4,6,13,0.88) 0%, rgba(4,6,13,0.68) 100%)` }} />
                      <div className="relative p-5 h-full flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base mb-3"
                            style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>
                            <i className={icon}></i>
                          </div>
                          <h3 className="font-bold text-white text-sm mb-1.5">{title}</h3>
                          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>{desc}</p>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5">
                          <i className="ri-arrow-left-line text-xs" style={{ color: `${color}80` }}></i>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                            {input}
                          </span>
                          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${color}50)` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: simple 2x2 grid fallback */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                {[
                  { icon: "ri-football-line",       title: "Players",               desc: "Personalised to their position and personality — making them the hero.", color: "#fbbf24", img: "academy-1.jpg" },
                  { icon: "ri-home-heart-line",      title: "Parents",               desc: "Stories read at home reinforce academy values and deepen family-club bonds.", color: "#3b82f6", img: "academy-3.jpg" },
                  { icon: "ri-whistle-line",         title: "Coaches",               desc: "Coach insight weaves into the narrative with a debrief guide included.", color: "#10b981", img: "academy-5.jpg" },
                  { icon: "ri-mental-health-line",   title: "Sports Psychologists",  desc: "Position-specific mental themes aligned to your club's wellbeing framework.", color: "#8b5cf6", img: "academy-7.jpg" },
                ].map(({ icon, title, desc, color, img }) => (
                  <div key={title} className="rounded-2xl overflow-hidden relative"
                    style={{ border: `1px solid ${color}22`, minHeight: 160 }}>
                    <img src={publicAssetUrl(`images/academy/${img}`)} alt="" aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: "saturate(0.3) brightness(0.28)" }} />
                    <div className="absolute inset-0" style={{ background: "rgba(4,6,13,0.85)" }} />
                    <div className="relative p-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mb-2"
                        style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>
                        <i className={icon}></i>
                      </div>
                      <h3 className="font-bold text-white text-xs mb-1">{title}</h3>
                      <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: portal hub strip */}
              <div className="md:hidden mt-4 flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: "rgba(249,115,22,0.08)", border: "1.5px solid rgba(249,115,22,0.22)" }}>
                <img src={publicAssetUrl("images/metime-logo-animated.gif")} alt="Me Time Stories" className="h-7 w-auto object-contain flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold" style={{ color: "#f97316" }}>Player Portal</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.38)" }}>All stakeholder inputs → one personalised story</p>
                </div>
                <i className="ri-book-2-fill ml-auto text-lg" style={{ color: "#fbbf24" }}></i>
              </div>
            </div>

            {/* What academies get */}
            <div className="rounded-2xl p-6 mb-5" style={GLASS}>
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.25)" }}>What the Academy Receives</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "ri-book-2-line",         label: "Personalised story per player",               desc: "24 illustrated pages, built from player, coach, and parent input" },
                  { icon: "ri-dashboard-line",       label: "Academy story dashboard",                    desc: "Track delivery, read rates, and engagement across your squad" },
                  { icon: "ri-chat-1-line",          label: "Coach conversation guides",                  desc: "Post-story discussion prompts aligned to each position's development themes" },
                  { icon: "ri-parent-line",          label: "Parent companion version",                   desc: "A read-aloud adapted edition for home engagement and family conversation" },
                  { icon: "ri-bar-chart-2-line",     label: "Wellbeing insight reports",                  desc: "Aggregated (anonymised) player sentiment from story engagement patterns" },
                  { icon: "ri-award-line",           label: "Academy branding and co-creation",           desc: "Stories carry your club's identity — crest, values, and coaching culture embedded" },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.18)", color: "#f97316" }}>
                      <i className={`${icon} text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white mb-0.5">{label}</p>
                      <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.32)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <button onClick={() => setEnquiryOpen(true)}
                className="px-10 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 0 40px rgba(249,115,22,0.28)" }}>
                Enquire About the Academy Programme
              </button>
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.20)" }}>We respond within 2 business days.</p>
            </div>
          </div>
          </>
        )}
      </div>

      {/* ── Enquiry modal ── */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.75)" }}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
            style={{ backdropFilter: "blur(24px)", background: "rgba(10,15,30,0.97)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <button onClick={() => { setEnquiryOpen(false); setFormSubmitted(false); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <i className="ri-close-line"></i>
            </button>
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.28)", color: "#34d399" }}>
                  <i className="ri-check-line"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Enquiry Received</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>We'll be in touch within 2 business days to discuss your programme.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">Academy Programme Enquiry</h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {selected ? `Enquiring about the ${selected.label} programme.` : "Tell us about your academy and we'll arrange a demo."}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {[
                    { placeholder: "Your name", type: "text" },
                    { placeholder: "Work email", type: "email" },
                    { placeholder: "Academy / Club name", type: "text" },
                  ].map(({ placeholder, type }) => (
                    <input key={placeholder} required type={type} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }} />
                  ))}
                  <select required className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50 bg-transparent"
                    style={{ background: "rgba(20,25,45,0.95)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)" }}>
                    <option value="">Select league / level</option>
                    <option>Premier League Academy</option>
                    <option>EFL Championship Academy</option>
                    <option>League One / Two Academy</option>
                    <option>Non-League / Grassroots</option>
                    <option>International Academy</option>
                    <option>Other</option>
                  </select>
                  <textarea rows={2} placeholder="Anything specific you'd like to discuss…"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400/50 resize-none transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }} />
                  <button type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 16px rgba(249,115,22,0.30)" }}>
                    Send Enquiry <i className="ri-arrow-right-line"></i>
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
