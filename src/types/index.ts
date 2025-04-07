
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ScriptureReference {
  book: string;
  chapter: number;
  verses: string; // Can be a single verse "1" or range "1-5"
  text?: string;
}

export interface FollowUpQuestion {
  id: string;
  text: string;
}

export interface ChatResponse {
  answer: string;
  references: ScriptureReference[];
  followUpQuestions: FollowUpQuestion[];
}
