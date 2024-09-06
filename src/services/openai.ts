import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function generateResponse(prompt: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('openai', {
      body: { query: prompt }
    })

    if (error) throw error

    return data.reply || "Sorry, I couldn't generate a response."
  } catch (error) {
    console.error('Error calling Supabase function:', error)
    return "Sorry, there was an error generating a response."
  }
}