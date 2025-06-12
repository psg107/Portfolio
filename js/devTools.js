import { projectState } from './projectState.js';
import { createProjectCard } from './projects.js';

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
    const firstTab = document.getElementById('all-tab');
    if (firstTab) {
      firstTab.style.display = 'block';
      firstTab.innerHTML = '';
      return firstTab;
    }
    return null;
  },

  addPdfModeStyles() {
    // 기존 PDF 모드 스타일이 있다면 제거
    const existingStyle = document.getElementById('pdf-mode-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // PDF 모드용 스타일 생성
    const style = document.createElement('style');
    style.id = 'pdf-mode-styles';
    style.textContent = `
      /* PDF 모드에서 이미지 갤러리 숨기기 */
      .gallery-section {
        display: none !important;
      }
      
      /* PDF 모드에서 프로젝트 카드 스타일 조정 */
      .project-card {
        margin-bottom: 20px;
        box-shadow: none !important;
        border: 1px solid #ccc !important;
      }

      /* PDF 모드에서 링크 섹션 숨기기 */
      .project-card .link-section {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// 프로젝트 데이터 관리
const projectManager = {
  getAllProjectsSorted() {
    const companyOrder = ['noluniverse', 'ksoft', 'personal'];
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

// PDF 모드로 전환
const changeToPdfMode = () => {
  // UI 상태 변경
  ui.toggleTabVisibility(false);
  ui.hideAllTabContents();
  const firstTab = ui.showFirstTab();
  if (!firstTab) return;

  // 프로젝트 컨테이너 생성 및 프로젝트 표시
  const container = projectManager.createProjectContainer();
  firstTab.appendChild(container);
  projectManager.displayAllProjects(container);

  // PDF 모드용 스타일 추가 - 이미지 숨기기
  ui.addPdfModeStyles();
};

// 전역으로 함수 노출
window.changeToPdfMode = changeToPdfMode;

export { changeToPdfMode };
