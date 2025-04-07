
import OpenAI from "openai";
import { ChatResponse } from '@/types';

// Initialize the OpenAI client
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-demo-api-key',
  dangerouslyAllowBrowser: true // This is fine for demo purposes
});

export const generateAnswer = async (question: string): Promise<ChatResponse> => {
  console.log("Question sent to API:", question);
  
  try {
    // Create the system prompt that instructs the model how to respond
    const systemPrompt = `You are an AI assistant specialized in answering questions about the Book of Mormon.
    When responding to questions:
    1. Always ground your answers in actual Book of Mormon scriptures.
    2. Provide specific scripture references (book, chapter, verse) and quote the relevant passages.
    3. Answer thoughtfully and with consideration of the context and intent of the scriptures.
    4. Suggest 3 follow-up questions related to the topic.
    
    Format your response as follows:
    - Main answer section addressing the question
    - At least 2 specific scripture references with the quoted text
    - 3 suggested follow-up questions`;
    
    // If we don't have a real API key, return mock data
    if (client.apiKey === 'your-demo-api-key') {
      console.log("Using mock data (no API key provided)");
      return getMockResponse(question);
    }
    
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.7,
    });
    
    // Extract the content from the response
    const content = response.choices[0].message.content || '';
    
    // Parse the content to extract scripture references and follow-up questions
    return parseResponse(content, question);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return getMockResponse(question);
  }
};

// Helper function to parse the OpenAI response into our ChatResponse format
const parseResponse = (content: string, originalQuestion: string): ChatResponse => {
  // Simplified parser - in a real app you'd want more robust parsing
  const lines = content.split('\n');
  
  let answer = '';
  let references = [];
  let followUpQuestions = [];
  let parsingState = 'answer';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Look for scripture references in format "Book Chapter:Verse"
    const referenceMatch = trimmedLine.match(/([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+(-\d+)?)/);
    
    if (trimmedLine.includes('follow-up question') || 
        trimmedLine.includes('Follow-up question') ||
        trimmedLine.match(/^\d+\.\s/) && parsingState === 'references') {
      parsingState = 'questions';
      
      // Clean up the question text
      const questionText = trimmedLine.replace(/^\d+\.\s/, '').replace(/^[Ff]ollow-up question:?\s*/, '');
      
      if (questionText.length > 5) {
        followUpQuestions.push({
          id: `q-${followUpQuestions.length + 1}`,
          text: questionText
        });
      }
    } 
    else if (referenceMatch && parsingState === 'answer') {
      parsingState = 'references';
      
      const [_, book, chapter, verseRange] = referenceMatch;
      const verseText = line.split('-').slice(1).join('-').trim();
      
      references.push({
        book: book,
        chapter: parseInt(chapter),
        verses: verseRange,
        text: verseText || "\"" + lines[lines.indexOf(line) + 1]?.trim() + "\""
      });
    } 
    else if (parsingState === 'answer') {
      answer += trimmedLine + '\n';
    }
    else if (parsingState === 'references' && trimmedLine && !referenceMatch) {
      // Add this line to the text of the last reference
      if (references.length > 0 && !references[references.length - 1].text) {
        references[references.length - 1].text = "\"" + trimmedLine + "\"";
      }
    }
  }
  
  // Ensure we have at least some follow-up questions
  if (followUpQuestions.length === 0) {
    followUpQuestions = [
      {
        id: "1",
        text: "How can I apply this principle in my daily life?"
      },
      {
        id: "2",
        text: "What other Book of Mormon passages relate to this topic?"
      },
      {
        id: "3",
        text: "How does this teaching connect to the Atonement of Jesus Christ?"
      }
    ];
  }
  
  // Limit to 3 follow-up questions
  followUpQuestions = followUpQuestions.slice(0, 3);
  
  return {
    answer: answer.trim(),
    references,
    followUpQuestions
  };
};

// Fallback mock response when API is unavailable
const getMockResponse = (question: string): ChatResponse => {
  return {
    answer: `Your question about "${question}" is a thoughtful one that many people ponder. In the Book of Mormon, we find insights in several passages.\n\nAlma teaches us that "faith is not to have a perfect knowledge of things; therefore if ye have faith ye hope for things which are not seen, which are true" (Alma 32:21).\n\nMoroni further invites us to "remember how merciful the Lord hath been unto the children of men, from the creation of Adam even down until the time that ye shall receive these things, and ponder it in your hearts" (Moroni 10:3).`,
    references: [
      {
        book: "Alma",
        chapter: 32,
        verses: "21-22",
        text: "And now as I said concerning faith—faith is not to have a perfect knowledge of things; therefore if ye have faith ye hope for things which are not seen, which are true. And now, behold, I say unto you, and I would that ye should remember, that God is merciful unto all who believe on his name; therefore he desireth, in the first place, that ye should believe, yea, even on his word."
      },
      {
        book: "Moroni",
        chapter: 10,
        verses: "3-5",
        text: "Behold, I would exhort you that when ye shall read these things, if it be wisdom in God that ye should read them, that ye would remember how merciful the Lord hath been unto the children of men, from the creation of Adam even down until the time that ye shall receive these things, and ponder it in your hearts."
      }
    ],
    followUpQuestions: [
      {
        id: "1",
        text: "How can I apply Alma's teachings on faith in my daily life?"
      },
      {
        id: "2",
        text: "What does Moroni teach about receiving personal revelation?"
      },
      {
        id: "3",
        text: "How do other Book of Mormon prophets describe the nature of faith?"
      }
    ]
  };
};
