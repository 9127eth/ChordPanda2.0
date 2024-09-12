import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SoundCardDisplay } from './SoundCardDisplay';

export interface SoundCardConfig {
  cardType: 'Single Keys' | 'Chords' | '';
  numberOfKeyboards?: number;
  keysToPlay: number | '';
  notesInCard: number | '';
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | '';
  musicalStyle?: string;
  mood?: string;
  keySignature?: string;
  timeSignature?: string;
  tempo?: string;
  scaleType?: string;
  chordType?: string;
  chordProgression?: string;
  chords: Chord[];
}

export interface Chord {
  name: string;
  notes: string[];
  order: number;
}

const defaultConfig: SoundCardConfig = {
  cardType: 'Single Keys',
  keysToPlay: 5,
  notesInCard: 5,
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
};

export function SoundCardGenerator() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  const [config, setConfig] = useState<SoundCardConfig>(defaultConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<SoundCardConfig | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? (value === '' ? '' : parseInt(value, 10)) : value
    }));
  };

  const generateCard = async () => {
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
      setGeneratedCard(data);
    } catch (error) {
      console.error('Error generating card:', error);
      // Display error message to the user
      if (error instanceof Error) {
        alert(`Error generating card: ${error.message}`);
      } else {
        alert('An unknown error occurred while generating the card');
      }
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
      keysToPlay: Math.floor(Math.random() * 19) + 2, // 2 to 20
      notesInCard: Math.floor(Math.random() * 11) + 2, // 2 to 12
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
    };
    setConfig(randomConfig);
  };

  const clearConfig = () => {
    setConfig({
      cardType: '',
      numberOfKeyboards: undefined,
      keysToPlay: '',
      notesInCard: '',
      difficultyLevel: '',
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
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-4xl font-bold mb-4">Chord Panda</h1>
      <p className="mb-8">Unlock the secrets of music theory with our captivating chord generator.</p>
      <div className="bg-[#F5F5F5] p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-left">Sound Card Generator</h2>
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
            name="keysToPlay"
            value={config.keysToPlay}
            onChange={handleConfigChange}
            className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
          >
            <option value="">Number of keys to play</option>
            {Array.from({ length: config.cardType === 'Single Keys' ? 19 : 9 }, (_, i) => i + 2).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <select
            name="notesInCard"
            value={config.notesInCard}
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
            <option value="Classical">Classical</option>
            <option value="Jazz">Jazz</option>
            <option value="Rock">Rock</option>
            <option value="Pop">Pop</option>
            {/* Add more musical style options here */}
          </select>
          <select
            name="mood"
            value={config.mood}
            onChange={handleConfigChange}
            className="bg-[#E0E0E0] text-mainCardText py-2 px-3 rounded-2xl appearance-none select-arrow text-sm w-full"
          >
            <option value="">Mood</option>
            <option value="Happy">Happy</option>
            <option value="Sad">Sad</option>
            <option value="Energetic">Energetic</option>
            <option value="Calm">Calm</option>
            {/* Add more mood options here */}
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
          className="bg-[#FFB300] text-white py-2 px-6 rounded-2xl hover:bg-[#FFA000] transition-colors duration-200"
        >
          {isGenerating ? 'Generating...' : 'Generate Sound Card'}
        </button>
      </div>

      {generatedCard && <SoundCardDisplay card={generatedCard} />}
    </div>
  );
}
