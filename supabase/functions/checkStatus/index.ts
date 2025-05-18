// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! 
);




Deno.serve(async (req) => {
  try{
  
    const tickets = await getTickets();
    if (!tickets || tickets.length === 0) return new Response(
      JSON.stringify({ message: 'Nav pieejamu biļešu' }),
      { headers: { "Content-Type": "application/json" } }
    );

    const { date: date_now, time: time_now } = getLatvianTime();

    for (const ticket of tickets) {
      if (!ticket.user_subscription || 
          !ticket.user_subscription.invoice || 
          !ticket.user_subscription.invoice[0] ||
          !ticket.user_subscription.subscriptions) {
        continue;
      }
      
      const status = ticket.user_subscription.invoice[0].status;
      
      if (status === 'valid') {
        const id = ticket.id;
        const is_date = ticket.user_subscription.subscriptions.is_date;
        const is_time = ticket.user_subscription.subscriptions.is_time;
        const invoice_id = ticket.user_subscription.invoice[0].id;
        
        if (is_date && is_time) {
          await checkConditonForTimeAndDate(ticket, date_now, time_now, invoice_id);
        }
        else if (is_date && !is_time) {
          await checkDayAndNotTime(ticket, date_now, invoice_id);
        }
        else {
          
          const stamps = await getResult(id);
          
          if (!stamps || stamps.length === 0) continue;
          const uniqueDates = extractDates(stamps);
          if (!uniqueDates || uniqueDates.length === 0) continue;
          
          const {duration_type: restrictionType, duration_value: restrictionValue} = ticket.user_subscription.subscriptions;
          await checkStatusChange(restrictionType, restrictionValue, uniqueDates, invoice_id);
        }
      }
    }
    return new Response(
      JSON.stringify({ message: 'Viss ir labi' }),
      { headers: { "Content-Type": "application/json" } }
    );
  }catch (err) {
    console.error("Kļūda funkcijā:", err);
    return new Response(
      JSON.stringify({ error: "Servera kļūda" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

const extractDates = (stamps) => {
  if (!stamps || stamps.length === 0) return [];
  
  const uniqueDates = [];
  for (const stamp of stamps) {
    if (!stamp || !stamp.created_at) continue;
    
    const createdDate = new Date(stamp.created_at).toISOString().split('T')[0];
    if (uniqueDates.length === 0 || uniqueDates[uniqueDates.length - 1] !== createdDate) {
      uniqueDates.push(createdDate);
    }
  }

  return uniqueDates;
};

const checkStatusChange = async (restrictionType, restrictionValue, uniqueDates, invoice_id) =>{
  if (!uniqueDates || uniqueDates.length === 0 || !restrictionType || !restrictionValue) return;

  const lastUsedDate = new Date(uniqueDates[uniqueDates.length - 1]);
  const today = new Date();
  if (restrictionType === "dienas" && uniqueDates.length >= restrictionValue && lastUsedDate < today) {
    await changeStatus(invoice_id); 
  }
}

const checkConditonForTimeAndDate = async(ticket, date_now, time_now, invoice_id) => {
  try{
    if (!ticket || !ticket.user_subscription || !ticket.user_subscription.start_date) return;
    
    const { start_date, end_time } = ticket.user_subscription;

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
  }catch(err){
    console.log('notika kluda');
    console.error(err);
  }
}

const checkDayAndNotTime = async (ticket, date_now, invoice_id) => {
  try{
    if (!ticket || !ticket.user_subscription || !ticket.user_subscription.end_date) return;
    
    const { end_date } = ticket.user_subscription;
          
    const formatted_end_date = new Date(end_date).toISOString().split('T')[0];

    if (formatted_end_date < date_now) {
      await changeStatus(invoice_id);
    }
  }catch(err){
    console.error(err);
  }
}

const changeStatus = async (id: number) => {
  if (!id) return;
  
  const { error } = await supabase
    .from("invoice")
    .update({ status: "invalid" })
    .eq("id", id);

  if (error) {
    console.error("Notika kluda", error);
  }
}

const getResult = async(id: number) => {
  if (!id) return [];
  
  const { data, error } = await supabase
    .from("time_stamps")
    .select("created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

const getLatvianTime = () =>  {
  const now = new Date();
  const latvianTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Riga' }));
  return {
    date: latvianTime.toISOString().split('T')[0],
    time: latvianTime.toISOString().split('T')[1].split('.')[0]
  };
}

const getTickets = async () => {
  const { data, error } = await supabase
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
    console.error("Notika kluda", error);
    return [];
  }
  return data ?? [];
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/checkStatus' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
