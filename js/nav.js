const navToggle = document.getElementById('menu-btn');
const navList = document.getElementById('secondary-nav');

const navOpen = document.getElementById('nav-open');
const navClose = document.getElementById('nav-close');

navToggle.onclick = () => {
    navList.classList.toggle("nav-display");
    navOpen.classList.toggle("nav-open-toggle");
    navClose.classList.toggle("nav-close-toggle");
}