import React, { useState } from 'react';
import { SoundCardConfig } from './SoundCardGenerator';

interface SoundCardDisplayProps {
  card: SoundCardConfig;
}

const SoundCardDisplay: React.FC<SoundCardDisplayProps> = ({ card }) => {
  const [showNotes, setShowNotes] = useState(true);
  const [showOrder, setShowOrder] = useState(true);

  const renderPiano = (keys: { note: string; order: number }[] | undefined, chordName?: string) => (
    <div className="piano mb-4">
      {chordName && <h3 className="text-xl font-bold mb-2">{chordName}</h3>}
      <div className="keys flex relative">
        {Array.from({ length: card.cardType === 'Chords' ? 12 : 24 }, (_, i) => {
          const isBlackKey = [1, 3, 6, 8, 10].includes(i % 12);
          const keyClass = isBlackKey ? 'black-key' : 'key';
          const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
          const octave = 4 + Math.floor(i / 12);
          const note = `${noteNames[i % 12]}${octave}`;
          const highlightedKeys = keys?.filter(k => k.note === note) || [];
          const isHighlighted = highlightedKeys.length > 0;

          return (
            <div
              key={i}
              className={`${keyClass} ${isHighlighted ? 'highlighted' : ''} relative`}
              data-note={note}
            >
              {isHighlighted && (
                <>
                  {showOrder && (
                    <div className="absolute top-1 right-1 text-xs">
                      {highlightedKeys.map(key => (
                        <span key={key.order} className="mr-1">{key.order}</span>
                      ))}
                    </div>
                  )}
                  {showNotes && (
                    <span className={`absolute ${isBlackKey ? 'bottom-1' : 'bottom-2'} left-1/2 transform -translate-x-1/2 text-xs ${isBlackKey ? 'text-white' : 'text-black'}`}>
                      {note}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="sound-card bg-card p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-mainCardText">{card.cardName}</h2>
      <div className="mb-4">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="mr-2 px-2 py-1 bg-[#E0E0E0] rounded"
        >
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
        <button
          onClick={() => setShowOrder(!showOrder)}
          className="px-2 py-1 bg-[#E0E0E0] rounded"
        >
          {showOrder ? 'Hide Order' : 'Show Order'}
        </button>
      </div>
      {card.cardType === 'Single Keys' ? (
        renderPiano(card.keys)
      ) : (
        <div className="chord-pianos grid grid-cols-2 gap-4">
          {card.chords?.map((chord, index) => (
            <div key={index} className="chord-piano">
              {renderPiano(chord.notes.map((note, i) => ({ note, order: i + 1 })), chord.name)}
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 text-altCardText">
        <p><strong>Description:</strong> {card.description}</p>
        <p><strong>Tip:</strong> {card.tip}</p>
        <p><strong>Music Theory:</strong> {card.musicTheory}</p>
        <p><strong>Difficulty:</strong> {card.difficultyLevel}</p>
        <p><strong>Style:</strong> {card.musicalStyle}</p>
        <p><strong>Mood:</strong> {card.mood}</p>
        <p><strong>Key Signature:</strong> {card.keySignature}</p>
        <p><strong>Time Signature:</strong> {card.timeSignature}</p>
        <p><strong>Tempo:</strong> {card.tempo}</p>
        {card.cardType === 'Chords' && (
          <>
            <p><strong>Chord Type:</strong> {card.chordType}</p>
            <p><strong>Chord Progression:</strong> {card.chordProgression}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SoundCardDisplay;
