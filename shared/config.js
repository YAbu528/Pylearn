/* Shared path and URL configuration for every PyLearn page. */
(() => {
  const scriptUrl = document.currentScript ? document.currentScript.src : "";
  const basePath = scriptUrl
    ? new URL("../", scriptUrl).pathname
    : (location.pathname.startsWith("/Pylearn/") ? "/Pylearn/" : "/");

  const cleanPath = value => String(value || "").replace(/^\/+|\/+$/g, "");
  window.PyLearnConfig = Object.freeze({
    basePath,
    url(path = "") {
      const clean = cleanPath(path);
      return basePath + (clean ? clean + "/" : "");
    },
    asset(path) {
      return basePath + cleanPath(path);
    },
    homeUrl() {
      return location.origin + basePath;
    },
    authHomeUrl() {
      return "https://pylearn-git-architecture-multipage-foundation-yabu528s-projects.vercel.app/";
    }
  });
})();
