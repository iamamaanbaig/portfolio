// Home: one scroll per section on wide windows (as on the case studies); the header's Home, Work squares and
// Contact follow the section in view, and the case-study panel waiting below stays dark until it is current
(() => {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const stops = $$('.snap');
  const desktop = () => matchMedia('(min-width: 900px)').matches;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const head = () => document.querySelector('.site-head').offsetHeight;
  const top = i => Math.max(0, Math.min(stops[i].offsetTop - head(), document.documentElement.scrollHeight - innerHeight));

  let animating = false;
  const glide = to => {
    const from = scrollY;
    if (Math.abs(to - from) < 2) return;
    if (still) { scrollTo(0, to); return; }
    animating = true;
    let start = null;
    const T = 850;
    const step = now => {
      if (start === null) start = now;
      const k = Math.min(1, (now - start) / T);
      const e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
      scrollTo(0, from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step); else animating = false;
    };
    requestAnimationFrame(step);
  };
  const current = () => {
    let c = 0;
    stops.forEach((s, i) => { if (top(i) <= scrollY + 4) c = i; });
    return c;
  };
  const go = i => glide(top(Math.max(0, Math.min(stops.length - 1, i))));

  /* A wheel gesture, read as one step. A trackpad sends a stream of small events (the swipe, then its
     inertia, which can run on for seconds) that never goes quiet; a mouse sends one large event per notch.
     The deltas of a gesture add up until they reach a threshold, which moves one step; the rest of the
     gesture is ignored. Inertia only slows down and never turns round, so once it has started slowing, a
     clear rise above its slowest point, or a delta in the other direction, is the finger swiping again, even
     while the inertia is still running. Speeds are per millisecond, so events the browser merges or splits
     between frames don't read as a rise. */
  const wheelStep = (() => {
    let last = 0, prevSpeed = 0, acc = 0, fired = 0, firedAt = 0, low = 0, slowing = false, rearmed = false;
    return (e, busy) => {
      const now = performance.now();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1; // lines / pages to px
      const dx = e.deltaX * unit, dy = e.deltaY * unit;
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      const a = Math.abs(d);
      if (!a) return 0;
      const gap = now - last;
      last = now;
      if (gap > 160) { acc = 0; fired = 0; rearmed = false; prevSpeed = 0; }
      const speed = a / Math.min(50, Math.max(8, gap)); // px per ms
      const before = prevSpeed;
      prevSpeed = speed;
      if (fired) {
        if (!slowing) { if (speed < before * .95) { slowing = true; low = speed; } } // still the same swipe
        else low = Math.min(low, speed);
        const fresh = Math.sign(d) !== fired || (slowing && a >= 4 && speed > low * 1.5);
        if (busy || now - firedAt < 200 || !fresh) return 0;
        fired = 0; acc = 0; rearmed = true;
      } else if (rearmed && speed < before * .6) acc = 0; // slowing again: that was inertia, not a new swipe
      if (acc && Math.sign(d) !== Math.sign(acc)) acc = 0;
      acc += d;
      if (busy || Math.abs(acc) < 20) return 0;
      fired = Math.sign(d); firedAt = now; slowing = false; acc = 0; rearmed = false;
      return fired;
    };
  })();
  addEventListener('wheel', e => {
    if (!desktop() || e.ctrlKey) return;
    e.preventDefault();
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // sideways swipes don't move the page
    const dir = wheelStep(e, animating);
    if (dir) go(current() + dir);
  }, { passive: false });
  addEventListener('keydown', e => {
    if (!desktop() || e.target.closest('textarea, input')) return;
    const k = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (k) { e.preventDefault(); if (!animating) go(current() + (e.shiftKey && e.key === ' ' ? -1 : k)); }
    if (e.key === 'Home') { e.preventDefault(); go(0); }
    if (e.key === 'End') { e.preventDefault(); go(stops.length - 1); }
  });
  $$('[data-to]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const i = +a.dataset.to;
    if (desktop()) go(i); else stops[i].scrollIntoView({ behavior: still ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  }));

  // the header: Home, Work (and its square) or Contact, whichever section holds the middle of the view
  const nav = { home: $$('.site-nav > a')[0], work: $$('.nav-work > a')[0], contact: $$('.site-nav > a')[1] };
  const sqs = $$('.sq');
  const track = () => {
    let c = 0;
    stops.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) c = i; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) c = stops.length - 1;
    nav.home.setAttribute('aria-current', c === 0);
    nav.work.setAttribute('aria-current', c > 0 && c < stops.length - 1);
    nav.contact.setAttribute('aria-current', c === stops.length - 1);
    sqs.forEach((q, i) => q.setAttribute('aria-current', i + 1 === c));
    stops.forEach((s, i) => s.classList.toggle('is-current', i === c));
    document.documentElement.classList.toggle('at-hero', scrollY < 8); // the header stays clear over the hero
  };
  addEventListener('scroll', track, { passive: true }); track();
  // a resized window keeps the section it was on
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (desktop() && !animating) scrollTo(0, top(current())); }, 150); });

  // the cursor over a case study
  if (!matchMedia('(hover: hover)').matches) return;
  const cur = document.createElement('div');
  cur.className = 'cs-cursor'; cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<svg viewBox="0 0 16 16"><defs><linearGradient id="cur-grad" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#6BABFF"/><stop offset="1" stop-color="#0051FF"/></linearGradient></defs>' +
    '<path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="url(#cur-grad)" stroke-width="2" stroke-linecap="square"/></svg><span>View case study</span>';
  document.body.append(cur);
  const label = cur.querySelector('span');
  addEventListener('pointermove', e => { cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; }, { passive: true });
  $$('.s-work').forEach(s => {
    s.addEventListener('pointerenter', e => {
      cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; // no pointermove yet (page just loaded): not at the corner
      const soon = s.classList.contains('soon');
      cur.classList.toggle('soon', soon); label.textContent = soon ? 'Case study coming soon' : 'View case study';
      cur.classList.add('on');
    });
    s.addEventListener('pointerleave', () => cur.classList.remove('on'));
  });
  $$('.s-work .term').forEach(t => {
    t.addEventListener('pointerenter', () => cur.classList.remove('on'));
    t.addEventListener('pointerleave', () => cur.classList.add('on'));
  });
})();

