import { openImageModal } from "./modal.js";
import { lazyImageLoader } from "./lazyImageLoader.js";

export const createImageGallery = (project) => {
  const gallery = document.createElement("div");
  gallery.classList.add("gallery-section");

  const swiperContainer = document.createElement("div");
  swiperContainer.classList.add("swiper");

  const swiperWrapper = document.createElement("div");
  swiperWrapper.classList.add("swiper-wrapper");

  if (
    !project.images ||
    !Array.isArray(project.images) ||
    project.images.length === 0
  ) {
    return createFallbackImage(gallery, project.name);
  }

  project.images.forEach((imageName) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("gallery-item");

    const image = document.createElement("img");
    image.loading = "lazy";
    image.dataset.src = `images/${imageName}`;
    image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.3em' fill='%23d1d5db'%3E로딩 중...%3C/text%3E%3C/svg%3E"; // 플레이스홀더
    image.alt = `${project.name} 프로젝트 이미지`;
    image.draggable = false;
    
    lazyImageLoader.observe(image);
    
    image.onerror = () => handleImageError(image, project.name);
    imageContainer.addEventListener("click", () => {
      const modal = document.getElementById("imageModal");
      if (modal) {
        modal._lastFocusedElement = document.activeElement;
      }

      const galleryImages = project.images.map((img) => `images/${img}`);
      openImageModal(image.src, galleryImages);
    });
    imageContainer.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        imageContainer.click();
      }
    });
    imageContainer.setAttribute("tabindex", "0");
    imageContainer.setAttribute("role", "button");
    imageContainer.setAttribute(
      "aria-label",
      `${project.name} 프로젝트 이미지 보기`
    );

    imageContainer.appendChild(image);
    slide.appendChild(imageContainer);
    swiperWrapper.appendChild(slide);
  });

  swiperContainer.appendChild(swiperWrapper);
  gallery.appendChild(swiperContainer);
  
  requestAnimationFrame(() => {
    new Swiper(swiperContainer, {
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
    });
  });

  return gallery;
};

const createFallbackImage = (gallery, projectName) => {
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("gallery-item");

  const image = document.createElement("img");
  image.src = "images/noImage.jpg";
  image.alt = `${projectName} 프로젝트 이미지 없음`;
  image.classList.add("no-image");

  imageContainer.appendChild(image);
  gallery.appendChild(imageContainer);
  return gallery;
};

const handleImageError = (image, projectName) => {
  image.src = "images/noImage.jpg";
  image.alt = `${projectName} 프로젝트 이미지 로드 실패`;
  image.classList.add("error");
  console.warn(`이미지 로드 실패: ${projectName}`);
};

window.handleImageError = handleImageError;
