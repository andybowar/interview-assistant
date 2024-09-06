import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'

console.log(`Function "openai" up and running!`)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    const apiKey = Deno.env.get('VUE_APP_OPENAI_API_KEY')
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: query }],
      model: 'gpt-3.5-turbo',
      stream: false,
    })

    const reply = chatCompletion.choices[0].message.content
    const responseBody = { reply };

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})