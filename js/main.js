import { COMPANIES } from './constants.js';
import { projectState } from './projectState.js';
import { switchCompanyTab, initializeTabs } from './tabs.js';
import { initializeModal } from './modal.js';
import { initializeMermaid, renderMermaidInTab } from './mermaid.js';

// 프로젝트 데이터 로드 및 초기화
const initializeProjects = async () => {
  try {
    const [projects1Response, projects2Response] = await Promise.all([
      fetch('projects.json'),
      fetch('projects2.json')
    ]);

    if (!projects1Response.ok || !projects2Response.ok) {
      throw new Error('프로젝트 데이터를 불러오는데 실패했습니다.');
    }

    const projects1 = await projects1Response.json();
    const projects2 = await projects2Response.json();

    [...projects1, ...projects2].forEach(project => {
      if (project && typeof project === 'object') {
        projectState.addProject(project);
      }
    });

    // 기본 탭으로 ALL 선택
    switchCompanyTab(COMPANIES.ALL, { scroll: false });
  } catch (error) {
    console.error('프로젝트 데이터를 불러오는 데 실패했습니다:', error);
  }
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  initializeMermaid();
  initializeTabs();
  initializeProjects();
  initializeModal();
  // 아키텍처 & 시스템 구성도의 Mermaid 다이어그램 렌더링
  const architectureSection = document.getElementById('section-architecture');
  if (architectureSection) {
    renderMermaidInTab(architectureSection);
  }
});
