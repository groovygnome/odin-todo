import './styles.css';
import { createProject, createTodo } from './project.js';
//import { createDOM } from './dom.js';
import { pubsub } from './pubsub.js';

export const dom = (() => {
    const projectsContainer = document.querySelector('.projects-container');
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

    pubsub.subscribe('updateProject', (project) => { updateProject(project) });
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

        projContainer.appendChild(renderTasks(project.getTasks(), title));
        projectsContainer.appendChild(projContainer);

    }

    function updateProject(project) {
        const projContainer = document.querySelector('#' + project.getName());
        projContainer.removeChild(projContainer.querySelector('.task-container'));
        projContainer.appendChild(renderTasks(project.getTasks(), project.getName()));
    }

    function createDOMProject(title) {
        pubsub.publish('createProject', (title));
    }

    function renderTasks(tasks, projTitle) {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';
        for (let task of tasks) {
            taskContainer.appendChild(createTask(task, projTitle));
        }
        return taskContainer;
    }

    function createTask(task, projTitle) {
        const taskDOM = document.createElement('div');
        const deleteBtn = document.createElement('button');
        const taskTitle = task.getTitle();
        deleteBtn.textContent = 'Delete';

        const title = document.createElement('h2');
        const more = document.createElement('div');
        more.id = taskTitle + 'more';
        const desc = document.createElement('p');
        const dueDate = document.createElement('p');
        const prio = document.createElement('p');
        const completed = document.createElement('p');

        title.textContent = taskTitle;
        desc.textContent = task.getDesc();
        dueDate.textContent = task.getDueDate();
        prio.textContent = task.getPrio();
        completed.textContent = task.getCompleted();

        const completedBtn = document.createElement('button');
        completedBtn.textContent = 'Complete';

        taskDOM.className = 'task';
        taskDOM.id = taskTitle;
        deleteBtn.addEventListener('click', () => {
            const project = document.querySelector('#' + projTitle);
            const taskCont = project.querySelector('.task-container');
            const deleteTask = taskCont.querySelector('#' + taskTitle);
            taskCont.removeChild(deleteTask);
            pubsub.publish(projTitle + 'deleteTask', (taskTitle));
        });

        completedBtn.addEventListener('click', () => {
            pubsub.publish(projTitle + 'completeTask', (taskTitle));
        });
        taskDOM.appendChild(title);
        taskDOM.appendChild(dueDate);
        taskDOM.appendChild(deleteBtn);
        more.appendChild(desc);
        more.appendChild(prio);
        more.appendChild(completed);
        more.appendChild(completedBtn);
        taskDOM.appendChild(more);

        return taskDOM;
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




