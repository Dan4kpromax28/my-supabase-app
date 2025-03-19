// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";
import { decodeBase64 } from "https://deno.land/std/encoding/base64.ts";

const qrData = '1234567';
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
  to: "danikbalik@gmail.com",
  subject: "example",
  content: "test",
  html: "<p>test</p>",
  attachments: [attachment],
});

await client.close();

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sendMail' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
