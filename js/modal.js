let currentGalleryImages = [];
let currentImageIndex = 0;

const updateImageCounter = (modal) => {
  const counter = modal.querySelector(".modal-counter");
  if (counter && currentGalleryImages.length > 0) {
    counter.textContent = `${currentImageIndex + 1}/${
      currentGalleryImages.length
    }`;
  }
};

export const openImageModal = (imageSrc, galleryImages = []) => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  if (!modal || !modalImg) {
    console.error("모달 요소를 찾을 수 없습니다.");
    return;
  }

  currentGalleryImages = [];
  currentImageIndex = -1;

  currentGalleryImages = galleryImages;
  const currentImageName = imageSrc.split("/").pop();
  currentImageIndex = galleryImages.findIndex(
    (img) => img.split("/").pop() === currentImageName
  );

  modal.style.display = "block";
  modalImg.src = imageSrc;

  updateImageCounter(modal);

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

export const closeImageModal = (modal) => {
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "";

  const lastFocusedElement = modal._lastFocusedElement;
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};

export const initializeModal = () => {
  const modal = document.getElementById("imageModal");
  const closeButton = document.getElementsByClassName("modal-close")[0];

  if (!modal || !closeButton) {
    console.error("모달 요소를 찾을 수 없습니다.");
    return;
  }

  const handleKeyDown = (event) => {
    if (modal.style.display !== "block") return;

    if (event.key === "Escape") {
      closeImageModal(modal);
    } else if (event.key === "ArrowLeft") {
      showPreviousImage();
    } else if (event.key === "ArrowRight") {
      showNextImage();
    }
  };

  const handleClick = (event) => {
    if (event.target === modal) {
      closeImageModal(modal);
    }
  };

  const showPreviousImage = () => {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex =
      (currentImageIndex - 1 + currentGalleryImages.length) %
      currentGalleryImages.length;
    const modalImg = document.getElementById("modalImage");
    modalImg.src = currentGalleryImages[currentImageIndex];
    updateImageCounter(modal);
  };

  const showNextImage = () => {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    const modalImg = document.getElementById("modalImage");
    modalImg.src = currentGalleryImages[currentImageIndex];
    updateImageCounter(modal);
  };

  document.addEventListener("keydown", handleKeyDown);
  modal.addEventListener("click", handleClick);
  closeButton.addEventListener("click", () => closeImageModal(modal));

  const prevButton = modal.querySelector(".modal-prev");
  const nextButton = modal.querySelector(".modal-next");
  if (prevButton)
    prevButton.addEventListener("click", (e) => {
      e.stopPropagation();
      showPreviousImage();
    });
  if (nextButton)
    nextButton.addEventListener("click", (e) => {
      e.stopPropagation();
      showNextImage();
    });

  modal.addEventListener("show", () => {
    modal._lastFocusedElement = document.activeElement;
  });
};
