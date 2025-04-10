import './styles.css';
import { createProject, createTodo } from './project.js';
//import { createDOM } from './dom.js';
import { pubsub } from './pubsub.js';

const dom = (() => {
    const projectsContainer = document.querySelector('.projects-container');
    const newprojBtn = document.querySelector('.new-proj');
    const projModal = document.querySelector('.proj-modal');
    const projModalClose = document.querySelector('.proj-close');
    const projModalSubmit = document.querySelector('.proj-submit');

    const taskModal = document.querySelector('.task-modal');
    const taskModalClose = document.querySelector('.task-close');
    const taskForm = document.querySelector('#newtask');

    taskModalClose.addEventListener('click', () => { taskModal.close(); event.preventDefault(); taskForm.removeChild(taskModal.querySelector(`input[type='submit']`)); });

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
        projContainer.setAttribute('id', title.replace(/ /g, "-"));
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
        const completedBtn = document.createElement('input');
        completedBtn.setAttribute('type', 'checkbox');
        const moreBtn = document.createElement('button');
        moreBtn.textContent = 'Show More';

        const title = document.createElement('h2');
        const more = document.createElement('div');
        more.id = taskTitle.replace(/ /g, "-") + 'more';
        more.classList = 'more';
        const desc = document.createElement('p');
        const dueDate = document.createElement('p');
        const prio = document.createElement('p');
        const completed = document.createElement('p');

        title.textContent = taskTitle;
        desc.textContent = task.getDesc();
        dueDate.textContent = task.getDueDate();
        prio.textContent = task.getPrio();
        switch (prio.textContent) {
            case 'No Priority':
                prio.style.color = 'grey';
                break;
            case 'Low Priority':
                prio.style.color = 'green';
                break;
            case 'Medium Priority':
                prio.style.color = 'orange';
                break;
            case 'High Priority':
                prio.style.color = 'red';
                break;
        }
        completed.textContent = 'Not Completed';
        completed.style.color = 'red';

        taskDOM.className = 'task';
        taskDOM.id = taskTitle.replace(/ /g, "-");
        deleteBtn.addEventListener('click', () => {
            const project = document.querySelector('#' + projTitle);
            const taskCont = project.querySelector('.task-container');
            const deleteTask = taskCont.querySelector('#' + taskTitle.replace(/ /g, "-"));
            taskCont.removeChild(deleteTask);
            pubsub.publish(projTitle + 'deleteTask', (taskTitle));
        });

        completedBtn.addEventListener('change', () => {
            if (completedBtn.checked) {
                completed.textContent = 'Completed'
                completed.style.color = 'green';
            } else {
                completed.textContent = 'Not Completed'
                completed.style.color = 'red';
            }

        });

        moreBtn.addEventListener('click', () => {
            if (moreBtn.textContent == 'Show More') {
                moreBtn.textContent = 'Show Less';
                more.style.display = 'inline';
            } else {
                moreBtn.textContent = 'Show More';
                more.style.display = 'none';
            }
        });
        taskDOM.appendChild(title);
        taskDOM.appendChild(dueDate);
        taskDOM.appendChild(completedBtn);
        more.appendChild(desc);
        more.appendChild(prio);
        more.appendChild(completed);
        more.appendChild(deleteBtn);
        more.style.display = 'none';
        taskDOM.appendChild(more);
        taskDOM.appendChild(moreBtn);

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


