import { openImageModal } from './modal.js';

// 이미지 갤러리 생성
export const createImageGallery = (project) => {
  const gallery = document.createElement('div');
  gallery.classList.add('gallery-section');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  if (!project.images || !Array.isArray(project.images) || project.images.length === 0) {
    return createFallbackImage(gallery, project.name);
  }

  project.images.forEach(imageName => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('gallery-item');

    const image = document.createElement('img');
    image.loading = 'lazy';
    image.src = `images/${imageName}`;
    image.alt = `${project.name} 프로젝트 이미지`;
    image.draggable = false;

    // 이미지 로드 에러 처리
    image.onerror = () => handleImageError(image, project.name);

    // 이미지 로드 완료 시 페이드인 효과
    image.onload = () => {
      image.classList.add('loaded');
      imageContainer.classList.add('loaded');
    };

    // 이미지 클릭 이벤트
    imageContainer.addEventListener('click', () => {
      const modal = document.getElementById('imageModal');
      if (modal) {
        modal._lastFocusedElement = document.activeElement;
      }
      openImageModal(image.src);
    });

    // 키보드 접근성
    imageContainer.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        imageContainer.click();
      }
    });
    imageContainer.setAttribute('tabindex', '0');
    imageContainer.setAttribute('role', 'button');
    imageContainer.setAttribute('aria-label', `${project.name} 프로젝트 이미지 보기`);

    imageContainer.appendChild(image);
    slide.appendChild(imageContainer);
    swiperWrapper.appendChild(slide);
  });

  swiperContainer.appendChild(swiperWrapper);
  gallery.appendChild(swiperContainer);

  // Swiper 초기화
  new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    spaceBetween: 15,
    grabCursor: true,
    mousewheel: {
      forceToAxis: true
    },
    keyboard: {
      enabled: true
    }
  });

  return gallery;
};

// 폴백 이미지 생성
const createFallbackImage = (gallery, projectName) => {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('gallery-item');

  const image = document.createElement('img');
  image.src = 'images/noImage.jpg';
  image.alt = `${projectName} 프로젝트 이미지 없음`;
  image.classList.add('no-image');

  imageContainer.appendChild(image);
  gallery.appendChild(imageContainer);
  return gallery;
};

// 이미지 로드 에러 처리
const handleImageError = (image, projectName) => {
  image.src = 'images/noImage.jpg';
  image.alt = `${projectName} 프로젝트 이미지 로드 실패`;
  image.classList.add('error');
  console.warn(`이미지 로드 실패: ${projectName}`);
};
