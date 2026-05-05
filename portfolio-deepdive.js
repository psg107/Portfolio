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

    container.innerHTML = cases.map(item => {
      const sections = [
        ['문제 상황', item.problem],
        ['내 역할', item.role],
        ['기술적 판단', item.decision],
        ['결과', item.result]
      ].filter(([, value]) => value);

      return `
        <article class="deep-dive-card">
          <div class="deep-dive-header">
            <span class="deep-dive-label">${item.label}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
          </div>
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
        </article>
      `;
    }).join('');
  } catch (error) {
    console.error('Failed to render deep dive cases:', error);
  }
}

document.addEventListener('DOMContentLoaded', renderDeepDiveCases);
