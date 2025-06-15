const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

let isScrolling = false;
let scrollTimeout;

const handleScrollStart = () => {
  if (!isScrolling) {
    isScrolling = true;
    document.body.classList.add('is-scrolling');
  }
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
    document.body.classList.remove('is-scrolling');
  }, 100);
};

const throttledScrollHandler = throttle(handleScrollStart, 16);

window.addEventListener('scroll', throttledScrollHandler, { 
  passive: true, 
  capture: false 
});

window.addEventListener('touchmove', throttledScrollHandler, { 
  passive: true 
});

export { throttle, debounce };
