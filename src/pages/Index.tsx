
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatResponse } from '@/types';
import { generateAnswer } from '@/utils/apiService';
import ChatInput from '@/components/ChatInput';
import ResponseDisplay from '@/components/ResponseDisplay';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [latestResponse, setLatestResponse] = useState<ChatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      const response = await generateAnswer(content);
      
      const newAssistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      setLatestResponse(response);
    } catch (error) {
      console.error('Error generating answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate a response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen liahona-pattern">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-liahona-DEFAULT mb-2 font-serif">
            Liahona <span className="text-liahona-gold">AI</span>
          </h1>
          <p className="text-gray-600">
            Your personalized Book of Mormon study companion
          </p>
        </header>
        
        <main className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col h-[calc(80vh-4rem)]">
            <ResponseDisplay 
              messages={messages} 
              latestResponse={latestResponse}
              isLoading={isLoading}
              onQuestionClick={handleFollowUpQuestionClick}
            />
            
            <div className="mt-6">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
            <div ref={messagesEndRef} />
          </div>
        </main>
        
        <footer className="text-center text-sm text-gray-500">
          <p>Liahona AI is designed to assist with Book of Mormon study.</p>
          <p className="mt-1">
            Responses are AI-generated and should be considered with personal revelation and scripture study.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
