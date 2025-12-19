
import { GoogleGenAI } from "@google/genai";
import { TrendResponse, Region, Category } from "../types";

export const fetchTrends = async (categoryPrompt: string, region: Region): Promise<TrendResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个专业的全领域趋势分析师。请针对以下请求，提供针对【${region}】地区在今日（${new Date().toLocaleDateString()}）最火爆、最具影响力的趋势内容：
      
      "${categoryPrompt}"
      
      要求：
      1. 必须聚焦于【${region}】地区的本地市场和流行文化，如果是全球趋势，请说明其在【${region}】的影响。
      2. 请以Markdown格式详细阐述，至少列出3-5个核心趋势点。
      3. 每个点应包含：趋势名称 (加粗)、详细内容描述、爆火原因分析。
      
      最后，请提供相关的背景信息和参考数据来源说明。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "暂时无法获取该地区的趋势内容，请尝试切换其他地区。";
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[]) || [];

    return {
      text,
      sources,
    };
  } catch (error) {
    console.error("Error fetching regional trends:", error);
    throw error;
  }
};

export const analyzeFutureTrends = async (product: string, category: Category, region: Region): Promise<TrendResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个极具前瞻性的商业策略专家。
      用户拥有一个产品/概念：【${product}】。
      
      请分析【${region}】地区【${category}】领域的【今日最新热门趋势】，并探讨该产品如何与这些趋势深度结合，创造未来的商业机会或创新功能。
      
      分析要求：
      1. 识别当前【${category}】领域最火的3个趋势。
      2. 针对每个趋势，为【${product}】提出一个具体的“未来功能”或“营销结合点”。
      3. 评估这些结合点在【${region}】市场的潜在成功率。
      4. 建议接下来的落地步骤。
      
      请以Markdown格式输出，语言要专业且富有启发性。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "未能生成分析报告，请稍后再试。";
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[]) || [];

    return {
      text,
      sources,
    };
  } catch (error) {
    console.error("Error analyzing future trends:", error);
    throw error;
  }
};
