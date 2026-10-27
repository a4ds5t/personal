(function () {
  var KEY = "armand-theme";
  var html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute("data-theme", theme === "c2" ? "c2" : "night");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var next = html.getAttribute("data-theme") === "c2" ? "night" : "c2";
      setTheme(next);
      try {
        localStorage.setItem(KEY, next);
      } catch (_e) {
        /* ignore */
      }
    });
  });
})();
