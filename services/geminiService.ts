

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
        model: 'gemini-2.5-flash',
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

    // Use ai.models.generateContent
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    // Extract text using response.text
    return response.text;
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
    
    // Use ai.models.generateContent with responseSchema for JSON output
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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

    // Extract text and parse JSON
    const jsonStr = response.text.trim();
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
        model: 'gemini-2.5-flash',
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

    const jsonStr = response.text.trim();
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
        model: 'gemini-2.5-pro', // Using a more powerful model for complex analysis
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    plantingSuggestion: { type: Type.STRING, description: "Detailed suggestion for planting in this location." },
                    vegetationAnalysis: { type: Type.STRING, description: "Analysis of current vegetation and need for trees." },
                    riskAnalysis: {
                        type: Type.ARRAY,
                        description: "List of potential risks.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, enum: ['regulatory', 'climate', 'ecological'] },
                                warningPercentage: { type: Type.INTEGER, description: "A risk score from 0 to 100." },
                                description: { type: Type.STRING, description: "Explanation of the risk." }
                            },
                             required: ["name", "warningPercentage", "description"]
                        }
                    },
                    suggestedTrees: {
                        type: Type.ARRAY,
                        description: "List of suitable native tree species.",
                        items: { type: Type.STRING }
                    },
                    crowdfundingPitch: { type: Type.STRING, description: "A compelling pitch for a crowdfunding campaign." }
                },
                required: ["plantingSuggestion", "vegetationAnalysis", "riskAnalysis", "suggestedTrees", "crowdfundingPitch"]
            }
        }
    });
    
    const jsonStr = response.text.trim();
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

        Extract the following information from the grant's website (use search if needed from the link) and provide a relevance score.
        
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
        - relevancePercentage: A score from 0 to 100 indicating how relevant this grant is to my profile.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
};

type ScriptScene = Omit<VideoScene, 'videoUrls' | 'imageUrl' | 'isGenerating' | 'isApproved' | 'error'>;

export const generateVideoScript = async (prompt: string, image: string | null, duration: number, videoType: string, targetLanguage: string = 'English'): Promise<ScriptScene[]> => {
    const systemInstruction = `You are a creative video scriptwriter. Your task is to generate a script for a short video based on a user's prompt. The script should be broken down into scenes. For each scene, provide a concise narration and a detailed description of the visuals. The total number of scenes should be appropriate for a ${duration}-second video (approximately one scene per 5-7 seconds). 
    
    IMPORTANT: The 'narration' MUST be written in ${targetLanguage}. The 'description' for the visuals should be in English (for the image generator), but if the user asked for specific text overlays, mention them.`;
    
    let userPrompt = `Video Topic: ${prompt}\nVideo Type: ${videoType}`;
    if (image) {
        userPrompt += "\nAn image has been provided as inspiration.";
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING, description: "A unique ID for the scene, e.g., 'scene_1'" },
                        narration: { type: Type.STRING, description: "The voiceover narration for this scene." },
                        description: { type: Type.STRING, description: "A detailed visual description for the AI video/image generator." },
                    },
                    required: ["id", "narration", "description"],
                }
            }
        }
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
};

export const generateBlogPostWithImages = async (title: string, content: string, tone: string, targetLanguage: string = 'English'): Promise<string> => {
    const blogGenerationPrompt = `
        Based on the following title, content, and desired tone, generate a complete blog post in Markdown format.
        The blog post should be well-structured, engaging, and ready for publication.
        
        CRITICAL: The entire blog post must be written in ${targetLanguage}.

        Crucially, you must insert exactly three placeholders in the text: [IMAGE_1] at the beginning (after the intro), [IMAGE_2] in the middle, and [IMAGE_3] towards the end (before the conclusion).
        Also, provide three visually descriptive prompts for an AI image generator that correspond to these placeholders and match the blog's content and tone (Keep image prompts in English for best results).

        Title: "${title}"
        Content/Outline: "${content}"
        Tone: "${tone}"

        Return a JSON object with two keys: "blogContent" (the full markdown text in ${targetLanguage}) and "imagePrompts" (an array of three string prompts in English).
    `;

    const blogResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: blogGenerationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    blogContent: { 
                        type: Type.STRING,
                        description: "The full blog post in Markdown format with placeholders [IMAGE_1], [IMAGE_2], and [IMAGE_3]."
                    },
                    imagePrompts: {
                        type: Type.ARRAY,
                        description: "An array of three detailed, visually rich prompts for an image generator.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["blogContent", "imagePrompts"]
            }
        }
    });

    const blogData = JSON.parse(blogResponse.text.trim());
    let { blogContent, imagePrompts } = blogData;

    if (!Array.isArray(imagePrompts) || imagePrompts.length < 3) {
        throw new Error("AI did not return at least three image prompts as expected.");
    }
    
    const promptsToGenerate = imagePrompts.slice(0, 3);
    
    const imagePromises = promptsToGenerate.map(prompt => 
        ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
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
        throw new Error("No image data found in one of the responses.");
    });

    blogContent = blogContent
        .replace('[IMAGE_1]', `\n![${promptsToGenerate[0]}](${imageUrls[0]})\n`)
        .replace('[IMAGE_2]', `\n![${promptsToGenerate[1]}](${imageUrls[1]})\n`)
        .replace('[IMAGE_3]', `\n![${promptsToGenerate[2]}](${imageUrls[2]})\n`);
        
    return blogContent;
};

