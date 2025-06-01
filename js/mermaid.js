import { UI_CONFIG } from './constants.js';

// 탭 내의 Mermaid 다이어그램 렌더링
export const renderMermaidInTab = async (tabElement, tabName) => {
  const mermaidElements = tabElement.querySelectorAll('.mermaid');

  for (const [index, element] of mermaidElements.entries()) {
    if (element.querySelector('svg')) {
      addFullscreenButton(element);
      continue;
    }

    await renderMermaidDiagram(element, tabName, index);
  }
};

// 개별 Mermaid 다이어그램 렌더링
const renderMermaidDiagram = async (element, tabName, index) => {
  const mermaidCode = element.textContent.trim();
  const tempDiv = document.createElement('div');
  tempDiv.style.display = 'none';
  document.body.appendChild(tempDiv);

  try {
    const uniqueId = `mermaid-${tabName}-${index}-${Date.now()}`;

    if (typeof mermaid !== 'undefined') {
      const { svg } = await mermaid.render(uniqueId, mermaidCode);
      element.innerHTML = svg;
      initializePanzoom(element);
      addFullscreenButton(element);
    }
  } catch (error) {
    console.error('Mermaid 렌더링 오류:', error);
  } finally {
    document.body.removeChild(tempDiv);
  }
}

// Panzoom 초기화 및 이벤트 설정
const initializePanzoom = (element) => {
  if (typeof Panzoom === 'undefined') {
    console.warn('Panzoom 라이브러리가 로드되지 않았습니다.');
    return;
  }

  const svgElement = element.querySelector('svg');
  if (!svgElement) {
    console.warn('SVG 요소를 찾을 수 없습니다.');
    return;
  }

  const panzoom = Panzoom(svgElement, {
    maxScale: UI_CONFIG.ZOOM.MAX,
    minScale: UI_CONFIG.ZOOM.MIN,
    startScale: UI_CONFIG.ZOOM.INITIAL,
    startX: 0,
    startY: 0,
    animate: true
  });

  svgElement._panzoom = panzoom;
  attachPanzoomEvents(svgElement, panzoom);
}

// Panzoom 이벤트 설정
const attachPanzoomEvents = (svgElement, panzoom) => {
  // 마우스 휠 이벤트
  svgElement.parentElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    panzoom.zoomWithWheel(e);
  });

  // 터치 이벤트
  let lastTouchDistance = 0;
  svgElement.parentElement.addEventListener('touchstart', handleTouchStart, { passive: false });
  svgElement.parentElement.addEventListener('touchmove', handleTouchMove, { passive: false });
  svgElement.parentElement.addEventListener('touchend', handleTouchEnd);

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastTouchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const delta = distance - lastTouchDistance;
      lastTouchDistance = distance;

      const scale = panzoom.getScale();
      const newScale = scale * (1 + delta * 0.01);
      panzoom.zoom(newScale);
    }
  }

  function handleTouchEnd(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTouchTime;
    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault();
      panzoom.reset();
    }
    lastTouchTime = currentTime;
  }
}

// 전체화면 컨트롤 버튼 추가
const addFullscreenButton = (element) => {
  if (element.querySelector('.mermaid-controls')) return;

  const controls = document.createElement('div');
  controls.className = 'mermaid-controls';

  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.className = 'mermaid-button';
  fullscreenBtn.innerHTML = '전체화면';
  fullscreenBtn.onclick = () => toggleFullscreen(element);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'mermaid-button close-button';
  closeBtn.innerHTML = '닫기 (ESC)';
  closeBtn.style.display = 'none';
  closeBtn.onclick = () => toggleFullscreen(element);

  controls.appendChild(fullscreenBtn);
  controls.appendChild(closeBtn);
  element.appendChild(controls);
};

// 다이어그램 전체화면 토글
const toggleFullscreen = (element) => {
  const isFullscreen = element.classList.contains('fullscreen');
  const controls = element.querySelector('.mermaid-controls');
  const fullscreenBtn = controls.querySelector('.mermaid-button:first-child');
  const closeBtn = controls.querySelector('.mermaid-button:last-child');

  if (isFullscreen) {
    exitFullscreen(element, fullscreenBtn, closeBtn);
  } else {
    enterFullscreen(element, fullscreenBtn, closeBtn);
  }
};

// 전체화면 모드 진입
const enterFullscreen = (element, fullscreenBtn, closeBtn) => {
  element.classList.add('fullscreen');
  document.body.style.overflow = 'hidden';
  fullscreenBtn.style.display = 'none';
  closeBtn.style.display = '';

  resetMermaid(element);

  element._escListener = (e) => {
    if (e.key === 'Escape') {
      toggleFullscreen(element);
    }
  };
  document.addEventListener('keydown', element._escListener);
}

// 전체화면 모드 종료
const exitFullscreen = (element, fullscreenBtn, closeBtn) => {
  element.classList.remove('fullscreen');
  document.body.style.overflow = '';
  fullscreenBtn.style.display = '';
  closeBtn.style.display = 'none';

  resetMermaid(element);
  document.removeEventListener('keydown', element._escListener);
}

// 다이어그램 줌/위치 초기화
const resetMermaid = (element) => {
  const svg = element.querySelector('svg');
  if (svg && svg._panzoom) {
    svg._panzoom.reset();
  }
}
