/**
 * @fileoverview Conversational widget for carbon footprint awareness.
 * Provides custom insights, tooltips, and analysis based on user state.
 * @module components/Assistant/EcoAssistant
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { getAssistantResponse } from '../../services/assistantEngine';

interface Message {
  readonly id: string;
  readonly sender: 'user' | 'assistant';
  readonly text: string;
  readonly timestamp: string;
}

const GREETING =
  'Hello! I am EcoLens, your sustainability co-pilot. I can analyze your footprint details and suggest the most impactful ways to reduce emissions. Try asking for a general analysis or about travel, diet, energy, and shopping.';

/**
 * Floating conversational assistant component.
 *
 * @returns The rendered EcoLens assistant widget.
 */
export const EcoAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<readonly Message[]>([
    { id: 'g', sender: 'assistant', text: GREETING, timestamp: new Date().toLocaleTimeString() },
  ]);

  const userProfile = useCarbonStore((s) => s.userProfile);
  const carbonScore = useCarbonStore((s) => s.carbonScore);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = useCallback(
    (textToSend?: string) => {
      const text = textToSend || input;
      if (!text.trim()) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInput('');

      setTimeout(() => {
        const replyText = getAssistantResponse(text, userProfile, carbonScore);
        const replyMsg: Message = {
          id: `reply-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 600);
    },
    [input, userProfile, carbonScore],
  );

  return (
    <div className={`assistant-widget ${isOpen ? 'assistant-widget--open' : ''}`}>
      {!isOpen && (
        <button
          className="assistant-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Open EcoLens Assistant"
        >
          🌿 <span className="assistant-trigger__text">EcoLens Co-Pilot</span>
        </button>
      )}

      {isOpen && (
        <div className="assistant-panel" role="dialog" aria-label="EcoLens Chat Assistant">
          <header className="assistant-panel__header">
            <div className="assistant-panel__title">
              <span>🌿</span> EcoLens Co-Pilot
            </div>
            <button
              className="assistant-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
            >
              ✕
            </button>
          </header>

          <div className="assistant-panel__chat">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble chat-bubble--${m.sender}`}>
                <p className="chat-bubble__text">{m.text}</p>
                <span className="chat-bubble__time">{m.timestamp}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="assistant-panel__actions">
            <button onClick={() => handleSend('Analyze my footprint')} aria-label="Ask assistant to analyze my footprint">📊 Analyze</button>
            <button onClick={() => handleSend('How can I cut transport?')} aria-label="Ask assistant how to reduce travel emissions">🚗 Travel</button>
            <button onClick={() => handleSend('How can I cut energy?')} aria-label="Ask assistant how to reduce home energy emissions">⚡ Energy</button>
            <button onClick={() => handleSend('How to offset?')} aria-label="Ask assistant about carbon offsetting options">🌳 Offsetting</button>
          </div>

          <form
            className="assistant-panel__input-group"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask about your footprint..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Ask assistant a question"
            />
            <button type="submit" aria-label="Send message">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
