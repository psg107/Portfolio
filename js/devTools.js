import { projectState } from "./projectState.js";
import { createProjectCard } from "./projects.js";

const PDF_MODE = {
  MERMAID_RENDER_DELAY: 100,
  DIAGRAM_MIN_HEIGHT: "450px",
};

const ui = {
  toggleTabVisibility(show) {
    const companyTabs = document.querySelector(".company-tabs");
    if (companyTabs) {
      companyTabs.style.display = show ? "flex" : "none";
    }
  },

  hideAllTabContents() {
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.style.display = "none";
    });
  },

  showFirstTab() {
    const firstTab = document.getElementById("all-tab");
    if (firstTab) {
      firstTab.style.display = "block";
      firstTab.innerHTML = "";
      return firstTab;
    }
    return null;
  },

  addPdfModeStyles() {
    const existingStyle = document.getElementById("pdf-mode-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "pdf-mode-styles";
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
  },
};

const projectManager = {
  getAllProjectsSorted() {
    const companyOrder = ["noluniverse", "ksoft"];
    let companyProjects = [];
    let personalProjects = [];

    companyOrder.forEach((company) => {
      if (projectState.data[company]) {
        const projects = projectState.data[company].sort((a, b) =>
          b.from.localeCompare(a.from)
        );
        companyProjects = companyProjects.concat(projects);
      }
    });

    if (projectState.data["personal"]) {
      personalProjects = projectState.data["personal"].sort((a, b) =>
        b.from.localeCompare(a.from)
      );
    }

    return companyProjects.concat(personalProjects);
  },

  createProjectContainer() {
    const container = document.createElement("div");
    container.className = "projects-container";
    return container;
  },

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

const changeToPdfMode = () => {
  document.body.classList.add('pdf-mode');
  
  ui.toggleTabVisibility(false);
  ui.hideAllTabContents();
  const firstTab = ui.showFirstTab();
  if (!firstTab) return;

  const container = projectManager.createProjectContainer();
  firstTab.appendChild(container);
  projectManager.displayAllProjects(container);

  ui.addPdfModeStyles();
};

window.changeToPdfMode = changeToPdfMode;

export { changeToPdfMode };
