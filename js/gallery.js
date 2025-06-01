import { openImageModal } from './modal.js';

// 이미지 갤러리 생성
export const createImageGallery = (project) => {
  const gallery = document.createElement('div');
  gallery.classList.add('image-gallery');

  if (!project.images || !Array.isArray(project.images) || project.images.length === 0) {
    return createFallbackImage(gallery, project.name);
  }

  project.images.forEach(imageName => {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('gallery-item');

    const image = document.createElement('img');
    image.loading = 'lazy'; // 지연 로딩 적용
    image.src = `images/${imageName}`;
    image.alt = `${project.name} 프로젝트 이미지`;

    // 이미지 로드 에러 처리
    image.onerror = () => handleImageError(image, project.name);

    // 이미지 로드 완료 시 페이드인 효과
    image.onload = () => {
      image.classList.add('loaded');
      imageContainer.classList.add('loaded');
    };

    // 이미지 클릭 이벤트
    image.addEventListener('click', () => {
      // 현재 포커스된 요소 저장
      const modal = document.getElementById('imageModal');
      if (modal) {
        modal._lastFocusedElement = document.activeElement;
      }
      openImageModal(image.src);
    });

    // 키보드 접근성
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        image.click();
      }
    });
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${project.name} 프로젝트 이미지 보기`);

    imageContainer.appendChild(image);
    gallery.appendChild(imageContainer);
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
