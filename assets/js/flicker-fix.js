(function () {
  /* 0) disable transitions immediately */
  document.documentElement.classList.add('no-transition');
  document.documentElement.style.visibility = 'hidden';

  /* 1) decide theme */
  const isDark = (localStorage.getItem('theme') || 'dark') === 'dark';

  /* 2) apply to <html> */
  document.documentElement.classList.toggle('dark-mode', isDark);

  /* 3) wait until <body> exists, then apply there too  */
  window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.toggle('dark-mode', isDark);
  /* keep your toggle switch in sync */
  const chk = document.getElementById('toggle-dark-mode');
  if (chk) chk.checked = isDark;

  /* 4) re-enable transitions AFTER first paint */
  requestAnimationFrame(() => {           // 1 frame later
    document.documentElement.classList.remove('no-transition');
  });
  });

  /* 5) reveal page */
  document.documentElement.style.visibility = 'visible';
})();