
import React from 'react';
import { Button } from '@/components/ui/button';
import { FollowUpQuestion as FollowUpQuestionType } from '@/types';

interface FollowUpQuestionProps {
  question: FollowUpQuestionType;
  onQuestionClick: (question: string) => void;
}

const FollowUpQuestion: React.FC<FollowUpQuestionProps> = ({ 
  question, 
  onQuestionClick 
}) => {
  return (
    <Button
      variant="outline"
      className="mr-2 mb-2 text-liahona-DEFAULT border-liahona-light hover:bg-liahona-light/10 text-left"
      onClick={() => onQuestionClick(question.text)}
    >
      {question.text}
    </Button>
  );
};

export default FollowUpQuestion;
