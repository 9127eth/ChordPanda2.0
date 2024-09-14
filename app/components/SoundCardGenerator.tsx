import React, { useState } from 'react';
import { useCards } from '../contexts/CardContext';
import SoundCardDisplay from './SoundCardDisplay';
import Toast from './Toast';

export interface SoundCardConfig {
  cardType: 'Single Keys' | 'Chords';
  numberOfKeyboards?: number;
  numberOfKeysToPlay: number;
  numberOfNotesInCard: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  musicalStyle?: string;
  mood?: string;
  keySignature?: string;
  timeSignature?: string;
  tempo?: string;
  scaleType?: string;
  chordType?: string;
  chordProgression?: string;
  keys?: { note: string; order: number }[];
  chords?: { name: string; notes: string[]; order: number }[];
  cardName: string;
  description: string;
  tip: string;
  musicTheory: string;
}

const defaultConfig: SoundCardConfig = {
  cardType: 'Single Keys',
  numberOfKeysToPlay: 5,
  numberOfNotesInCard: 5,
  difficultyLevel: 'Beginner',
  musicalStyle: 'Classical',
  mood: 'Happy',
  keySignature: 'C Major',
  timeSignature: '4/4',
  tempo: 'Medium',
  scaleType: 'Major',
  chordType: 'Major',
  chordProgression: 'I-IV-V',
  chords: [],
  cardName: '',
  description: '',
  tip: '',
  musicTheory: '',
};

