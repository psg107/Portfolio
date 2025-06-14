import { COMPANIES } from "./constants.js";
import { projectState } from "./projectState.js";
import { switchCompanyTab, initializeTabs } from "./tabs.js";
import { initializeModal } from "./modal.js";
import { initializeMermaid, renderMermaidInTab } from "./mermaid.js";

const initializeProjects = async () => {
  try {
    const [projects1Response, projects2Response] = await Promise.all([
      fetch("projects.json"),
      fetch("projects2.json"),
    ]);

    if (!projects1Response.ok || !projects2Response.ok) {
      throw new Error("프로젝트 데이터를 불러오는데 실패했습니다.");
    }

    const projects1 = await projects1Response.json();
    const projects2 = await projects2Response.json();

    [...projects1, ...projects2].forEach((project) => {
      if (project && typeof project === "object") {
        projectState.addProject(project);
      }
    });

    switchCompanyTab(COMPANIES.ALL, { scroll: false });
  } catch (error) {
    console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
  }
};

const initializeNavigation = () => {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .cta-button[href^="#"]');
  const navbar = document.querySelector(".navbar");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth",
        });
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initializeMermaid();
  initializeTabs();
  initializeProjects();
  initializeModal();
  initializeNavigation();
  const architectureSection = document.getElementById("section-architecture");
  if (architectureSection) {
    renderMermaidInTab(architectureSection);
  }
});
