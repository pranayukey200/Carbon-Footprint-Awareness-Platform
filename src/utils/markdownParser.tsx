/**
 * @fileoverview Safe markdown parsing helper for EcoLens chatbot bubble formatting.
 * @module utils/markdownParser
 */

import React from 'react';

/**
 * Parses basic markdown like bold text (**text**) and newlines into React elements.
 * @param text - The raw markdown text from the chatbot
 * @returns React elements for rendering inside bubble
 */
export function parseMarkdown(text: string): React.ReactNode {
  return text.split('\n').map((line, lineIndex) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const elements = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <React.Fragment key={lineIndex}>
        {lineIndex > 0 && <br />}
        {elements}
      </React.Fragment>
    );
  });
}
