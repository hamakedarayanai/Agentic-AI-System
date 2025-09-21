
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export const runResearcherAgent = async (topic: string): Promise<string> => {
    const prompt = `You are a world-class research agent. Your goal is to find and provide a concise, factual summary of the topic: '${topic}'. The summary should be well-structured, easy to understand, and suitable for a blog post. Focus on the key points, important facts, and any recent developments. Provide the summary in about 200-300 words.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error in Researcher Agent:", error);
        throw new Error("The researcher agent failed to generate a summary.");
    }
};

export const runWriterAgent = async (summary: string): Promise<string> => {
    const prompt = `You are an expert blog post writer. Using the following summary, write an engaging and informative blog post of about 400-500 words. The blog post should have a catchy title, an introduction, a body with clear paragraphs, and a concluding paragraph. The tone should be professional yet accessible. The first line of your response MUST be "Title: <Your Catchy Title Here>", followed by the full blog post content on subsequent lines.

Here is the summary:
---
${summary}
---`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error in Writer Agent:", error);
        throw new Error("The writer agent failed to generate a blog post.");
    }
};

export const runSchedulerAgent = async (blogTitle: string): Promise<string> => {
    const prompt = `You are a social media scheduling agent. A blog post titled '${blogTitle}' is ready to be published. Generate a confirmation message indicating that the post has been successfully scheduled to be published on Twitter, LinkedIn, and Facebook tomorrow at 9:00 AM PST. The message should sound professional and automated.`;
    
    try {
        // Simulate network delay for a more realistic feel
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error in Scheduler Agent:", error);
        throw new Error("The scheduler agent failed to generate a confirmation.");
    }
};
