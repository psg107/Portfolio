import { UI_CONFIG, SERVICE_CATEGORIES } from "./constants.js";
import { updateProjects } from "./projects.js";
import { renderMermaidInTab } from "./mermaid.js";

export const switchCompanyTab = (tabName, options = { scroll: true }) => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const targetButton = Array.from(tabButtons).find(
    (button) => button.dataset.company === tabName || button.dataset.service === tabName
  );

  tabButtons.forEach((button) => button.classList.remove("active"));
  if (targetButton) {
    targetButton.classList.add("active");
  }

  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  updateProjects(tabName);

  const targetTab = document.getElementById(tabName + "-tab");
  if (targetTab) {
    targetTab.classList.add("active");

    if (options.scroll) {
      const sectionProject = document.getElementById("section-project");
      sectionProject.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    renderMermaidInTab(targetTab, tabName);
  }
};

export const initializeTabs = () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const company = button.dataset.company;
      const service = button.dataset.service;
      const tabName = company || service;
      if (tabName) {
        switchCompanyTab(tabName);
      }
    });
  });
};
