import React, { useState } from 'react';
import { SoundCardConfig } from './SoundCardGenerator';

interface SoundCardProps {
  card: SoundCardConfig;
}

export const SoundCard: React.FC<SoundCardProps> = ({ card }) => {
  const [showNotes, setShowNotes] = useState(true);
  const [showOrder, setShowOrder] = useState(true);

  const renderPiano = (keys: { note: string; order?: number }[] | undefined, chordName?: string) => (
    <div className="piano mb-4">
      {chordName && <h3 className="text-sm font-bold mb-1">{chordName}</h3>}
      <div className={`keys flex relative ${card.cardType === 'Chords' ? 'w-[480px]' : 'w-[960px]'}`}>
        {Array.from({ length: card.cardType === 'Chords' ? 12 : 24 }, (_, i) => {
          const isBlackKey = [1, 3, 6, 8, 10].includes(i % 12);
          const keyClass = isBlackKey ? 'black-key' : 'key';
          const octave = Math.floor(i / 12) + 4;
          const noteIndex = i % 12;
          const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteIndex];
          const note = `${noteName}${octave}`;
          const highlightedKeys = keys?.filter(k => k.note === note) || [];
          const isHighlighted = highlightedKeys.length > 0;

          return (
            <div
              key={i}
              className={`${keyClass} ${isHighlighted ? 'highlighted' : ''} relative`}
              data-note={note}
            >
              {isHighlighted && showNotes && (
                <span className={`absolute ${isBlackKey ? 'bottom-1' : 'bottom-2'} left-1/2 transform -translate-x-1/2 text-xs ${isBlackKey ? 'text-white' : 'text-black'}`}>
                  {note}
                </span>
              )}
              {isHighlighted && showOrder && card.cardType === 'Single Keys' && (
                <div className="absolute top-1 right-1 text-xs">
                  {highlightedKeys.map(key => (
                    <span key={key.order} className="mr-1">{key.order}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="sound-card bg-[#F5F5F5] p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">{card.cardName}</h2>
      <div className="mb-4">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="mr-2 px-2 py-1 bg-[#E0E0E0] rounded"
        >
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
        {card.cardType === 'Single Keys' && (
          <button
            onClick={() => setShowOrder(!showOrder)}
            className="px-2 py-1 bg-[#E0E0E0] rounded"
          >
            {showOrder ? 'Hide Order' : 'Show Order'}
          </button>
        )}
      </div>
      <div className="overflow-x-auto w-full">
        {card.cardType === 'Single Keys' && card.keys && renderPiano(card.keys)}
        {card.cardType === 'Chords' && card.chords && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {card.chords.map((chord) => (
              renderPiano(chord.notes.map(note => ({ note })), chord.name)
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p><strong>Description:</strong> {card.description}</p>
        <p><strong>Tip:</strong> {card.tip}</p>
        <p><strong>Music Theory:</strong> {card.musicTheory}</p>
      </div>
    </div>
  );
};

export default SoundCard;


