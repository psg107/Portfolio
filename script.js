// 상수 정의
const COMPANIES = {
  NOLUNIVERSE: 'noluniverse',
  KSOFT: 'ksoft',
  PERSONAL: 'personal'
};

// 프로젝트 데이터 상태 관리
const projectState = {
  data: {
    [COMPANIES.NOLUNIVERSE]: [],
    [COMPANIES.KSOFT]: [],
    [COMPANIES.PERSONAL]: []
  },
  
  addProject(project) {
    const { companyName, type } = project;
    if (companyName === COMPANIES.NOLUNIVERSE) {
      this.data[COMPANIES.NOLUNIVERSE].push(project);
    } else if (companyName === COMPANIES.KSOFT) {
      this.data[COMPANIES.KSOFT].push(project);
    } else if (type === 'private') {
      this.data[COMPANIES.PERSONAL].push(project);
    }
  }
};

const switchCompanyTab = (tabName) => {
  // 탭 버튼 상태 업데이트
  const tabButtons = document.querySelectorAll('.tab-button');
  const targetButton = Array.from(tabButtons).find(button => 
    button.getAttribute('onclick').includes(tabName)
  );
  
  tabButtons.forEach(button => button.classList.remove('active'));
  if (targetButton) {
    targetButton.classList.add('active');
  }
  
  // 탭 컨텐츠 상태 업데이트
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));

  // 프로젝트 업데이트
  updateProjects(tabName);
  
  const targetTab = document.getElementById(tabName + '-tab');
  if (targetTab) {
    targetTab.classList.add('active');
    
    setTimeout(() => {
      renderMermaidInTab(targetTab, tabName);
    }, 100);
  }
}

const updateProjects = (tabName) => {
  const tabContent = document.getElementById(tabName + '-tab');
  if (!tabContent) return;

  // 프로젝트 컨테이너가 없으면 생성
  let projectsContainer = tabContent.querySelector('.projects-container');
  if (!projectsContainer) {
    projectsContainer = document.createElement('div');
    projectsContainer.className = 'projects-container';
    tabContent.appendChild(projectsContainer);
  }

  projectsContainer.innerHTML = "";
  const projectsToShow = projectState.data[tabName] || [];

  projectsToShow.sort((a, b) => b.from.localeCompare(a.from));

  projectsToShow.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');

    const title = document.createElement('h3');
    title.textContent = project.name;
    projectCard.appendChild(title);

    const date = document.createElement('p');
    date.classList.add('date');
    date.textContent = project.from + (project.to ? ` - ${project.to}` : '');
    projectCard.appendChild(date);

    const skills = document.createElement('p');
    skills.classList.add('skills');
    skills.textContent = project.skills.join(', ');
    projectCard.appendChild(skills);

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = project.description;
    projectCard.appendChild(description);

    if (project.linkVisible) {
      const projectLink = document.createElement('a');
      projectLink.classList.add('project-link');
      projectLink.href = project.link;
      projectLink.target = '_blank';
      projectLink.textContent = '프로젝트 보기';
      projectCard.appendChild(projectLink);
    }

    projectsContainer.appendChild(projectCard);
  });
}

const renderMermaidInTab = async (tabElement, tabName) => {
  const mermaidElements = tabElement.querySelectorAll('.mermaid');
  
  for (const [index, element] of mermaidElements.entries()) {
    if (element.querySelector('svg')) continue;
    
    const mermaidCode = element.textContent.trim();
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);
    
    try {
      const uniqueId = `mermaid-${tabName}-${index}-${Date.now()}`;
      
      if (typeof mermaid !== 'undefined') {
        const { svg } = await mermaid.render(uniqueId, mermaidCode);
        element.innerHTML = svg;
        
        // SVG Pan Zoom 초기화
        if (typeof svgPanZoom !== 'undefined') {
          const svgElement = element.querySelector('svg');
          svgPanZoom(svgElement, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1,
            maxZoom: 10
          });
        }
      }
    } catch (error) {
      console.error('Mermaid rendering error:', error);
    } finally {
      document.body.removeChild(tempDiv);
    }
  }
};

// 초기화 함수
const initializePortfolio = async () => {
  try {
    const [projects1, projects2] = await Promise.all([
      fetch('projects.json').then(response => response.json()),
      fetch('projects2.json').then(response => response.json())
    ]);

    [...projects1, ...projects2].forEach(project => projectState.addProject(project));
    switchCompanyTab(COMPANIES.NOLUNIVERSE);
  } catch (error) {
    console.error('프로젝트 데이터를 불러오는 데 실패했습니다:', error);
  }
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializePortfolio);
