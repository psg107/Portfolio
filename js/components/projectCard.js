import { createImageGallery } from "../ui/gallery.js";
import { PROJECT_STATUS } from "../constants.js";

/**
 * 프로젝트 카드 DOM 요소 생성
 * 포트폴리오의 핵심 컴포넌트로, 프로젝트 정보를 카드 형태로 표시
 * 
 * @param {Object} project - 프로젝트 데이터 객체
 * @param {string} project.name - 프로젝트 이름
 * @param {Array} project.images - 프로젝트 이미지 배열
 * @param {Object} project.description - 프로젝트 설명 객체
 * @param {Array} project.skills - 사용 기술 배열
 * @param {string} project.from - 시작 날짜
 * @param {string} project.to - 종료 날짜 (선택사항)
 * @param {string} tabName - 현재 활성화된 탭 이름
 * @returns {HTMLElement} 생성된 프로젝트 카드 DOM 요소
 */
export const createProjectCard = (project, tabName) => {
  const projectCard = document.createElement("div");
  projectCard.classList.add("project-card");
  projectCard.setAttribute("role", "article");

  const sections = [
    { type: 'title', data: project },
    { type: 'gallery', data: project, condition: project.images?.length > 0 },
    { type: 'description', data: project.description, tabName },
    { type: 'details', data: project, condition: project.description?.solutions || project.description?.ongoing_challenges },
    { type: 'skills', data: project, condition: project.skills?.length > 0 },
    { type: 'date', data: project },
    { type: 'link', data: project, condition: project.link && (project.linkVisible !== false) }
  ];

  sections.forEach(({ type, data, condition }) => {
    if (condition !== false) {
      const section = createProjectSection(type, data, tabName);
      if (section) projectCard.appendChild(section);
    }
  });

  requestAnimationFrame(() => {
    projectCard.classList.add("visible");
  });

  return projectCard;
};

/**
 * 프로젝트 섹션 생성
 * 프로젝트 카드의 각 섹션(제목, 갤러리, 설명, 상세정보, 스킬, 날짜, 링크)을 생성
 * 
 * @param {string} sectionType - 생성할 섹션 타입 ('title', 'gallery', 'description', 'details', 'skills', 'date', 'link')
 * @param {Object} data - 섹션에 필요한 데이터 객체
 * @param {string} tabName - 현재 탭 이름 (일부 섹션에서 사용)
 * @returns {HTMLElement|null} 생성된 섹션 DOM 요소 또는 null
 */
const createProjectSection = (sectionType, data, tabName) => {
  switch (sectionType) {
    case 'title':
      return createTitleSection(data);
    case 'gallery':
      return createGallerySection(data);
    case 'description':
      return createDescriptionSection(data, tabName);
    case 'details':
      return createDetailsSection(data);
    case 'skills':
      return createSkillsSection(data);
    case 'date':
      return createDateSection(data);
    case 'link':
      return createLinkSection(data);
    default:
      return null;
  }
};

/**
 * 제목 섹션 생성
 * 프로젝트 이름과 상태 배지를 포함한 제목 영역 생성
 * 
 * @param {Object} project - 프로젝트 데이터 객체
 * @param {string} project.name - 프로젝트 이름
 * @param {string} project.status - 프로젝트 상태 (선택사항)
 * @returns {HTMLElement} 제목 섹션 DOM 요소
 */
const createTitleSection = (project) => {
  const titleSection = document.createElement("div");
  titleSection.classList.add("title-section");
  
  const title = document.createElement("h3");
  title.classList.add("project-title");
  title.textContent = project.name;
  
  titleSection.appendChild(title);
  
  if (project.status) {
    const statusBadge = createStatusBadge(project.status);
    titleSection.appendChild(statusBadge);
  }
  
  return titleSection;
};

/**
 * 갤러리 섹션 생성
 * 프로젝트 이미지들을 Swiper 슬라이더로 표시하는 갤러리 영역 생성
 * 
 * @param {Object} project - 프로젝트 데이터 객체
 * @param {Array} project.images - 프로젝트 이미지 배열
 * @returns {HTMLElement} 갤러리 섹션 DOM 요소
 */
const createGallerySection = (project) => {
  const gallerySection = document.createElement("div");
  gallerySection.classList.add("gallery-section");
  
  const gallery = createImageGallery(project.images, project.name);
  gallerySection.appendChild(gallery);
  
  return gallerySection;
};

/**
 * 설명 섹션 생성
 * 프로젝트 요약과 핵심 기능을 표시하는 설명 영역 생성
 * 
 * @param {Object} description - 프로젝트 설명 객체
 * @param {string} description.summary - 프로젝트 요약
 * @param {Array} description.key_features - 핵심 기능 목록
 * @param {string} tabName - 현재 탭 이름 (필터링에 사용)
 * @returns {HTMLElement} 설명 섹션 DOM 요소
 */
