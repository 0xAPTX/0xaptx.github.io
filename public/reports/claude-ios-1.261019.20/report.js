(() => {
  const rows = [...document.querySelectorAll('#risk-table tbody tr')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const input = document.querySelector('#risk-search');
  const count = document.querySelector('#risk-count');
  const empty = document.querySelector('#risk-empty');
  let selected = 'all';
  function update() {
    const query = input.value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const row of rows) {
      const visible = (selected === 'all' || row.dataset.grade === selected)
        && row.textContent.toLocaleLowerCase().includes(query);
      row.hidden = !visible;
      if (visible) shown++;
    }
    count.textContent = `显示 ${shown} / ${rows.length} 项`;
    empty.hidden = shown !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    update();
  }));
  input.addEventListener('input', update);
  const sections = [...document.querySelectorAll('.report-section')];
  const links = [...document.querySelectorAll('.toc nav a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        links.forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, {rootMargin: '-90px 0px -65% 0px', threshold: 0});
    sections.forEach(section => observer.observe(section));
  }
})();
