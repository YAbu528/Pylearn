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
    signOut: async () => {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    }
  });
})();
