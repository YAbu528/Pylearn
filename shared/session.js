/* Shared Supabase session bridge for standalone PyLearn pages.
   The existing learning page keeps its established auth client and sync flow.
   Standalone pages use the same project and Supabase's standard persisted session. */
(() => {
  const config = window.PyLearnConfig;
  const sdk = window.supabase;
  if (!config || !sdk?.createClient || window.PyLearnSession) return;

  const client = sdk.createClient(
    "https://vzgbxoxscmlmacxciwze.supabase.co",
    "sb_publishable_KQo7xmr50dXipb4dm_i2NA_tNGGg-Lg"
  );

  let currentUser = null;
  const listeners = new Set();
  let initialized = false;

  const publish = user => {
    currentUser = user || null;
    listeners.forEach(listener => {
      try { listener(currentUser); } catch (error) { console.error("PyLearn session listener:", error); }
    });
  };

  const ready = client.auth.getSession().then(({ data, error }) => {
    if (error) throw error;
    publish(data.session?.user || null);
    initialized = true;
    return currentUser;
  }).catch(error => {
    console.error("PyLearn could not restore the saved session:", error);
    initialized = true;
    return null;
  });

  client.auth.onAuthStateChange((_event, session) => publish(session?.user || null));

  window.PyLearnSession = Object.freeze({
    ready,
    getUser: async () => {
      await ready;
      return currentUser;
    },
    subscribe: listener => {
      if (typeof listener !== "function") return () => {};
      listeners.add(listener);
      if (initialized) listener(currentUser);
      return () => listeners.delete(listener);
    },
    getLearningPath: async () => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) return null;
      const { data, error } = await client.from("lesson_progress")
        .select("lesson_id,completed,quiz_best_score,challenge_completed")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []).map(row => ({
        lessonId: Number(row.lesson_id),
        completed: !!row.completed,
        quizMastered: Number(row.quiz_best_score || 0) >= 100,
        challengeCompleted: !!row.challenge_completed
      })).filter(row => Number.isInteger(row.lessonId) && row.lessonId >= 0 && row.lessonId < 14);
    },
    getLearningSummary: async () => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) return null;
      const [progressResult, statsResult] = await Promise.all([
        client.from("lesson_progress")
          .select("lesson_id,completed,quiz_best_score,challenge_completed")
          .eq("user_id", user.id),
        client.from("user_stats")
          .select("xp,streak,last_active_date")
          .eq("user_id", user.id)
          .maybeSingle()
      ]);
      if (progressResult.error) throw progressResult.error;
      if (statsResult.error) throw statsResult.error;
      const rows = progressResult.data || [];
      return {
        lessonsCompleted: rows.filter(row => row.completed).length,
        quizzesMastered: rows.filter(row => Number(row.quiz_best_score || 0) >= 100).length,
        challengesCompleted: rows.filter(row => row.challenge_completed).length,
        xp: Number(statsResult.data?.xp || 0),
        streak: Number(statsResult.data?.streak || 0)
      };
    },

    getLessonTools: async lessonId => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) return null;
      const id = String(lessonId);
      const [noteResult, bookmarkResult, progressResult] = await Promise.all([
        client.from("user_notes").select("content,deleted_at,updated_at").eq("user_id", user.id).eq("lesson_id", id).maybeSingle(),
        client.from("user_bookmarks").select("deleted_at").eq("user_id", user.id).eq("lesson_id", id).maybeSingle(),
        client.from("lesson_progress").select("completed,quiz_best_score,challenge_completed").eq("user_id", user.id).eq("lesson_id", id).maybeSingle()
      ]);
      for (const result of [noteResult, bookmarkResult, progressResult]) if (result.error) throw result.error;
      return {
        note: noteResult.data && !noteResult.data.deleted_at ? noteResult.data.content || "" : "",
        bookmarked: !!bookmarkResult.data && !bookmarkResult.data.deleted_at,
        completed: !!progressResult.data?.completed,
        quizMastered: Number(progressResult.data?.quiz_best_score || 0) >= 100,
        challengeCompleted: !!progressResult.data?.challenge_completed
      };
    },
    saveLessonNote: async (lessonId, content) => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to save lesson notes.");
      const now = new Date().toISOString();
      const value = String(content || "");
      const { error } = await client.from("user_notes").upsert({
        user_id: user.id, lesson_id: String(lessonId), content: value,
        updated_at: now, deleted_at: value.trim() ? null : now
      }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
      return { saved: !!value.trim() };
    },
    setLessonBookmark: async (lessonId, bookmarked) => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to save bookmarks.");
      const { error } = await client.from("user_bookmarks").upsert({
        user_id: user.id, lesson_id: String(lessonId),
        deleted_at: bookmarked ? null : new Date().toISOString()
      }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
      return !!bookmarked;
    },
    recordQuizMastery: async lessonId => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to save quiz mastery.");
      const id = String(lessonId);
      const { data: existing, error: readError } = await client.from("lesson_progress")
        .select("completed,quiz_best_score,challenge_completed")
        .eq("user_id", user.id).eq("lesson_id", id).maybeSingle();
      if (readError) throw readError;
      const { error } = await client.from("lesson_progress").upsert({
        user_id: user.id, lesson_id: id, completed: !!existing?.completed,
        quiz_best_score: Math.max(100, Number(existing?.quiz_best_score || 0)),
        challenge_completed: !!existing?.challenge_completed
      }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
      const reward = await client.functions.invoke("award-learning-reward", {
        body: { lesson_id: id, event_type: "quiz" }
      });
      if (reward.error) throw reward.error;
      return true;
    },
    completeLesson: async lessonId => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to save lesson completion.");
      const id = String(lessonId);
      const { data: existing, error: readError } = await client.from("lesson_progress")
        .select("completed,quiz_best_score,challenge_completed")
        .eq("user_id", user.id).eq("lesson_id", id).maybeSingle();
      if (readError) throw readError;
      if (Number(existing?.quiz_best_score || 0) < 100) throw new Error("Complete the quick check correctly before marking this lesson complete.");
      const { error } = await client.from("lesson_progress").upsert({
        user_id: user.id, lesson_id: id, completed: true,
        quiz_best_score: Number(existing.quiz_best_score),
        challenge_completed: !!existing?.challenge_completed
      }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
      const reward = await client.functions.invoke("award-learning-reward", {
        body: { lesson_id: id, event_type: "lesson" }
      });
      if (reward.error) throw reward.error;
      return true;
    },
    recordChallengeCompletion: async lessonId => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to save challenge completion.");
      const id = String(lessonId);
      const { data: existing, error: readError } = await client.from("lesson_progress")
        .select("completed,quiz_best_score,challenge_completed")
        .eq("user_id", user.id).eq("lesson_id", id).maybeSingle();
      if (readError) throw readError;
      if (existing?.challenge_completed) return { alreadyCompleted: true };
      const { error } = await client.from("lesson_progress").upsert({
        user_id: user.id, lesson_id: id, completed: !!existing?.completed,
        quiz_best_score: Number(existing?.quiz_best_score || 0),
        challenge_completed: true
      }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
      const reward = await client.functions.invoke("award-learning-reward", {
        body: { lesson_id: id, event_type: "challenge" }
      });
      if (reward.error) throw reward.error;
      return { alreadyCompleted: false };
    },
    signOut: async () => {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    }
  });
})();
