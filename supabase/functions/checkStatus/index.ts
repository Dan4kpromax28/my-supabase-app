// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") 
);


function getLatvianTime() {
  const now = new Date();
  const latvianTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Riga' }));
  return {
    date: latvianTime.toISOString().split('T')[0],
    time: latvianTime.toISOString().split('T')[1].split('.')[0]
  };
}

Deno.serve(async (req) => {
  try {
    const { data: tickets, error } = await supabase
      .from("ticket")
      .select(`
        id,
        count,
        user_string,
        user_subscription_id,
        user_subscription(
            client_id,
            start_date,
            end_date,
            end_time,
            invoice(status,id),
            subscriptions(
                restriction_start,
                restriction_end,
                is_date,
                is_time,
                duration_value,
                duration_type
            )
        )
      `);

    if (error) {
      return new Response(JSON.stringify({error: 'Problema ar datiem'}), {status: 500});
    }

    for (const ticket of tickets) {
      const status = ticket.user_subscription.invoice[0].status;
      if (status === 'valid') {
        const id = ticket.id;
        const is_date = ticket.user_subscription.subscriptions.is_date;
        const is_time = ticket.user_subscription.subscriptions.is_time;
        const invoice_id = ticket.user_subscription.invoice[0].id;
        
        if (is_date && is_time) {
          const { start_date, end_time } = ticket.user_subscription;

          try {
            const formatted_start_date = new Date(start_date).toISOString().split('T')[0];
            const formatted_end_time = end_time;

            console.log("formatted_start_date", formatted_start_date);
            console.log("formatted_end_time", formatted_end_time);

            if (formatted_start_date < date_now) {
              console.log('datums nav derigs');
              await changeStatus(invoice_id);
            }
            else if (formatted_start_date === date_now && formatted_end_time < time_now) {
              console.log('laiks nav derigs');
              await changeStatus(invoice_id);
            }
          } catch (e) {
            console.error("Notika kluda");
          }
        }
        else if (is_date && !is_time) {
          const { end_date } = ticket.user_subscription;
          try {
            const formatted_end_date = new Date(end_date).toISOString().split('T')[0];

            if (formatted_end_date < date_now) {
              await changeStatus(invoice_id);
            }
          } catch (e) {
            console.log("Notika kluda");
          }
        }
        else {
          try {
            const resultSecond = await getResult(id);
            let count = 0;
            const uniqueDates = [];

            if (resultSecond && resultSecond.length !== 0) {
              for (const item of resultSecond) {
                const createdDate = new Date(item.created_at).toISOString().split('T')[0];
                if (uniqueDates.length === 0 || uniqueDates[uniqueDates.length - 1] !== createdDate) {
                  uniqueDates.push(createdDate);
                  count++;
                }
              }
              const restrictionType = ticket.user_subscription.subscriptions.duration_type;
              const restrictionValue = ticket.user_subscription.subscriptions.duration_value;
              const lastUsedDate = new Date(uniqueDates[uniqueDates.length - 1]);
              const today = new Date();

              if (restrictionType === "dienas" && uniqueDates.length === restrictionValue && lastUsedDate < today) {
                await changeStatus(invoice_id); 
              }
            }
          } catch (e) {
            console.error('Notika kluda');
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Viss ir labi' }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Problema ar datiem' }), 
      { status: 500 }
    );
  }
});

async function changeStatus(id: number) {
  const { error } = await supabase
    .from("invoice")
    .update({ status: "invalid" })
    .eq("id", id);

  if (error) {
    console.error("Notika kluda", error);
  }
}

async function getResult(id: number) {
  const { data, error } = await supabase
    .from("time_stamps")
    .select("created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data;
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/checkStatus' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
