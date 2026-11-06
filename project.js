(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
})();

const CATEGORY_LABELS = {
  'dynamic-package': '다이나믹 패키지',
  'new-package': '신규 패키지 시스템',
  'cm-package': '법인단체 패키지',
  ai: 'AI·자동화',
  'old-package': '구패키지 시스템'
};

async function renderSide() {
  const side = document.querySelector('.doc-side');
  if (!side) return;
  const root = document.body.dataset.root || '../';
  const current = document.body.dataset.project;

  const response = await fetch(`${root}portfolio.json`);
  const { profile, projects } = await response.json();
  const withPage = projects
    .filter(p => p.detailPage)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const groups = Object.keys(CATEGORY_LABELS)
    .map(key => {
      const items = withPage.filter(p => p.category === key);
      if (items.length === 0) return '';
      const links = items.map(p => {
        const active = p.id === current ? ' class="active" aria-current="page"' : '';
        return `<li><a href="${root}${p.detailPage}"${active}>${p.name}</a></li>`;
      }).join('');
      return `<div class="doc-side-group">${CATEGORY_LABELS[key]}</div><ul>${links}</ul>`;
    })
    .join('');

  side.innerHTML = `
    <a class="doc-side-home" href="${root}index.html">${profile.name}</a>
    <a class="doc-side-sub" href="${root}index.html#projects">프로젝트 목록으로 이동</a>
    ${groups}
  `;
}

function renderToc() {
  const toc = document.querySelector('.toc');
  const main = document.querySelector('main');
  if (!toc || !main) return;
  const heads = Array.from(main.querySelectorAll('h2, h3'));
  if (heads.length < 2) return;

  const list = document.createElement('ul');
  const links = heads.map((head, index) => {
    if (!head.id) head.id = `sec-${index + 1}`;
    const item = document.createElement('li');
    item.className = `toc-${head.tagName.toLowerCase()}`;
    const link = document.createElement('a');
    link.href = `#${head.id}`;
    link.textContent = head.textContent;
    item.appendChild(link);
    list.appendChild(item);
    return link;
  });
  toc.appendChild(list);

  const offset = document.querySelector('.top-nav') ? 96 : 48;
  let current = -1;
  const update = () => {
    let next = 0;
    heads.forEach((head, index) => {
      if (head.getBoundingClientRect().top <= offset) next = index;
    });
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    if (atBottom) next = heads.length - 1;
    if (next === current) return;
    if (current >= 0) links[current].classList.remove('active');
    links[next].classList.add('active');
    current = next;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  renderToc();
  renderSide().catch(error => console.error('Failed to render project list:', error));
});
