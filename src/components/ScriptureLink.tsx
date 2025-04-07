
import React from 'react';
import { ScriptureReference } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ScriptureLinkProps {
  reference: ScriptureReference;
}

const ScriptureLink: React.FC<ScriptureLinkProps> = ({ reference }) => {
  const { book, chapter, verses, text } = reference;
  const fullReference = `${book} ${chapter}:${verses}`;
  
  // This would link to an external scripture resource in a real application
  const handleClick = () => {
    // For a real app, you might link to something like scriptures.byu.edu or churchofjesuschrist.org
    window.open(
      `https://www.churchofjesuschrist.org/study/scriptures/bofm/${book.toLowerCase()}/${chapter}.${verses.split('-')[0]}?lang=eng`,
      '_blank'
    );
  };

  return (
    <Card className="mb-4 border-l-4 border-l-liahona-gold shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-4">
        <p 
          onClick={handleClick} 
          className="scripture-reference cursor-pointer hover:underline mb-2"
        >
          {fullReference}
        </p>
        {text && (
          <p className="scripture text-sm">"{text}"</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScriptureLink;
