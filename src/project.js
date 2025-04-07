import { pubsub } from './pubsub.js';

export function createProject(name) {
    let tasks = [];
    const project = { getName, getTasks, addTask, removeTask, displayProject }

    function getName() {
        return name;
    }

    function getTasks() {
        return tasks;
    }

    function addTask(newTask) {
        tasks.push(newTask);
        pubsub.publish('newTask', project);
    }

    function removeTask(index) {
        tasks.splice(index, 1);
    }

    function displayProject() {
        for (let task of tasks) {
            task.display();
        }
    }

    pubsub.publish('newProject', project);

    return { getName, getTasks, addTask, removeTask, displayProject }
}

export function createTodo(title, description, dueDate, priority) {
    let completed = false;

    function changeCompleted() {
        completed = !completed;
    }

    function display() {
        return 'Title: ' + title + ' Description: ' + description + ' Due: ' + dueDate + ' Priority: ' + priority + ' Completed: ' + completed;
    }

    return { changeCompleted, display }
}
