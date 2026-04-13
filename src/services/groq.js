const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const generateRealityCheck = async (userData, weatherData, mode) => {
  if (!GROQ_API_KEY) {
    throw new Error("Missing VITE_GROQ_API_KEY in environment variables.");
  }

  const systemPrompts = {
    "Savage 😈": "You are a savage, ruthless, and highly sarcastic AI. You mock the user mercilessly while providing structured data.",
    "Therapist 🧘": "You are a calm, empathetic, and gentle AI therapist. You validate their feelings and gently guide them.",
    "Analyst 🧠": "You are a cold, logic-driven AI analyst. You calculate probabilities with robotic precision and use statistical jargon.",
    "Meme Lord 🤡": "You are a brain-rotted meme lord AI. You speak in gen-z slang, internet memes, and chaotic energy."
  };

  const systemTone = systemPrompts[mode] || systemPrompts["Savage 😈"];

  const prompt = `
Analyze the user's day based on the following data:
- City: ${weatherData.location}
- Weather: ${weatherData.temperature}°C, ${weatherData.condition}
- Current Mood: ${userData.mood}
- Sleep Hours: ${userData.sleep}
- Today's Plans: ${userData.plans}
- Random Entropy: ${Math.random().toString(36).substring(7)} (Use this seed to radically change your creative angle, vocabulary, and specific futuristic scenarios generated compared to previous times. Never repeat the exact same scenario.)

Return ONLY valid JSON in this format:
{
  "roast": "...",
  "prediction": "...",
  "survival_score": number between 0 and 100,
  "advice": "...",
  "future": {
    "best": "...",
    "worst": "...",
    "realistic": "..."
  },
  "summary": "...",
  "explanation": "..."
}

Rules:
- No extra text
- No markdown
- survival_score must be 0-100

Future Simulation Rules:
- "best" must be highly optimistic and successful
- "worst" must be clearly negative or failure scenario
- "realistic" must be balanced and practical
- ALL three must be creatively absurd, wildly divergent, and completely different from each other.
- Use deeply specific, wildly different nouns, verbs, and contexts every single time you are asked. Do not use generic phrases.
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemTone + " ALWAYS RESPOND WITH VALID JSON ONLY." },
          { role: "user", content: prompt }
        ],
        temperature: 1.0,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch from Groq API");
    }

    const data = await response.json();
    const rawText = data.choices[0].message.content;
    
    // Clean response before parsing using regex
    const jsonMatch = rawText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("AI scattered its thoughts. Couldn't parse reality.");
    }
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error("AI returned unreadable chaos! Please try again.");
    }
  } catch (error) {
    console.error("Groq generation error:", error);
    throw error; // Let the UI handle this friendly error
  }
};
