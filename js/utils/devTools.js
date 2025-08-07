import { projectState } from "../services/projectState.js";
import { createProjectCard, setPdfMode } from "../projects.js";

/**
 * 개발자 도구 유틸리티
 * PDF 모드 전환 및 개발 시 유용한 기능들을 제공
 * 
 * 주요 기능:
 * - PDF 모드로 포트폴리오 전환
 * - UI 요소 숨기기/표시
 * - 프로젝트 정렬 및 표시
 */

/**
 * PDF 모드 관련 상수
 * PDF 출력 시 적용할 스타일 설정
 */
const PDF_MODE = {
  DIAGRAM_MIN_HEIGHT: "450px",  // 다이어그램 최소 높이
};

/**
 * UI 조작 유틸리티 객체
 */
const ui = {
  /**
   * 탭 가시성 토글
   * @param {boolean} show - 표시 여부
   */
  toggleTabVisibility(show) {
    const companyTabs = document.querySelector(".company-tabs");
    if (companyTabs) {
      companyTabs.style.display = show ? "flex" : "none";
    }
  },

  /**
   * 모든 탭 콘텐츠 숨기기
   */
  hideAllTabContents() {
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.style.display = "none";
    });
  },

  /**
   * 첫 번째 탭 표시
   * @returns {HTMLElement|null} 첫 번째 탭 요소
   */
  showFirstTab() {
    const firstTab = document.getElementById("all-tab");
    if (firstTab) {
      firstTab.style.display = "block";
      firstTab.innerHTML = "";
      return firstTab;
    }
    return null;
  },

  /**
   * PDF 모드용 스타일 추가
   */
  addPdfModeStyles() {
    const existingStyle = document.getElementById("pdf-mode-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "pdf-mode-styles";
    style.textContent = `
      .gallery-section {
        display: none !important;
      }
      
      .grid-controls {
        display: none !important;
      }
      
      .project-card {
        margin-bottom: 20px;
        box-shadow: none !important;
        border: 1px solid #ccc !important;
      }

      .project-card .link-section {
        display: none !important;
      }
      
      .pdf-mode .details-container,
      .project-card .details-container {
        display: block !important;
      }
      
      .pdf-mode .details-toggle,
      .project-card .details-toggle {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  },
};

/**
 * 프로젝트 관리 유틸리티 객체
 */
const projectManager = {
  /**
   * 모든 프로젝트를 카테고리별로 정렬하여 반환
   * @returns {Array} 정렬된 프로젝트 배열
   */
  getAllProjectsSorted() {
    const serviceCategories = {
      'new-package': [],
      'old-package': [],
      'cms-crm': [],
      'personal': []
    };

    const addedProjects = new Set();

    // 중복 제거하면서 프로젝트 분류
    Object.values(projectState.data).flat().forEach(project => {
      const projectKey = `${project.name}-${project.from}`;
      if (!addedProjects.has(projectKey) && project.serviceCategory && serviceCategories[project.serviceCategory]) {
        serviceCategories[project.serviceCategory].push(project);
        addedProjects.add(projectKey);
      }
    });

    // 각 카테고리 내에서 날짜순 정렬
    Object.keys(serviceCategories).forEach(category => {
      serviceCategories[category].sort((a, b) => b.from.localeCompare(a.from));
    });

    // 카테고리 우선순위에 따라 배열 반환
    return [
      ...serviceCategories['new-package'],
      ...serviceCategories['old-package'], 
      ...serviceCategories['cms-crm'],
      ...serviceCategories['personal']
    ];
  },

  /**
   * 프로젝트 컨테이너 생성
   * @returns {HTMLElement} 프로젝트 컨테이너 요소
   */
  createProjectContainer() {
    const container = document.createElement("div");
    container.className = "projects-container";
    return container;
  },

  /**
   * 모든 프로젝트를 컨테이너에 표시
   * @param {HTMLElement} container - 프로젝트를 표시할 컨테이너
   */
  displayAllProjects(container) {
    const allProjects = this.getAllProjectsSorted();
    allProjects.forEach((project) => {
      const projectCard = createProjectCard(
        project,
        project.companyName || "personal"
      );
      container.appendChild(projectCard);
    });
  },
};

/**
 * PDF 모드로 전환
 * 모든 프로젝트를 하나의 탭에 표시하고 PDF 출력에 최적화된 스타일 적용
 */
const changeToPdfMode = () => {
  document.body.classList.add('pdf-mode');
  
  // UI 조작
  ui.toggleTabVisibility(false);
  ui.hideAllTabContents();
  const firstTab = ui.showFirstTab();
  if (!firstTab) return;

  // 프로젝트 컨테이너 생성 및 프로젝트 표시
  const container = projectManager.createProjectContainer();
  firstTab.appendChild(container);
  projectManager.displayAllProjects(container);

  // PDF 모드 스타일 추가
  ui.addPdfModeStyles();
  
  // DOM 업데이트 후 PDF 모드 설정
  setTimeout(() => {
    setPdfMode(true);
  }, 100);
};

// 전역 함수로 노출 (개발자 도구에서 사용)
window.changeToPdfMode = changeToPdfMode;

export { changeToPdfMode };
