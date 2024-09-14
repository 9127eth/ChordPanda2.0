import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  moodList,
  musicalStyleList,
  scaleTypeList,
  chordTypeList,
  chordProgressionList,
  timeSignatureList,
  keySignatureList,
  tempoList,
} from '../../constants/prompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Config {
  cardType: 'Single Keys' | 'Chords';
  numberOfKeyboards?: number;
  numberOfKeysToPlay: number;
  numberOfNotesInCard: number;
  difficultyLevel?: string;
  musicalStyle?: string;
  mood?: string;
  timeSignature?: string;
  tempo?: string;
  keySignature?: string;
  scaleType?: string;
  chordType?: string;
  chordProgression?: string;
}

const generatePrompt = (config: Config): string => {
  return `
You are an expert music theorist, music producer for all genres, and a piano instructor.

Your task is to generate a "sound card" for a music app, primarily focusing on the piano. This sound card should provide a musical pattern that is both educational and inspirational for piano learners and musicians looking for creative inspiration.

The user has provided some parameters, but others may be unspecified. Your goals are:

1. **Parameter Completion**: For any unspecified parameters, choose appropriate values that create a cohesive and musically sensible combination. Consider the user-specified parameters when generating the missing ones. Ensure that the complete set of parameters is appropriate for piano learning and/or musicians looking for creative inspiration.

2. **Music/Melody and Metadata Generation**: Based on the complete set of parameters, provide the sequence of piano keys to be played or chords, and generate additional metadata.

3. **Response Formatting**: Provide your response as a **valid JSON object** with the specified structure, and **nothing else**. Do not include any explanations or additional text.

**User-specified parameters:**
${Object.entries(config)
  .map(([key, value]) => `- ${key}: ${value || 'unspecified'}`)
  .join('\n')}

**IMPORTANT**: 
- For Single Keys, you MUST generate exactly the number of keys specified in the "Number of Keys to Play" parameter.
- For Chords, you MUST generate exactly the number of chords specified in the "Number of Keyboards" parameter.
This is crucial for the app to function correctly.

**Available Options for Parameters:**
- **Mood**: ${moodList.map((m) => `"${m}"`).join(', ')}
- **Musical Style**: ${musicalStyleList.map((s) => `"${s}"`).join(', ')}
- **Scale Type**: ${scaleTypeList.map((s) => `"${s}"`).join(', ')}
- **Chord Type**: ${chordTypeList.map((c) => `"${c}"`).join(', ')}
- **Chord Progression**: ${chordProgressionList.map((c) => `"${c}"`).join(', ')}
- **Time Signature**: ${timeSignatureList.map((t) => `"${t}"`).join(', ')}
- **Key Signature**: ${keySignatureList.map((k) => `"${k}"`).join(', ')}
- **Tempo**: ${tempoList.map((t) => `"${t}"`).join(', ')}

**Constraints:**
- **For Single Keys: Ensure that the number of keys is less than or equal to the specified "Number of Keys to Play" parameter.**
- **For Chords: Ensure that the number of chords matches the specified "Number of Keyboards" parameter.**
- **Each chord should contain the correct number of notes based on the chord type.**
- **The pattern should be playable within the constraints of a standard 88-key piano.**

**Response Format:**

\`\`\`json
{
  "${config.cardType === 'Single Keys' ? 'Keys' : 'Chords'}": [
    ${config.cardType === 'Single Keys'
      ? `{"note": "C4", "order": 1}, {"note": "E4", "order": 2}, ...`
      : `{"name": "C Major", "notes": ["C4", "E4", "G4"], "order": 1}, ... (exactly ${config.numberOfKeyboards} chords)`}
  ],
  "Card Type": "${config.cardType}",
  "Number of Keyboards": ${config.cardType === 'Chords' ? config.numberOfKeyboards || 'null' : 'null'},
  "Number of Keys to Play": ${config.numberOfKeysToPlay || 'null'},
  "Number of Notes in the Card": ${config.numberOfNotesInCard || 'null'},
  "Number of Chords": ${config.cardType === 'Chords' ? config.numberOfKeyboards : 'null'},
  "Difficulty Level": "${config.difficultyLevel || 'unspecified'}",
  "Musical Style": "${config.musicalStyle || 'unspecified'}",
  "Mood": "${config.mood || 'unspecified'}",
  "Time Signature": "${config.timeSignature || 'unspecified'}",
  "Tempo": "${config.tempo || 'unspecified'}",
  "Key Signature": "${config.keySignature || 'unspecified'}",
  "Scale Type": "${config.scaleType || 'unspecified'}",
  "Chord Type": ${config.cardType === 'Chords' ? `"${config.chordType || 'unspecified'}"` : 'null'},
  "Chord Progression": ${config.cardType === 'Chords' ? `"${config.chordProgression || 'unspecified'}"` : 'null'},
  "Sound Card Name": "[Generate a Creative Name]",
  "Description": "[Provide a brief explanation of the musical concept]",
  "Tip": "[Provide a sentence or two of playing advice]",
  "Music Theory": "[Provide a one to two sentence explanation of the underlying theory]"
}
\`\`\`

**Important Notes:**
- **Your entire response should be a single valid JSON object matching the format above.**
- **Do not include any additional text, explanations, or commentary.**
- **Ensure all strings are properly quoted and the JSON is well-formed.**
- **Replace placeholders like \`[Generate a Creative Name]\` with actual content.**
- **For Chords, you MUST generate exactly ${config.numberOfKeyboards} chords. No more, no less.**
  `;
};

