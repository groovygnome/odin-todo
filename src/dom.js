import { pubsub } from './pubsub.js';

export const createDOM = (() => {
    const newprojBtn = document.querySelector('.new-proj');
    const modal = document.querySelector('.modal');
    const modalCloseBtn = document.querySelector('.close');

    newprojBtn.addEventListener('click', () => { modal.show() });
    modalCloseBtn.addEventListener('click', () => { modal.close(); event.preventDefault(); })

    pubsub.subscribe('newTask', (project) => { displayProject(project) });

    function displayProject(project) {
        const projContainer = document.createElement('div');
        projContainer.className = 'project';
        const projName = document.createElement('h1');
        projName.textContent = project.getName();
        projContainer.appendChild(projName);

        let tasks = project.getTasks();
        for (let task of tasks) {
            const taskContainer = document.createElement('div');
            taskContainer.className = 'task';
            taskContainer.textContent = task.display();
            projContainer.appendChild(taskContainer);
        }
        document.body.appendChild(projContainer);

    }

    return { displayProject };


})();
