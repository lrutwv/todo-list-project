function createProject(name) {
    return {
        name: name,
        todos: []
    };
}

function addTodoToProject(project, todo) {
    project.todos.push(todo);
}

export { createProject, addTodoToProject };