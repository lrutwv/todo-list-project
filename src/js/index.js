import "../css/style.css";

import { createTodo } from "./todo.js";
import { createProject, addTodoToProject } from "./project.js";
import { saveProjects, loadProjects } from "./storage.js";
import { renderTodo, renderProjectTodos } from "./dom.js";


const savedProjects = loadProjects();

let projects;

if (savedProjects.length > 0) {
    projects = savedProjects;

    if (!projects.some((project) => project.name === "Coding")) {
        projects.push(createProject("Coding"));
    }

    if (!projects.some((project) => project.name === "Design")) {
        projects.push(createProject("Design"));
    }
} else {
    projects = [
        createProject("University"),
        createProject("Coding"),
        createProject("Design")
    ];
}

saveProjects(projects);


let currentProject = projects[0];


const projectsContainer = document.querySelector(".projects");
const projectTitle = document.querySelector(".project-title");
const dateDisplay = document.querySelector(".date");
const addTodoButton = document.querySelector(".add-todo");
const todoList = document.querySelector(".todo-list");
const todoForm = document.querySelector(".todo-form");
const submitTodoButton = todoForm.querySelector("button[type='submit']");
const newProjectButton = document.querySelector(".new-project");
const projectForm = document.querySelector(".project-form");
const allTasksButton = document.querySelector(".all-tasks");

const today = new Date();

dateDisplay.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});

function deleteTodo(todoToDelete) {
    currentProject.todos = currentProject.todos.filter((todo) => {
        return todo !== todoToDelete;
    });

    saveProjects(projects);

    renderProjectTodos(
        currentProject,
        todoList,
        deleteTodo,
        editTodo
    );
}


function selectProject(project) {
    currentProject = project;

    projectTitle.textContent = currentProject.name;

    renderProjectTodos(
        currentProject,
        todoList,
        deleteTodo,
        editTodo
    );
}


function showAllTasks() {
    projectTitle.textContent = "All Tasks";

    todoList.innerHTML = "";

    projects.forEach((project) => {
        project.todos.forEach((todo) => {
            const todoCard = renderTodo(
                todo,
                deleteTodo,
                editTodo,
                project.name
            );

            todoList.appendChild(todoCard);
        });
    });
}


function addProjectButton(project) {
    const projectItem = document.createElement("div");

    projectItem.classList.add("project-item");


    const button = document.createElement("button");

    button.classList.add("project-button");
    button.dataset.project = project.name;
    button.textContent = project.name;

    button.addEventListener("click", () => {
        selectProject(project);
    });


    const deleteButton = document.createElement("button");

    deleteButton.classList.add("delete-project");
    deleteButton.dataset.project = project.name;
    deleteButton.textContent = "×";


    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();

        if (projects.length === 1) {
            return;
        }

        const confirmed = confirm(
            `Delete "${project.name}" and all its tasks?`
        );

        if (!confirmed) {
            return;
        }

        projects = projects.filter((item) => {
            return item !== project;
        });

        saveProjects(projects);

        projectItem.remove();

        if (currentProject === project) {
            currentProject = projects[0];

            projectTitle.textContent = currentProject.name;

            renderProjectTodos(
                currentProject,
                todoList,
                deleteTodo,
                editTodo
            );
        }
    });


    projectItem.appendChild(button);
    projectItem.appendChild(deleteButton);


    projectsContainer.insertBefore(
        projectItem,
        newProjectButton
    );
}


function editTodo(todoToEdit) {
    todoForm.style.display = "flex";

    document.querySelector(".todo-title").value = todoToEdit.title;
    document.querySelector(".todo-description").value = todoToEdit.description;
    document.querySelector(".todo-date").value = todoToEdit.dueDate;
    document.querySelector(".todo-priority").value = todoToEdit.priority;

    todoForm.dataset.editing = "true";
    todoForm.dataset.editingTitle = todoToEdit.title;

    submitTodoButton.textContent = "Save Changes";
}


const projectButtons = document.querySelectorAll(".project-button");

projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const projectName = button.dataset.project;

        const selectedProject = projects.find((project) => {
            return project.name === projectName;
        });

        selectProject(selectedProject);
    });
});


const deleteProjectButtons = document.querySelectorAll(".delete-project");

deleteProjectButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();

        const projectName = button.dataset.project;

        const projectToDelete = projects.find((project) => {
            return project.name === projectName;
        });

        if (projects.length === 1) {
            return;
        }

        const confirmed = confirm(
            `Delete "${projectName}" and all its tasks?`
        );

        if (!confirmed) {
            return;
        }

        projects = projects.filter((project) => {
            return project !== projectToDelete;
        });

        saveProjects(projects);

        const projectItem = button.parentElement;

        projectItem.remove();

        if (currentProject === projectToDelete) {
            currentProject = projects[0];

            projectTitle.textContent = currentProject.name;

            renderProjectTodos(
                currentProject,
                todoList,
                deleteTodo,
                editTodo
            );
        }
    });
});


addTodoButton.addEventListener("click", () => {
    if (todoForm.style.display === "flex") {
        todoForm.style.display = "none";
    } else {
        todoForm.style.display = "flex";
    }
});


newProjectButton.addEventListener("click", () => {
    if (projectForm.style.display === "flex") {
        projectForm.style.display = "none";
    } else {
        projectForm.style.display = "flex";
    }
});


projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const projectNameInput = document.querySelector(".project-name");
    const projectName = projectNameInput.value.trim();

    if (projectName === "") {
        return;
    }

    const newProject = createProject(projectName);

    projects.push(newProject);

    saveProjects(projects);

    addProjectButton(newProject);

    projectNameInput.value = "";

    projectForm.style.display = "none";

    console.log("New project created:", newProject);
});


projects.forEach((project) => {
    const projectButtonExists = Array.from(
        document.querySelectorAll(".project-button")
    ).some((button) => button.dataset.project === project.name);

    if (!projectButtonExists) {
        addProjectButton(project);
    }
});


renderProjectTodos(
    currentProject,
    todoList,
    deleteTodo,
    editTodo
);


allTasksButton.addEventListener("click", (event) => {
    event.preventDefault();

    showAllTasks();
});


todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.querySelector(".todo-title").value;
    const description = document.querySelector(".todo-description").value;
    const dueDate = document.querySelector(".todo-date").value;
    const priority = document.querySelector(".todo-priority").value;


    if (todoForm.dataset.editing === "true") {

        const oldTitle = todoForm.dataset.editingTitle;

        const todoToEdit = currentProject.todos.find((todo) => {
            return todo.title === oldTitle;
        });

        todoToEdit.title = title;
        todoToEdit.description = description;
        todoToEdit.dueDate = dueDate;
        todoToEdit.priority = priority;

        todoForm.dataset.editing = "false";
        todoForm.dataset.editingTitle = "";

        submitTodoButton.textContent = "Add Task";

    } else {

        const newTodo = createTodo(
            title,
            description,
            dueDate,
            priority
        );

        addTodoToProject(currentProject, newTodo);
    }


    renderProjectTodos(
        currentProject,
        todoList,
        deleteTodo,
        editTodo
    );

    saveProjects(projects);

    todoForm.reset();
});