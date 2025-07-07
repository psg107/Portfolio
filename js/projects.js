import { projectState } from "./projectState.js";
import { SERVICE_CATEGORIES } from "./constants.js";
import { createImageGallery } from "./gallery.js";

export const updateProjects = (tabName) => {
  const tabContent = document.getElementById(tabName + "-tab");
  if (!tabContent) return;

  let projectsContainer = tabContent.querySelector(".projects-container");
  if (!projectsContainer) {
    projectsContainer = document.createElement("div");
    projectsContainer.className = "projects-container";
    tabContent.insertBefore(projectsContainer, tabContent.firstChild);
  }

  projectsContainer.innerHTML = "";
  const projectsToShow = projectState.data[tabName] || [];
  
  // 정렬 로직
  if (tabName === "all") {
    projectsToShow.sort((a, b) => {
      const serviceOrder = {
        'new-package': 1,
        'old-package': 2, 
        'cms-crm': 3,
        'personal': 4
      };
      
      const aOrder = serviceOrder[a.serviceCategory] || 5;
      const bOrder = serviceOrder[b.serviceCategory] || 5;
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      const aDisplayOrder = a.displayOrder || 0;
      const bDisplayOrder = b.displayOrder || 0;
      
      if (aDisplayOrder !== bDisplayOrder) {
        return aDisplayOrder - bDisplayOrder;
      }
      
      if (a.serviceCategory === 'personal' && b.serviceCategory === 'personal') {
        return b.from.localeCompare(a.from);
      }
      
      return a.from.localeCompare(b.from);
    });
  } else if (Object.values(SERVICE_CATEGORIES).includes(tabName) && tabName !== "all") {
    projectsToShow.sort((a, b) => {
      const aDisplayOrder = a.displayOrder || 0;
      const bDisplayOrder = b.displayOrder || 0;
      
      if (aDisplayOrder !== bDisplayOrder) {
        return aDisplayOrder - bDisplayOrder;
      }
      
      if (tabName === SERVICE_CATEGORIES.PERSONAL) {
        return b.from.localeCompare(a.from);
      }
      
      return a.from.localeCompare(b.from);
    });
  } else {
    projectsToShow.sort((a, b) => b.from.localeCompare(a.from));
  }

  projectsToShow.forEach((project) => {
    const projectCard = createProjectCard(project, tabName);
    projectsContainer.appendChild(projectCard);
  });
};

export const createProjectCard = (project, tabName) => {
  const projectCard = document.createElement("div");
  projectCard.classList.add("project-card");
  projectCard.setAttribute("role", "article");

  const titleSection = document.createElement("header");
  titleSection.classList.add("header-section");
  const title = document.createElement("h3");
  title.textContent = project.name;
  
  // 상태 배지 추가
  if (project.status) {
    const statusBadge = createStatusBadge(project.status);
    title.appendChild(statusBadge);
  }
  
  titleSection.appendChild(title);
  projectCard.appendChild(titleSection);

  if (project.images && project.images.length > 0) {
    const gallerySection = document.createElement("div");
    gallerySection.classList.add("gallery-section");
    gallerySection.appendChild(createImageGallery(project));
    projectCard.appendChild(gallerySection);
  }

  const descriptionSection = document.createElement("div");
  descriptionSection.classList.add("description-section");
  addProjectDescription(descriptionSection, project.description, tabName);
  projectCard.appendChild(descriptionSection);

  if (project.skills && project.skills.length > 0) {
    const skillsSection = document.createElement("div");
    skillsSection.classList.add("skills-section");
    const skills = document.createElement("p");
    skills.classList.add("skills");
    skills.textContent = project.skills.join(", ");
    skills.setAttribute(
      "aria-label",
      "사용된 기술: " + project.skills.join(", ")
    );
    skillsSection.appendChild(skills);
    projectCard.appendChild(skillsSection);
  }

  const dateSection = document.createElement("div");
  dateSection.classList.add("date-section");
  const date = document.createElement("p");
  date.classList.add("date");
  const dateText = project.to
    ? `${project.from} - ${project.to}`
    : `${project.from}`;
  date.textContent = dateText;
  date.setAttribute("aria-label", `프로젝트 기간: ${dateText}`);

  dateSection.appendChild(date);
  projectCard.appendChild(dateSection);

  const linkVisible =
    project.linkVisible !== undefined ? project.linkVisible : true;
  if (project.link && linkVisible) {
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
    projectCard.appendChild(linkSection);
  }

  requestAnimationFrame(() => {
    projectCard.classList.add("visible");
  });

  return projectCard;
};