const createDescriptionSection = (description, tabName) => {
  const descriptionSection = document.createElement("div");
  descriptionSection.classList.add("description-section");
  
  // description 필드만 사용
  addProjectDescription(descriptionSection, description, tabName);
  
  return descriptionSection;
};

/**
 * 스킬 섹션 생성
 * 프로젝트에서 사용된 기술 스택을 표시하는 영역 생성
 * 
 * @param {Object} project - 프로젝트 데이터 객체
 * @param {Array} project.skills - 사용된 기술 배열
 * @returns {HTMLElement} 스킬 섹션 DOM 요소
 */
const createSkillsSection = (project) => {
  const skillsSection = document.createElement("div");
  skillsSection.classList.add("skills-section");
  
  const skills = document.createElement("p");
  skills.classList.add("skills");
  skills.textContent = project.skills.join(" • ");
  skills.setAttribute("aria-label", "사용된 기술: " + project.skills.join(", "));
  
  skillsSection.appendChild(skills);
  return skillsSection;
};

/**
 * 날짜 섹션 생성
 * 프로젝트 진행 기간을 표시하는 날짜 영역 생성
 * 
 * @param {Object} project - 프로젝트 데이터 객체
 * @param {string} project.from - 시작 날짜
 * @param {string} project.to - 종료 날짜 (선택사항, 없으면 "진행중" 표시)
 * @returns {HTMLElement} 날짜 섹션 DOM 요소
 */
const createDateSection = (project) => {
  const dateSection = document.createElement("div");
  dateSection.classList.add("date-section");
  
  const dateText = project.to ? `${project.from} - ${project.to}` : project.from;
  const dateElement = document.createElement("span");
  dateElement.classList.add("date");
  dateElement.textContent = dateText;
  
  dateSection.appendChild(dateElement);
  return dateSection;
};

/**
 * 링크 섹션 생성
 * 프로젝트 외부 링크를 표시하는 영역 생성
 * 
 * @param {Object} project - 프로젝트 데이터 객체
 * @param {string} project.link - 프로젝트 링크 URL
 * @param {boolean} project.linkVisible - 링크 표시 여부 (기본값: true)
 * @returns {HTMLElement|null} 링크 섹션 DOM 요소 또는 null
 */
const createLinkSection = (project) => {
  if (!project.link) return null;
  
  const linkSection = document.createElement("div");
  linkSection.classList.add("link-section");
  
  const link = document.createElement("a");
  link.href = project.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.classList.add("project-link");
  link.textContent = "자세히 보기";
  link.setAttribute("aria-label", `${project.name} 자세히 보기`);
  
  linkSection.appendChild(link);
  return linkSection;
};

/**
 * 상세 정보 섹션 생성
 * 프로젝트의 기술적 구현과 진행 중인 과제를 토글 가능한 형태로 표시
 * solutions나 ongoing_challenges가 없으면 null 반환하여 버튼이 표시되지 않음
 * 
 * @param {Object} project - 프로젝트 데이터 객체
 * @param {Object} project.description - 프로젝트 설명 객체
 * @param {Array} project.description.solutions - 기술적 구현 목록 (선택사항)
 * @param {Array} project.description.ongoing_challenges - 진행 중인 과제 목록 (선택사항)
 * @returns {HTMLElement|null} 상세 정보 섹션 DOM 요소 또는 null
 */
