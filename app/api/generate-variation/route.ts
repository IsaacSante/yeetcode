import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcardVariation } from '@/lib/flashcard-generator';
import { Flashcard } from '@/types/flashcard';

export async function POST(request: NextRequest) {
  console.log('API Route Called: /api/generate-variation');
  
  try {
    const baseFlashcard: Flashcard = await request.json();
    console.log('Received flashcard:', baseFlashcard.problem_title);

    if (!baseFlashcard || !baseFlashcard.problem_title) {
      console.error('Invalid flashcard data received');
      return NextResponse.json(
        { error: 'Invalid flashcard data' },
        { status: 400 }
      );
    }

    console.log('Calling generateFlashcardVariation...');
    const variation = await generateFlashcardVariation(baseFlashcard);
    console.log('Variation result:', variation ? 'Success' : 'Failed');

    if (!variation) {
      return NextResponse.json(
        { error: 'Failed to generate variation' },
        { status: 500 }
      );
    }

    return NextResponse.json(variation);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}