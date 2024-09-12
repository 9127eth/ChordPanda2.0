import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const config = await req.json();
    
    console.log('Received request:', config);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

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
Based on the complete set of parameters (user-specified and AI-completed), generate a sound card using the format below. Your response must be a valid JSON object with the following structure:

{
  "${config.cardType === 'Single Keys' ? 'Keys' : 'Chords'}": [
    ${config.cardType === 'Single Keys' 
      ? '{ "note": "C4", "order": 1 }, { "note": "E4", "order": 2 }, ...'
      : '{ "name": "C Major", "notes": ["C4", "E4", "G4"], "order": 1 }, ...'
    }
  ],
  "Card Type": "${config.cardType}",
  "Number of Keyboards": ${config.cardType === 'Chords' ? '2' : 'null'},
  "Number of Keys to Play": 5,
  "Number of Notes in the Card": 5,
  "Difficulty Level": "Beginner",
  "Musical Style": "Classical",
  "Mood": "Calm",
  "Time Signature": "4/4",
  "Tempo": "Slow",
  "Key Signature": "C Major",
  "Scale Type": "Major",
  "Chord Type": ${config.cardType === 'Chords' ? '"Major"' : 'null'},
  "Chord Progression": ${config.cardType === 'Chords' ? '"I-IV-V"' : 'null'},
  "Sound Card Name": "Gentle Sunrise Melody",
  "Description": "A simple, calming progression perfect for beginners.",
  "Tip": "Focus on smooth transitions between notes.",
  "Music Theory": "This pattern introduces basic chord structure in the key of C major."
}

Ensure that your response is a valid JSON object and includes all the fields shown above, adjusting the values based on the generated sound card. The 'Keys' or 'Chords' array should contain the correct number of elements as specified in 'Number of Keys to Play'.`;

    console.log('Sending prompt to OpenAI:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log('OpenAI response:', completion);

    if (!completion.choices[0].message.content) {
      throw new Error('No content in OpenAI response');
    }

    const generatedCard = parseAIResponse(completion.choices[0].message.content);

    console.log('Parsed response:', generatedCard);

    return NextResponse.json(generatedCard);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

function parseAIResponse(response: string): Record<string, unknown> {
  try {
    console.log('Raw AI response:', response);
    const result = JSON.parse(response);
    console.log('Parsed result:', result);
    return result;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    console.error('Full response:', response);
    throw new Error('Failed to parse AI response: ' + (error instanceof Error ? error.message : String(error)));
  }
}
