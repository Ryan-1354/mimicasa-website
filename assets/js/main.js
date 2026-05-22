/* ══════════════════════════════════════════════
   NAVBAR — Smart Scroll
══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

function updateNavbar() {
  const currentScrollY = window.scrollY;

  if (currentScrollY === 0) {
    navbar.className = 'navbar navbar--transparent navbar--visible';
  } else if (currentScrollY < lastScrollY) {
    navbar.className = 'navbar navbar--dark navbar--visible';
  } else {
    navbar.className = 'navbar navbar--dark navbar--hidden';
  }

  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ══════════════════════════════════════════════
   HAMBURGER / DRAWER
══════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('drawer');
const drawerCloseBtn = document.getElementById('drawerClose');

function openDrawer() {
  drawer.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
}

if (drawerCloseBtn) {
  drawerCloseBtn.addEventListener('click', closeDrawer);
}

drawer.querySelectorAll('.drawer__link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

/* ══════════════════════════════════════════════
   CAMPUS MAP TAB
══════════════════════════════════════════════ */
const MAPS = {
  mimi: 'https://maps.google.com/maps?q=114%E8%87%BA%E5%8C%97%E5%B8%82%E5%85%A7%E6%B9%96%E5%8D%80%E6%96%87%E5%BE%B366%E5%B7%B669%E5%BC%8F30%E8%99%9F&output=embed&hl=zh-TW',
  casa: 'https://maps.google.com/maps?q=%E8%87%BA%E5%8C%97%E5%B8%82%E5%85%A7%E6%B9%96%E5%8D%80%E5%A4%A7%E6%B9%96%E8%A1%97158%E5%B7%B72-3%E8%99%9F&output=embed&hl=zh-TW'
};

function switchCampus(campus) {
  const iframe = document.getElementById('map-iframe');
  if (iframe) iframe.src = MAPS[campus] || '';

  document.querySelectorAll('.campus-info').forEach(el => {
    el.classList.toggle('campus-info--active', el.dataset.campus === campus);
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('tab--active', tab.dataset.campus === campus);
  });
}

window.switchCampus = switchCampus;

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});
