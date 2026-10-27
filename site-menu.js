// Phones: the header's links give way to one "Menu" button, right, in its own cell; it opens the site's pages in
// a panel from the right: Home, Work with the four case studies (a light thumbnail of each one's main screen,
// title and description), Contact. The page you're on is lit. Every page loads this; desktop keeps its links.
(() => {
  const head = document.querySelector('.site-head'); if (!head) return;
  const base = new URL('.', document.currentScript.src).href; // the site's root: this script sits there
  const onHome = !!document.querySelector('.snaps');
  const path = location.pathname;
  const cases = [
    { slug: 'global-incentive-fee-awards', img: 'GIFAcasestudyimages/GIFAherocenter.webp', title: 'Saved millions of dollars in taxes',
      desc: 'By improving stakeholder visibility and coordination across a complex, multi&#8209;stakeholder process.' },
    { slug: 'fee-management', img: 'Feemanagementcasestudyimages/Heroleft.webp', title: 'Cut fee management effort by 40 minutes',
      desc: 'By reducing the fee templates a single classroom needed from an average of 9&nbsp;to&nbsp;1.' },
    { slug: 'creating-automation', img: 'Creatingautomationcasestudyimages/Group%201321317990.webp', title: 'Reduced support calls',
      desc: 'By making it easy to create a new automation.' },
    { slug: null, img: 'Stampcasestudyimages/Hero%20Image%20Left.webp', title: 'Reduced the compliance review effort with AI',
      desc: 'By designing an AI feature that does the review work and suggests a final action.' },
  ];
  const href = { home: onHome ? '#home' : base, work: onHome ? '#work' : base + '#work', contact: onHome ? '#contact' : base + '#contact' };

  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'mm-btn'; btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'mm-panel');
  btn.innerHTML = '<span class="mm-burger" aria-hidden="true"></span>Menu';
  head.append(btn);

  const shade = document.createElement('div'); shade.className = 'mm-shade';
  const panel = document.createElement('div');
  panel.className = 'mm-panel'; panel.id = 'mm-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Menu');
  const row = c => {
    const inner = `<span class="mm-thumb"><img src="${base + c.img}" alt="" loading="lazy" decoding="async"></span>` +
      `<span class="mm-text"><span class="mm-title">${c.title}</span><span class="mm-desc">${c.desc}</span></span>`;
    return c.slug ? `<a class="mm-case" href="${base}case-studies/${c.slug}/" data-slug="${c.slug}">${inner}</a>`
      : `<div class="mm-case soon">${inner}<span class="mm-soon">Soon</span></div>`;
  };
  panel.innerHTML = '<div class="mm-top"><button type="button" class="mm-close"><span class="mm-x" aria-hidden="true"></span>Close</button></div>' +
    '<nav class="mm-nav" aria-label="Main">' +
    `<a class="mm-link" data-k="home" href="${href.home}">Home</a>` +
    `<a class="mm-link" data-k="work" href="${href.work}">Work</a>` +
    `<div class="mm-cases">${cases.map(row).join('')}</div>` +
    `<a class="mm-link" data-k="contact" href="${href.contact}">Contact</a></nav>`;
  document.body.append(shade, panel);

  const root = document.documentElement, close = panel.querySelector('.mm-close');
  const links = [...panel.querySelectorAll('.mm-link')], rows = [...panel.querySelectorAll('a.mm-case')];
  const focusables = () => [close, ...panel.querySelectorAll('nav a')];

  // the page you're on: a case study by its address; on the home page, the section in view; else Contact or Home
  const mark = () => {
    let k = 'home', slug = null;
    const cs = cases.find(c => c.slug && path.includes('/case-studies/' + c.slug));
    if (cs) { k = 'work'; slug = cs.slug; }
    else if (/\/contact\/?$/.test(path)) k = 'contact';
    else if (onHome) {
      const cur = document.querySelector('.snap.is-current') || document.querySelector('.snap');
      k = cur.id === 'home' ? 'home' : cur.id === 'contact' ? 'contact' : 'work';
      if (k === 'work') slug = cur.id === 'gifa' ? 'global-incentive-fee-awards' : cur.id;
    }
    links.forEach(a => a.setAttribute('aria-current', a.dataset.k === k));
    rows.forEach(a => a.setAttribute('aria-current', a.dataset.slug === slug));
  };
  const open = () => {
    mark(); root.classList.add('mm-open'); btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => close.focus({ preventScroll: true }));
  };
  const shut = (back = true) => {
    root.classList.remove('mm-open'); btn.setAttribute('aria-expanded', 'false');
    if (back) btn.focus({ preventScroll: true });
  };
  // the thumbnails start loading at the first touch of Menu, so they're there when the panel slides in
  const warm = () => panel.querySelectorAll('.mm-thumb img').forEach(i => { i.loading = 'eager'; });
  ['pointerdown', 'focus'].forEach(t => btn.addEventListener(t, warm, { once: true }));
  btn.addEventListener('click', open);
  close.addEventListener('click', () => shut());
  shade.addEventListener('click', () => shut());
  // on the home page, Home, Work and Contact scroll to their sections
  if (onHome) links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); shut(false);
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  }));
  // Escape closes; Tab stays inside the open panel
  addEventListener('keydown', e => {
    if (!root.classList.contains('mm-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); shut(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // leaving phone width with the panel open: close it
  matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches) shut(false); });
})();
