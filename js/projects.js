import { projectState } from "./projectState.js";
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
  projectsToShow.sort((a, b) => b.from.localeCompare(a.from));

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
