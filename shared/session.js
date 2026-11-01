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
    signOut: async () => {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    }
  });
})();