export const generateImageForPost = async (title: string): Promise<string> => {
    const prompt = `A high-quality, professional photo representing the theme of a blog post titled: "${title}". The image should be suitable for a scientific and humanitarian organization's website. Photorealistic, clean, and impactful, 16:9 aspect ratio.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
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
    
    throw new Error("No image was generated.");
};

export const generateImageForProject = async (title: string): Promise<string> => {
    const prompt = `A professional, high-quality, photorealistic image representing a humanitarian or scientific project titled: "${title}". The style should be suitable for a research and consultancy firm's portfolio. The image should be impactful and visually compelling, conveying innovation and global reach. Avoid text or logos. Aspect ratio 16:9.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
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
    
    throw new Error("No image was generated.");
};


export const askGoogleBabaAboutImage = async (image: {data: string, mimeType: string}, userFocus?: string, targetLanguage: string = 'English'): Promise<GrantResult> => {
    const textPart = { text: `Analyze this image. The user is particularly interested in: "${userFocus || 'General information, context, and potential opportunities related to the image.'}". Use Google Search to find relevant, up-to-date information, including potential grant opportunities, research collaborations, or relevant news. Provide web sources. Output the textual analysis in ${targetLanguage}.` };
    const imagePart = { inlineData: image };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = groundingChunks.map(chunk => chunk.web).filter(s => s) as { uri: string; title: string }[];
    
    return {
        text: response.text,
        sources: sources.map(s => ({ web: s })),
    };
};

export const generateSceneVideo = async (description: string): Promise<string[]> => {
    // This is a placeholder as video generation is a long-running operation.
    // In a real app, this would initiate an operation and poll for results.
    console.log("Generating video for:", description);
    await new Promise(res => setTimeout(res, 3000)); // Simulate network delay
    // Returning a placeholder URL
    return [`/videos/placeholder.mp4`];
};

export const generateSceneImage = async (description: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: description }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
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
    
    throw new Error("No image was generated.");
};

export const generateMusicDescription = async (prompt: string, targetLanguage: string = 'English'): Promise<string> => {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Describe a suitable background music track for a video with the following theme: "${prompt}". Describe the mood, instruments, and tempo. Output in ${targetLanguage}.`,
    });
    return response.text;
};

// --- Content Hub Services ---

export const generateVideoConcept = async (topic: string, platform: string, language: string): Promise<VideoScript> => {
    const prompt = `Create a short vertical video script (Reels/TikTok style) about "${topic}" for ${platform} in ${language}. 
    Return a JSON object with: 
    - title: catchy title in ${language}
    - hook: first 3 seconds text in ${language}
    - scenes: array of { timecode, visual, voiceover, emotion, audio_cues } where text is in ${language}
    - cta: Call to Action in ${language}
    - caption: post caption in ${language}
    - hashtags: array of strings`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text.trim());
};

export const getPublishingStrategy = async (topic: string, platform: string, language: string): Promise<PublishingStrategy> => {
    const prompt = `Analyze the best publishing strategy for a post about "${topic}" on ${platform} targeting a ${language} speaking audience.
    Return JSON with:
    - bestTime: Best time of day to post (e.g. "Tuesday 5 PM") in ${language}
    - reasoning: Why this time is best in ${language}
    - algorithmTip: A tip to boost reach in ${language}
    - nextPostIdea: A follow-up post idea in ${language}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text.trim());
};

export const findBestVideoTools = async (language: string): Promise<VideoTool[]> => {
    const prompt = `List 3 top AI video generation tools suitable for creating content in ${language}.
    Return a JSON array of objects with:
    - name: Tool name
    - cost: Free/Paid (in ${language})
    - farsiSupport: "Yes"/"No" (in ${language})
    - features: Short description of key features (in ${language})
    - qualityRating: "High"/"Medium" (in ${language})`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text.trim());
};