const createDetailsSection = (project) => {
  const detailsWrapper = document.createElement("div");
  detailsWrapper.classList.add("details-wrapper");
  
  // 상세 정보 컨테이너
  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details-container");
  detailsContainer.style.display = "none";
  
  let hasContent = false;
  
  // 구현 솔루션
  if (project.description.solutions && project.description.solutions.length > 0) {
    const solutionsSection = document.createElement("div");
    solutionsSection.classList.add("solutions-section");
    
    const solutionsTitle = document.createElement("h4");
    solutionsTitle.textContent = "기술적 구현";
    solutionsSection.appendChild(solutionsTitle);
    
    const solutionsList = document.createElement("ul");
    solutionsList.classList.add("solutions-list");
    
    project.description.solutions.forEach(solution => {
      const listItem = document.createElement("li");
      listItem.textContent = solution;
      solutionsList.appendChild(listItem);
    });
    
    solutionsSection.appendChild(solutionsList);
    detailsContainer.appendChild(solutionsSection);
    hasContent = true;
  }
  
  // 진행 중인 과제
  if (project.description.ongoing_challenges && project.description.ongoing_challenges.length > 0) {
    const challengesSection = document.createElement("div");
    challengesSection.classList.add("challenges-section");
    
    const challengesTitle = document.createElement("h4");
    challengesTitle.textContent = "진행 중인 과제";
    challengesSection.appendChild(challengesTitle);
    
    const challengesList = document.createElement("ul");
    challengesList.classList.add("challenges-list");
    
    project.description.ongoing_challenges.forEach(challenge => {
      const listItem = document.createElement("li");
      listItem.textContent = challenge;
      challengesList.appendChild(listItem);
    });
    
    challengesSection.appendChild(challengesList);
    detailsContainer.appendChild(challengesSection);
    hasContent = true;
  }
  
  // 내용이 없으면 null 반환
  if (!hasContent) {
    return null;
  }
  
  // 토글 버튼
  const toggleButton = document.createElement("button");
  toggleButton.classList.add("details-toggle");
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.innerHTML = '<span class="toggle-text">상세 정보 보기</span> <span class="toggle-icon">▼</span>';
  
  // 토글 이벤트
  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    
    if (isExpanded) {
      toggleButton.innerHTML = '<span class="toggle-text">상세 정보 보기</span> <span class="toggle-icon">▼</span>';
      toggleButton.setAttribute("aria-expanded", "false");
      detailsContainer.style.display = "none";
    } else {
      toggleButton.innerHTML = '<span class="toggle-text">상세 정보 숨기기</span> <span class="toggle-icon">▲</span>';
      toggleButton.setAttribute("aria-expanded", "true");
      detailsContainer.style.display = "block";
    }
  });
  
  detailsWrapper.appendChild(toggleButton);
  detailsWrapper.appendChild(detailsContainer);
  
  return detailsWrapper;
};

/**
 * 상태 배지 생성
 * 프로젝트 상태(진행중, 완료, 계획됨)를 시각적으로 표시하는 배지 생성
 * 
 * @param {string} status - 프로젝트 상태 ('in-progress', 'completed', 'planned')
 * @returns {HTMLElement} 상태 배지 DOM 요소
 */
const createStatusBadge = (status) => {
  const badge = document.createElement("span");
  const statusConfig = PROJECT_STATUS[status] || PROJECT_STATUS.completed;
  
  badge.classList.add("status-badge", `status-${statusConfig.class}`);
  
  if (statusConfig.icon) {
    const icon = document.createElement("span");
    icon.classList.add("status-icon");
    icon.textContent = statusConfig.icon;
    badge.appendChild(icon);
  }
  
  const text = document.createElement("span");
  text.textContent = statusConfig.text;
  badge.appendChild(text);
  
  return badge;
};

/**
 * 리스트 생성
 * HTML ul/li 요소로 구성된 리스트 생성 (핵심 기능, 솔루션, 과제 등에 사용)
 * 
 * @param {string} className - 리스트에 적용할 CSS 클래스명
 * @param {Array} items - 리스트 아이템 배열
 * @returns {HTMLElement} ul 요소
 */
const createList = (className, items) => {
  const list = document.createElement("ul");
  list.classList.add(className);
  
  items.forEach(item => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });
  
  return list;
};

/**
 * 간략한 프로젝트 설명을 컨테이너에 추가
 * 프로젝트 요약과 핵심 기능을 DOM 컨테이너에 추가
 * 텍스트를 자연스럽게 처리하여 가독성 향상
 * 
 * @param {HTMLElement} container - 설명을 추가할 DOM 컨테이너
 * @param {Object} description - 프로젝트 설명 객체
 * @param {string} description.summary - 프로젝트 요약 텍스트
 * @param {Array} description.key_features - 핵심 기능 배열
 * @param {string} tabName - 현재 탭 이름 (필터링에 사용)
 */
const addProjectDescription = (container, description, tabName) => {
  if (!description) return;

  if (description.summary) {
    const summary = document.createElement("p");
    summary.classList.add("summary");
    
    // 텍스트를 자연스럽게 처리하여 가독성 향상
    const summaryText = description.summary
      .replace(/\n\n/g, '\n') // 연속된 줄바꿈을 하나로
      .replace(/\n/g, ' ') // 줄바꿈을 공백으로
      .trim();
    
    summary.textContent = summaryText;
    container.appendChild(summary);
  }

  if (description.key_features && description.key_features.length > 0) {
    const keyFeaturesSection = document.createElement("div");
    keyFeaturesSection.classList.add("key-features-section");
    
    const keyFeaturesTitle = document.createElement("h4");
    keyFeaturesTitle.textContent = "핵심 기능";
    keyFeaturesTitle.classList.add("key-features-title");
    
    keyFeaturesSection.appendChild(keyFeaturesTitle);
    keyFeaturesSection.appendChild(createList("key-features", description.key_features));
    container.appendChild(keyFeaturesSection);
  }
};
