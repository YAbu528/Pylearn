import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const QUIZ_ANSWER_INDEX = [1, 2, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0] as const;
const OBJECTIVE_CHALLENGES = new Set(["2", "6", "13"]);

function corsHeaders(req: Request): HeadersInit {
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

function reply(body: Record<string, unknown>, status: number, headers: HeadersInit) {
  return Response.json(body, { status, headers });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(body: Record<string, unknown>, expected: string[]): boolean {
  const actual = Object.keys(body).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

function validateShape(body: Record<string, unknown>): string | null {
  if (typeof body.lesson_id !== "string" || !/^(0|[1-9]|1[0-3])$/.test(body.lesson_id)) {
    return "invalid_request";
  }

  if (body.event_type === "quiz") {
    if (!exactKeys(body, ["lesson_id", "event_type", "answer_index"])
      || !Number.isInteger(body.answer_index)
      || (body.answer_index as number) < 0
      || (body.answer_index as number) > 5) return "invalid_request";
    return null;
  }

  if (body.event_type === "lesson") {
    return exactKeys(body, ["lesson_id", "event_type"]) ? null : "invalid_request";
  }

  if (body.event_type === "challenge") {
    if (!OBJECTIVE_CHALLENGES.has(body.lesson_id)) return "unsupported_event";

    if (body.lesson_id === "6") {
      if (!exactKeys(body, ["lesson_id", "event_type", "answer_index"])
        || !Number.isInteger(body.answer_index)
        || (body.answer_index as number) < 0
        || (body.answer_index as number) > 5) return "invalid_request";
    } else {
      if (!exactKeys(body, ["lesson_id", "event_type", "answer"])
        || typeof body.answer !== "string"
        || body.answer.length > 32) return "invalid_request";
    }
    return null;
  }

  return "invalid_request";
}

function isCorrectAnswer(body: Record<string, unknown>): boolean {
  const lessonId = body.lesson_id as string;

  if (body.event_type === "quiz") {
    return body.answer_index === QUIZ_ANSWER_INDEX[Number(lessonId)];
  }

  if (body.event_type === "challenge") {
    if (lessonId === "6") return body.answer_index === 1;
    const normalized = (body.answer as string).trim().toLowerCase();
    if (lessonId === "2") return normalized === "16";
    if (lessonId === "13") return normalized === "95";
  }

  return true;
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);
  const origin = req.headers.get("Origin") || "";
  const originAllowed = !origin
    || origin === "https://yabu528.github.io"
    || origin === "https://pylearn.vercel.app"
    || /^https:\/\/pylearn-[a-z0-9-]+-yabu528s-projects\.vercel\.app$/.test(origin);

  if (req.method === "OPTIONS") {
    if (!originAllowed) return reply({ error: "origin_not_allowed" }, 403, headers);
    return new Response("ok", { headers });
  }

  if (!originAllowed) return reply({ error: "origin_not_allowed" }, 403, headers);
  if (req.method !== "POST") return reply({ error: "method_not_allowed" }, 405, headers);
  if (!(req.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return reply({ error: "invalid_request" }, 400, headers);
  }

  try {
    const rawBody = await req.text();
    if (rawBody.length > 4096) return reply({ error: "invalid_request" }, 400, headers);

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return reply({ error: "invalid_request" }, 400, headers);
    }
    if (!isPlainObject(body)) return reply({ error: "invalid_request" }, 400, headers);

    const shapeError = validateShape(body);
    if (shapeError === "unsupported_event") {
      return reply({ error: "unsupported_event" }, 422, headers);
    }
    if (shapeError) return reply({ error: shapeError }, 400, headers);

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return reply({ error: "unauthorized" }, 401, headers);

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceKey) throw new Error("Missing server configuration");

    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) return reply({ error: "unauthorized" }, 401, headers);

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: allowed, error: limitError } = await admin.rpc("reserve_learning_attempt", {
      p_user_id: user.id,
      p_lesson_id: body.lesson_id,
      p_event_type: body.event_type,
    }).schema("private");

    if (limitError) throw limitError;
    if (allowed !== true) return reply({ error: "rate_limited" }, 429, headers);

    if (!isCorrectAnswer(body)) return reply({ error: "invalid_answer" }, 422, headers);

    const { data, error } = await admin.schema("private").rpc("record_verified_learning_event", {
      p_user_id: user.id,
      p_lesson_id: body.lesson_id,
      p_event_type: body.event_type,
      p_verification_version: 1,
    });

    if (error) {
      const message = String(error.message || "");
      if (message.includes("quiz_required")) return reply({ error: "quiz_required" }, 409, headers);
      if (message.includes("unsupported_event")) return reply({ error: "unsupported_event" }, 422, headers);
      if (message.includes("invalid_event")) return reply({ error: "invalid_request" }, 400, headers);
      throw error;
    }

    return reply(data as Record<string, unknown>, 200, headers);
  } catch (error) {
    console.error("verify-learning-activity failed:", error);
    return reply({ error: "server_error" }, 500, headers);
  }
});
