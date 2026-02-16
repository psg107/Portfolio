const state = {
  data: null,
  currentProject: null
};

async function init() {
  try {
    const response = await fetch(`portfolio.json?v=${Date.now()}`);
    state.data = await response.json();

    renderProfile();
    renderAbout();
    renderSkills();
    renderExperience();
    renderProjects();
    renderSocialLinks();

    setupNavigation();
    setupProjectPanel();
  } catch (error) {
    console.error('Failed to load portfolio data:', error);
  }
}

function renderProfile() {
  const { profile } = state.data;

  document.getElementById('profile-name').textContent = profile.name;
  document.getElementById('profile-title').textContent = profile.subtitle;
  document.title = `${profile.name} | ${profile.title}`;
}

function renderAbout() {
  const { profile } = state.data;

  const aboutText = document.getElementById('about-text');
  aboutText.innerHTML = profile.description
    .split('\n\n')
    .map(p => `<p>${p}</p>`)
    .join('');
}

function renderSkills() {
  const { skills } = state.data;

  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = skills.map(skillGroup =>
    `<li class="skill-inline">${skillGroup.join(' · ')}</li>`
  ).join('');
}

function renderExperience() {
  const { experience } = state.data;
  const container = document.getElementById('experience-list');

  container.innerHTML = experience.map(exp => `
    <div class="experience-item">
      <div class="experience-period">${exp.period}</div>
      <div class="experience-content">
        <h3>${exp.role} · <span class="company">${exp.company}</span></h3>
        <p>${exp.description}</p>
        <ul>
          ${exp.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
        <div class="tech-tags">
          ${exp.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderProjects() {
  const { projects } = state.data;
  const container = document.getElementById('projects-grid');

  const categories = [
    { key: 'new-package', title: '신패키지 시스템' },
    { key: 'old-package', title: '구패키지 시스템' },
    { key: 'personal', title: '개인 프로젝트' }
  ];

  const sortByOrder = (a, b) => {
    return (a.order || 999) - (b.order || 999);
  };

  container.innerHTML = categories.map(category => {
    const categoryProjects = projects
      .filter(p => p.category === category.key)
      .sort(sortByOrder);

    if (categoryProjects.length === 0) return '';

    return `
      <div class="project-category">
        <h3 class="project-category-title">${category.title}</h3>
        ${categoryProjects.map(project => `
          <article class="project-card" data-project-id="${project.id}">
            <div class="project-card-header">
              <h3>${project.name}${project.status === 'in-progress' ? '<span class="project-status">진행중</span>' : ''}</h3>
            </div>
            <p>${project.summary}</p>
            <div class="tech-tags">
              ${project.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    `;
  }).join('');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.projectId;
      openProjectPanel(projectId);
    });
  });
}

function renderSocialLinks() {
  const { contact } = state.data;
  const container = document.getElementById('social-links');

  container.innerHTML = `
    <a href="${contact.github}" target="_blank" class="social-link" aria-label="GitHub">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    </a>
    <a href="mailto:${contact.email}" class="social-link" aria-label="Email">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
    </a>
  `;
}

function setupNavigation() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    const scrollTop = window.scrollY;

    if (scrollTop < 100) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#about');
      });
      return;
    }

    let currentSection = 'about';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (scrollTop >= sectionTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  };

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

function setupProjectPanel() {
  const panel = document.getElementById('project-panel');
  const overlay = document.getElementById('panel-overlay');
  const closeBtn = document.getElementById('panel-close');

  closeBtn.addEventListener('click', closeProjectPanel);
  overlay.addEventListener('click', closeProjectPanel);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProjectPanel();
  });
}

function openProjectPanel(projectId) {
  const project = state.data.projects.find(p => p.id === projectId);
  if (!project) return;

  state.currentProject = project;

  const panel = document.getElementById('project-panel');
  const overlay = document.getElementById('panel-overlay');
  const content = document.getElementById('panel-content');

  const descriptionHtml = project.description
    ? `<div class="panel-description">${project.description}</div>`
    : '';

  const implementationsHtml = project.implementations?.length
    ? `
      <div class="panel-section">
        <h4>주요 구현</h4>
        <ul>
          ${project.implementations.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  const linkHtml = project.link
    ? `<a href="${project.link}" target="_blank" class="panel-link">프로젝트 보기 →</a>`
    : '';

  content.innerHTML = `
    <h3 class="panel-title">${project.name}</h3>
    ${descriptionHtml}
    ${implementationsHtml}
    <div class="panel-section">
      <h4>기술 스택</h4>
      <div class="tech-tags">
        ${project.stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
    </div>
    ${linkHtml}
  `;

  panel.classList.add('open');
  overlay.classList.add('open');
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
}

function closeProjectPanel() {
  const panel = document.getElementById('project-panel');
  const overlay = document.getElementById('panel-overlay');

  panel.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  state.currentProject = null;
}

function setupMouseGradient() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  document.addEventListener('mousemove', e => {
    const x = e.pageX;
    const y = e.pageY;
    document.body.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(29, 78, 216, 0.15), transparent 80%), #0a192f`;
    document.body.style.backgroundAttachment = 'scroll';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  setupMouseGradient();
});
