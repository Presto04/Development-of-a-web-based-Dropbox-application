
import { GoogleGenAI, Type } from "@google/genai";
import { FileMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function scanFileMetadata(file: FileMetadata): Promise<{ 
  status: 'CLEAN' | 'WARNING' | 'INFECTED'; 
  score: number;
  analysis: string;
}> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a security analysis on the following file metadata:
      Name: ${file.name}
      Type: ${file.type}
      Size: ${file.size} bytes
      
      Look for potential injection patterns in the filename, mismatched extensions, or unusual characteristics that might suggest malware or malicious intent. 
      Return a risk score from 0 to 100 and a status.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "CLEAN, WARNING, or INFECTED" },
            score: { type: Type.NUMBER, description: "Risk score from 0-100" },
            analysis: { type: Type.STRING, description: "Brief explanation of findings" }
          },
          required: ["status", "score", "analysis"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      status: result.status as any,
      score: result.score,
      analysis: result.analysis
    };
  } catch (error) {
    console.error("AI Scan Error:", error);
    return {
      status: 'CLEAN',
      score: 0,
      analysis: "Automatic check failed, defaulted to CLEAN for demo purposes."
    };
  }
}
