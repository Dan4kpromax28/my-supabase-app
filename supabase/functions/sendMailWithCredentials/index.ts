import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req)=>{
 if (req.method === 'OPTIONS') {
   return new Response('ok', {
     headers: corsHeaders
   });
 }
 try {
   const { id, email} = await req.json();
   const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const {data, error} = await supabase
      .from('invoice')
      .select('*, user_subscription(*, subscriptions(*),client(*))')
      .eq('id', id)
      .single();
    if (error) {
      throw new Error('Notika kluda sakuma' + error.message);
    }
    let actualMessage = '';
    if (data.status === 'accepted'){
      actualMessage = `Labdien, ${data.user_subscription?.client?.name} ${data.user_subscription?.client?.surname}!<br>
      Jūsu pasutijums ${data.user_subscription?.subscriptions?.name} ir apstradats un gaida lai jus par to samaksatu.<br>
      Musu bakas konts ir: LV80HABA055101000001<br>
      Noradiet maksajuma mērķī so numuru numuru: ${data.number_id}<br>
      Un summa samaksai ir: ${data.full_price} EUR<br>`
    }else{
      actualMessage = `Labdien, ${data.user_subscription?.client?.name} ${data.user_subscription?.client?.surname}!<br>
      Mes diemzel mes nevaram apstiprinat pasutijumu ${data.user_subscription?.subscriptions?.name}.<br>
      Tas bus pabeigts. Jus varat ar mums szinaties seit\n
      `
    }
    
   const client = new SMTPClient({
     connection: {
       hostname: "smtp.gmail.com",
       port: 465,
       tls: true,
       auth: {
         username: Deno.env.get('MY_EMAIL'),
         password: Deno.env.get('MY_EMAIL_PASSWORD')
       }
     }
   });
   await client.send({
     from: "MOOMENTUM <danilobaliko@gmail.com>",
     to: {
       email
     },
     subject: "Zina par pasutijumu",
     content: "Zina par pasutijumu",
     html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Jūsu QR</title>
</head>
<body style="background-color: #d8d8d8; font-family: Arial, sans-serif; width: 100%;">
 <div style="background-color: #3068c3; color: white; border-radius: 8px; padding: 10px 0; text-align: center; width: 100%;">
   <h1>MOOMENTUM</h1>
 </div>
 <div style="width: 100%; background: white; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); text-align: center; padding-top: 5%; padding-bottom: 5%;">
   <h1 style="color: #333; margin-bottom: 10px;">Zina</h1>
   <p style="margin: 0 0 10px; color: #555;">${actualMessage}</p>
 </div>
</body>
</html>`
   });
   await client.close();
   return new Response(JSON.stringify(data), {
     headers: {
       ...corsHeaders,
       'Content-Type': 'application/json'
     },
     status: 200
   });
 } catch (error) {
   return new Response(JSON.stringify({
     error: error.message
   }), {
     headers: {
       ...corsHeaders,
       'Content-Type': 'application/json'
     },
     status: 400
   });
 }
}); /* To invoke locally:



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sendMailWithCredentials' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