// WORK's menu: opens while the pointer is on WORK, its squares or the menu; Esc, a scroll or leaving closes it
(() => {
  if (!matchMedia('(hover: hover)').matches) return;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement, head = document.querySelector('.site-head');
  const trigger = document.querySelector('.nav-work'), link = trigger.querySelector('a');
  const menu = document.getElementById('work-menu'), items = $$('.wm-item', menu), comps = $$('.wm-shot', menu), list = menu.querySelector('.wm-list'), pv = menu.querySelector('.wm-preview');
  const place = () => head.style.setProperty('--wm-x', (link.getBoundingClientRect().left - head.getBoundingClientRect().left - parseFloat(getComputedStyle(head).paddingLeft)) + 'px');
  let t;
  let quiet = false; // set while Esc hands focus back to WORK, so that focus doesn't reopen the menu
  let clicked = false; // set by a click on WORK or a square: the menu stays shut until the pointer leaves them
  const open = () => { if (quiet || clicked) return; leaving = false; clearTimeout(t); place(); root.classList.add('menu-open'); link.setAttribute('aria-expanded', 'true'); };
  let leaving = false;
  const close = () => { if (leaving) return; leaving = true; clearTimeout(t); t = setTimeout(() => shut(), 250); }; // grace: the preview may still be sliding open
  const show = i => {
    items.forEach((m, k) => m.classList.toggle('on', k === i));
    comps.forEach((c, k) => c.classList.toggle('on', k === i));
    if (i < 0) return;
    // centre the preview on the item, kept within the list
    const r = items[i].getBoundingClientRect(), l = list.getBoundingClientRect(), h = pv.offsetHeight;
    head.style.setProperty('--wm-top', Math.max(0, Math.min(r.top - l.top + r.height / 2 - h / 2, l.height - h)) + 'px');
    root.classList.add('previewing');
  };
  [trigger, menu].forEach(el => { el.addEventListener('pointerenter', open); el.addEventListener('pointerleave', close); });
  trigger.addEventListener('click', () => { shut(); clicked = true; });
  trigger.addEventListener('pointerleave', () => { clicked = false; });
  // a backstop for the leave events: the pointer anywhere but WORK, the list or the open preview starts the close;
  // coming back cancels it
  addEventListener('pointermove', e => {
    if (!root.classList.contains('menu-open') || e.pointerType !== 'mouse') return;
    const inside = trigger.contains(e.target) || menu.contains(e.target);
    if (inside) { if (leaving) open(); } else close();
  }, { passive: true });
  link.addEventListener('focus', open);
  link.addEventListener('blur', e => { clicked = false; if (!menu.contains(e.relatedTarget)) close(); });
  menu.addEventListener('focusout', e => { if (!menu.contains(e.relatedTarget) && e.relatedTarget !== link) close(); });
  items.forEach((m, i) => { m.addEventListener('pointerenter', () => show(i)); m.addEventListener('focus', () => { open(); show(i); }); });
  const shut = () => { leaving = false; clearTimeout(t); root.classList.remove('menu-open', 'previewing'); link.setAttribute('aria-expanded', 'false'); show(-1); };
  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !root.classList.contains('menu-open')) return;
    shut(); quiet = true; link.focus(); quiet = false;
  });
  addEventListener('wheel', () => { if (root.classList.contains('menu-open')) shut(); }, { passive: true });
})();
