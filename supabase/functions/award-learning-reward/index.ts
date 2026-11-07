import { createClient } from "npm:@supabase/supabase-js@2";

function corsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowed = origin === "https://yabu528.github.io"
    || origin === "https://pylearn.vercel.app"
    || /^https:\/\/pylearn-[a-z0-9-]+-yabu528s-projects\.vercel\.app$/.test(origin);
  return {
    ...(allowed ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return Response.json({ error: "Sign-in required" }, { status: 401, headers });

    const url = Deno.env.get("SUPABASE_URL")!;
    // Use the legacy JWT-based keys when present; they work with supabase-js v2's
    // Authorization header behavior. Never expose the service key to the browser.
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) return Response.json({ error: "Invalid or expired session" }, { status: 401, headers });

    const body = await req.json();
    const lessonId = String(body.lesson_id ?? "");
    const eventType = String(body.event_type ?? "");
    if (!/^(0|[1-9][0-9]*)$/.test(lessonId) || !["quiz", "lesson", "challenge"].includes(eventType)) {
      return Response.json({ error: "Invalid reward request" }, { status: 400, headers });
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await admin.rpc("award_learning_xp", {
      p_user_id: user.id,
      p_event_key: lessonId + ":" + eventType,
      p_event_type: eventType,
      p_lesson_id: lessonId,
    });
    if (error) throw error;

    return Response.json(data, { status: 200, headers });
  } catch (error) {
    console.error("award-learning-reward failed:", error);
    return Response.json({ error: "Could not process learning reward" }, { status: 500, headers });
  }
});