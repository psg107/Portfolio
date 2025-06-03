import { projectState } from './projectState.js';
import { createImageGallery } from './gallery.js';

// 프로젝트 목록 업데이트 및 표시
export const updateProjects = (tabName) => {
  const tabContent = document.getElementById(tabName + '-tab');
  if (!tabContent) return;

  let projectsContainer = tabContent.querySelector('.projects-container');
  if (!projectsContainer) {
    projectsContainer = document.createElement('div');
    projectsContainer.className = 'projects-container';
    tabContent.insertBefore(projectsContainer, tabContent.firstChild);
  }

  projectsContainer.innerHTML = "";
  const projectsToShow = projectState.data[tabName] || [];
  projectsToShow.sort((a, b) => b.from.localeCompare(a.from));

  projectsToShow.forEach(project => {
    const projectCard = createProjectCard(project, tabName);
    projectsContainer.appendChild(projectCard);
  });
};

// 프로젝트 카드 생성
export const createProjectCard = (project, tabName) => {
  const projectCard = document.createElement('div');
  projectCard.classList.add('project-card');
  projectCard.setAttribute('role', 'article');

  // 제목 섹션
  const titleSection = document.createElement('header');
  titleSection.classList.add('header-section');
  const title = document.createElement('h3');
  title.textContent = project.name;
  titleSection.appendChild(title);
  projectCard.appendChild(titleSection);

  // 이미지 갤러리
  if (project.images && project.images.length > 0) {
    const gallerySection = document.createElement('div');
    gallerySection.classList.add('gallery-section');
    gallerySection.appendChild(createImageGallery(project));
    projectCard.appendChild(gallerySection);
  }

  // 프로젝트 설명
  const descriptionSection = document.createElement('div');
  descriptionSection.classList.add('description-section');
  addProjectDescription(descriptionSection, project.description, tabName);
  projectCard.appendChild(descriptionSection);

  // 기술 스택 섹션
  if (project.skills && project.skills.length > 0) {
    const skillsSection = document.createElement('div');
    skillsSection.classList.add('skills-section');
    const skills = document.createElement('p');
    skills.classList.add('skills');
    skills.textContent = project.skills.join(', ');
    skills.setAttribute('aria-label', '사용된 기술: ' + project.skills.join(', '));
    skillsSection.appendChild(skills);
    projectCard.appendChild(skillsSection);
  }

  // 날짜 섹션
  const dateSection = document.createElement('div');
  dateSection.classList.add('date-section');
  const date = document.createElement('p');
  date.classList.add('date');
  const dateText = project.to ?
    `${project.from} - ${project.to}` :
    `${project.from}`;
  date.textContent = dateText;
  date.setAttribute('aria-label', `프로젝트 기간: ${dateText}`);
  dateSection.appendChild(date);
  projectCard.appendChild(dateSection);

  // 프로젝트 카드 애니메이션
  requestAnimationFrame(() => {
    projectCard.classList.add('visible');
  });

  return projectCard;
};

// 프로젝트 설명 섹션 추가
const addProjectDescription = (container, description, tabName) => {
  if (!description) return;

  // 요약 정보
  if (description.summary) {
    const summary = document.createElement('p');
    summary.classList.add('summary');
    summary.textContent = description.summary;
    container.appendChild(summary);
  }

  // 회사 프로젝트의 경우 주요 성과와 주요 기능 표시
  if (tabName !== 'personal') {
    if (description.impact) {
      const impactSection = document.createElement('div');
      impactSection.classList.add('impact-section');
      const impactTitle = document.createElement('h4');
      impactTitle.textContent = '주요 성과';
      impactSection.appendChild(impactTitle);
      impactSection.appendChild(createList('impact', description.impact));
      container.appendChild(impactSection);
    }
  }

  // 기능 섹션 추가 (모든 프로젝트 공통)
  if (description.features) {
    const featuresSection = document.createElement('div');
    featuresSection.classList.add('features-section');
    const featuresTitle = document.createElement('h4');
    featuresTitle.textContent = '주요 기능';
    featuresSection.appendChild(featuresTitle);
    featuresSection.appendChild(createList('features', description.features));
    container.appendChild(featuresSection);
  }
};

// 목록 요소 생성
const createList = (className, items) => {
  const list = document.createElement('ul');
  list.classList.add(className);
  list.setAttribute('role', 'list');

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.setAttribute('role', 'listitem');
    if (index === 0) {
      li.classList.add('first');
    }
    list.appendChild(li);
  });

  return list;
};
