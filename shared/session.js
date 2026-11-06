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
    getLessonReview: async lessonId => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) return null;
      const { data, error } = await client.from("lesson_reviews")
        .select("rating,interval_days,reviewed_at,next_review_at")
        .eq("user_id", user.id).eq("lesson_id", String(lessonId))
        .order("reviewed_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      return data || null;
    },
    recordLessonReview: async (lessonId, rating) => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to save your revision schedule.");
      const value = Number(rating);
      if (![1, 2, 3, 4].includes(value)) throw new Error("Choose a review rating from 1 to 4.");
      const previous = await window.PyLearnSession.getLessonReview(lessonId);
      const firstIntervals = { 1: 1, 2: 2, 3: 4, 4: 7 };
      const multipliers = { 1: 1, 2: 1.5, 3: 2, 4: 2.5 };
      const interval = !previous?.interval_days || value === 1
        ? firstIntervals[value]
        : Math.min(60, Math.max(firstIntervals[value], Math.round(Number(previous.interval_days) * multipliers[value])));
      const reviewedAt = new Date();
      const nextReview = new Date(reviewedAt);
      nextReview.setDate(nextReview.getDate() + interval);
      const id = globalThis.crypto?.randomUUID?.();
      const row = {
        ...(id ? { id } : {}),
        user_id: user.id, lesson_id: String(lessonId), rating: value,
        interval_days: interval, reviewed_at: reviewedAt.toISOString(),
        next_review_at: nextReview.toISOString(), created_at: reviewedAt.toISOString()
      };
      const { error } = await client.from("lesson_reviews").insert(row);
      if (error) throw error;
      return row;
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
      return { alreadyCompleted: !!existing?.challenge_completed };
    },
    signIn: async (email, password) => {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    signUp: async (email, password) => {
      const { data, error } = await client.auth.signUp({
        email, password,
        options: { emailRedirectTo: config.authHomeUrl() + "welcome/" }
      });
      if (error) throw error;
      return data;
    },
    signInWithProvider: async provider => {
      const { data, error } = await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: config.authHomeUrl() + "dashboard/" }
      });
      if (error) throw error;
      return data;
    },
    resetPassword: async email => {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: config.authHomeUrl() + "welcome/"
      });
      if (error) throw error;
      return true;
    },
    getProfile: async () => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) return null;
      const { data, error } = await client.from("profiles")
        .select("display_name,avatar_url").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    getIdentities: async () => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) return [];
      const { data, error } = await client.auth.getUserIdentities();
      if (error) throw error;
      return data?.identities || [];
    },
    getPersonalDataCounts: async () => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) return { notes: 0, bookmarks: 0 };
      const [notes, bookmarks] = await Promise.all([
        client.from("user_notes").select("lesson_id", { count: "exact", head: true })
          .eq("user_id", user.id).is("deleted_at", null),
        client.from("user_bookmarks").select("lesson_id", { count: "exact", head: true })
          .eq("user_id", user.id).is("deleted_at", null)
      ]);
      if (notes.error) throw notes.error;
      if (bookmarks.error) throw bookmarks.error;
      return { notes: Number(notes.count || 0), bookmarks: Number(bookmarks.count || 0) };
    },
    updateProfile: async profile => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to update your profile.");
      const values = typeof profile === "string" ? { displayName: profile } : (profile || {});
      const displayName = String(values.displayName || "").trim().slice(0, 60);
      const avatarUrl = String(values.avatarUrl || "").trim();
      if (avatarUrl && !/^https:\/\//i.test(avatarUrl)) {
        throw new Error("Profile image links must start with https://.");
      }
      const { error } = await client.from("profiles").upsert({
        id: user.id, display_name: displayName, avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });
      if (error) throw error;
      return true;
    },
    updateEmail: async email => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to change your email address.");
      const nextEmail = String(email || "").trim();
      if (!nextEmail) throw new Error("Enter a new email address.");
      const { data, error } = await client.auth.updateUser({ email: nextEmail });
      if (error) throw error;
      return data?.user || true;
    },
    updatePassword: async password => {
      const user = await window.PyLearnSession.getUser();
      if (!user?.id) throw new Error("Sign in to change your password.");
      if (String(password || "").length < 8) throw new Error("Use at least 8 characters for your new password.");
      const { data, error } = await client.auth.updateUser({ password: String(password) });
      if (error) throw error;
      return data?.user || true;
    },
    signOut: async () => {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw error;
    },
    signOutAllDevices: async () => {
      const { error } = await client.auth.signOut({ scope: "global" });
      if (error) throw error;
    }
  });
})();