const addProjectDescription = (container, description, tabName) => {
  if (!description) return;

  if (description.summary) {
    const summary = document.createElement("p");
    summary.classList.add("summary");
    summary.textContent = description.summary;
    container.appendChild(summary);
  }

  if (description.challenges) {
    const challengesSection = document.createElement("div");
    challengesSection.classList.add("challenges-section");
    const challengesTitle = document.createElement("h4");
    challengesTitle.textContent = "해결 과제";
    challengesSection.appendChild(challengesTitle);
    challengesSection.appendChild(
      createList("challenges", description.challenges)
    );
    container.appendChild(challengesSection);
  }

  if (description.solutions) {
    const solutionsSection = document.createElement("div");
    solutionsSection.classList.add("solutions-section");
    const solutionsTitle = document.createElement("h4");
    solutionsTitle.textContent = "해결 방안";
    solutionsSection.appendChild(solutionsTitle);
    solutionsSection.appendChild(
      createList("solutions", description.solutions)
    );
    container.appendChild(solutionsSection);
  }

  if (description.technical_details) {
    const technicalSection = document.createElement("div");
    technicalSection.classList.add("technical-section");
    const technicalTitle = document.createElement("h4");
    technicalTitle.textContent = "기술적 구현";
    technicalSection.appendChild(technicalTitle);
    technicalSection.appendChild(
      createList("technical-details", description.technical_details)
    );
    container.appendChild(technicalSection);
  }

  if (description.performance_results) {
    const performanceSection = document.createElement("div");
    performanceSection.classList.add("performance-section");
    const performanceTitle = document.createElement("h4");
    performanceTitle.textContent = "성과";
    performanceSection.appendChild(performanceTitle);
    performanceSection.appendChild(
      createList("performance-results", description.performance_results)
    );
    container.appendChild(performanceSection);
  }

  if (description.ongoing_challenges && description.ongoing_challenges.length > 0) {
    const ongoingSection = document.createElement("div");
    ongoingSection.classList.add("ongoing-challenges-section");
    const ongoingTitle = document.createElement("h4");
    ongoingTitle.textContent = "현재 해결 중인 과제들";
    ongoingSection.appendChild(ongoingTitle);
    ongoingSection.appendChild(
      createList("ongoing-challenges", description.ongoing_challenges)
    );
    container.appendChild(ongoingSection);
  }

  if (description.highlights) {
    const highlightsSection = document.createElement("div");
    highlightsSection.classList.add("highlights-section");
    const highlightsTitle = document.createElement("h4");
    highlightsTitle.textContent = "핵심 내용";
    highlightsSection.appendChild(highlightsTitle);
    highlightsSection.appendChild(
      createList("highlights", description.highlights)
    );
    container.appendChild(highlightsSection);
  }
};

const createList = (className, items) => {
  const list = document.createElement("ul");
  list.classList.add(className);
  list.setAttribute("role", "list");

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.setAttribute("role", "listitem");
    if (index === 0) {
      li.classList.add("first");
    }
    list.appendChild(li);
  });

  return list;
};

const createStatusBadge = (status) => {
  const badge = document.createElement("span");
  badge.classList.add("project-status-badge");
  
  switch (status) {
    case "in-progress":
      badge.classList.add("in-progress");
      badge.textContent = "🚧 진행중";
      break;
    case "planned":
      badge.classList.add("planned");
      badge.textContent = "📋 계획됨";
      break;
    case "completed":
      badge.classList.add("completed");
      badge.textContent = "✅ 완료";
      break;
    default:
      badge.classList.add("completed");
      badge.textContent = "✅ 완료";
  }
  
  return badge;
};
