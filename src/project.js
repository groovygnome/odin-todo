import { pubsub } from './pubsub.js';

pubsub.subscribe('createProject', (title) => createProject(title));

export function createProject(name) {
    let tasks = [];
    const project = { getName, getTasks, addTask, removeTask, displayProject }
    pubsub.subscribe(name + 'createTask', ([title, desc, dueDate, prio]) => addTask(createTodo(title, desc, dueDate, prio)));
    pubsub.subscribe(name + 'storeTask', ([title, desc, dueDate, prio, complete, more]) => addTask(createTodo(title, desc, dueDate, prio, complete, more)));
    pubsub.subscribe(name + 'deleteTask', (title) => removeTask(title));
    pubsub.subscribe(name + 'completeTask', (title) => { getTask(title).changeCompleted(); pubsub.publish('updateProject', project); });
    pubsub.subscribe(name + 'deleteProject', (title) => { delete this; });


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

    function addTask(newTask) {
        console.log(newTask);
        tasks.push(newTask);
        pubsub.publish('updateProject', [name, tasks]);
    }

    function removeTask(title) {
        const index = tasks.findIndex(task => task.getTitle() === title);
        if (index !== -1) {
            tasks.splice(index, 1);
        }
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
