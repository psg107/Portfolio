/**
 * 모달 전역 상태 관리
 * 이미지 모달의 현재 상태를 관리하는 전역 변수들
 * 
 * @type {Array} currentGalleryImages - 현재 갤러리의 모든 이미지 경로 배열
 * @type {number} currentImageIndex - 현재 표시 중인 이미지의 인덱스
 */
let currentGalleryImages = [];
let currentImageIndex = 0;

/**
 * 모달 내 이미지 카운터 업데이트
 * @param {HTMLElement} modal - 모달 요소
 */
const updateImageCounter = (modal) => {
  const counter = modal.querySelector(".modal-counter");
  if (counter && currentGalleryImages.length > 0) {
    counter.textContent = `${currentImageIndex + 1}/${currentGalleryImages.length}`;
  }
};

/**
 * 이미지 모달 열기
 * 프로젝트 이미지를 모달 창에서 표시하고 갤러리 네비게이션 기능 활성화
 * 
 * @param {string} imageSrc - 표시할 이미지 경로
 * @param {Array} galleryImages - 갤러리 이미지 배열 (선택사항, 네비게이션용)
 */
export const openImageModal = (imageSrc, galleryImages = []) => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  if (!modal || !modalImg) {
    console.error("모달 요소를 찾을 수 없습니다.");
    return;
  }

  // 전역 변수 초기화
  currentGalleryImages = [];
  currentImageIndex = -1;

  // 갤러리 이미지 설정
  currentGalleryImages = galleryImages;
  const currentImageName = imageSrc.split("/").pop();
  currentImageIndex = galleryImages.findIndex(
    (img) => img.split("/").pop() === currentImageName
  );

  // 모달 표시 및 이미지 설정
  modal.style.display = "block";
  modalImg.src = imageSrc;

  updateImageCounter(modal);

  // 네비게이션 버튼 표시/숨김 처리
  const prevButton = modal.querySelector(".modal-prev");
  const nextButton = modal.querySelector(".modal-next");
  if (prevButton && nextButton) {
    const showNav = galleryImages.length > 1;
    prevButton.style.display = showNav ? "flex" : "none";
    nextButton.style.display = showNav ? "flex" : "none";
  }

  modal.focus();
  document.body.style.overflow = "hidden";
};

/**
 * 이미지 모달 닫기
 * @param {HTMLElement} modal - 닫을 모달 요소
 */
export const closeImageModal = (modal) => {
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "";

  // 이전에 포커스된 요소로 포커스 복원
  const lastFocusedElement = modal._lastFocusedElement;
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};

/**
 * 이미지 네비게이션 (통합된 함수)
 * 갤러리 이미지 간 이전/다음 이미지로 이동하는 기능
 * 순환 구조로 마지막 이미지에서 다음을 누르면 첫 번째 이미지로 이동
 * 
 * @param {string} direction - 네비게이션 방향 ('prev' 또는 'next')
 */
const navigateImage = (direction) => {
  if (currentGalleryImages.length <= 1) return;
  
  if (direction === 'prev') {
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  } else {
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
  }
  
  const modalImg = document.getElementById("modalImage");
  modalImg.src = currentGalleryImages[currentImageIndex];
  updateImageCounter(document.getElementById("imageModal"));
};

/**
 * 모달 초기화 및 이벤트 리스너 설정
 */
export const initializeModal = () => {
  const modal = document.getElementById("imageModal");
  const closeButton = document.getElementsByClassName("modal-close")[0];

  if (!modal || !closeButton) {
    console.error("모달 요소를 찾을 수 없습니다.");
    return;
  }

  /**
   * 키보드 이벤트 처리
   * @param {KeyboardEvent} event - 키보드 이벤트
   */
  const handleKeyDown = (event) => {
    if (modal.style.display !== "block") return;

    if (event.key === "Escape") {
      closeImageModal(modal);
    } else if (event.key === "ArrowLeft") {
      navigateImage('prev');
    } else if (event.key === "ArrowRight") {
      navigateImage('next');
    }
  };

  /**
   * 모달 배경 클릭 시 닫기
   * @param {MouseEvent} event - 마우스 이벤트
   */
  const handleClick = (event) => {
    if (event.target === modal) {
      closeImageModal(modal);
    }
  };

  // 이벤트 리스너 등록
  document.addEventListener("keydown", handleKeyDown);
  modal.addEventListener("click", handleClick);
  closeButton.addEventListener("click", () => closeImageModal(modal));

  // 네비게이션 버튼 이벤트 리스너
  const prevButton = modal.querySelector(".modal-prev");
  const nextButton = modal.querySelector(".modal-next");
  
  if (prevButton) {
    prevButton.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateImage('prev');
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateImage('next');
    });
  }

  // 모달 표시 시 포커스 요소 저장
  modal.addEventListener("show", () => {
    modal._lastFocusedElement = document.activeElement;
  });
};
