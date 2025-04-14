import { pubsub } from './pubsub.js';

pubsub.subscribe('createProject', (title) => createProject(title));

export function createProject(name) {
    let tasks = [];
    const project = { getName, getTasks, addTask, removeTask, displayProject }
    pubsub.subscribe(name + 'createTask', ([title, desc, dueDate, prio]) => addTask(createTodo(title, desc, dueDate, prio)));
    pubsub.subscribe(name + 'storeTask', ([title, desc, dueDate, prio, complete]) => addTask(createTodo(title, desc, dueDate, prio, complete)));
    pubsub.subscribe(name + 'deleteTask', (title) => removeTask(title));
    pubsub.subscribe(name + 'deleteProject', (title) => { delete this; });
    pubsub.subscribe(name + 'completeTask', (taskTitle) => { completeTask(taskTitle); });


    function getName() {
        return name;
    }

    function getTasks() {
        return tasks;
    }

    function getTask(title) {
        const index = tasks.findIndex(task => task.getTitle() === title);
        if (index !== -1) {
            return tasks[index];
        }
    }

    function completeTask(title) {
        const task = getTask(title);
        task.changeCompleted();
        pubsub.publish('updateProject', [name, tasks]);
    }

    function addTask(newTask) {
        tasks.push(newTask);
        pubsub.publish('updateProject', [name, tasks]);
    }

    function removeTask(title) {
        const index = tasks.findIndex(task => task.getTitle() === title);
        if (index !== -1) {
            tasks.splice(index, 1);
        }
        pubsub.publish('updateProject', [name, tasks]);
    }

    function displayProject() {
        for (let task of tasks) {
            task.display();
        }
    }

    pubsub.publish('newProject', [name, tasks]);

    return { getName, getTasks, addTask, removeTask, displayProject }
}

export function createTodo(title, description, dueDate, priority, completed = false, more = false) {

    function changeCompleted() {
        completed = !completed;
    }

    function changeMore() {
        more = !more;
    }

    function getTitle() {
        return title;
    }

    function getDesc() {
        return description;
    }

    function getDueDate() {
        return dueDate;
    }

    function getPrio() {
        return priority;
    }

    function getCompleted() {
        return completed;
    }

    function getMore() {
        return more;
    }

    function display() {
        return 'Title: ' + title + ' Description: ' + description + ' Due: ' + dueDate + ' Priority: ' + priority + ' Completed: ' + completed;
    }

    return { changeCompleted, display, getTitle, getDesc, getDueDate, getPrio, getCompleted, changeMore, getMore }
}
