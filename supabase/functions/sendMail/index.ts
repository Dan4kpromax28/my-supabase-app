// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
    const { subId, email } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_ANON_KEY'),
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    let isCreated = false;
    let random = '';
    const { data: exist, error: errExist } = await supabase
      .from('ticket')
      .select('user_string')
      .eq('user_subscription_id', subId)
      .maybeSingle();
    if (errExist) {
      return new Response(JSON.stringify({ error: errExist.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (exist) {
      random = exist.user_string;
    } else {
      while(!isCreated){
        const charactersForQrCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        for (let i = 0; i < 15; i++) {
          random += charactersForQrCode.charAt(Math.floor(Math.random() * charactersForQrCode.length));
        }
        const {error} = await supabase
          .from('ticket')
          .select('user_string')
          .eq('user_string', random)
          .maybeSingle();
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }
        const {error: insertError} = await supabase
          .from('ticket')
          .insert({ user_string: random, user_subscription_id: subId })
          .select()
          .single();

        if (insertError) {
          return new Response(JSON.stringify({ error: insertError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }

        isCreated = true;
      }
    }
    const data = await qrcode(random);
    const base64 = data.split(',')[1];

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get('MY_EMAIL'),
          password: Deno.env.get('MY_EMAIL_PASSWORD'),
        },
      },
    });

    const attachment = {
      filename: "qrcode.png",
      content: base64,
      contentType: "image/png",
      encoding: "base64"
    };

    await client.send({
      from: "MOOMENTUM <danilobaliko@gmail.com>",
      to: {email},
      subject: "Jūsu kods",
      content: "QR kods",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jūsu QR</title>
</head>
<body style="background-color: #d8d8d8; font-family: Arial, sans-serif; width: 100%;">
  <div style="background-color: #3068c3; color: white; border-radius: 8px; padding: 10px 0; text-align: center; width: 100%;">
    <h1>MOOMENTUM</h1>
  </div>
  <div style="width: 100%; background: white; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); text-align: center; padding-top: 5%; padding-bottom: 5%;">
    <h1 style="color: #333; margin-bottom: 10px;">Jūsu QR Kods</h1>
    <p style="margin: 0 0 10px; color: #555;">Varāt izmantot QR kodu</p>
  </div>
</body>
</html>`,
      attachments: [attachment],
    });

    await client.close();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sendMail' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
