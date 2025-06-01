import { projectState } from './projectState.js';
import { createProjectCard } from './projects.js';
import { renderMermaidInTab } from './mermaid.js';

// PDF 모드 관련 상수
const PDF_MODE = {
  MERMAID_RENDER_DELAY: 100,
  DIAGRAM_MIN_HEIGHT: '450px'
};

// UI 상태 관리
const ui = {
  toggleTabVisibility(show) {
    const companyTabs = document.querySelector('.company-tabs');
    if (companyTabs) {
      companyTabs.style.display = show ? 'flex' : 'none';
    }
  },

  hideAllTabContents() {
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
    });
  },

  showFirstTab() {
    const firstTab = document.getElementById('noluniverse-tab');
    if (firstTab) {
      firstTab.style.display = 'block';
      firstTab.innerHTML = '';
      return firstTab;
    }
    return null;
  }
};

// 프로젝트 데이터 관리
const projectManager = {
  getAllProjectsSorted() {
    const companyOrder = ['noluniverse', 'ksoft'];
    let allProjects = [];

    companyOrder.forEach(company => {
      if (projectState.data[company]) {
        const projects = projectState.data[company].sort((a, b) => b.from.localeCompare(a.from));
        allProjects = allProjects.concat(projects);
      }
    });

    return allProjects;
  },

  createProjectContainer() {
    const container = document.createElement('div');
    container.className = 'projects-container';
    return container;
  },

  displayAllProjects(container) {
    const allProjects = this.getAllProjectsSorted();
    allProjects.forEach(project => {
      const projectCard = createProjectCard(project, project.companyName || 'personal');
      container.appendChild(projectCard);
    });
  }
};

// 구성도 관리
const architectureManager = {
  createSection() {
    const section = document.createElement('section');
    section.id = 'section-architecture';
    section.innerHTML = '<h2>서비스 구성도</h2>';
    return section;
  },

  collectDiagrams() {
    const diagrams = [];
    document.querySelectorAll('.tab-content').forEach(tab => {
      const elements = Array.from(tab.children).filter(el =>
        el.classList.contains('mermaid') ||
        (el.tagName === 'H3' && el.nextElementSibling?.classList.contains('mermaid'))
      );
      elements.forEach(element => {
        diagrams.push(element.cloneNode(true));
      });
    });
    return diagrams;
  },

  appendDiagrams(section, diagrams) {
    diagrams.forEach(diagram => {
      section.appendChild(diagram);
    });
  },

  removeMermaidFullscreenButtons() {
    document.querySelectorAll('.mermaid-controls').forEach(control => {
      control.remove();
    });
  }
};

// PDF 모드로 전환
const changeToPdfMode = () => {
  // 구성도 섹션 생성
  const architectureSection = architectureManager.createSection();
  const diagrams = architectureManager.collectDiagrams();

  // UI 상태 변경
  ui.toggleTabVisibility(false);
  ui.hideAllTabContents();
  const firstTab = ui.showFirstTab();
  if (!firstTab) return;

  // 프로젝트 컨테이너 생성 및 프로젝트 표시
  const container = projectManager.createProjectContainer();
  firstTab.appendChild(container);
  projectManager.displayAllProjects(container);

  // 구성도 섹션 추가
  architectureManager.appendDiagrams(architectureSection, diagrams);
  const projectSection = document.getElementById('section-project');
  if (projectSection) {
    projectSection.parentNode.insertBefore(architectureSection, projectSection.nextSibling);
  }

  // Mermaid 다이어그램 렌더링
  renderMermaidInTab(architectureSection, "architecture");

  // Mermaid 전체화면 버튼 제거
  setTimeout(() => {
    if (typeof mermaid !== 'undefined') {
      architectureManager.removeMermaidFullscreenButtons();
    }
  }, PDF_MODE.MERMAID_RENDER_DELAY);
};

// 전역으로 함수 노출
window.changeToPdfMode = changeToPdfMode;

export { changeToPdfMode };
