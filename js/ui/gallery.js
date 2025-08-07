import { openImageModal } from "./modal.js";
import { lazyImageLoader } from "../utils/lazyImageLoader.js";

/**
 * Swiper 설정 상수
 * 이미지 갤러리의 슬라이더 동작을 제어하는 설정
 * 성능 최적화를 위해 일부 옵션을 비활성화
 */
const SWIPER_CONFIG = {
  slidesPerView: "auto",
  spaceBetween: 15,
  grabCursor: true,
  mousewheel: {
    forceToAxis: true,
  },
  keyboard: {
    enabled: true,
  },
  updateOnWindowResize: false,
  observer: false,
  observeParents: false,
  watchSlidesProgress: false,
};

/**
 * 프로젝트 이미지 갤러리 생성
 * Swiper 슬라이더를 사용하여 이미지들을 표시
 * 지연 로딩, 에러 처리, 접근성 지원 기능 포함
 * 
 * @param {Array} images - 프로젝트 이미지 파일명 배열
 * @param {string} projectName - 프로젝트 이름 (접근성 및 에러 처리용)
 * @returns {HTMLElement} 생성된 갤러리 DOM 요소
 */
export const createImageGallery = (images, projectName) => {
  const gallery = document.createElement("div");
  gallery.classList.add("gallery-section");

  const swiperContainer = document.createElement("div");
  swiperContainer.classList.add("swiper");

  const swiperWrapper = document.createElement("div");
  swiperWrapper.classList.add("swiper-wrapper");

  // 이미지가 없는 경우 대체 이미지 생성
  if (!images || !Array.isArray(images) || images.length === 0) {
    return createFallbackImage(gallery, projectName);
  }

  // 각 이미지에 대해 슬라이드 생성
  images.forEach((imageName) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("gallery-item");

    const image = document.createElement("img");
    image.loading = "lazy";
    const imagePath = `images/${imageName}`;
    image.dataset.src = imagePath;
    // 로딩 중 플레이스홀더 이미지
    image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' fill='%23d1d5db'%3E로딩 중...%3C/text%3E%3C/svg%3E";
    image.alt = `${projectName} 프로젝트 이미지`;
    image.draggable = false;
    
    // 지연 로딩 관찰자에 추가
    lazyImageLoader.observe(image);
    
    // 이미지 로드 실패 처리
    image.onerror = () => handleImageError(image, projectName);
    
    // 이미지 클릭 시 모달 열기
    imageContainer.addEventListener("click", () => {
      const modal = document.getElementById("imageModal");
      if (modal) {
        modal._lastFocusedElement = document.activeElement;
      }

      const galleryImages = images.map((img) => `images/${img}`);
      openImageModal(image.src, galleryImages);
    });
    
    // 키보드 접근성 지원
    imageContainer.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        imageContainer.click();
      }
    });
    
    // 접근성 속성 설정
    imageContainer.setAttribute("tabindex", "0");
    imageContainer.setAttribute("role", "button");
    imageContainer.setAttribute("aria-label", `${projectName} 프로젝트 이미지 보기`);

    imageContainer.appendChild(image);
    slide.appendChild(imageContainer);
    swiperWrapper.appendChild(slide);
  });

  swiperContainer.appendChild(swiperWrapper);
  gallery.appendChild(swiperContainer);
  
  // Swiper 초기화 (다음 프레임에서 실행)
  requestAnimationFrame(() => {
    new Swiper(swiperContainer, SWIPER_CONFIG);
  });

  return gallery;
};

/**
 * 대체 이미지 생성 (이미지가 없는 경우)
 * 프로젝트에 이미지가 없을 때 기본 이미지를 표시
 * 
 * @param {HTMLElement} gallery - 갤러리 컨테이너
 * @param {string} projectName - 프로젝트 이름 (alt 텍스트용)
 * @returns {HTMLElement} 대체 이미지가 포함된 갤러리
 */
const createFallbackImage = (gallery, projectName) => {
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("gallery-item");

  const image = document.createElement("img");
  image.src = "images/19.jpg";
  image.alt = `${projectName || '프로젝트'} 이미지 없음`;
  image.classList.add("no-image");

  imageContainer.appendChild(image);
  gallery.appendChild(imageContainer);
  return gallery;
};

/**
 * 이미지 로드 실패 처리
 * 이미지 로드에 실패했을 때 대체 이미지로 교체하고 콘솔에 경고 출력
 * 
 * @param {HTMLImageElement} image - 실패한 이미지 요소
 * @param {string} projectName - 프로젝트 이름 (경고 메시지용)
 */
const handleImageError = (image, projectName) => {
  image.src = "images/19.jpg";
  image.alt = `${projectName || '프로젝트'} 이미지 로드 실패`;
  image.classList.add("error");
  console.warn(`이미지 로드 실패: ${projectName || '알 수 없는 프로젝트'}`);
};

// 전역 함수로 노출 (다른 모듈에서 사용)
window.handleImageError = handleImageError;
