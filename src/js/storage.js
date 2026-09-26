function saveProjects(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
}


function loadProjects() {
    const savedProjects = localStorage.getItem("projects");

    if (savedProjects) {
        return JSON.parse(savedProjects);
    }

    return [];
}


export { saveProjects, loadProjects };