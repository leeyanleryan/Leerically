// keep scrolled position
document.addEventListener('DOMContentLoaded', () => {
  ['left-sidebar', 'right-sidebar'].forEach(sidebarId => {
    const sidebar = document.getElementById(sidebarId);
    if (!sidebar) return;

    // key in localStorage
    const storageKey = `sidebarScroll:${sidebarId}`;

    // 1) restore scroll position (if we have one)
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      sidebar.scrollTop = parseInt(saved, 10);
    }

    // 2) save on scroll
    sidebar.addEventListener('scroll', () => {
      localStorage.setItem(storageKey, sidebar.scrollTop);
    });
  });
});