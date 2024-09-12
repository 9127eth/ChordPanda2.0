import React from 'react';
import { SoundCardConfig, Chord } from './SoundCardGenerator';

interface SoundCardDisplayProps {
  card: SoundCardConfig;
}

export const SoundCardDisplay: React.FC<SoundCardDisplayProps> = ({ card }) => {
  if (!card) {
    return <div>No card data available</div>;
  }

  if (card.cardType === 'Single Keys' && card.keys && card.keys.length > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {card.keys.map((key, index) => (
          <div key={index} className="bg-[#F5F5F5] p-4 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-2">Key {index + 1}</h3>
            <div className="bg-white p-2 rounded-xl">
              <p>Note: {key.note}</p>
              <p>Order: {key.order}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (card.cardType === 'Chords' && card.chords && card.chords.length > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {card.chords.map((chord: Chord, index: number) => (
          <div key={index} className="bg-[#F5F5F5] p-4 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-2">{chord.name}</h3>
            <div className="bg-white p-2 rounded-xl">
              <p>Notes: {chord.notes.join(', ')}</p>
              <p>Order: {chord.order}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div>No valid key or chord data available</div>;
};
