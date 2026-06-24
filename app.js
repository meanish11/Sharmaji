/* =====================================================
   app.js — Sharma Ji Thekua
   ===================================================== */

// -------------------------
// Pack data
// -------------------------
const packs = {
  '250gm': {
    weight:    '250 gm',
    title:     '250 gm Swadisht Maida Thekua',
    desc:      'A handy pouch ideal for tea-time and gifting. About 12–14 pieces of pure nostalgia. Made in small batches with desi ghee and no artificial preservatives.',
    price:     '₹ 149',
    pieces:    '12–14 pieces',
    serves:    '4–6',
    waText:    'Namaste!%20I\'d%20like%20to%20order%20the%20250gm%20Maida%20Thekua%20pack%20(%E2%82%B9149).%20Please%20share%20delivery%20details.',
    featured:  false,
  },
  '500gm': {
    weight:    '500 gm',
    title:     '500 gm Swadisht Maida Thekua',
    desc:      'The family favourite — roughly 26–28 pieces of hand-pressed thekua sealed for freshness. Best value for sharing or stocking up the snack shelf.',
    price:     '₹ 249',
    pieces:    '26–28 pieces',
    serves:    '10–12',
    waText:    'Namaste!%20I\'d%20like%20to%20order%20the%20500gm%20Maida%20Thekua%20pack%20(%E2%82%B9249).%20Please%20share%20delivery%20details.',
    featured:  true,
  },
};

// -------------------------
// Page switching (SPA-style)
// -------------------------
function showHome() {
  document.getElementById('page-home').style.display = '';
  document.getElementById('page-pack').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPack(packId) {
  const pack = packs[packId];
  if (!pack) return;

  // Populate dynamic content
  document.getElementById('pack-breadcrumb-trail').textContent = `Home / Packs / ${pack.weight}`;
  document.getElementById('pack-weight-label').textContent    = `${pack.weight} Pouch`;
  document.getElementById('pack-title').textContent           = pack.title;
  document.getElementById('pack-desc').textContent            = pack.desc;
  document.getElementById('pack-price').textContent           = pack.price;
  document.getElementById('spec-weight').textContent          = pack.weight;
  document.getElementById('spec-pieces').textContent          = pack.pieces;
  document.getElementById('spec-serves').textContent          = pack.serves;
  document.getElementById('spec-price').textContent           = pack.price;
  document.getElementById('pack-wa-btn').href = `https://wa.me/918777790916?text=${pack.waText}`;

  const badge = document.getElementById('pack-most-loved');
  badge.style.display = pack.featured ? 'inline-block' : 'none';

  document.getElementById('page-home').style.display = 'none';
  document.getElementById('page-pack').style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// -------------------------
// Navbar — scroll shadow
// -------------------------
window.addEventListener('scroll', function () {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// -------------------------
// Mobile hamburger menu
// -------------------------
function toggleMobileMenu() {
  const links = document.getElementById('nav-links');
  const ham   = document.getElementById('hamburger');
  links.classList.toggle('open');
  ham.classList.toggle('open');
}

// Close mobile menu on nav link click
document.getElementById('nav-links').addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    document.getElementById('nav-links').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }
});

// -------------------------
// Smooth-scroll for anchor links
// -------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
