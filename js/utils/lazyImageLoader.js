/**
 * 지연 이미지 로딩 클래스
 * Intersection Observer API를 사용하여 뷰포트에 들어온 이미지만 로드
 * 성능 최적화를 위해 화면에 보이지 않는 이미지는 로드하지 않음
 * 
 * 사용법:
 * const loader = new LazyImageLoader();
 * loader.observe(imageElement);
 */
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  /**
   * Intersection Observer 초기화
   * 이미지가 뷰포트에 들어오면 자동으로 로드
   */
  init() {
    const observerOptions = {
      root: null, // 뷰포트를 기준으로 관찰
      rootMargin: '50px', // 뷰포트 경계에서 50px 전에 로드 시작
      threshold: 0.1 // 10% 이상 보이면 로드
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target); // 한 번 로드 후 관찰 중단
        }
      });
    }, observerOptions);
  }

  /**
   * 이미지 로드 처리
   * @param {HTMLImageElement} img - 로드할 이미지 요소
   */
  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // 로딩 상태 표시
    img.classList.add('loading');
    
    // 새로운 Image 객체로 미리 로드
    const imageLoader = new Image();
    
    // 로드 성공 시 처리
    imageLoader.onload = () => {
      img.src = src;
      img.classList.remove('loading');
      img.classList.add('loaded');
      
      // 컨테이너에도 로드 완료 상태 적용
      const container = img.closest('.gallery-item');
      if (container) {
        container.classList.add('loaded');
      }
    };
    
    // 로드 실패 시 처리
    imageLoader.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      if (window.handleImageError) {
        window.handleImageError(img, img.alt);
      }
    };
    
    // 실제 로드 시작
    imageLoader.src = src;
  }

  /**
   * 이미지 요소를 관찰 대상에 추가
   * @param {HTMLImageElement} img - 관찰할 이미지 요소
   */
  observe(img) {
    this.imageObserver.observe(img);
  }

  /**
   * 모든 관찰 중단 및 정리
   * 메모리 누수 방지를 위해 사용
   */
  disconnect() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const lazyImageLoader = new LazyImageLoader();

export { lazyImageLoader };
