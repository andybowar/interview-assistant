import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VUE_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In a production app, you should use a backend to make API calls
});

export async function generateResponse(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return "Sorry, there was an error generating a response.";
  }
}