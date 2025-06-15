import { COMPANIES, SERVICE_CATEGORIES } from "./constants.js";

export const projectState = {
  data: {
    [COMPANIES.NOLUNIVERSE]: [],
    [COMPANIES.KSOFT]: [],
    [COMPANIES.PERSONAL]: [],
    [SERVICE_CATEGORIES.NEW_PACKAGE]: [],
    [SERVICE_CATEGORIES.OLD_PACKAGE]: [],
    [SERVICE_CATEGORIES.CMS_CRM]: [],
    [SERVICE_CATEGORIES.PERSONAL]: [],
    [SERVICE_CATEGORIES.ALL]: [],
  },

  addProject(project) {
    const { companyName, type, serviceCategory } = project;
    try {
      this.data[SERVICE_CATEGORIES.ALL].push(project);

      if (serviceCategory === SERVICE_CATEGORIES.NEW_PACKAGE) {
        this.data[SERVICE_CATEGORIES.NEW_PACKAGE].push(project);
      } else if (serviceCategory === SERVICE_CATEGORIES.OLD_PACKAGE) {
        this.data[SERVICE_CATEGORIES.OLD_PACKAGE].push(project);
      } else if (serviceCategory === SERVICE_CATEGORIES.CMS_CRM) {
        this.data[SERVICE_CATEGORIES.CMS_CRM].push(project);
      } else if (serviceCategory === SERVICE_CATEGORIES.PERSONAL) {
        this.data[SERVICE_CATEGORIES.PERSONAL].push(project);
      }
    } catch (error) {
      console.error("프로젝트 추가 중 오류 발생:", error);
    }
  },
};
