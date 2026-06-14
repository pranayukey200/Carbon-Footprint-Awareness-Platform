/**
 * @fileoverview Smart conversational assistant for carbon footprint awareness.
 * Provides dynamic analysis and recommendations based on the user's store state.
 * @module components/Assistant/EcoAssistant
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import type { UserProfile, CarbonScore } from '../../types';

interface Message {
  readonly id: string;
  readonly sender: 'user' | 'assistant';
  readonly text: string;
  readonly timestamp: string;
}

const GREETING =
  'Hello! I am EcoLens, your sustainability co-pilot. I can analyze your footprint details and suggest the most impactful ways to reduce emissions. Try asking for a general analysis or about travel, diet, energy, and shopping.';

/** Match keywords to profile state to generate a dynamic response */
function getAssistantResponse(
  input: string,
  profile: UserProfile,
  score: CarbonScore | null,
): string {
  const query = input.toLowerCase().trim();

  if (!score) {
    return "I don't have your carbon score yet! Please complete the onboarding questionnaire so I can analyze your footprint and give you custom recommendations.";
  }

  if (
    query.includes('analyze') ||
    query.includes('report') ||
    query.includes('summary') ||
    query.includes('all')
  ) {
    const total = score.totalAnnualKgCO2;
    const highest = [...score.categories].sort((a, b) => b.annualKgCO2 - a.annualKgCO2)[0];
    return `Your annual carbon footprint is ${total.toLocaleString()} kg CO2. Your highest emission source is ${highest?.category} at ${highest?.annualKgCO2.toLocaleString()} kg CO2 (${highest?.percentageOfTotal}% of your total footprint). I recommend focusing on ${highest?.category} actions first to make the biggest impact!`;
  }

  if (
    query.includes('transport') ||
    query.includes('car') ||
    query.includes('flight') ||
    query.includes('travel') ||
    query.includes('commute')
  ) {
    const transport = score.categories.find((c) => c.category === 'transport');
    const mode = profile.transport.primaryMode;
    return `Your transport footprint is ${transport?.annualKgCO2.toLocaleString()} kg CO2. Since your primary travel mode is "${mode}", you can save ~1,100 kg CO2 by carpooling or ~2,200 kg CO2 by switching to public transit. Cutting one flight saves ~816 kg CO2!`;
  }

  if (
    query.includes('diet') ||
    query.includes('food') ||
    query.includes('meat') ||
    query.includes('vegan') ||
    query.includes('vegetarian')
  ) {
    const diet = score.categories.find((c) => c.category === 'diet');
    return `Your diet footprint is ${diet?.annualKgCO2.toLocaleString()} kg CO2. Trying Meatless Mondays (veggie 1 day/week) saves ~350 kg CO2/year. Going fully vegetarian cuts food emissions by up to 50% (~800 kg CO2)!`;
  }

  if (
    query.includes('energy') ||
    query.includes('electricity') ||
    query.includes('gas') ||
    query.includes('solar') ||
    query.includes('heating')
  ) {
    const energy = score.categories.find((c) => c.category === 'energy');
    return `Your home energy footprint is ${energy?.annualKgCO2.toLocaleString()} kg CO2. Installing a smart thermostat cuts gas emissions by 15%, while upgrading to LEDs saves ~200 kg CO2. Rooftop solar panels can offset up to 80% of your electricity!`;
  }

  if (
    query.includes('shopping') ||
    query.includes('spend') ||
    query.includes('fashion') ||
    query.includes('recycle') ||
    query.includes('electronics')
  ) {
    const shopping = score.categories.find((c) => c.category === 'shopping');
    return `Your consumption footprint is ${shopping?.annualKgCO2.toLocaleString()} kg CO2. Buying second-hand clothes avoids ~10 kg CO2 per item, while refurbished electronics avoid 80% of manufacturing emissions. High recycling can shave off 15% of shopping waste!`;
  }

  if (
    query.includes('offset') ||
    query.includes('compensate') ||
    query.includes('tree') ||
    query.includes('neutral')
  ) {
    const trees = Math.ceil(score.totalAnnualKgCO2 / 22);
    return `To completely offset your footprint of ${score.totalAnnualKgCO2.toLocaleString()} kg CO2 naturally, you would need about ${trees} mature trees absorbing carbon (estimating 22 kg CO2 absorption per tree annually). Reducing directly is always best, but supporting forestry projects is a great way to balance!`;
  }

  return "I'm not sure about that, but I can tell you about your transport, diet, energy, or shopping footprint, or give you a complete analysis of your score! Try asking: 'Analyze my footprint' or 'How can I cut energy?'";
}

/** Floating dynamic assistant component */
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
            <button onClick={() => handleSend('Analyze my footprint')}>📊 Analyze</button>
            <button onClick={() => handleSend('How can I cut transport?')}>🚗 Travel</button>
            <button onClick={() => handleSend('How can I cut energy?')}>⚡ Energy</button>
            <button onClick={() => handleSend('How to offset?')}>🌳 Offsetting</button>
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
