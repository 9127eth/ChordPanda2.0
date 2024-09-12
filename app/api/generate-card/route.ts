import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const config = await request.json();

    const prompt = `Generate a sound card with the following configuration:
    Card Type: ${config.cardType}
    Keys to Play: ${config.keysToPlay}
    Notes in Card: ${config.notesInCard}
    Difficulty Level: ${config.difficultyLevel}
    ${config.musicalStyle ? `Musical Style: ${config.musicalStyle}` : ''}
    ${config.mood ? `Mood: ${config.mood}` : ''}
    ${config.timeSignature ? `Time Signature: ${config.timeSignature}` : ''}
    ${config.tempo ? `Tempo: ${config.tempo}` : ''}
    ${config.keySignature ? `Key Signature: ${config.keySignature}` : ''}
    ${config.scaleType ? `Scale Type: ${config.scaleType}` : ''}
    ${config.chordType ? `Chord Type: ${config.chordType}` : ''}
    ${config.chordProgression ? `Chord Progression: ${config.chordProgression}` : ''}

    Provide the response in the following JSON format:
    {
      "keys": [
        { "note": "C4", "order": 1 },
        { "note": "E4", "order": 2 },
        ...
      ],
      "name": "Creative name for the sound card",
      "description": "Brief explanation of the musical concept",
      "tip": "Short playing advice",
      "musicTheory": "One-sentence explanation of the underlying theory"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const generatedCard = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(generatedCard);
  } catch (error) {
    console.error('Error generating card:', error);
    return NextResponse.json({ error: 'Error generating card' }, { status: 500 });
  }
}
