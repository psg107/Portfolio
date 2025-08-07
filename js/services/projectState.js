import { COMPANIES, SERVICE_CATEGORIES } from "../constants.js";

/**
 * 프로젝트 상태 관리 객체
 * 회사별, 서비스 카테고리별로 프로젝트를 분류하여 저장
 * 모든 프로젝트는 ALL 카테고리에도 포함됨
 */
export const projectState = {
  // 프로젝트 데이터 저장소 - 회사별, 카테고리별로 분류
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

  /**
   * 프로젝트를 상태에 추가
   * @param {Object} project - 추가할 프로젝트 객체
   * @param {string} project.companyName - 회사명
   * @param {string} project.type - 프로젝트 타입
   * @param {string} project.serviceCategory - 서비스 카테고리
   */
  addProject(project) {
    const { companyName, type, serviceCategory } = project;
    try {
      // 모든 프로젝트는 ALL 카테고리에 추가
      this.data[SERVICE_CATEGORIES.ALL].push(project);

      // 서비스 카테고리에 따라 분류
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
