import { COMPANIES } from "./constants.js";

export const projectState = {
  data: {
    [COMPANIES.NOLUNIVERSE]: [],
    [COMPANIES.KSOFT]: [],
    [COMPANIES.PERSONAL]: [],
    [COMPANIES.ALL]: [],
  },

  addProject(project) {
    const { companyName, type } = project;
    try {
      this.data[COMPANIES.ALL].push(project);

      if (companyName === COMPANIES.NOLUNIVERSE) {
        this.data[COMPANIES.NOLUNIVERSE].push(project);
      } else if (companyName === COMPANIES.KSOFT) {
        this.data[COMPANIES.KSOFT].push(project);
      } else if (type === "personal") {
        this.data[COMPANIES.PERSONAL].push(project);
      }
    } catch (error) {
      console.error("프로젝트 추가 중 오류 발생:", error);
    }
  },
};
