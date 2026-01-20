
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({ providedIn: 'root' })
export class AIService {
  private ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });

  async getFeedback(outcome: 'win' | 'loss', target: number, val1: number, val2: number): Promise<string> {
    try {
      const prompt = outcome === 'win' 
        ? `A specialist successfully aligned neural fragments ${val1} and ${val2} to hit target ${target}. Provide a precise, elite cyberpunk confirmation (max 12 words).`
        : `Neural fragments ${val1} and ${val2} failed to reach ${target}. Provide a technical diagnostic or a 're-synchronization required' message. DO NOT insult the user or mention 'amateur', 'burn-out', or 'lockout' (max 12 words).`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: "You are a professional neural-link supervisor in a high-tech facility. Your tone is clinical, efficient, and technologically advanced. Avoid aggression or condescension. Keep responses extremely brief and professional.",
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text;
    } catch (e) {
      return outcome === 'win' ? "NEURAL LINK ESTABLISHED. SEQUENCE VERIFIED." : "SYNC ERROR. RECALIBRATION PROTOCOL INITIATED.";
    }
  }
}
