import { projectState } from "../services/projectState.js";

/**
 * TOP 3 핵심 프로젝트를 Hero 영역에 렌더링
 */
export const renderHeroProjects = () => {
  const heroGrid = document.getElementById("hero-projects-grid");
  if (!heroGrid) return;

  // projects.json에서 isCore가 true인 프로젝트들 가져오기
  const allProjects = projectState.getFilteredProjects("all");
  const heroProjects = allProjects
    .filter(project => project.isCore === true)
    .slice(0, 3); // 최대 3개만 표시

  // 프로젝트가 로드되지 않았을 경우 폴백
  if (heroProjects.length === 0) {
    // 폴백: 기본 데이터 사용
    const fallbackProjects = [
      {
        name: "패키지 여행 통합 검색/전시 서비스",
        skills: ["Kotlin", "SpringBoot", "MongoDB", "Redis", "AWS ECS"]
      },
      {
        name: "패키지 여행 공급사 연동 서비스",
        skills: ["Kotlin", "SpringBoot", "MongoDB", "AWS", "Amazon SQS"]
      },
      {
        name: "패키지 여행 예약 서비스",
        skills: ["Kotlin", "SpringBoot", "MongoDB", "Redis", "AWS Kinesis"]
      }
    ];
    heroGrid.innerHTML = fallbackProjects.map(project => createHeroProjectCard(project)).join("");
  } else {
    heroGrid.innerHTML = heroProjects.map(project => createHeroProjectCard(project)).join("");
  }
  
  // 클릭 이벤트 추가
  initializeHeroProjectClicks();
};

/**
 * Hero 프로젝트 카드 생성 (간결한 버전)
 */
const createHeroProjectCard = (project) => {
  return `
    <div class="hero-project-card" data-project-name="${project.name}" style="cursor: pointer;">
      <h4>${project.name}</h4>
      <div class="impact-summary">${project.hero?.summary || '프로젝트 설명'}</div>
      <div class="key-metrics">
        ${(project.hero?.metrics || []).map(metric => `<span class="metric">${metric}</span>`).join("")}
      </div>
      <div class="tech-stack">${getMainTechStack(project.skills)}</div>
    </div>
  `;
};


/**
 * 핵심 기술 스택만 추출 (최대 3개)
 */
const getMainTechStack = (skills) => {
  if (!skills || skills.length === 0) return "";
  
  const priorityTech = ["Kotlin", "SpringBoot", "MongoDB", "AWS", "Python"];
  const mainSkills = skills.filter(skill => priorityTech.includes(skill)).slice(0, 3);
  
  return mainSkills.join(" • ");
};

/**
 * Hero 프로젝트 카드 클릭 이벤트 초기화
 */
const initializeHeroProjectClicks = () => {
  const heroCards = document.querySelectorAll('.hero-project-card');
  
  heroCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectName = card.dataset.projectName;
      expandAndScrollToProject(projectName);
    });
  });
};

/**
 * 확장된 프로젝트 섹션을 열고 해당 프로젝트로 스크롤
 */
const expandAndScrollToProject = (projectName) => {
  const showMoreBtn = document.getElementById("show-more-projects");
  const extendedProjects = document.getElementById("extended-projects");
  
  // 확장된 섹션이 숨겨져 있다면 먼저 표시
  if (extendedProjects.style.display === "none" || extendedProjects.style.display === "") {
    extendedProjects.style.display = "block";
    showMoreBtn.style.display = "none";
  }
  
  // 약간의 딜레이 후 해당 프로젝트로 스크롤
  setTimeout(() => {
    const allProjectTitles = document.querySelectorAll('#extended-projects h3');
    const matchingTitle = Array.from(allProjectTitles).find(h3 => h3.textContent.includes(projectName));
    if (matchingTitle) {
      const elementTop = matchingTitle.getBoundingClientRect().top + window.pageYOffset;
      const offset = 140; // 네비게이션바 높이 + 여백
      window.scrollTo({
        top: elementTop - offset,
        behavior: "smooth"
      });
    }
  }, 200);
};

/**
 * "더 많은 프로젝트 보기" 버튼 이벤트
 */
export const initializeShowMoreButton = () => {
  const showMoreBtn = document.getElementById("show-more-projects");
  const extendedProjects = document.getElementById("extended-projects");
  
  if (showMoreBtn && extendedProjects) {
    showMoreBtn.addEventListener("click", () => {
      extendedProjects.style.display = "block";
      showMoreBtn.style.display = "none";
      
      // 부드러운 스크롤
      setTimeout(() => {
        extendedProjects.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }, 100);
    });
  }
};