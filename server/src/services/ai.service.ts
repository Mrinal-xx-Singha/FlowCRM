interface DraftContext {
    customerName: string;
    customerNotes?: string;
    jobTitle?: string;
    dealValue?: number;
    jobStatus?: string
    tone?: "professional" | "friendly" | "urgent"
}

export const generateEmailDraft = async (context: DraftContext) => {
    const apiKey = process.env.GEMINI_API_KEY;
    // Fallback if API key is not configured yet
    if (!apiKey) {
        return {
            subject: `Following up on our discussion - ${context.customerName}`,
            body: `Hi ${context.customerName},\n\nI hope you're having a productive week! I wanted to follow up on ${context.jobTitle || "our previous conversation"}.\n\nPlease let me know if you have any questions or when you'd like to chat next. \n\nBest regards,`
        }
    }

    // 2. Build context prompt
    const tone = context.tone || "professional"
    const prompt = `You are an AI sales assistant for a modern small-business CRM.
    Write a personalized follow-up email to a client with the following details:
    - Client Name: ${context.customerName}
    - Client Notes/History: ${context.customerNotes || "None"}
    - Associated Deal: ${context.jobTitle || "General follow-up"}
    - Deal Status: ${context.jobStatus || "In discussion"}
    - Deal Value: ${context.dealValue ? `₹${context.dealValue}` : "N/A"}
    - Tone: ${tone} (e.g., friendly, professional, or gentle urgency)
    Requirements:
    - Keep the body concise (under 120 words).
    - Make it sound natural and human, never robotic.
    - Respond STRICTLY with a valid JSON object with exactly two keys: "subject" and "body". Do not wrap in markdown quotes.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
            }
        })
    })

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        throw new Error("Failed to generate AI draft");
    }

    const data = await response.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
    const parsed = JSON.parse(rawText)


    return {
        subject: parsed.subject || `Follow-up: ${context.customerName}`,
        body: parsed.body || ""
    }


}