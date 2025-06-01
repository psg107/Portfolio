import { UI_CONFIG } from './constants.js';
import { updateProjects } from './projects.js';
import { renderMermaidInTab } from './mermaid.js';

// 회사별 탭 전환 처리
export const switchCompanyTab = (tabName, options = { scroll: true }) => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const targetButton = Array.from(tabButtons).find(button =>
    button.dataset.company === tabName
  );

  tabButtons.forEach(button => button.classList.remove('active'));
  if (targetButton) {
    targetButton.classList.add('active');
  }

  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));

  updateProjects(tabName);

  const targetTab = document.getElementById(tabName + '-tab');
  if (targetTab) {
    targetTab.classList.add('active');
    
    if (options.scroll) {
      const sectionProject = document.getElementById('section-project');
      sectionProject.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderMermaidInTab(targetTab, tabName);
  }
};

// 탭 이벤트 초기화
export const initializeTabs = () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const company = button.dataset.company;
      if (company) {
        switchCompanyTab(company);
      }
    });
  });
};
