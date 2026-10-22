const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

// Native links remain usable with scripts disabled; these controls add navigation and exploration.
const menuButton = $('[data-menu-toggle]');
const navigation = $('#main-navigation');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
$$('nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
matchMedia('(min-width: 1201px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const mega = $('[data-mega-toggle]');
const megaPanel = $('#solutions-menu');
function closeMega() { mega?.setAttribute('aria-expanded', 'false'); megaPanel?.classList.remove('is-open'); }
mega?.addEventListener('click', () => {
  const expanded = mega.getAttribute('aria-expanded') !== 'true';
  mega.setAttribute('aria-expanded', String(expanded));
  megaPanel.classList.toggle('is-open', expanded);
});
document.addEventListener('click', event => { if (!event.target.closest('.nav-mega')) closeMega(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && mega?.getAttribute('aria-expanded') === 'true') { closeMega(); mega.focus(); } });

const reveal = $$('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  reveal.forEach(element => { element.classList.add('will-reveal'); observer.observe(element); });
}

const filters = $$('[data-filter]');
const search = $('#solution-search');
let activeCategory = 'all';
function syncCategoryAddress() {
  const url = new URL(location.href);
  if (activeCategory === 'all') url.searchParams.delete('categoria');
  else url.searchParams.set('categoria', activeCategory);
  history.replaceState(null, '', url);
}
function filterProducts() {
  const term = (search?.value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  let visible = 0;
  $$('[data-product]').forEach(card => {
    const searchable = card.dataset.search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const show = (activeCategory === 'all' || card.dataset.category === activeCategory) && (!term || searchable.includes(term));
    card.hidden = !show;
    if (show) visible++;
  });
  const count = $('#result-count');
  if (count) count.textContent = `${visible} ${visible === 1 ? 'proyecto' : 'proyectos'}`;
  const empty = $('#empty-results');
  if (empty) empty.hidden = visible > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.filter;
  filters.forEach(other => { other.classList.toggle('is-active', other === button); other.setAttribute('aria-pressed', String(other === button)); });
  filterProducts();
  syncCategoryAddress();
}));
search?.addEventListener('input', filterProducts);
const initialCategory = new URLSearchParams(location.search).get('categoria');
if (initialCategory && filters.some(button => button.dataset.filter === initialCategory)) {
  activeCategory = initialCategory;
  filters.forEach(button => { const selected = button.dataset.filter === initialCategory; button.classList.toggle('is-active', selected); button.setAttribute('aria-pressed', String(selected)); });
  filterProducts();
}
$('[data-reset-search]')?.addEventListener('click', () => {
  search.value = ''; activeCategory = 'all';
  filters.forEach(button => { const selected = button.dataset.filter === 'all'; button.classList.toggle('is-active', selected); button.setAttribute('aria-pressed', String(selected)); });
  filterProducts(); search.focus();
  syncCategoryAddress();
});

const tabs = $$('[data-showcase-tab]');
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    tabs.forEach(other => { const selected = other === tab; other.classList.toggle('is-active', selected); other.setAttribute('aria-selected', String(selected)); other.tabIndex = selected ? 0 : -1; });
    $$('[data-showcase-panel]').forEach(panel => { panel.hidden = panel.dataset.showcasePanel !== tab.dataset.showcaseTab; });
  });
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].click(); tabs[next].focus();
  });
});

const galleryDialog = $('#image-dialog');
let previousFocus;
$$('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  if (!galleryDialog) return;
  previousFocus = button;
  const source = $('img', button);
  $('#dialog-image').src = source.dataset.fullSrc || source.currentSrc || source.src;
  $('#dialog-image').alt = source.alt;
  $('#dialog-caption').textContent = button.dataset.caption || source.alt;
  galleryDialog.showModal();
}));
$('[data-close-dialog]')?.addEventListener('click', () => galleryDialog.close());
galleryDialog?.addEventListener('click', event => { if (event.target === galleryDialog) galleryDialog.close(); });
galleryDialog?.addEventListener('close', () => previousFocus?.focus());

// Contact address is deliberately reserved until the company supplies its final channel.
const contactForm = $('#contact-form');
contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const message = `Consulta para Neuratale\n\nNombre: ${data.get('name')}\nOrganización: ${data.get('organization') || 'No indicada'}\nCorreo: ${data.get('email')}\nInterés: ${data.get('interest')}\n\n${data.get('message')}\n`;
  $('#prepared-message').value = message;
  const emailLink = $('[data-email-message]');
  const recipient = contactForm.dataset.contactEmail;
  if (emailLink && recipient && !recipient.endsWith('.example')) {
    emailLink.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(`Consulta Neuratale · ${data.get('interest')}`)}&body=${encodeURIComponent(message)}`;
  }
  const output = $('#contact-output'); output.hidden = false;
  output.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'center'});
  $('#contact-result-title').focus();
});
$('[data-copy-message]')?.addEventListener('click', async event => {
  const button = event.currentTarget;
  const field = $('#prepared-message');
  try { await navigator.clipboard.writeText(field.value); button.textContent = 'Mensaje copiado'; }
  catch { field.select(); $('#copy-status').textContent = 'Seleccionamos el texto para que puedas copiarlo.'; }
});
$('[data-download-message]')?.addEventListener('click', () => {
  const blob = new Blob([$('#prepared-message').value], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = 'consulta-neuratale.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const requestedInterest = new URLSearchParams(location.search).get('interes');
if (requestedInterest && $('#interest')) {
  const option = [...$('#interest').options].find(item => item.value === requestedInterest);
  if (option) $('#interest').value = requestedInterest;
}
