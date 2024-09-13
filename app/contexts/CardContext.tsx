"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SoundCardConfig } from '../components/SoundCardGenerator';

interface CardContextType {
  savedCards: SoundCardConfig[];
  saveCard: (card: SoundCardConfig) => void;
  deleteCard: (cardId: string) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};

const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedCards, setSavedCards] = useState<SoundCardConfig[]>([]);

  useEffect(() => {
    // Load saved cards from local storage or API
    const loadedCards = localStorage.getItem('savedCards');
    if (loadedCards) {
      setSavedCards(JSON.parse(loadedCards));
    }
  }, []);

  const saveCard = (card: SoundCardConfig) => {
    const newCard = { ...card, id: Date.now().toString() };
    setSavedCards(prevCards => {
      const updatedCards = [...prevCards, newCard];
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      return updatedCards;
    });
  };

  const deleteCard = (cardId: string) => {
    setSavedCards(prevCards => {
      const updatedCards = prevCards.filter(card => (card as SoundCardConfig & { id: string }).id !== cardId);
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      return updatedCards;
    });
  };

  return (
    <CardContext.Provider value={{ savedCards, saveCard, deleteCard }}>
      {children}
    </CardContext.Provider>
  );
};

export { CardProvider };
