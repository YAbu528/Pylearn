/* Shared navigation shell for the gradual multi-page migration. */
(() => {
  const config = window.PyLearnConfig;
  if (!config || document.querySelector("[data-pylearn-shell]")) return;

  const current = document.body.dataset.page || "home";
  const home = config.url();
  const items = [
    {id:"home",label:"Home",icon:"⌂",href:home},
    {id:"discover",label:"Discover",icon:"✦",href:config.url("discover")},
    {id:"dashboard",label:"Dashboard",icon:"▦",href:config.url("dashboard")},
    {id:"learn",label:"Learn",icon:"▤",href:config.url("learn")},
    {id:"code",label:"Code",icon:"⌘",href:config.url("playground")},
    {id:"projects",label:"Projects",icon:"◇",href:config.url("projects")},
    {id:"profile",label:"Profile",icon:"●",href:config.url("profile")}
  ];

  const shell = document.createElement("div");
  shell.dataset.pylearnShell = "true";
  shell.className = "pl-shell";
  const header = document.createElement("header");
  header.className = "pl-header";
  const brand = document.createElement("a");
  brand.className = "pl-brand";
  brand.href = home;
  const logo = document.createElement("img");
  logo.src = config.asset("assets/pylearn-logo-dark.png");
  logo.alt = "PyLearn";
  brand.append(logo);
  const nav = document.createElement("nav");
  nav.className = "pl-desktop-nav";
  nav.setAttribute("aria-label","Main navigation");
  const makeLink = item => {
    const a = document.createElement("a");
    a.href = item.href;
    a.className = "pl-nav-link" + (current === item.id ? " is-active" : "");
    if (current === item.id) a.setAttribute("aria-current","page");
    a.textContent = item.label;
    return a;
  };
  items.forEach(item => nav.append(makeLink(item)));
  const actions = document.createElement("div");
  actions.className = "pl-header-actions";
  const account = document.createElement("span");
  account.className = "pl-account-status";
  account.textContent = "Checking account…";
  account.setAttribute("aria-live", "polite");
  const theme = document.createElement("button");
  theme.className = "pl-theme-toggle";
  theme.type = "button";
  theme.setAttribute("aria-label","Toggle colour theme");
  const applyTheme = value => {
    document.body.classList.toggle("light",value === "light");
    theme.textContent = value === "light" ? "☾" : "☀";
    logo.src = config.asset(value === "light" ? "assets/pylearn-logo-dark.png" : "assets/pylearn-logo-light.png");
    const footerLogo = document.querySelector(".pl-footer-brand img");
    if (footerLogo) footerLogo.src = logo.src;
  };
  let savedTheme = "dark";
  try { savedTheme = localStorage.getItem("pylearn_prod_theme") || "dark"; } catch {}
  applyTheme(savedTheme);
  theme.addEventListener("click",() => {
    const next = document.body.classList.contains("light") ? "dark" : "light";
    try { localStorage.setItem("pylearn_prod_theme",next); } catch {}
    applyTheme(next);
  });
  actions.append(account, theme);
  header.append(brand,nav,actions);
  shell.append(header);

  const mobile = document.createElement("nav");
  mobile.className = "pl-mobile-nav";
  mobile.setAttribute("aria-label","Mobile navigation");
  items.forEach(item => {
    const a = document.createElement("a");
    a.href = item.href;
    a.className = "pl-mobile-link" + (current === item.id ? " is-active" : "");
    if (current === item.id) a.setAttribute("aria-current","page");
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden","true");
    icon.textContent = item.icon;
    const label = document.createElement("small");
    label.textContent = item.label;
    a.append(icon,label);
    mobile.append(a);
  });
  shell.append(mobile);
  document.body.prepend(shell);

  if (!document.querySelector("[data-pylearn-footer]")) {
    const footer = document.createElement("footer");
    footer.className = "pl-footer";
    footer.dataset.pylearnFooter = "true";
    const inner = document.createElement("div");
    inner.className = "pl-footer-inner";
    const footerBrand = document.createElement("a");
    footerBrand.className = "pl-footer-brand";
    footerBrand.href = home;
    const footerLogo = document.createElement("img");
    footerLogo.src = config.asset("assets/pylearn-logo-dark.png");
    footerLogo.alt = "PyLearn";
    const tagline = document.createElement("p");
    tagline.textContent = "Understand Python. Practise with purpose. Build something real.";
    footerBrand.append(footerLogo, tagline);
    const footerLinks = document.createElement("nav");
    footerLinks.className = "pl-footer-links";
    footerLinks.setAttribute("aria-label", "Footer navigation");
    [
      {label:"Discover",href:config.url("discover")},
      {label:"Learning path",href:config.url("learn")},
      {label:"Playground",href:config.url("playground")},
      {label:"Projects",href:config.url("projects")},
      {label:"Profile",href:config.url("profile")}
    ].forEach(item => {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      footerLinks.append(link);
    });
    inner.append(footerBrand, footerLinks);
    footer.append(inner);
    document.body.append(footer);
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(config.url("service-worker.js"), { scope: config.basePath }).catch(error => console.warn("PyLearn offline cache could not be registered:", error));
  }

  if (window.PyLearnSession) {
    window.PyLearnSession.ready.then(() => window.PyLearnSession.subscribe(user => {
      account.textContent = user ? "Signed in" : "Guest";
      account.title = user?.email || "Browsing without an account";
    }));
  } else {
    account.textContent = "Guest";
  }
})();
