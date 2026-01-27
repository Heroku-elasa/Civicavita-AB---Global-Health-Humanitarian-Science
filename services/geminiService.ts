import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import { Grant, GrantSummary, VideoScene, PlantingAnalysis, RiskItem, VideoScript, PublishingStrategy, VideoTool } from "../types";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface GrantResult {
    text: string;
    sources: { web: { uri: string; title: string } }[];
}

export const startWasteBotChat = (language: string = 'English'): Chat => {
    const systemInstruction = `
You are an AI agent for the "Waste to Wealth" project. Your role is an Educational Ambassador and Support Agent. Your mission is to simplify our complex business model and promote our project, making it understandable and appealing to a general audience, potential partners, and investors.

**Language Instruction:**
You MUST interact with the user in ${language}. All responses must be in ${language}.

**Communication Style:**
Your primary communication goal is clarity and accessibility.
- **Use simple, clear, and concise language.** Break down complex ideas into easy-to-understand points.
- **Avoid technical jargon.** Instead of using terms like 'tokenization', 'equity', or 'scalability' directly, explain the concepts behind them.
- **Be professional, encouraging, and inspiring.** Your goal is to be both informative and build excitement about the project.

You MUST integrate the following three core knowledge modules into your responses whenever a user's query is relevant.

**Core Knowledge Modules:**

1.  **Community Share Model (Equity):**
    *   **Trigger Topics:** "profit," "rewards," "business model," "making money," "ownership."
    *   **Core Message:** When triggered, you MUST explain that 65-70% of the project's value is designated for the community and active users. Emphasize that user participation is directly linked to ownership. This is not just a recycling program; it's a community-owned venture.

2.  **Tokenization & Credibility (Tokens):**
    *   **Trigger Topics:** "value," "digital currency," "legality," "Green Points," "how rewards work."
    *   **Core Message:** When triggered, you MUST clarify that rewards are paid as secure digital "Green Points" or "Green Tokens." You MUST stress the credibility by mentioning that their issuance is supervised by universities and accredited accelerators to ensure regulatory compliance and trust. This ensures the rewards have real, stable value.

3.  **Scalability & Global Credibility (Growth):**
    *   **Trigger Topics:** "project's future," "expansion," "sponsors," "long-term plan," "investors."
    *   **Core Message:** When triggered, you MUST highlight our international achievements and vision. Mention that the project is endorsed by XPRIZE. Talk about our global strategy, which includes 100 pilots in Iran, and our plan to secure funding from major climate funds like COP28 / ALTÉRRA for regional expansion.

**Behavioral Guidelines:**

*   **For General Users:** Focus on the benefits of participation, the ease of use, and the positive community and environmental impact.
*   **For Potential Partners/Investors:** When you detect more professional language, provide concise, high-level summaries of the Economic/Branding ROI and strategic advantages. Be ready to point them towards official channels for more detailed information.
*   **Be Proactive:** If a user asks a simple question, try to connect it back to one of the core modules to educate them further.
`;

    const chat: Chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction,
        },
    });

    return chat;
};

export const generateReport = async (topic: string, description: string, reportType: string, targetLanguage: string = 'English'): Promise<string> => {
    const prompt = `
        Generate a comprehensive report of type "${reportType}".
        Topic: ${topic}
        Description: ${description}

        The report should be well-structured, detailed, and formatted in Markdown.
        Include sections like Introduction, Analysis, Findings, and Conclusion.

        IMPORTANT: The ENTIRE output must be written in ${targetLanguage}.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    
    return response.text || "No content generated.";
};

export const findGrants = async (keywords: string, targetLanguage: string = 'English'): Promise<Grant[]> => {
    const prompt = `
        Find available grants related to these keywords: "${keywords}".
        Provide a list of 5 grants. For each grant, provide:
        - grantTitle: The official title of the grant (translate to ${targetLanguage}).
        - fundingBody: The organization providing the funds.
        - summary: A brief summary of the grant's purpose (translated to ${targetLanguage}).
        - deadline: The application deadline.
        - link: A direct URL to the grant page.
        
        The output must be a valid JSON array. Ensure values for 'grantTitle' and 'summary' are in ${targetLanguage}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        grantTitle: { type: Type.STRING },
                        fundingBody: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        deadline: { type: Type.STRING },
                        link: { type: Type.STRING },
                    },
                    required: ["grantTitle", "fundingBody", "summary", "deadline", "link"]
                }
            }
        }
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
};

