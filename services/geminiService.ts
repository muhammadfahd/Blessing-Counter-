
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WORLD_POPULATION } from "../constants";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blessingResponseSchema = {
    type: Type.OBJECT,
    properties: {
        estimated_count: {
            type: Type.NUMBER,
            description: "The estimated number of people worldwide to whom the statement applies."
        },
        perspective_fact: {
            type: Type.STRING,
            description: "A hard-hitting, factual global statistic."
        },
        village_stat: {
            type: Type.STRING,
            description: "A version of the stat for a village of 100 people. E.g., 'In a village of 100 people, only 5 would have this.'"
        }
    },
    required: ["estimated_count", "perspective_fact", "village_stat"]
};

export const estimateBlessingCount = async (blessing: string): Promise<{count: number, fact: string, villageStat: string}> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Estimate global data for: "${blessing}"`,
            config: {
                systemInstruction: "You are a data-driven sociologist. Provide a numerical estimate (8.1B population), an eye-opening fact, and a 'Global Village' stat (if the world were 100 people). Return JSON.",
                responseMimeType: "application/json",
                responseSchema: blessingResponseSchema,
            },
        });

        const result = JSON.parse(response.text.trim());
        return {
            count: result.estimated_count,
            fact: result.perspective_fact,
            villageStat: result.village_stat
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Could not get an estimate.");
    }
};

export const generateBlessingImage = async (blessingText: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        text: `A cinematic, peaceful, and high-quality artistic interpretation of the feeling of gratitude for: "${blessingText}". Style: Dreamy realism, soft lighting, 4k, trending on artstation.`,
                    },
                ],
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1"
                }
            }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data returned");
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Read this calmly and peacefully: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("Failed to generate audio data.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw error;
    }
};

export const estimateCombinedBlessingCount = async (blessings: string[]): Promise<number> => {
    if (blessings.length === 0) return WORLD_POPULATION;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Estimate how many people meet ALL these conditions: ${blessings.join('; ')}`,
            config: {
                systemInstruction: "Estimate the intersection. Population 8.1B. Return only JSON with 'estimated_count'.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { estimated_count: { type: Type.NUMBER } },
                    required: ["estimated_count"]
                }
            },
        });
        return JSON.parse(response.text.trim()).estimated_count;
    } catch (error) {
        return WORLD_POPULATION / 10;
    }
};

export const fetchPersonalizedInsight = async (blessings: string[]): Promise<string> => {
    if (blessings.length === 0) return "";
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a single encouraging sentence summarizing these blessings: ${blessings.join(', ')}`,
    });
    return response.text.trim();
};

export const fetchInspirationalQuote = async (): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Short quote about gratitude.",
    });
    return response.text.trim();
};
