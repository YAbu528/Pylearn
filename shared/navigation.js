/* Shared navigation shell for the gradual multi-page migration. */
(() => {
  const config = window.PyLearnConfig;
  if (!config || document.querySelector("[data-pylearn-shell]")) return;

  const current = document.body.dataset.page || "home";
  const home = config.url();
  const items = [
    {id:"home",label:"Home",icon:"⌂",href:home},
    {id:"discover",label:"Discover",icon:"✦",href:config.url("discover")},
    {id:"learn",label:"Learn",icon:"▤",href:home+"#learn"},
    {id:"code",label:"Code",icon:"⌘",href:home+"#playground"},
    {id:"projects",label:"Projects",icon:"◇",href:home+"#projects"}
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
  const theme = document.createElement("button");
  theme.className = "pl-theme-toggle";
  theme.type = "button";
  theme.setAttribute("aria-label","Toggle colour theme");
  const applyTheme = value => {
    document.body.classList.toggle("light",value === "light");
    theme.textContent = value === "light" ? "☾" : "☀";
    logo.src = config.asset(value === "light" ? "assets/pylearn-logo-light.png" : "assets/pylearn-logo-dark.png");
  };
  let savedTheme = "dark";
  try { savedTheme = localStorage.getItem("pylearn_theme") || "dark"; } catch {}
  applyTheme(savedTheme);
  theme.addEventListener("click",() => {
    const next = document.body.classList.contains("light") ? "dark" : "light";
    try { localStorage.setItem("pylearn_theme",next); } catch {}
    applyTheme(next);
  });
  actions.append(theme);
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
})();