export const findReforestationGrants = async (projectDescription: string, targetLanguage: string = 'English'): Promise<Grant[]> => {
    const prompt = `
        Based on the following reforestation project description, find 5 relevant grants.
        Project Description: "${projectDescription}"

        For each grant, provide:
        - grantTitle: The official title of the grant (translated to ${targetLanguage}).
        - fundingBody: The organization providing the funds.
        - summary: A brief summary of the grant's purpose and how it relates to the project (translated to ${targetLanguage}).
        - deadline: The application deadline.
        - link: A direct URL to the grant page.

        The output must be a valid JSON array. Ensure values for 'grantTitle' and 'summary' are in ${targetLanguage}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        grantTitle: { type: Type.STRING },
                        fundingBody: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        deadline: { type: Type.STRING },
                        link: { type: Type.STRING },
                    },
                    required: ["grantTitle", "fundingBody", "summary", "deadline", "link"]
                }
            }
        }
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
};

export const analyzePlantingLocation = async (location: string, targetLanguage: string = 'English'): Promise<PlantingAnalysis> => {
    const prompt = `
        Analyze the location "${location}" for a large-scale tree planting project. 
        Provide a detailed analysis in the following JSON format.
        
        CRITICAL: All textual descriptions and values must be in ${targetLanguage}.

        The analysis must include:
        1.  A suggestion for planting, considering climate, soil, and potential impact.
        2.  An analysis of current vegetation cover and the need for reforestation.
        3.  A risk analysis covering three specific categories: regulatory (local environmental laws), climate (risks from climate change to the project), and ecological (potential negative impacts on the existing ecosystem). Each risk must have a warning percentage (0-100) and a brief description.
        4.  A list of 3-5 native tree species suitable for the location.
        5.  A short, compelling crowdfunding pitch to raise funds for this specific location.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    plantingSuggestion: { type: Type.STRING },
                    vegetationAnalysis: { type: Type.STRING },
                    riskAnalysis: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, enum: ['regulatory', 'climate', 'ecological'] },
                                warningPercentage: { type: Type.INTEGER },
                                description: { type: Type.STRING }
                            },
                             required: ["name", "warningPercentage", "description"]
                        }
                    },
                    suggestedTrees: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    crowdfundingPitch: { type: Type.STRING }
                },
                required: ["plantingSuggestion", "vegetationAnalysis", "riskAnalysis", "suggestedTrees", "crowdfundingPitch"]
            }
        }
    });
    
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
};


export const analyzeGrant = async (grant: Grant, userProfile: string, targetLanguage: string = 'English'): Promise<GrantSummary> => {
    const prompt = `
        Analyze the following grant opportunity based on my profile.
        
        My Profile:
        ${userProfile}

        Grant Details:
        Title: ${grant.grantTitle}
        Funding Body: ${grant.fundingBody}
        Summary: ${grant.summary}
        Deadline: ${grant.deadline}
        Link: ${grant.link}

        Extract the relevant information and provide a relevance score.
        
        CRITICAL: Translate all textual fields (except links and numbers) to ${targetLanguage}.

        - grantTitle
        - fundingBody
        - deadline
        - amount
        - duration
        - geography
        - eligibility
        - scope
        - howToApply
        - contact
        - relevancePercentage: 0-100 score.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    grantTitle: { type: Type.STRING },
                    fundingBody: { type: Type.STRING },
                    deadline: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    geography: { type: Type.STRING },
                    eligibility: { type: Type.STRING },
                    scope: { type: Type.STRING },
                    howToApply: { type: Type.STRING },
                    contact: { type: Type.STRING },
                    relevancePercentage: { type: Type.INTEGER },
                },
                required: ["grantTitle", "fundingBody", "deadline", "amount", "duration", "geography", "eligibility", "scope", "howToApply", "contact", "relevancePercentage"]
            }
        }
    });
    
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
};

type ScriptScene = Omit<VideoScene, 'videoUrls' | 'imageUrl' | 'isGenerating' | 'isApproved' | 'error'>;

export const generateVideoScript = async (prompt: string, image: string | null, duration: number, videoType: string, targetLanguage: string = 'English'): Promise<ScriptScene[]> => {
    const systemInstruction = `You are a creative video scriptwriter. Your task is to generate a script for a short video based on a user's prompt. The script should be broken down into scenes. For each scene, provide a concise narration and a detailed description of the visuals.
    
    IMPORTANT: The 'narration' MUST be written in ${targetLanguage}. The 'description' for the visuals should be in English.`;
    
    let userPrompt = `Video Topic: ${prompt}\nVideo Type: ${videoType}\nDuration: ${duration}s`;
    if (image) {
        userPrompt += "\nAn image has been provided as inspiration.";
    }

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        narration: { type: Type.STRING },
                        description: { type: Type.STRING },
                    },
                    required: ["id", "narration", "description"],
                }
            }
        }
    });
    
    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
};

export const generateBlogPostWithImages = async (title: string, content: string, tone: string, targetLanguage: string = 'English'): Promise<string> => {
    const blogGenerationPrompt = `
        Based on the following title, content, and desired tone, generate a complete blog post in Markdown format.
        
        CRITICAL: The entire blog post must be written in ${targetLanguage}.

        Placeholders: [IMAGE_1], [IMAGE_2], and [IMAGE_3].
        Also provide three English image prompts.

        Title: "${title}"
        Content/Outline: "${content}"
        Tone: "${tone}"

        Return JSON with "blogContent" and "imagePrompts" (array of 3 strings).
    `;

    const blogResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: blogGenerationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    blogContent: { type: Type.STRING },
                    imagePrompts: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["blogContent", "imagePrompts"]
            }
        }
    });

    const blogData = JSON.parse(blogResponse.text?.trim() || "{}");
    let { blogContent, imagePrompts } = blogData;

    if (!Array.isArray(imagePrompts) || imagePrompts.length < 3) {
        return blogContent || "Failed to generate blog content.";
    }
    
    const promptsToGenerate = imagePrompts.slice(0, 3);
    
    const imagePromises = promptsToGenerate.map(prompt => 
        ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
        })
    );

    const imageResults = await Promise.all(imagePromises);
    
    const imageUrls = imageResults.map(result => {
        const candidate = result?.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    return `data:${mimeType};base64,${base64ImageBytes}`;
                }
            }
        }
        return "https://via.placeholder.com/800x450?text=Image+Generation+Failed";
    });

    blogContent = blogContent
        .replace('[IMAGE_1]', `\n![Image 1](${imageUrls[0]})\n`)
        .replace('[IMAGE_2]', `\n![Image 2](${imageUrls[1]})\n`)
        .replace('[IMAGE_3]', `\n![Image 3](${imageUrls[2]})\n`);
        
    return blogContent;
};

export const generateImageForPost = async (title: string): Promise<string> => {
    const prompt = `A professional, thematic high-quality 16:9 photo representing: "${title}". Suitable for a humanitarian/scientific organization website. Realistic, clean, evocative.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
    });

    const candidate = response?.candidates?.[0];
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
    }
    
    throw new Error("No image data returned from AI service.");
};

