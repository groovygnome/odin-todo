import './styles.css';
import { createProject, createTodo } from './project.js';
//import { createDOM } from './dom.js';
import { pubsub } from './pubsub.js';

export const dom = (() => {
    const newprojBtn = document.querySelector('.new-proj');
    const projModal = document.querySelector('.proj-modal');
    const projModalClose = document.querySelector('.proj-close');
    const projModalSubmit = document.querySelector('.proj-submit');

    const taskModal = document.querySelector('.task-modal');
    const taskModalClose = document.querySelector('.task-close');
    const taskForm = document.querySelector('#newtask');

    taskModalClose.addEventListener('click', () => { taskModal.close(); event.preventDefault(); });

    newprojBtn.addEventListener('click', () => { projModal.show(); });
    projModalClose.addEventListener('click', () => { projModal.close(); event.preventDefault(); });
    projModalSubmit.addEventListener('click', () => {
        projModal.close();
        event.preventDefault();
        const title = document.querySelector('#title');
        createDOMProject(title.value);
        title.value = '';
    });

    pubsub.subscribe('newTask', (project) => { updateProject(project) });
    pubsub.subscribe('newProject', (project) => { displayProject(project) });

    function displayProject(project) {
        title = project.getName();
        const projContainer = document.createElement('div');
        projContainer.className = 'project';
        projContainer.setAttribute('id', title);
        const projName = document.createElement('h1');
        projName.textContent = title;
        projContainer.appendChild(projName);

        projContainer.appendChild(createNewTaskButton(title))

        projContainer.appendChild(renderTasks(project.getTasks()));
        document.body.appendChild(projContainer);

    }

    function updateProject(project) {
        const projContainer = document.querySelector('#' + project.getName());
        projContainer.removeChild(projContainer.querySelector('.task-container'));
        projContainer.appendChild(renderTasks(project.getTasks()));
    }

    function createDOMProject(title) {
        pubsub.publish('createProject', (title));
    }

    function createDOMTask(title, desc, dueDate, prio) {
        pubsub.publish('createTask', (title, desc, dueDate, prio));
    }

    function renderTasks(tasks) {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';
        for (let task of tasks) {
            const taskDOM = document.createElement('div');
            taskDOM.className = 'task';
            taskDOM.textContent = task.display();
            taskContainer.appendChild(taskDOM);
        }
        return taskContainer;
    }

    function createNewTaskButton(title) {
        const newTaskBtn = document.createElement('button');
        newTaskBtn.textContent = 'New Task';

        const taskModalSubmit = document.createElement('input');
        taskModalSubmit.setAttribute('type', 'submit');
        taskModalSubmit.setAttribute('form', 'newtask');
        taskModalSubmit.textContent = 'Submit Query';

        newTaskBtn.addEventListener('click', () => { taskModal.show(); taskForm.appendChild(taskModalSubmit); });

        taskModalSubmit.addEventListener('click', () => {
            taskModal.close();
            event.preventDefault();
            const taskTitle = document.querySelector('#task-title');
            const desc = document.querySelector('#desc');
            const dueDate = document.querySelector('#duedate');
            const prio = document.querySelector('#prio');
            pubsub.publish(title + 'createTask', [taskTitle.value, desc.value, dueDate.value, prio.value]);
            taskForm.removeChild(taskModalSubmit);
            taskTitle.value = '';
            desc.value = '';
            dueDate.value = '';
            prio.value = '';
        });

        return newTaskBtn;
    }

})();

window.createProject = createProject;
window.createTodo = createTodo;
//window.createDOM = createDOM;




