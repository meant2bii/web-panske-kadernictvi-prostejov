const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navigation.addEventListener('click', (event) => {
  if (event.target.matches('a')) { header.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded', 'false'); }
});

const notices = document.querySelector('[data-notices]');
const formatDate = (value) => new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric.', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
fetch('data/provozni-zmeny.json')
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((items) => {
    const current = new Date(); current.setHours(0, 0, 0, 0);
    const active = items.filter((item) => !item.until || new Date(`${item.until}T23:59:59`) >= current);
    notices.innerHTML = active.length ? active.map((item) => `<article class="notice notice--${item.type || 'info'}"><time datetime="${item.date}">${formatDate(item.date)}</time><p>${item.text}</p></article>`).join('') : '<p class="loading">Dnes platí běžná otevírací doba.</p>';
  })
  .catch(() => { notices.innerHTML = '<p class="loading">Dnes platí běžná otevírací doba.</p>'; });

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('[data-year]').textContent = new Date().getFullYear();
