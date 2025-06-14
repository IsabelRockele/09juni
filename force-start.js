const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

if (isStandalone && !window.location.pathname.endsWith("start.html")) {
  window.location.href = "start.html";
}
