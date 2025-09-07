import { geminiClient } from './gemini-client';
import { Flashcard } from '@/types/flashcard';

export async function generateFlashcardVariation(baseFlashcard: Flashcard): Promise<Flashcard | null> {
  try {
    console.log('Generating variation for:', baseFlashcard.problem_title);
    
    // Create a very explicit prompt that forces Gemini to understand the problem type
    const prompt = `You are a coding problem variation generator. I will give you a coding problem and you MUST generate a variation of that EXACT problem type.

CURRENT PROBLEM TYPE: ${baseFlashcard.problem_title}
THIS IS NOT A FIZZBUZZ PROBLEM UNLESS THE TITLE SAYS "FizzBuzz"

Original Problem:
=================
Title: ${baseFlashcard.problem_title}
Description: ${baseFlashcard.problem_description}
Solution:
${baseFlashcard.code_solution}
Explanation: ${baseFlashcard.code_explanation}

INSTRUCTIONS:
=============
1. Keep the EXACT SAME problem title: "${baseFlashcard.problem_title}"
2. Generate a variation of THIS SPECIFIC PROBLEM (not FizzBuzz unless the title is FizzBuzz)
3. Change variable names, values, and wording but keep the same algorithm type

${baseFlashcard.problem_title === 'FizzBuzz' ? `
For FizzBuzz: Change the divisors (like 3→4, 5→7), change the strings (Fizz→Ping, Buzz→Pong), change the range (1-100→1-50)
` : baseFlashcard.problem_title === 'Two Sum' ? `
For Two Sum: Keep the hash table approach, change variable names (nums→numbers, target→sum_target, num_dict→seen_values)
` : baseFlashcard.problem_title === 'Valid Parentheses' ? `
For Valid Parentheses: Keep the stack approach, change variable names (stack→bracket_stack, mapping→bracket_pairs)
` : baseFlashcard.problem_title === 'Reverse String' ? `
For Reverse String: Keep the two-pointer approach, change variable names (left→start, right→end)
` : baseFlashcard.problem_title === 'Fibonacci Sequence' ? `
For Fibonacci: Keep the iterative approach, change variable names (a→prev, b→current)
` : baseFlashcard.problem_title === 'Palindrome Number' ? `
For Palindrome Number: Keep the string reversal approach, maybe add a note about alternative approaches
` : baseFlashcard.problem_title === 'Binary Search' ? `
For Binary Search: Keep the binary search algorithm, change variable names (left→low, right→high, mid→middle)
` : baseFlashcard.problem_title === 'Climbing Stairs' ? `
For Climbing Stairs: Keep the dynamic programming approach, change variable names (dp→ways)
` : `
For ${baseFlashcard.problem_title}: Keep the same algorithm and approach, just change variable names and explanation wording
`}

IMPORTANT: Your response must be ONLY a valid JSON object with these exact keys:
{
  "problem_title": "${baseFlashcard.problem_title}",
  "problem_description": "YOUR VARIATION OF THE DESCRIPTION HERE",
  "code_solution": "YOUR VARIATION OF THE CODE HERE", 
  "code_explanation": "YOUR VARIATION OF THE EXPLANATION HERE"
}

Do not include any other text, markdown formatting, or explanation. Just the JSON object.`;

    // Send the request
    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const responseText = response.text;
    console.log('Gemini response:', responseText.substring(0, 200) + '...');
    
    // Clean up the response text to extract JSON
    let cleanedText = responseText;
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\s*/gi, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    
    // Try to find the JSON object
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response');
      return null;
    }

    try {
      const variation = JSON.parse(jsonMatch[0]);
      
      // Validate the response has all required fields
      if (!variation.problem_title || !variation.problem_description || 
          !variation.code_solution || !variation.code_explanation) {
        console.error('Missing required fields in variation');
        return null;
      }

      // Ensure the title matches the original
      variation.problem_title = baseFlashcard.problem_title;
      
      console.log('Successfully generated variation for:', variation.problem_title);
      return variation as Flashcard;
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error generating flashcard variation:', error);
    return null;
  }
}