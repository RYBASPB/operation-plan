// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { Bot, InputFile } from 'https://deno.land/x/grammy@v1.30.0/mod.ts'
import { corsHeaders } from '../_shared/cors.ts'

const bot = new Bot(Deno.env.get('BOT_TOKEN') || '')
const chatId = Deno.env.get('CHAT_ID') || ''
console.log('Telegram bot created!')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }
  const image = await req.blob()
  console.log(image)

  if (image) {
    await bot.api.sendPhoto(
      chatId,
      new InputFile(image),
    )
  }

  return new Response(
    JSON.stringify({ message: 'Sent' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
