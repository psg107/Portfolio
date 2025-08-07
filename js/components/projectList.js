import { createProjectCard } from "./projectCard.js";
import { CATEGORY_PRIORITY } from "../constants.js";

/**
 * 특정 탭의 프로젝트 목록을 업데이트
 * 탭 전환 시 해당 탭의 프로젝트들을 정렬하여 표시
 * 
 * @param {string} tabName - 업데이트할 탭 이름
 * @param {Array} projects - 표시할 프로젝트 배열
 */
export const updateProjects = (tabName, projects) => {
  const tabContent = document.getElementById(tabName + "-tab");
  if (!tabContent) return;

  const projectsContainer = getOrCreateProjectsContainer(tabContent);
  clearProjectsContainer(projectsContainer);
  
  const sortedProjects = sortProjects(projects);
  
  sortedProjects.forEach((project) => {
    const projectCard = createProjectCard(project, tabName);
    projectsContainer.appendChild(projectCard);
  });
};

/**
 * 프로젝트 컨테이너 생성 또는 가져오기
 * @param {HTMLElement} tabContent - 탭 컨텐츠 요소
 * @returns {HTMLElement} 프로젝트 컨테이너
 */
const getOrCreateProjectsContainer = (tabContent) => {
  let projectsContainer = tabContent.querySelector(".projects-container");
  if (!projectsContainer) {
    projectsContainer = document.createElement("div");
    projectsContainer.className = "projects-container";
    tabContent.insertBefore(projectsContainer, tabContent.firstChild);
  }
  return projectsContainer;
};

/**
 * 프로젝트 컨테이너 초기화
 * @param {HTMLElement} container - 프로젝트 컨테이너
 */
const clearProjectsContainer = (container) => {
  container.innerHTML = "";
};

/**
 * 프로젝트 정렬
 * 카테고리 우선순위와 날짜를 기준으로 프로젝트를 정렬
 * 
 * 정렬 기준:
 * 1. 서비스 카테고리 우선순위 (new-package > old-package > cms-crm > personal)
 * 2. 시작 날짜 (최신순)
 * 
 * @param {Array} projects - 정렬할 프로젝트 배열
 * @returns {Array} 정렬된 프로젝트 배열
 */
const sortProjects = (projects) => {
  return [...projects].sort((a, b) => {
    const priorityA = CATEGORY_PRIORITY[a.serviceCategory] || 5;
    const priorityB = CATEGORY_PRIORITY[b.serviceCategory] || 5;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return b.from.localeCompare(a.from);
  });
};

/**
 * 모든 상세 정보 토글 상태 업데이트
 * 모든 프로젝트 카드의 상세 정보를 일괄적으로 확장/축소
 * 
 * @param {boolean} expand - 확장 여부 (true: 확장, false: 축소)
 */
export const updateAllDetails = (expand) => {
  const toggleButtons = document.querySelectorAll('.details-toggle');
  
  toggleButtons.forEach(button => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    if (isExpanded !== expand) {
      button.click();
    }
  });
};

/**
 * 모든 상세 정보 확장
 */
export const expandAllDetails = () => updateAllDetails(true);

/**
 * 모든 상세 정보 축소
 */
export const collapseAllDetails = () => updateAllDetails(false);

/**
 * PDF 모드 설정
 * 프로젝트 카드에 PDF 출력용 스타일을 적용/제거
 * 
 * @param {boolean} enabled - PDF 모드 활성화 여부 (true: 활성화, false: 비활성화)
 */
export const setPdfMode = (enabled) => {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    if (enabled) {
      card.classList.add('pdf-mode');
    } else {
      card.classList.remove('pdf-mode');
    }
  });
};
