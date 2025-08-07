import { COMPANIES, SERVICE_CATEGORIES } from "./constants.js";
import { projectState } from "./services/projectState.js";
import { switchCompanyTab, initializeTabs } from "./ui/tabs.js";
import { initializeModal } from "./ui/modal.js";
import "./utils/scrollOptimization.js";

/**
 * 프로젝트 데이터를 비동기적으로 로드하고 상태에 추가
 * projects.json 파일에서 프로젝트 목록을 가져와 projectState에 저장
 * 로드 완료 후 기본 탭(ALL)으로 전환
 */
const initializeProjects = async () => {
  try {
    const projectsResponse = await fetch("projects.json");

    if (!projectsResponse.ok) {
      throw new Error("프로젝트 데이터를 불러오는데 실패했습니다.");
    }

    const projects = await projectsResponse.json();

    // 각 프로젝트를 상태에 추가
    projects.forEach((project) => {
      if (project && typeof project === "object") {
        projectState.addProject(project);
      }
    });

    // 기본 탭으로 전환 (스크롤 없이)
    switchCompanyTab(SERVICE_CATEGORIES.ALL, { scroll: false });
  } catch (error) {
    console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
  }
};

/**
 * 네비게이션 링크의 스무스 스크롤 기능 초기화
 * 네비게이션 바의 높이를 고려하여 정확한 위치로 스크롤
 */
const initializeNavigation = () => {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .cta-button[href^="#"]');
  const navbar = document.querySelector(".navbar");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // 네비게이션 바 높이와 여백을 고려한 스크롤 위치 계산
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

/**
 * DOM 로드 완료 시 모든 초기화 함수 실행
 * 각 모듈의 초기화를 순차적으로 실행하여 의존성 관리
 */
document.addEventListener("DOMContentLoaded", () => {
  // 순서가 중요한 초기화들
  initializeTabs();
  initializeProjects();
  initializeModal();
  initializeNavigation();
});
