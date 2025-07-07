import { projectState } from "./projectState.js";
import { createProjectCard, setPdfMode } from "./projects.js";

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
    `;
    document.head.appendChild(style);
  },
};

const projectManager = {
  getAllProjectsSorted() {
    const serviceCategories = {
      'new-package': [],
      'old-package': [],
      'cms-crm': [],
      'personal': []
    };

    const addedProjects = new Set();

    Object.values(projectState.data).flat().forEach(project => {
      const projectKey = `${project.name}-${project.from}`;
      if (!addedProjects.has(projectKey) && project.serviceCategory && serviceCategories[project.serviceCategory]) {
        serviceCategories[project.serviceCategory].push(project);
        addedProjects.add(projectKey);
      }
    });

    Object.keys(serviceCategories).forEach(category => {
      serviceCategories[category].sort((a, b) => {
        const aDisplayOrder = a.displayOrder || 0;
        const bDisplayOrder = b.displayOrder || 0;
        
        if (aDisplayOrder !== bDisplayOrder) {
          return aDisplayOrder - bDisplayOrder;
        }
        
        return a.from.localeCompare(b.from);
      });
    });

    return [
      ...serviceCategories['new-package'],
      ...serviceCategories['old-package'], 
      ...serviceCategories['cms-crm'],
      ...serviceCategories['personal']
    ];
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
  setPdfMode(true);
};

window.changeToPdfMode = changeToPdfMode;

export { changeToPdfMode };