export const generateImageForProject = async (title: string): Promise<string> => {
    const prompt = `A high-quality 16:9 photorealistic image representing a scientific research or humanitarian project titled: "${title}". Focus on innovation, impact, and global reach. Clean and professional.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
    });

    const candidate = response?.candidates?.[0];
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
    }
    
    throw new Error("No image data returned from AI service.");
};


export const askGoogleBabaAboutImage = async (image: {data: string, mimeType: string}, userFocus?: string, targetLanguage: string = 'English'): Promise<GrantResult> => {
    const textPart = { text: `Analyze this image. Interest: "${userFocus || 'General information'}". Use Google Search. Output in ${targetLanguage}.` };
    const imagePart = { inlineData: image };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = groundingChunks.map(chunk => chunk.web).filter(s => s) as { uri: string; title: string }[];
    
    return {
        text: response.text || "Analysis complete.",
        sources: sources.map(s => ({ web: s })),
    };
};

export const generateSceneVideo = async (description: string): Promise<string[]> => {
    console.log("Generating video placeholder for:", description);
    await new Promise(res => setTimeout(res, 2000));
    return [`https://storage.googleapis.com/civicavita-assets/placeholder-scene.mp4`];
};

export const generateSceneImage = async (description: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: description }],
        },
    });

    const candidate = response?.candidates?.[0];
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
    }
    
    throw new Error("Failed to generate scene image.");
};

export const generateMusicDescription = async (prompt: string, targetLanguage: string = 'English'): Promise<string> => {
     const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Describe suitable background music for: "${prompt}". Output in ${targetLanguage}.`,
    });
    return response.text || "No music description available.";
};

// --- Content Hub Services ---

export const generateVideoConcept = async (topic: string, platform: string, language: string): Promise<VideoScript> => {
    const prompt = `Create a vertical video script about "${topic}" for ${platform} in ${language}. Return JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    hook: { type: Type.STRING },
                    scenes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                timecode: { type: Type.STRING },
                                visual: { type: Type.STRING },
                                voiceover: { type: Type.STRING },
                                emotion: { type: Type.STRING },
                                audio_cues: { type: Type.STRING }
                            }
                        }
                    },
                    cta: { type: Type.STRING },
                    caption: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
};

export const getPublishingStrategy = async (topic: string, platform: string, language: string): Promise<PublishingStrategy> => {
    const prompt = `Publishing strategy for "${topic}" on ${platform} for ${language} audience. Return JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    bestTime: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    algorithmTip: { type: Type.STRING },
                    nextPostIdea: { type: Type.STRING }
                }
            }
        }
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
};

export const findBestVideoTools = async (language: string): Promise<VideoTool[]> => {
    const prompt = `List 3 top AI video tools for ${language} content. Return JSON array.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        cost: { type: Type.STRING },
                        farsiSupport: { type: Type.STRING },
                        features: { type: Type.STRING },
                        qualityRating: { type: Type.STRING }
                    }
                }
            }
        }
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
};