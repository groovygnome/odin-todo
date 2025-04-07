import './styles.css';
import { createProject, createTodo } from './project.js';
//import { createDOM } from './dom.js';
import { pubsub } from './pubsub.js';

export const dom = (() => {
    const newprojBtn = document.querySelector('.new-proj');
    const projModal = document.querySelector('.proj-modal');
    const projModalClose = document.querySelector('.proj-close');
    const projModalSubmit = document.querySelector('.proj-submit');

    newprojBtn.addEventListener('click', () => { projModal.show(); });
    projModalClose.addEventListener('click', () => { projModal.close(); event.preventDefault(); });
    projModalSubmit.addEventListener('click', () => { projModal.close(); event.preventDefault(); createDOMProject(document.querySelector('#title').value); });

    pubsub.subscribe('newTask', (project) => { updateProject(project) });
    pubsub.subscribe('newProject', (project) => { displayProject(project) });

    function displayProject(project) {
        const projContainer = document.createElement('div');
        projContainer.className = 'project';
        projContainer.setAttribute('id', project.getName());
        const projName = document.createElement('h1');
        projName.textContent = project.getName();
        projContainer.appendChild(projName);

        projContainer.appendChild(renderTasks(project.getTasks()));
        document.body.appendChild(projContainer);

    }

    function updateProject(project) {
        const projContainer = document.querySelector('#' + project.getName());
        projContainer.removeChild(projContainer.querySelector('.task-container'));
        projContainer.appendChild(renderTasks(project.getTasks()));
    }

    function createDOMProject(title) {
        const newProj = createProject(title);
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

})();

window.createProject = createProject;
window.createTodo = createTodo;
//window.createDOM = createDOM;




