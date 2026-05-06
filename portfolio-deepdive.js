async function renderDeepDiveCases() {
  const container = document.getElementById('deep-dive-list');
  if (!container) return;

  try {
    const response = await fetch(`portfolio.json?v=${Date.now()}`);
    const data = await response.json();
    const cases = data.deepDives || [];

    if (cases.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = cases.map((item, index) => {
      const sections = [
        ['문제 상황', item.problem],
        ['내 역할', item.role],
        ['기술적 판단', item.decision],
        ['결과', item.result]
      ].filter(([, value]) => value);
      const isOpen = index === 0;

      return `
        <article class="deep-dive-card ${isOpen ? 'is-open' : ''}">
          <button class="deep-dive-toggle" type="button" aria-expanded="${isOpen}">
            <span class="deep-dive-label">${item.label}</span>
            <span class="deep-dive-toggle-icon" aria-hidden="true">${isOpen ? '−' : '+'}</span>
          </button>
          <div class="deep-dive-header">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
          </div>
          <div class="deep-dive-body">
            <div class="deep-dive-grid">
              ${sections.map(([title, value]) => `
                <div class="deep-dive-block">
                  <span>${title}</span>
                  <p>${value}</p>
                </div>
              `).join('')}
            </div>
            ${item.points?.length ? `
              <ul class="project-implementations deep-dive-points">
                ${item.points.map(point => `<li>${point}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    setupDeepDiveToggles(container);
  } catch (error) {
    console.error('Failed to render deep dive cases:', error);
  }
}

function setupDeepDiveToggles(container) {
  container.querySelectorAll('.deep-dive-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.deep-dive-card');
      const isOpen = card.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      const icon = toggle.querySelector('.deep-dive-toggle-icon');
      if (icon) icon.textContent = isOpen ? '−' : '+';
    });
  });
}

document.addEventListener('DOMContentLoaded', renderDeepDiveCases);
