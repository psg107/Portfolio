class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    img.classList.add('loading');
    
    const imageLoader = new Image();
    imageLoader.onload = () => {
      img.src = src;
      img.classList.remove('loading');
      img.classList.add('loaded');
      
      const container = img.closest('.gallery-item');
      if (container) {
        container.classList.add('loaded');
      }
    };
    
    imageLoader.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      if (window.handleImageError) {
        window.handleImageError(img, img.alt);
      }
    };
    
    imageLoader.src = src;
  }

  observe(img) {
    this.imageObserver.observe(img);
  }

  disconnect() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
  }
}

const lazyImageLoader = new LazyImageLoader();

export { lazyImageLoader };
