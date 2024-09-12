import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SoundCardConfig {
  cardType: 'Single Keys' | 'Chords';
  numberOfKeyboards?: number;
  keysToPlay: number;
  notesInCard: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  musicalStyle?: string;
  mood?: string;
  timeSignature?: string;
  tempo?: string;
  keySignature?: string;
  scaleType?: string;
  chordType?: string;
  chordProgression?: string;
}

const defaultConfig: SoundCardConfig = {
  cardType: 'Single Keys',
  keysToPlay: 5,
  notesInCard: 5,
  difficultyLevel: 'Beginner',
};

export function SoundCardGenerator() {
  const { user } = useAuth();
  const [config, setConfig] = useState<SoundCardConfig>(defaultConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<SoundCardConfig | null>(null);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
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
      setGeneratedCard(data);
    } catch (error) {
      console.error('Error generating card:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      {user && (
        <p className="text-lg mb-4">
          Welcome back, {user.email}! Ready to create some music?
        </p>
      )}
      <h2 className="text-2xl font-bold mb-4">Generate Sound Card</h2>
      <form onSubmit={(e) => { e.preventDefault(); generateCard(); }} className="space-y-4">
        <div>
          <label className="block mb-1">Card Type</label>
          <select
            name="cardType"
            value={config.cardType}
            onChange={handleConfigChange}
            className="w-full p-2 border rounded"
          >
            <option value="Single Keys">Single Keys</option>
            <option value="Chords">Chords</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Keys to Play</label>
          <input
            type="number"
            name="keysToPlay"
            value={config.keysToPlay}
            onChange={handleConfigChange}
            min={2}
            max={config.cardType === 'Single Keys' ? 21 : 10}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Notes in Card</label>
          <input
            type="number"
            name="notesInCard"
            value={config.notesInCard}
            onChange={handleConfigChange}
            min={2}
            max={12}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Difficulty Level</label>
          <select
            name="difficultyLevel"
            value={config.difficultyLevel}
            onChange={handleConfigChange}
            className="w-full p-2 border rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-action text-white rounded"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Sound Card'}
        </button>
      </form>
      {generatedCard && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Generated Sound Card</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(generatedCard, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
