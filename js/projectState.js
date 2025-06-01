import { COMPANIES } from './constants.js';

// 프로젝트 데이터 관리를 위한 상태 객체
export const projectState = {
  data: {
    [COMPANIES.NOLUNIVERSE]: [],
    [COMPANIES.KSOFT]: [],
    [COMPANIES.PERSONAL]: []
  },

  // 새 프로젝트를 회사별로 분류하여 추가
  addProject(project) {
    const { companyName, type } = project;
    try {
      if (companyName === COMPANIES.NOLUNIVERSE) {
        this.data[COMPANIES.NOLUNIVERSE].push(project);
      } else if (companyName === COMPANIES.KSOFT) {
        this.data[COMPANIES.KSOFT].push(project);
      } else if (type === 'personal') {
        this.data[COMPANIES.PERSONAL].push(project);
      }
    } catch (error) {
      console.error('프로젝트 추가 중 오류 발생:', error);
    }
  }
};
