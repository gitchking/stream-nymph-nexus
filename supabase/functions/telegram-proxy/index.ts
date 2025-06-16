import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TelegramRequest {
  method: string;
  channelId?: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN not configured in Supabase secrets");
    }

    const { method, channelId, data }: TelegramRequest = await req.json();
    
    let telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;
    let requestOptions: RequestInit = {
      method: 'GET'
    };

    // Handle different Telegram API methods
    switch (method) {
      case 'getMe':
        // Keep default GET
        break;
      
      case 'sendMessage':
        requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
        break;
      
      case 'getChat':
        telegramUrl += `?chat_id=${channelId}`;
        break;
      
      case 'getChatHistory':
        telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
        if (channelId) {
          telegramUrl += `?allowed_updates=["channel_post"]`;
        }
        break;
      
      case 'sendDocument':
      case 'sendVideo':
        // For file uploads, we'll handle FormData
        if (data instanceof FormData) {
          requestOptions = {
            method: 'POST',
            body: data
          };
        } else {
          requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          };
        }
        break;
      
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    console.log('Making Telegram API request:', telegramUrl);
    
    const response = await fetch(telegramUrl, requestOptions);
    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in telegram-proxy function:", error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error.message,
        description: "Telegram proxy error"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
