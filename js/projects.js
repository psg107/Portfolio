import { projectState } from "./services/projectState.js";
import { updateProjects as updateProjectList } from "./components/projectList.js";

/**
 * 특정 탭의 프로젝트 목록을 업데이트
 * @param {string} tabName - 업데이트할 탭 이름
 */
export const updateProjects = (tabName) => {
  const projectsToShow = projectState.data[tabName] || [];
  updateProjectList(tabName, projectsToShow);
};

export { createProjectCard } from "./components/projectCard.js";
export { expandAllDetails, collapseAllDetails, setPdfMode } from "./components/projectList.js";
