// 이미지 모달 열기
export const openImageModal = (imageSrc) => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');

  if (!modal || !modalImg) {
    console.error('모달 요소를 찾을 수 없습니다.');
    return;
  }

  modal.style.display = "block";
  modalImg.src = imageSrc;

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

  // ESC 키 이벤트 핸들러
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      closeImageModal(modal);
    }
  };

  // 클릭 이벤트 핸들러
  const handleClick = (event) => {
    if (event.target === modal) {
      closeImageModal(modal);
    }
  };

  // 이벤트 리스너 등록
  document.addEventListener('keydown', handleKeyDown);
  modal.addEventListener('click', handleClick);
  closeButton.addEventListener('click', () => closeImageModal(modal));

  // 모달이 열릴 때 마지막으로 포커스된 요소 저장
  modal.addEventListener('show', () => {
    modal._lastFocusedElement = document.activeElement;
  });
};
