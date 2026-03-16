import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const PAGE_CONTEXT: Record<string, string> = {
  "/welcome": "The player is on the Welcome page, about to start their MeTime Stories journey. They can see chapter previews and a 'Begin My Story' button.",
  "/welcome-u9": "The player is on the Welcome page for U9s (younger players), about to start their MeTime Stories journey.",
  "/journey": "The player is actively answering scenario-based questions about their football life and personality — things like decision-making on the pitch, their mindset, goals, and values.",
  "/journey-u9": "The younger player (U9) is answering simplified photo-based questions about themselves and their football.",
  "/invite": "The player is on the Invite page, where they can send unique links to parents, friends, or coaches to contribute to their story.",
  "/complete": "The player has finished all their questions and their story is being compiled. They're waiting to hear back from their coach or academy.",
};

function getSystemPrompt(page: string, mascotName: string): string {
  const pageCtx = PAGE_CONTEXT[page] ?? "The player is using the MeTime Stories Football Academy Player Portal.";

  return `You are ${mascotName}, a helpful football academy assistant inside the MeTime Stories app. 
You help young academy players understand and complete their player journey.

Current page context: ${pageCtx}

Keep answers short, warm, and clear — 2 to 4 sentences max. 
Use plain, friendly language suitable for a young football player (age 9–18).
Don't use bullet points or headers — just a natural, conversational reply.
If you don't know something specific, give practical, encouraging advice.
Stay focused on the MeTime Stories experience: answering questions, building their story, inviting stakeholders.`;
}

router.post("/assistant/ask", async (req, res) => {
  const { question, page, mascotName } = req.body as {
    question?: string;
    page?: string;
    mascotName?: string;
  };

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const systemPrompt = getSystemPrompt(page ?? "/", mascotName ?? "Mety");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question.trim() },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? "I'm not sure — ask your coach if you're stuck!";
    return res.json({ answer });
  } catch (err) {
    console.error("[Assistant] error:", err);
    return res.status(500).json({ error: "Failed to get a response. Try again in a moment." });
  }
});

export default router;
