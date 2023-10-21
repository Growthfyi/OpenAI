import { Configuration, OpenAIApi } from 'openai';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      // Handle preflight request by setting up CORS headers
      const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      return new Response(null, {
        headers: headers,
      });
    } else if (request.method === 'POST') {
      const requestBody = await request.json(); // Parse the JSON request body

      if (!requestBody || !requestBody.text) {
        return new Response('Invalid request. Please provide a text input.', {
          status: 400,
        });
      }

      const apiKey = env.OPENAI_API_KEY;
      const openai = new OpenAIApi(new Configuration({ apiKey }));

      try {
        const response = await openai.createCompletion({
          model: 'davinci',
          prompt: requestBody.text,
          max_tokens: 50, // Adjust as needed
        });

        const jsonResponse = JSON.stringify({ text: response.data.choices[0].text });

        // Set up CORS headers to allow requests from any origin
        const headers = new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        });

        return new Response(jsonResponse, {
          headers: headers,
        });
      } catch (error) {
        return new Response('OpenAI API request failed.', {
          status: 500,
        });
      }
    }

    return new Response('Invalid request method. Use POST.', { status: 400 });
  },
};
