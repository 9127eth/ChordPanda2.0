import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const config = await request.json();

    const prompt = `You are an expert music theorist, music producer for all genres, and a piano instructor. Your task is to generate a "sound card" for a music app, primarily focusing on the piano. This sound card should provide a musical pattern that is both educational and inspirational for piano learners and musicians looking for creative inspiration.

The user has provided some parameters, but others may be unspecified. First, complete any missing parameters to create a cohesive musical concept. Then, generate the sound card based on the complete set of parameters.

User-specified parameters:
${Object.entries(config).map(([key, value]) => `- ${key}: ${value || "unspecified"}`).join('\n')}

Step 1: Parameter Completion
For any unspecified parameters, provide appropriate values that create a cohesive and musically sensible combination. Consider the user-specified parameters when generating the missing ones. Ensure that the complete set of parameters is appropriate for piano learning and/or musicians looking for creative inspiration.

Step 2: Music/Melody and additional metadata/parameter Generation
Provide the sequence of piano keys to be played or chords, represented in the following structured format:

${config.cardType === 'Single Keys' ? `
Keys: [
  { "note": "[NOTE]", "order": [ORDER] },
  ...
]
Ensure the number of keys matches the specified "Number of Keys to Play" parameter.
` : `
Chords: [
  {
    "name": "[CHORD NAME]",
    "notes": ["[NOTE1]", "[NOTE2]", "[NOTE3]"],
    "order": [ORDER]
  },
  ...
]
Ensure the number of chords matches the specified "Number of Keys to Play" parameter, and each chord contains the correct number of notes based on the chord type.
`}

Sound Card Name: [Generate a Creative Name for the title of the Sound Card]
Description: [Provide a brief explanation of the musical concept]
Tip: [Provide a sentence or two of playing advice]
Music Theory: [Provide a one to two sentence explanation of the underlying theory]

Remember, the goal is to create a pattern that is musically interesting, educational, and suitable for the specified difficulty level. The pattern should be playable within the constraints of a standard 88-key piano.

Step 3: Provide Your Response
Based on the complete set of parameters (user-specified and AI-completed), generate a sound card using the below format.
No matter what, your response should only be in the format below and nothing else:

${config.cardType === 'Single Keys' ? 'Keys:' : 'Chords:'} [JSON array as specified above]
Card Type: [Single Keys / Chords]
Number of Keyboards: [2-4, only if Card Type is Chords]
Number of Keys to Play: [2-21 for Single Keys, 2-10 for Chords]
Number of Notes in the Card: [2-12]
Difficulty Level: [Beginner / Intermediate / Advanced]
Musical Style: [e.g., Classical, Jazz, Pop, Blues]
Mood: [e.g., Happy, Sad, Energetic, Calm]
Time Signature: [e.g., 4/4, 3/4, 6/8]
Tempo: [e.g. Slow, Fast]
Key Signature: [e.g., C Major, G Major, A Minor]
Scale Type: [e.g., Major, Minor, Pentatonic, Blues]
Chord Type: [e.g., Major, Minor, Dominant 7th] (if applicable)
Chord Progression: [e.g., I-IV-V, ii-V-I] (if applicable)
Sound Card Name: [Creative Name]
Description: [Brief explanation of the musical concept]
Tip: [Short playing advice]
Music Theory: [One-sentence explanation of the underlying theory]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    if (!completion.choices[0].message.content) {
      throw new Error('No content in OpenAI response');
    }

    const generatedCard = parseAIResponse(completion.choices[0].message.content);

    return NextResponse.json(generatedCard);
  } catch (error) {
    console.error('Error generating card:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to generate card', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to generate card', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

function parseAIResponse(response: string): Record<string, unknown> {
  try {
    const lines = response.split('\n');
    const result: any = {};

    let currentKey = '';
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key === 'Keys' || key === 'Chords') {
          currentKey = key;
          result[currentKey] = JSON.parse(value);
        } else {
          result[key] = value;
        }
      } else if (currentKey && line.trim()) {
        result[currentKey] += '\n' + line.trim();
      }
    }

    return result;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI response');
  }
}
