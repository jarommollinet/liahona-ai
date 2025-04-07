
import React from 'react';
import { Message, ChatResponse } from '@/types';
import ScriptureLink from './ScriptureLink';
import FollowUpQuestion from './FollowUpQuestion';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ResponseDisplayProps {
  messages: Message[];
  latestResponse: ChatResponse | null;
  isLoading: boolean;
  onQuestionClick: (question: string) => void;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ 
  messages, 
  latestResponse, 
  isLoading, 
  onQuestionClick 
}) => {
  // Function to render messages with nice formatting
  const renderMessageContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
    ));
  };

  return (
    <ScrollArea className="flex-grow overflow-y-auto response-container pr-4">
      {messages.map((message) => (
        <div key={message.id} className={`mb-6 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          <Card className={`inline-block max-w-[80%] ${
            message.role === 'user' 
              ? 'bg-liahona-light text-white' 
              : 'bg-white'
          }`}>
            <CardContent className="p-4">
              {renderMessageContent(message.content)}
            </CardContent>
          </Card>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start mb-6">
          <Card className="inline-block max-w-[80%] bg-white">
            <CardContent className="p-4">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-300"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {latestResponse && !isLoading && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-liahona-DEFAULT mb-4">Scripture References</h3>
          {latestResponse.references.map((reference, index) => (
            <ScriptureLink key={index} reference={reference} />
          ))}
          
          <Separator className="my-6" />
          
          <h3 className="text-lg font-semibold text-liahona-DEFAULT mb-4">Explore Further</h3>
          <div className="flex flex-wrap">
            {latestResponse.followUpQuestions.map((question) => (
              <FollowUpQuestion 
                key={question.id} 
                question={question} 
                onQuestionClick={onQuestionClick}
              />
            ))}
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

export default ResponseDisplay;
