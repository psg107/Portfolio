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
  
  const getProjectCategory = (project) => {
    return project.serviceCategory || "unknown";
  };

  const getCategoryPriority = (category) => {
    switch (category) {
      case "new-package": return 1;
      case "old-package": return 2;
      case "cms-crm": return 3;
      case "personal": return 4;
      default: return 5;
    }
  };

  projectsToShow.sort((a, b) => {
    const categoryA = getProjectCategory(a);
    const categoryB = getProjectCategory(b);
    const priorityA = getCategoryPriority(categoryA);
    const priorityB = getCategoryPriority(categoryB);
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return b.from.localeCompare(a.from);
  });

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

  if (description.key_features) {
    const keyFeaturesSection = document.createElement("div");
    keyFeaturesSection.classList.add("key-features-section");
    keyFeaturesSection.appendChild(
      createList("key-features", description.key_features)
    );
    container.appendChild(keyFeaturesSection);
  }

  const hasDetailedInfo = description.challenges || description.solutions || 
                         description.performance_results || 
                         description.ongoing_challenges;

  if (hasDetailedInfo) {
    const toggleButton = document.createElement("button");
    toggleButton.classList.add("details-toggle");
    toggleButton.innerHTML = '<span class="toggle-text">상세 정보 보기</span> <span class="toggle-icon">▼</span>';
    toggleButton.setAttribute("aria-expanded", "false");
    
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("details-container");
    detailsContainer.style.display = "none";

    if (description.challenges) {
      const challengesSection = document.createElement("div");
      challengesSection.classList.add("challenges-section");
      const challengesTitle = document.createElement("h4");
      challengesTitle.textContent = "해결 과제";
      challengesSection.appendChild(challengesTitle);
      challengesSection.appendChild(
        createList("challenges", description.challenges)
      );
      detailsContainer.appendChild(challengesSection);
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
      detailsContainer.appendChild(solutionsSection);
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
      detailsContainer.appendChild(performanceSection);
    }

    if (description.ongoing_challenges) {
      const ongoingSection = document.createElement("div");
      ongoingSection.classList.add("ongoing-section");
      const ongoingTitle = document.createElement("h4");
      ongoingTitle.textContent = "진행 중인 과제";
      ongoingSection.appendChild(ongoingTitle);
      ongoingSection.appendChild(
        createList("ongoing-challenges", description.ongoing_challenges)
      );
      detailsContainer.appendChild(ongoingSection);
    }

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

    container.appendChild(toggleButton);
    container.appendChild(detailsContainer);
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

export const expandAllDetails = () => {
  const allToggleButtons = document.querySelectorAll('.details-toggle');
  
  allToggleButtons.forEach(button => {
    const detailsContainer = button.nextElementSibling;
    button.innerHTML = '<span class="toggle-text">상세 정보 숨기기</span> <span class="toggle-icon">▲</span>';
    button.setAttribute("aria-expanded", "true");
    if (detailsContainer) {
      detailsContainer.style.display = "block";
    }
  });
};

export const collapseAllDetails = () => {
  const allToggleButtons = document.querySelectorAll('.details-toggle');
  
  allToggleButtons.forEach(button => {
    const detailsContainer = button.nextElementSibling;
    button.innerHTML = '<span class="toggle-text">상세 정보 보기</span> <span class="toggle-icon">▼</span>';
    button.setAttribute("aria-expanded", "false");
    if (detailsContainer) {
      detailsContainer.style.display = "none";
    }
  });
};

export const setPdfMode = (enabled) => {
  const body = document.body;
  const allToggleButtons = document.querySelectorAll('.details-toggle');
  
  if (enabled) {
    body.classList.add('pdf-mode');
    allToggleButtons.forEach(button => {
      const detailsContainer = button.nextElementSibling;
      button.style.display = "none";
      if (detailsContainer) {
        detailsContainer.style.display = "block";
      }
    });
  } else {
    body.classList.remove('pdf-mode');
    allToggleButtons.forEach(button => {
      button.style.display = "flex";
    });
  }
};
