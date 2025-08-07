/**
 * 회사명 상수
 * 프로젝트를 회사별로 분류하기 위한 식별자
 */
export const COMPANIES = {
  NOLUNIVERSE: "noluniverse",
  KSOFT: "ksoft",
  PERSONAL: "personal",
  ALL: "all",
};

/**
 * 서비스 카테고리 상수
 * 프로젝트를 서비스 유형별로 분류하기 위한 식별자
 */
export const SERVICE_CATEGORIES = {
  NEW_PACKAGE: "new-package",    // 신규 패키지 개발
  OLD_PACKAGE: "old-package",    // 기존 패키지 유지보수
  CMS_CRM: "cms-crm",            // CMS/CRM 시스템
  PERSONAL: "personal",          // 개인 프로젝트
  ALL: "all",                    // 전체 프로젝트
};

/**
 * UI 설정 상수
 * 애플리케이션의 UI 동작을 제어하는 설정값들
 */
export const UI_CONFIG = {
  ZOOM: {
    MIN: 0.8,        // 최소 줌 레벨
    MAX: 2.0,        // 최대 줌 레벨
    INITIAL: 1.0,    // 초기 줌 레벨
  },
  GRID: {
    LARGE_SCREEN: 1,  // 대형 화면에서의 기본 컬럼 수
    MEDIUM_SCREEN: 1, // 중형 화면에서의 기본 컬럼 수
    SMALL_SCREEN: 1,  // 소형 화면에서의 기본 컬럼 수
  },
  ANIMATION: {
    DURATION: 300,    // 애니메이션 지속 시간 (ms)
    DELAY: 100,       // 애니메이션 지연 시간 (ms)
  },
  CACHE: {
    TTL: 3600000,     // 캐시 유효 시간 (1시간, ms)
  },
};

/**
 * 프로젝트 카테고리 우선순위
 * 프로젝트 정렬 시 사용되는 우선순위 값
 */
export const CATEGORY_PRIORITY = {
  "new-package": 1,
  "old-package": 2,
  "cms-crm": 3,
  "personal": 4,
};

/**
 * 프로젝트 상태 설정
 * 프로젝트 상태별 표시 텍스트와 스타일
 */
export const PROJECT_STATUS = {
  "in-progress": { text: "🚧 진행중", class: "in-progress" },
  "planned": { text: "계획됨", class: "planned" },
  "completed": { text: "완료", class: "completed" },
};
