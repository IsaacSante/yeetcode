import { GoogleGenAI, Type } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


// Initialize the Gemini client
export const geminiClient = new GoogleGenAI({apiKey: GEMINI_API_KEY});

// Define the function declaration for generating flashcard variations
const generateFlashcardVariationDeclaration = {
  name: 'generate_flashcard_variation',
  description: 'Generates a variation of a coding problem flashcard with similar difficulty and concept but different variables, parameters, or constraints',
  parameters: {
    type: Type.OBJECT,
    properties: {
      problem_title: {
        type: Type.STRING,
        description: 'The title of the problem (should remain the same)',
      },
      problem_description: {
        type: Type.STRING,
        description: 'A variation of the problem description with different variables, ranges, or output requirements but maintaining the same core algorithm',
      },
      code_solution: {
        type: Type.STRING,
        description: 'The solution code adapted to the new problem variation',
      },
      code_explanation: {
        type: Type.STRING,
        description: 'An explanation of the solution that reflects the changes in the variation',
      },
    },
    required: ['problem_title', 'problem_description', 'code_solution', 'code_explanation'],
  },
};

export { generateFlashcardVariationDeclaration };