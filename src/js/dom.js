import { formatTodoDate } from "./date.js";


function renderTodo(todo, onDelete, onEdit, projectName = "") {
    const todoCard = document.createElement("article");

    todoCard.classList.add("todo-card");
    todoCard.dataset.title = todo.title;

    todoCard.addEventListener("click", () => {
        const description = todoCard.querySelector(".todo-card-description");

        if (description.style.display === "block") {
            description.style.display = "none";
        } else {
            description.style.display = "block";
        }
    });

    todoCard.innerHTML = `
        <div class="todo-info">
            <h4>${todo.title}</h4>

            <p class="due-date">
                ${projectName ? projectName + " · " : ""}
                Due ${formatTodoDate(todo.dueDate)}
            </p>

            <p class="todo-card-description">
                ${todo.description}
            </p>
        </div>

        <span class="priority ${todo.priority}">
            ${todo.priority}
        </span>

        <div class="todo-actions">
            <button class="edit-todo">Edit</button>
            <button class="delete-todo">Delete</button>
        </div>`;

    const deleteButton = todoCard.querySelector(".delete-todo");

    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();

        onDelete(todo);
    });

    const editButton = todoCard.querySelector(".edit-todo");

    editButton.addEventListener("click", (event) => {
        event.stopPropagation();

        onEdit(todo);
    });

    return todoCard;
}


function renderProjectTodos(project, todoList, onDelete, onEdit) {
    todoList.innerHTML = "";

    project.todos.forEach((todo) => {
        const todoCard = renderTodo(
            todo,
            onDelete,
            onEdit
        );

        todoList.appendChild(todoCard);
    });
}


export { renderTodo, renderProjectTodos };