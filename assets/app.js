(() => {
  const base = document.body.dataset.base;
  const dialog = document.querySelector('.search-dialog');
  const input = document.querySelector('#doc-search');
  const results = document.querySelector('.search-results');
  const menu = document.querySelector('.menu-button');
  const backdrop = document.querySelector('.nav-backdrop');
  const theme = document.querySelector('.theme-button');
  let index, loading, active = -1, request = 0;
  const el = (name, text, className) => { const node = document.createElement(name); if (text) node.textContent = text; if (className) node.className = className; return node; };
  function themeLabel() { const dark = document.documentElement.dataset.theme === 'dark'; theme.textContent = dark ? '☀' : '☾'; theme.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); }
  themeLabel();
  theme.addEventListener('click', () => { document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('yugo-theme', document.documentElement.dataset.theme); } catch {} themeLabel(); });
  function toggleMenu(open) { document.body.classList.toggle('nav-open', open); backdrop.hidden = !open; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); }
  menu.addEventListener('click', () => toggleMenu(!document.body.classList.contains('nav-open')));
  backdrop.addEventListener('click', () => toggleMenu(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && document.body.classList.contains('nav-open')) { toggleMenu(false); menu.focus(); } });
  async function loadIndex() { if (window.YugoSearchIndex) return index = window.YugoSearchIndex; if (!loading) loading = fetch(base + 'search-index.json').then(r => { if (!r.ok) throw Error('Search unavailable'); return r.json(); }).then(data => index = data).catch(error => { loading = undefined; throw error; }); return loading; }
  async function search() {
    const sequence = ++request;
    try {
      await loadIndex();
      if (sequence !== request) return;
      const query = input.value.trim().toLowerCase(), terms = query.split(/\s+/).filter(Boolean);
      results.replaceChildren(); active = -1;
      if (!query) { results.append(el('p', 'Search pages, nodes, and concepts.')); return; }
      const matches = index.map(page => {
        const title = page.title.toLowerCase(), text = page.text.toLowerCase();
        if (!terms.every(t => (title + ' ' + text).includes(t))) return null;
        return { page, score: (title === query ? 100 : 0) + terms.reduce((sum, t) => sum + (title.includes(t) ? 12 : 1), 0) + (page.status === 'ready' ? 1 : 0) };
      }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 18);
      if (!matches.length) { results.append(el('p', 'No pages found. Try a node name or a shorter phrase.')); return; }
      for (const { page } of matches) {
        const link = el('a', '', 'search-result'); link.href = base + (page.url || page.id + '.html');
        link.addEventListener('click', () => dialog.close());
        link.append(el('small', page.section + (page.status === 'wip' ? ' · Work in progress' : '')), el('strong', page.title));
        const position = Math.max(0, page.text.toLowerCase().indexOf(terms[0]) - 45);
        link.append(el('p', (position ? '…' : '') + page.text.slice(position, position + 155) + '…')); results.append(link);
      }
    } catch { if (sequence === request) results.replaceChildren(el('p', 'Search could not load. Please refresh the page and try again.')); }
  }
  function openSearch() { if (!dialog.open) dialog.showModal(); input.focus(); search(); }
  document.querySelector('.search-button').addEventListener('click', openSearch);
  document.querySelector('.close-search').addEventListener('click', () => dialog.close());
  input.addEventListener('input', search);
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); } });
  dialog.addEventListener('keydown', event => {
    const links = [...results.querySelectorAll('a')];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); if (!links.length) return;
      active = event.key === 'ArrowDown' ? (active + 1) % links.length : (active - 1 + links.length) % links.length;
      links.forEach((link, i) => link.classList.toggle('active', i === active)); links[active].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && document.activeElement === input) { event.preventDefault(); (links[active < 0 ? 0 : active])?.click(); }
  });
  const headings = [...document.querySelectorAll('article h2[id], article h3[id]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { for (const item of entries) if (item.isIntersecting) document.querySelectorAll('.toc a').forEach(link => link.classList.toggle('active', link.hash === '#' + item.target.id)); }, { rootMargin: '-85px 0px -65% 0px' });
    headings.forEach(h => observer.observe(h));
  }
  const current = document.querySelector('.sidebar [aria-current="page"]');
  if (current && current.getBoundingClientRect().bottom > window.innerHeight) current.scrollIntoView({block:'nearest'});
})();
