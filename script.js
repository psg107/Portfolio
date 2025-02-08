document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggle-personal-projects");
  const toggleText = document.getElementById("project-toggle-text");
  let allProjects = { main: [], personal: [] };

  function updateProjects() {
    const projectsContainer = document.getElementById("projects-container");
    projectsContainer.innerHTML = "";

    let projectsToShow = [...allProjects.main];
    if (toggleSwitch.checked) {
      projectsToShow = [...projectsToShow, ...allProjects.personal];
      toggleText.textContent = "개인 프로젝트 포함";
    } else {
      toggleText.textContent = "개인 프로젝트 제외";
    }

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

  Promise.all([
    fetch('projects.json').then(response => response.json()),
    fetch('projects2.json').then(response => response.json())
  ])
    .then(([projects1, projects2]) => {
      allProjects.main = projects1;
      allProjects.personal = projects2;
      updateProjects();
    })
    .catch(error => console.error('프로젝트 데이터를 불러오는 데 실패했습니다:', error));

  toggleSwitch.addEventListener("change", updateProjects);
});
