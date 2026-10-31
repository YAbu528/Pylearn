import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://yabu528.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return Response.json({ error: "Sign-in required" }, { status: 401, headers: corsHeaders });

    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) return Response.json({ error: "Invalid or expired session" }, { status: 401, headers: corsHeaders });

    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await admin.from("user_achievements").upsert(
      { user_id: user.id, achievement_id: "code" },
      { onConflict: "user_id,achievement_id", ignoreDuplicates: true },
    );
    if (error) throw error;

    return Response.json({ awarded: true, achievement_id: "code" }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("award-python-run failed:", error);
    return Response.json({ error: "Could not save Python achievement" }, { status: 500, headers: corsHeaders });
  }
});