export async function POST(req: Request) {
  try {
    const config = await req.json();
    
    console.log('Received request:', config);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const prompt = generatePrompt(config);

    console.log('Sending prompt to OpenAI:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log('OpenAI response:', completion);

    if (!completion.choices[0].message.content) {
      throw new Error('No content in OpenAI response');
    }

    const parsedResponse = parseAIResponse(completion.choices[0].message.content);

    console.log('Parsed AI response:', parsedResponse);
    console.log('Config:', config);

    const validationResult = validateAIResponse(parsedResponse, config);
    if (!validationResult.isValid) {
      console.error('Invalid AI response:', parsedResponse);
      throw new Error(`Invalid AI response: ${validationResult.error}`);
    }

    console.log('Parsed response:', parsedResponse);

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

interface AIResponse {
  Keys?: { note: string; order: number }[];
  Chords?: { name: string; notes: string[]; order: number }[];
  [key: string]: unknown;
}

interface Chord {
  name: string;
  notes: string[];
  order: number;
}

function parseAIResponse(response: string): Record<string, unknown> {
  try {
    console.log('Raw AI response:', response);
    // Remove markdown code block delimiters if present
    const cleanedResponse = response.replace(/```json\n|\n```/g, '');
    const result = JSON.parse(cleanedResponse);
    console.log('Parsed result:', result);
    return result;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    console.error('Full response:', response);
    throw new Error('Failed to parse AI response: ' + (error instanceof Error ? error.message : String(error)));
  }
}

function validateAIResponse(response: AIResponse, config: Config): { isValid: boolean; error?: string } {
  if (config.cardType === 'Single Keys') {
    if (!Array.isArray(response.Keys)) {
      return { isValid: false, error: 'Keys should be an array' };
    }
    if (response.Keys.length > config.numberOfKeysToPlay) {
      return { isValid: false, error: `Expected at most ${config.numberOfKeysToPlay} keys, but got ${response.Keys.length}` };
    }
    return { isValid: true };
  } else if (config.cardType === 'Chords') {
    if (!Array.isArray(response.Chords)) {
      return { isValid: false, error: 'Chords should be an array' };
    }
    if (response.Chords.length !== config.numberOfKeyboards) {
      return { isValid: false, error: `Expected ${config.numberOfKeyboards} chords, but got ${response.Chords.length}. Please ensure you're generating the correct number of chords.` };
    }
    if (!response.Chords.every((chord: Chord) => Array.isArray(chord.notes) && chord.notes.length >= 2)) {
      return { isValid: false, error: 'Each chord should have at least 2 notes' };
    }
    return { isValid: true };
  }
  return { isValid: false, error: 'Invalid card type' };
}
