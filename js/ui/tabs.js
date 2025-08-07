import { UI_CONFIG, SERVICE_CATEGORIES } from "../constants.js";
import { updateProjects } from "../projects.js";

/**
 * 회사/서비스 탭 전환 함수
 * @param {string} tabName - 전환할 탭 이름
 * @param {Object} options - 옵션 객체
 * @param {boolean} options.scroll - 탭 전환 후 스크롤 여부 (기본값: true)
 */
export const switchCompanyTab = (tabName, options = { scroll: true }) => {
  const tabButtons = document.querySelectorAll(".tab-button");
  
  // 대상 탭 버튼 찾기
  const targetButton = Array.from(tabButtons).find(
    (button) => button.dataset.company === tabName || button.dataset.service === tabName
  );

  // 모든 탭 버튼 비활성화 후 대상 버튼만 활성화
  tabButtons.forEach((button) => button.classList.remove("active"));
  if (targetButton) {
    targetButton.classList.add("active");
  }

  // 모든 탭 콘텐츠 비활성화
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  // 프로젝트 목록 업데이트
  updateProjects(tabName);

  // 대상 탭 콘텐츠 활성화
  const targetTab = document.getElementById(tabName + "-tab");
  if (targetTab) {
    targetTab.classList.add("active");

    // 스크롤 옵션이 활성화된 경우 프로젝트 섹션으로 스크롤
    if (options.scroll) {
      const sectionProject = document.getElementById("section-project");
      sectionProject.scrollIntoView({ behavior: "smooth", block: "start" });
    }


  }
};

/**
 * 탭 버튼 이벤트 리스너 초기화
 * 각 탭 버튼에 클릭 이벤트를 추가하여 탭 전환 기능 활성화
 */
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
