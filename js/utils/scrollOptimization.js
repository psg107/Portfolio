/**
 * 스크롤 성능 최적화 유틸리티
 * throttle 함수를 제공하여 스크롤 이벤트 최적화
 * 스크롤 중일 때 CSS 클래스를 추가하여 애니메이션 성능 향상
 * 
 * 주요 기능:
 * - 스크롤 이벤트 throttling (60fps 최적화)
 * - 스크롤 상태에 따른 CSS 클래스 관리
 * - 터치 스크롤 지원
 */

/**
 * 함수 실행을 제한하는 throttle 유틸리티
 * @param {Function} func - 실행할 함수
 * @param {number} limit - 제한 시간 (밀리초)
 * @returns {Function} throttle된 함수
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// 스크롤 상태 관리 변수
let isScrolling = false;
let scrollTimeout;

/**
 * 스크롤 시작 시 호출되는 핸들러
 * 스크롤 중임을 나타내는 CSS 클래스를 추가/제거
 */
const handleScrollStart = () => {
  if (!isScrolling) {
    isScrolling = true;
    document.body.classList.add('is-scrolling');
  }
  
  // 스크롤 종료 타이머 리셋
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
    document.body.classList.remove('is-scrolling');
  }, 100);
};

// throttle된 스크롤 핸들러 생성 (16ms = 60fps)
const throttledScrollHandler = throttle(handleScrollStart, 16);

// 스크롤 이벤트 리스너 등록 (passive: true로 성능 최적화)
window.addEventListener('scroll', throttledScrollHandler, { 
  passive: true, 
  capture: false 
});

// 터치 스크롤 이벤트 리스너 등록
window.addEventListener('touchmove', throttledScrollHandler, { 
  passive: true 
});

// wheel 이벤트도 추가 (transform scale 문제 해결)
window.addEventListener('wheel', throttledScrollHandler, { 
  passive: true 
});

// document에도 이벤트 리스너 추가
document.addEventListener('scroll', throttledScrollHandler, { 
  passive: true, 
  capture: false 
});

document.addEventListener('wheel', throttledScrollHandler, { 
  passive: true 
});
