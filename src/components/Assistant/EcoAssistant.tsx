/**
 * @fileoverview Conversational widget for carbon footprint awareness.
 * Provides custom insights, tooltips, and analysis based on user state and Gemini API.
 * @module components/Assistant/EcoAssistant
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { getAssistantResponse, getGeminiResponse } from '../../services/assistantEngine';
import { parseMarkdown } from '../../utils/markdownParser';

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
 * @returns The rendered EcoLens assistant widget.
 */
export const EcoAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('ecoLens_gemini_key') || '');
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
    async (textToSend?: string) => {
      const text = textToSend || input;
      if (!text.trim() || isLoading) {return;}
      const userMsg: Message = { id: `user-${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) {setInput('');}
      setIsLoading(true);

      const loadingId = `loading-${Date.now()}`;
      setMessages((prev) => [...prev, { id: loadingId, sender: 'assistant', text: '⚡ EcoLens is thinking...', timestamp: new Date().toLocaleTimeString() }]);

      try {
        const replyText = geminiKey.trim()
          ? await getGeminiResponse(text, userProfile, carbonScore, geminiKey.trim())
          : getAssistantResponse(text, userProfile, carbonScore);
        setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat({ id: `reply-${Date.now()}`, sender: 'assistant', text: replyText, timestamp: new Date().toLocaleTimeString() }));
      } catch (err) {
        const replyText = getAssistantResponse(text, userProfile, carbonScore);
        setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat({ id: `reply-${Date.now()}`, sender: 'assistant', text: `${replyText}\n\n*(Gemini API failed, fell back to local assistant)*`, timestamp: new Date().toLocaleTimeString() }));
      } finally {
        setIsLoading(false);
      }
    },
    [input, userProfile, carbonScore, geminiKey, isLoading],
  );

  return (
    <div className={`assistant-widget ${isOpen ? 'assistant-widget--open' : ''}`}>
      {!isOpen ? (
        <button className="assistant-trigger" onClick={() => setIsOpen(true)} aria-label="Open EcoLens Assistant">
          🌿 <span className="assistant-trigger__text">EcoLens Co-Pilot</span>
        </button>
      ) : (
        <div className="assistant-panel" role="dialog" aria-label="EcoLens Chat Assistant">
          <header className="assistant-panel__header">
            <div className="assistant-panel__title">🌿 EcoLens Co-Pilot</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={() => setShowSettings(!showSettings)} aria-label="Toggle Assistant Settings" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-base)', marginRight: 'var(--space-2)' }}>⚙️</button>
              <button className="assistant-panel__close" onClick={() => setIsOpen(false)} aria-label="Close Assistant">✕</button>
            </div>
          </header>
          {showSettings && (
            <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
              <label htmlFor="gemini-key-input" style={{ display: 'block', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-1)', fontWeight: 'bold' }}>🔑 Gemini API Key:</label>
              <input id="gemini-key-input" type="password" className="input" placeholder="Enter Gemini API key" value={geminiKey} onChange={(e) => { setGeminiKey(e.target.value); localStorage.setItem('ecoLens_gemini_key', e.target.value); }} style={{ width: '100%', fontSize: 'var(--font-size-xs)', padding: 'var(--space-2)' }} />
            </div>
          )}
          <div className="assistant-panel__chat">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble chat-bubble--${m.sender}`}>
                <div className="chat-bubble__text">{parseMarkdown(m.text)}</div>
                <span className="chat-bubble__time">{m.timestamp}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="assistant-panel__actions">
            {['Analyze my footprint', 'How can I cut transport?', 'How can I cut energy?', 'How to offset?'].map((action, i) => (
              <button key={action} onClick={() => handleSend(action)} disabled={isLoading} aria-label={action}>{['📊 Analyze', '🚗 Travel', '⚡ Energy', '🌳 Offset'][i]}</button>
            ))}
          </div>
          <form className="assistant-panel__input-group" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <input type="text" placeholder="Ask about your footprint..." value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} aria-label="Ask assistant a question" />
            <button type="submit" disabled={isLoading} aria-label="Send message">➤</button>
          </form>
        </div>
      )}
    </div>
  );
};