export function SoundCardGenerator() {
  const { saveCard } = useCards();
  const [config, setConfig] = useState<SoundCardConfig>(defaultConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<SoundCardConfig | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['numberOfKeysToPlay', 'numberOfNotesInCard', 'numberOfKeyboards'];
    
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: numericFields.includes(name) ? parseInt(value, 10) : value
    }));
  };

  const generateCard = async () => {
    if (config.numberOfKeysToPlay < config.numberOfNotesInCard) {
      setToast({ message: "Error: The number of keys to play cannot be less than the number of notes. Please adjust your settings.", type: 'error' });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || 'Failed to generate card');
      }
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
      }

      const processedData: SoundCardConfig = {
        ...config,
        cardType: data['Card Type'] || config.cardType,
        numberOfKeysToPlay: data['Number of Keys to Play'] || config.numberOfKeysToPlay,
        numberOfNotesInCard: data['Number of Notes in the Card'] || config.numberOfNotesInCard,
        difficultyLevel: data['Difficulty Level'] || config.difficultyLevel,
        musicalStyle: data['Musical Style'] || config.musicalStyle,
        keySignature: data['Key Signature'] || config.keySignature,
        timeSignature: data['Time Signature'] || config.timeSignature,
        tempo: data.Tempo || config.tempo,
        scaleType: data['Scale Type'] || config.scaleType,
        chordType: data['Chord Type'] || config.chordType,
        chordProgression: data['Chord Progression'] || config.chordProgression,
        keys: Array.isArray(data.Keys) ? data.Keys : [],
        chords: Array.isArray(data.Chords) ? data.Chords : [],
        cardName: data['Sound Card Name'] || '',
        description: data.Description || '',
        tip: data.Tip || '',
        musicTheory: data['Music Theory'] || '',
      };

      // Validate the number of chords
      if (config.cardType === 'Chords' && config.numberOfKeyboards !== undefined) {
        if (!processedData.chords || processedData.chords.length !== config.numberOfKeyboards) {
          throw new Error(`Expected ${config.numberOfKeyboards} chords, but got ${processedData.chords?.length || 0}. Please try generating again.`);
        }
      }

      setGeneratedCard(processedData);
      setToast({ message: 'Card generated successfully!', type: 'success' });
    } catch (error: unknown) {
      console.error('Error generating card:', error);
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setToast({ message: `Error generating card: ${errorMessage}`, type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const setDefaultConfig = () => {
    setConfig(defaultConfig);
  };

  const setRandomConfig = () => {
    const randomConfig: SoundCardConfig = {
      ...defaultConfig,
      cardType: Math.random() > 0.5 ? 'Single Keys' : 'Chords',
      numberOfKeysToPlay: Math.floor(Math.random() * 19) + 2, // 2 to 20
      numberOfNotesInCard: Math.floor(Math.random() * 11) + 2, // 2 to 12
      difficultyLevel: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as 'Beginner' | 'Intermediate' | 'Advanced',
      musicalStyle: ['Classical', 'Jazz', 'Rock', 'Pop'][Math.floor(Math.random() * 4)],
      mood: ['Happy', 'Sad', 'Energetic', 'Calm'][Math.floor(Math.random() * 4)],
      // Advanced options
      keySignature: ['C Major', 'G Major', 'D Major', 'A Major'][Math.floor(Math.random() * 4)],
      timeSignature: ['4/4', '3/4', '6/8'][Math.floor(Math.random() * 3)],
      tempo: ['Slow', 'Medium', 'Fast'][Math.floor(Math.random() * 3)],
      scaleType: ['Major', 'Minor', 'Pentatonic'][Math.floor(Math.random() * 3)],
      chordType: ['Major', 'Minor', 'Dominant 7th'][Math.floor(Math.random() * 3)],
      chordProgression: ['I-IV-V', 'ii-V-I', 'I-V-vi-IV'][Math.floor(Math.random() * 3)],
      cardName: '',
      description: '',
      tip: '',
      musicTheory: '',
    };
    setConfig(randomConfig);
  };

  const clearConfig = () => {
    setConfig({
      cardType: 'Single Keys' as 'Single Keys' | 'Chords',
      numberOfKeyboards: undefined,
      numberOfKeysToPlay: 0,
      numberOfNotesInCard: 0,
      difficultyLevel: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
      musicalStyle: '',
      mood: '',
      // Clear advanced options as well
      keySignature: '',
      timeSignature: '',
      tempo: '',
      scaleType: '',
      chordType: '',
      chordProgression: '',
      chords: [],
      cardName: '',
      description: '',
      tip: '',
      musicTheory: '',
    });
  };

  const handleSaveCard = () => {
    if (generatedCard) {
      saveCard(generatedCard);
      setToast({ message: 'Card saved successfully!', type: 'success' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <p className="mb-8">Unlock the secrets of music theory with our captivating melody and chord generator.</p>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl font-bold text-left text-mainCardText">Customize Your Sound</h4>
          <div className="space-x-4 text-sm">
            <button onClick={setDefaultConfig} className="text-mainCardText hover:text-blue-800 transition-colors duration-200">
              Default
            </button>
            <button onClick={setRandomConfig} className="text-mainCardText hover:text-blue-800 transition-colors duration-200">
              Random
            </button>
            <button onClick={clearConfig} className="text-mainCardText hover:text-blue-800 transition-colors duration-200">
              Clear
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            name="cardType"
            value={config.cardType}
            onChange={handleConfigChange}
            className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
          >
            <option value="">Sound type</option>
            <option value="Single Keys">Single Keys</option>
            <option value="Chords">Chords</option>
          </select>
          {config.cardType === 'Chords' && (
            <select
              name="numberOfKeyboards"
              value={config.numberOfKeyboards}
              onChange={handleConfigChange}
              className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
            >
              <option value="">Number of chords</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          )}
          <select
            name="numberOfKeysToPlay"
            value={config.numberOfKeysToPlay}
            onChange={handleConfigChange}
            className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
          >
            <option value="">Number of keys to play</option>
            {Array.from({ length: config.cardType === 'Single Keys' ? 23 : 9 }, (_, i) => i + 2).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <select
            name="numberOfNotesInCard"
            value={config.numberOfNotesInCard}
            onChange={handleConfigChange}
            className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
          >
            <option value="">Number of notes</option>
            {Array.from({ length: 11 }, (_, i) => i + 2).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <select
            name="difficultyLevel"
            value={config.difficultyLevel}
            onChange={handleConfigChange}
            className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
          >
            <option value="">Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            name="musicalStyle"
            value={config.musicalStyle}
            onChange={handleConfigChange}
            className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
          >
            <option value="">Musical style</option>
            {[
              'Classical', 'Jazz', 'Blues', 'Rock', 'Pop', 'Hip Hop', 'R&B', 'Country', 'Folk', 'Electronic',
              'Dance', 'Reggae', 'Soul', 'Funk', 'Metal', 'Punk', 'Indie', 'Alternative', 'World Music',
              'Gospel', 'Latin', 'Ambient', 'New Age', 'Orchestral', 'Baroque', 'Romantic Era',
              'Contemporary Classical', 'Minimalist', 'Ragtime', 'Bebop', 'Swing', 'Cool Jazz', 'Fusion',
              'Bossa Nova', 'Delta Blues', 'Chicago Blues', 'Rock \'n\' Roll', 'Hard Rock', 'Progressive Rock',
              'Psychedelic Rock', 'Soft Rock', 'Grunge', 'Pop Rock', 'Synthpop', 'Disco', 'House', 'K-Pop',
              'Dubstep', 'Techno', 'Salsa', 'Bluegrass'
            ].map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
          <select
            name="mood"
            value={config.mood}
            onChange={handleConfigChange}
            className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
          >
            <option value="">Mood</option>
            {[
              'Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Melancholic', 'Angry', 'Peaceful',
              'Excited', 'Nostalgic', 'Triumphant', 'Mysterious', 'Anxious', 'Hopeful', 'Playful',
              'Intense', 'Dreamy', 'Reflective', 'Confident', 'Vulnerable'
            ].map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-mainCardText hover:text-blue-800 transition-colors duration-200"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              name="keySignature"
              value={config.keySignature}
              onChange={handleConfigChange}
              className="bg-[#E0E0E0] text-mainCardText py-2 px-4 rounded-2xl appearance-none select-arrow text-sm"
            >
              <option value="">Select key signature</option>
              {['C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'F Major', 'Bb Major', 'Eb Major', 'Ab Major', 'A Minor', 'E Minor', 'D Minor', 'G Minor', 'C Minor', 'B Minor', 'F# Minor', 'Bb Minor'].map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <select
              name="timeSignature"
              value={config.timeSignature}
              onChange={handleConfigChange}
              className="bg-[#E0E0E0] text-mainCardText py-2 px-4 rounded-2xl appearance-none select-arrow text-sm"
            >
              <option value="">Select time signature</option>
              {['4/4', '3/4', '2/4', '6/8', '12/8', '2/2', '9/8', '5/4', '7/8'].map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <select
              name="tempo"
              value={config.tempo}
              onChange={handleConfigChange}
              className="bg-[#E0E0E0] text-mainCardText py-2 px-4 rounded-2xl appearance-none select-arrow text-sm"
            >
              <option value="">Select tempo</option>
              <option value="Very Slow">Very Slow (60-70 BPM)</option>
              <option value="Slow">Slow (70-80 BPM)</option>
              <option value="Medium">Medium (80-90 BPM)</option>
              <option value="Fast">Fast (90-100 BPM)</option>
              <option value="Very Fast">Very Fast (100-120 BPM)</option>
            </select>
            <select
              name="scaleType"
              value={config.scaleType}
              onChange={handleConfigChange}
              className="bg-[#E0E0E0] text-mainCardText py-2 px-4 rounded-2xl appearance-none select-arrow text-sm"
            >
              <option value="">Select scale type</option>
              {['Major', 'Natural Minor', 'Harmonic Minor', 'Melodic Minor', 'Major Pentatonic', 'Minor Pentatonic', 'Blues Scale', 'Ionian Mode', 'Dorian Mode', 'Phrygian Mode', 'Lydian Mode', 'Mixolydian Mode', 'Aeolian Mode', 'Locrian Mode', 'Chromatic', 'Whole Tone', 'Octatonic (Diminished)', 'Raga (Indian Classical)', 'Maqam (Middle Eastern)', 'Hirajoshi (Japanese)', 'Wu Sheng (Chinese Pentatonic)'].map(scale => (
                <option key={scale} value={scale}>{scale}</option>
              ))}
            </select>
            {config.cardType === 'Chords' && (
              <>
                <select
                  name="chordType"
                  value={config.chordType}
                  onChange={handleConfigChange}
                  className="bg-[#E0E0E0] text-mainCardText py-2 px-4 rounded-2xl appearance-none select-arrow text-sm"
                >
                  <option value="">Select chord type</option>
                  {['Major', 'Minor', 'Dominant 7th', 'Major 7th', 'Minor 7th', 'Diminished', 'Augmented', 'Suspended 2nd (sus2)', 'Suspended 4th (sus4)', 'Minor 7 flat 5 (Half-Diminished)', 'Diminished 7th', 'Add9', 'Major 6th', 'Minor 6th', '9th', '11th', '13th', 'Power Chord (5th)'].map(chord => (
                    <option key={chord} value={chord}>{chord}</option>
                  ))}
                </select>
                <select
                  name="chordProgression"
                  value={config.chordProgression}
                  onChange={handleConfigChange}
                  className="bg-[#E0E0E0] text-mainCardText py-2 px-4 rounded-2xl appearance-none select-arrow text-sm"
                >
                  <option value="">Select chord progression</option>
                  {['I-IV-V', 'ii-V-I', 'I-V-vi-IV', 'I-vi-IV-V', 'I-V-IV', 'vi-IV-I-V', 'I-IV-vii°-iii-vi-ii-V-I', 'I-vi-ii-V', 'I-vi-iii-IV', 'I-V-vi-iii-IV-I-IV-V'].map(progression => (
                    <option key={progression} value={progression}>{progression}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}

        <button
          onClick={generateCard}
          disabled={isGenerating}
          className="bg-action text-white py-2 px-6 rounded-2xl hover:bg-[#FFA000] transition-colors duration-200"
        >
          {isGenerating ? 'Generating...' : 'Generate Sound Card'}
        </button>
      </div>

      {generatedCard && (
        <>
          <div className="mt-8">
            <SoundCardDisplay card={generatedCard} />
          </div>
          <button
            onClick={handleSaveCard}
            className="mt-4 px-4 py-2 bg-action text-white rounded"
          >
            Save Card
          </button>
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
