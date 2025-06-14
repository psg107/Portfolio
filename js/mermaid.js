import { UI_CONFIG } from "./constants.js";

export const initializeMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "loose",
    htmlLabels: true,
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      nodeSpacing: 40,
      rankSpacing: 60,
      padding: 20,
      defaultRenderer: "dagre-d3",
      useMaxWidth: true,
    },
  });
};

export const renderMermaidInTab = async (tabElement, tabName) => {
  const mermaidElements = tabElement.querySelectorAll(".mermaid");

  for (const [index, element] of mermaidElements.entries()) {
    if (element.querySelector("svg")) {
      addFullscreenButton(element);
      continue;
    }

    await renderMermaidDiagram(element, tabName, index);
  }
};

const renderMermaidDiagram = async (element, tabName, index) => {
  const mermaidCode = element.textContent.trim();
  const tempDiv = document.createElement("div");
  tempDiv.style.display = "none";
  document.body.appendChild(tempDiv);

  try {
    const uniqueId = `mermaid-${tabName}-${index}-${Date.now()}`;

    if (typeof mermaid !== "undefined") {
      const { svg } = await mermaid.render(uniqueId, mermaidCode);
      element.innerHTML = svg;
      initializePanzoom(element);
      addFullscreenButton(element);
    }
  } catch (error) {
    console.error("Mermaid 렌더링 오류:", error);
  } finally {
    document.body.removeChild(tempDiv);
  }
};

const initializePanzoom = (element) => {
  if (typeof Panzoom === "undefined") {
    console.warn("Panzoom 라이브러리가 로드되지 않았습니다.");
    return;
  }

  const svgElement = element.querySelector("svg");
  if (!svgElement) {
    console.warn("SVG 요소를 찾을 수 없습니다.");
    return;
  }

  let normalPanzoom = Panzoom(svgElement, {
    maxScale: 1,
    minScale: 1,
    startScale: 1,
    disablePan: true,
    disableZoom: true,
  });

  let fullscreenPanzoom = null;

  svgElement._panzoom = normalPanzoom;

  svgElement._enableFullscreen = () => {
    if (normalPanzoom) {
      normalPanzoom.destroy();
      normalPanzoom = null;
    }

    const isMobile = (() => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileUserAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
      
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      
      const isSmallScreen = window.innerWidth <= 768;
      
      const hasCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      
      return mobileUserAgents.test(userAgent) || (hasTouch && isSmallScreen) || hasCoarsePointer;
    })();
    
    const maxScale = isMobile ? UI_CONFIG.ZOOM.MAX * 3 : UI_CONFIG.ZOOM.MAX;

    fullscreenPanzoom = Panzoom(svgElement, {
      maxScale: maxScale,
      minScale: UI_CONFIG.ZOOM.MIN,
      startScale: UI_CONFIG.ZOOM.INITIAL,
      startX: 0,
      startY: 0,
      animate: true,
      disablePan: false,
      disableZoom: false,
    });

    svgElement.parentElement.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        fullscreenPanzoom.zoomWithWheel(e);
      },
      { passive: false }
    );

    setTimeout(() => {
      fullscreenPanzoom.zoom(1.0, { animate: false });
    }, 0);

    svgElement._panzoom = fullscreenPanzoom;
  };

  svgElement._disableFullscreen = () => {
    if (fullscreenPanzoom) {
      fullscreenPanzoom.destroy();
      fullscreenPanzoom = null;
    }

    normalPanzoom = Panzoom(svgElement, {
      maxScale: 1,
      minScale: 1,
      startScale: 1,
      disablePan: true,
      disableZoom: true,
    });

    svgElement._panzoom = normalPanzoom;
  };
};

const addFullscreenButton = (element) => {
  if (element.querySelector(".mermaid-controls")) return;

  const controls = document.createElement("div");
  controls.className = "mermaid-controls";

  const fullscreenBtn = document.createElement("button");
  fullscreenBtn.className = "mermaid-button";
  fullscreenBtn.innerHTML = "전체화면";
  fullscreenBtn.onclick = () => toggleFullscreen(element);

  const closeBtn = document.createElement("button");
  closeBtn.className = "mermaid-button close-button";
  closeBtn.innerHTML = "닫기 (ESC)";
  closeBtn.style.display = "none";
  closeBtn.onclick = () => toggleFullscreen(element);

  controls.appendChild(fullscreenBtn);
  controls.appendChild(closeBtn);
  element.appendChild(controls);
};

const toggleFullscreen = (element) => {
  const isFullscreen = element.classList.contains("fullscreen");
  const controls = element.querySelector(".mermaid-controls");
  const fullscreenBtn = controls.querySelector(".mermaid-button:first-child");
  const closeBtn = controls.querySelector(".mermaid-button:last-child");

  if (isFullscreen) {
    exitFullscreen(element, fullscreenBtn, closeBtn);
  } else {
    enterFullscreen(element, fullscreenBtn, closeBtn);
  }
};

const enterFullscreen = (element, fullscreenBtn, closeBtn) => {
  element.classList.add("fullscreen");
  document.body.style.overflow = "hidden";
  fullscreenBtn.style.display = "none";
  closeBtn.style.display = "";

  const svg = element.querySelector("svg");
  if (svg && svg._enableFullscreen) {
    svg._enableFullscreen();
  }

  element._escListener = (e) => {
    if (e.key === "Escape") {
      toggleFullscreen(element);
    }
  };
  document.addEventListener("keydown", element._escListener);
};

const exitFullscreen = (element, fullscreenBtn, closeBtn) => {
  element.classList.remove("fullscreen");
  document.body.style.overflow = "";
  fullscreenBtn.style.display = "";
  closeBtn.style.display = "none";

  const svg = element.querySelector("svg");
  if (svg && svg._disableFullscreen) {
    svg._disableFullscreen();
  }

  document.removeEventListener("keydown", element._escListener);
};
