// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from "../_shared/cors.ts";
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { qrData, email } = await req.json();
    const data = await qrcode(qrData);
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
      subject: "example",
      content: "test",
      html: `<!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Jūsu QR</title>
                <style>
                
                  body {
                    background-color: #d8d8d8;
                    font-family: Arial, sans-serif;
                    
                  }
                  .container {
                    max-width: 600px;
                    background: rgb(255, 255, 255);
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    text-align: center;
                  }
                  header {
                    background-color: #3068c3;
                    color: white;
                    border-radius: 8px;
                    padding: 5px 0;
                    text-align: center;
                    margin-bottom: 5px;
                  }
                  img {
                    width: 100%;
                    max-width: 400px;
                    margin-top: 20px;
                  }
                </style>
              </head>
              <body>
              <header>
                <div class="myheader">
                  <h1>MOOMENTUM</h1>
                </div>
              </header>
                <div class="container">
                  <h1 class="text-xl font-bold text-gray-800">Jūsu QR Kods</h1>
                  <p>Varāt izmantot QR kodu</p>
                  <img src="${data}" alt="QR Code" class="mt-4">
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
  } catch (error) {
    
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sendMail' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
