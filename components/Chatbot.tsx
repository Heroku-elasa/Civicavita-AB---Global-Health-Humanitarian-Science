
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { ChatMessage, useLanguage } from '../types';
import type { Chat } from '@google/genai';

interface ChatbotProps {
    chatSession: Chat | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ chatSession }) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initialSuggestions = [
        t('chatbot.suggestion1'),
        t('chatbot.suggestion2'),
        t('chatbot.suggestion3'),
    ];

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 'initial-message',
                    role: 'system',
                    text: t('chatbot.welcome')
                }
            ]);
            setCurrentSuggestions(initialSuggestions);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, messages.length, t]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, currentSuggestions]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !chatSession || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: messageText,
        };
        setMessages(prev => [...prev, userMessage]);
        setCurrentSuggestions([]);
        setIsLoading(true);

        try {
            const stream = await chatSession.sendMessageStream({ message: messageText });
            
            let botResponseText = '';
            const botMessageId = Date.now().toString() + '-bot';
            
            setMessages(prev => [...prev, { id: botMessageId, role: 'model', text: '' }]);

            for await (const chunk of stream) {
                botResponseText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === botMessageId ? { ...msg, text: botResponseText } : msg
                ));
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: ChatMessage = {
                id: Date.now().toString() + '-error',
                role: 'model',
                text: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setCurrentSuggestions(initialSuggestions);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
        setUserInput('');
    };

    const handleSuggestionClick = (suggestion: string) => {
        handleSendMessage(suggestion);
    };

    const renderMessageContent = (message: ChatMessage) => {
        const html = marked.parse(message.text, { async: false }) as string;
        return <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
        <>
            <div className="chatbot-fab">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-gradient-primary rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label="Toggle Chatbot"
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    )}
                </button>
            </div>
            <div className={`chatbot-window ${isOpen ? '' : 'closed'} flex flex-col bg-slate-800/80 backdrop-blur-md rounded-lg shadow-2xl border border-slate-700 overflow-hidden`}>
                <header className="p-4 bg-slate-900/70 border-b border-slate-700 flex-shrink-0">
                    <h3 className="font-bold text-white">Waste to Wealth Ambassador</h3>
                </header>
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map(message => (
                        <div key={message.id} className={`flex gap-3 items-end ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {message.role !== 'user' && (
                                 <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white flex-shrink-0">
                                     W
                                 </div>
                             )}
                            <div className={`message-bubble p-3 rounded-lg ${message.role === 'user' ? 'bg-gradient-primary text-white' : 'bg-slate-700 text-gray-200'}`}>
                               {renderMessageContent(message)}
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex gap-3 items-end justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white flex-shrink-0">W</div>
                            <div className="message-bubble p-3 rounded-lg bg-slate-700">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {currentSuggestions.length > 0 && !isLoading && (
                    <div className="px-4 pb-3 flex flex-wrap justify-start gap-2 animate-fade-in flex-shrink-0">
                        {currentSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-1.5 text-xs bg-slate-700/80 text-gray-200 rounded-full hover:bg-slate-600 transition-colors border border-slate-600"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
                <footer className="p-4 bg-slate-900/70 border-t border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-grow bg-slate-700/80 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-white"
                            placeholder={t('chatbot.placeholder')}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="p-2 bg-primary text-white rounded-md hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default Chatbot;
