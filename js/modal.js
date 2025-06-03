let currentGalleryImages = [];
let currentImageIndex = 0;

// 이미지 카운터 업데이트
const updateImageCounter = (modal) => {
  const counter = modal.querySelector('.modal-counter');
  if (counter && currentGalleryImages.length > 0) {
    counter.textContent = `${currentImageIndex + 1}/${currentGalleryImages.length}`;
  }
};

// 이미지 모달 열기
export const openImageModal = (imageSrc, galleryImages = []) => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');

  if (!modal || !modalImg) {
    console.error('모달 요소를 찾을 수 없습니다.');
    return;
  }

  // 이전 값들 초기화
  currentGalleryImages = [];
  currentImageIndex = -1;

  // 새로운 값 설정
  currentGalleryImages = galleryImages;
  const currentImageName = imageSrc.split('/').pop();
  currentImageIndex = galleryImages.findIndex(img => img.split('/').pop() === currentImageName);

  modal.style.display = "block";
  modalImg.src = imageSrc;

  // 이미지 카운터 업데이트
  updateImageCounter(modal);

  // 이미지가 하나인 경우 화살표 숨기기
  const prevButton = modal.querySelector('.modal-prev');
  const nextButton = modal.querySelector('.modal-next');
  if (prevButton && nextButton) {
    const showNav = galleryImages.length > 1;
    prevButton.style.display = showNav ? 'flex' : 'none';
    nextButton.style.display = showNav ? 'flex' : 'none';
  }

  // 포커스를 모달로 이동
  modal.focus();

  // 모달이 열릴 때 body 스크롤 방지
  document.body.style.overflow = 'hidden';
}

// 이미지 모달 닫기
export const closeImageModal = (modal) => {
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = '';

  // 포커스를 이전 요소로 되돌림
  const lastFocusedElement = modal._lastFocusedElement;
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// 모달 관련 이벤트 초기화
export const initializeModal = () => {
  const modal = document.getElementById('imageModal');
  const closeButton = document.getElementsByClassName('modal-close')[0];

  if (!modal || !closeButton) {
    console.error('모달 요소를 찾을 수 없습니다.');
    return;
  }

  // ESC 키와 화살표 키 이벤트 핸들러
  const handleKeyDown = (event) => {
    if (modal.style.display !== 'block') return;

    if (event.key === 'Escape') {
      closeImageModal(modal);
    } else if (event.key === 'ArrowLeft') {
      showPreviousImage();
    } else if (event.key === 'ArrowRight') {
      showNextImage();
    }
  };

  // 클릭 이벤트 핸들러
  const handleClick = (event) => {
    if (event.target === modal) {
      closeImageModal(modal);
    }
  };

  // 이전/다음 이미지 이동 함수
  const showPreviousImage = () => {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    const modalImg = document.getElementById('modalImage');
    modalImg.src = currentGalleryImages[currentImageIndex];
    updateImageCounter(modal);
  };

  const showNextImage = () => {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    const modalImg = document.getElementById('modalImage');
    modalImg.src = currentGalleryImages[currentImageIndex];
    updateImageCounter(modal);
  };

  // 이벤트 리스너 등록
  document.addEventListener('keydown', handleKeyDown);
  modal.addEventListener('click', handleClick);
  closeButton.addEventListener('click', () => closeImageModal(modal));

  // 이전/다음 버튼 이벤트 리스너
  const prevButton = modal.querySelector('.modal-prev');
  const nextButton = modal.querySelector('.modal-next');
  if (prevButton) prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    showPreviousImage();
  });
  if (nextButton) nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  // 모달이 열릴 때 마지막으로 포커스된 요소 저장
  modal.addEventListener('show', () => {
    modal._lastFocusedElement = document.activeElement;
  });
};
