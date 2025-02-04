document.addEventListener("DOMContentLoaded", async function () {
  const projects = await fetchProjects();
  createProjectSection(projects);

  // 이메일 복사 이벤트 리스너
  document
    .getElementById("email")
    .addEventListener("click", copyEmailToClipboard);
});

// 이메일 복사 기능
function copyEmailToClipboard() {
  const email = document.getElementById("email").innerText;
  if (confirm("이메일을 클립보드에 복사할까요?")) {
    navigator.clipboard
      .writeText(email)
      .then(() => alert("이메일이 클립보드에 복사되었습니다!"))
      .catch((err) => alert("복사에 실패했습니다: " + err));
  }
}

// 프로젝트 데이터 가져오기
async function fetchProjects() {
  try {
    const response = await fetch("projects.json?", { cache: "no-cache" });
    return await response.json();
  } catch (error) {
    console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
    return [];
  }
}

// 프로젝트 섹션 생성
function createProjectSection(projects) {
  const projectSection = document.querySelector(".section > .projects");

  projects.forEach((project) => {
    const link = project.linkVisible ? project.link : null;
    const date = project.to ? `${project.from} ~ ${project.to}` : project.from;

    projectSection.innerHTML += `
          <div class="project">
              <div class="project-header">
                  <h3 class="name">${project.name}</h3>
                  <p class="date">${date}</p>
              </div>

              <p class="skills">${project.skills.join(", ")}</p>
              <p class="description">${project.description.replaceAll(
                "\n",
                "<br/>"
              )}</p>
              
              ${
                link
                  ? `<a class="link btn-detail" target="_blank" href='${link}'>자세히 보기</a>`
                  : ""
              }
          </div>
      `;
  });
}
