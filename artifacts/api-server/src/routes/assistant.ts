import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

interface ActiveQuestion {
  text: string;
  hint?: string;
  prompts?: string[];
  options?: string[];
  type?: string;
  stageName?: string;
}

const PAGE_CONTEXT: Record<string, string> = {
  "/welcome":    "The player is on the Welcome page, about to start their MeTime Stories journey. They can see chapter previews and a 'Begin My Story' button.",
  "/welcome-u9": "The player is on the Welcome page for U9s (younger players), about to start their MeTime Stories journey.",
  "/journey":    "The player is actively answering scenario-based questions about their football life and personality.",
  "/journey-u9": "The younger player (U9) is answering simplified photo-based questions about themselves and their football.",
  "/invite":     "The player is on the Invite page, where they can send unique links to parents, friends, or coaches to contribute to their story.",
  "/complete":   "The player has finished all their questions and their story is being compiled.",
};

function getSystemPrompt(page: string, mascotName: string, activeQuestion?: ActiveQuestion): string {
  const pageCtx = PAGE_CONTEXT[page] ?? "The player is using the MeTime Stories Football Academy Player Portal.";

  let questionCtx = "";
  if (activeQuestion) {
    questionCtx = `\n\nThe player is currently on this specific question:\nQuestion: "${activeQuestion.text}"`;
    if (activeQuestion.hint) questionCtx += `\nHint shown to player: "${activeQuestion.hint}"`;
    if (activeQuestion.stageName) questionCtx += `\nSection: ${activeQuestion.stageName}`;
    if (activeQuestion.prompts?.length) questionCtx += `\nPrompts shown: ${activeQuestion.prompts.join(", ")}`;
    if (activeQuestion.options?.length) questionCtx += `\nOptions available: ${activeQuestion.options.join(", ")}`;
    if (activeQuestion.type === "voice-text") questionCtx += `\nAnswer format: player speaks or types a free response.`;
    if (activeQuestion.type === "multiselect") questionCtx += `\nAnswer format: player picks multiple options from the list.`;
    if (activeQuestion.type === "select") questionCtx += `\nAnswer format: player picks one option from the list.`;
    questionCtx += `\n\nYour job is to help them understand what this question is asking and how to answer it well. Give specific, concrete guidance for THIS question — not generic advice.`;
  }

  return `You are ${mascotName}, a helpful football academy assistant inside the MeTime Stories app.
You help young academy players understand and complete their player journey.

Current page context: ${pageCtx}${questionCtx}

Keep answers short, warm, and clear — 2 to 4 sentences max.
Use plain, friendly language suitable for a young football player (age 9–18).
Don't use bullet points or headers — just a natural, conversational reply.
Never say you can't help — always give a useful, specific answer or suggestion.
Stay focused on the MeTime Stories experience.`;
}

router.post("/assistant/ask", async (req, res) => {
  const { question, page, mascotName, activeQuestion } = req.body as {
    question?: string;
    page?: string;
    mascotName?: string;
    activeQuestion?: ActiveQuestion;
  };

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const systemPrompt = getSystemPrompt(page ?? "/", mascotName ?? "Mety", activeQuestion);

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
