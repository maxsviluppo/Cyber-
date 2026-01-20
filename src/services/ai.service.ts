import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({ providedIn: 'root' })
export class AIService {
  private genAI: GoogleGenerativeAI;
  private apiKey: string;

  private readonly winMessages = [
    "SINCRONIZZAZIONE NEURALE CONFERMATA. INTEGRITÀ DATI 100%.",
    "COLLEGAMENTO AL BERSAGLIO STABILITO. LINK STABILE.",
    "CALCOLO VERIFICATO. PROTOCOLLO AUTORIZZATO.",
    "RIASSEMBLAGGIO FRAMMENTI COMPLETATO. ECCELLENTE.",
    "SISTEMA ALLINEATO. PRESTAZIONI OTTIMALI RILEVATE."
  ];

  private readonly lossMessages = [
    "DISALLINEAMENTO RILEVATO. RICALIBRAZIONE RICHIESTA.",
    "ERRORE DI SOMMA. CONTROLLARE I PERCORSI NEURALI.",
    "SINCRONIZZAZIONE FALLITA. REGOLARE I PARAMETRI.",
    "FRAMMENTAZIONE DEL SEGNALE. RIPROVARE.",
    "CALIBRAZIONE FUORI ASSE. BERSAGLIO NON RAGGIUNTO."
  ];

  constructor() {
    this.apiKey = 'PLACEHOLDER_API_KEY';
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  async getFeedback(outcome: 'win' | 'loss', target: number, val1: number, val2: number): Promise<string> {
    // If we don't have a real key, use local random messages immediately.
    if (this.apiKey === 'PLACEHOLDER_API_KEY') {
      const messages = outcome === 'win' ? this.winMessages : this.lossMessages;
      return messages[Math.floor(Math.random() * messages.length)];
    }

    try {
      const prompt = outcome === 'win'
        ? `Uno specialista ha allineato con successo i frammenti neurali ${val1} e ${val2} per colpire il bersaglio ${target}. Fornisci una conferma cyberpunk precisa ed elitaria in ITALIANO (max 12 parole).`
        : `I frammenti neurali ${val1} e ${val2} non hanno raggiunto il bersaglio ${target}. Fornisci una diagnostica tecnica o un messaggio di 'risincronizzazione richiesta' in ITALIANO. NON insultare l'utente (max 12 parole).`;

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: "Sei un supervisore di collegamenti neurali in una struttura ad alta tecnologia. Il tuo tono è clinico, efficiente e tecnologicamente avanzato. Evita aggressività o condiscendenza. Mantieni le risposte estremamente brevi e professionali. RISPONDI SEMPRE IN ITALIANO."
      });

      const result = await model.generateContent(prompt);
      return result.response.text() || (outcome === 'win' ? "LINK NEURALE STABILITO." : "ERRORE DI SINCRONIZZAZIONE.");
    } catch (e) {
      console.warn("AI Unavailable, switching to manual overrides.");
      const messages = outcome === 'win' ? this.winMessages : this.lossMessages;
      return messages[Math.floor(Math.random() * messages.length)];
    }
  }
}
