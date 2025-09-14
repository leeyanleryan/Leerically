function toggleMenu() {
  const menuButton = document.querySelector('.menu-btn');
  const primaryNav = document.querySelector('.primary-nav');
  menuButton.classList.toggle('open');
  primaryNav.classList.toggle('open');
}