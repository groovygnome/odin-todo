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

    pubsub.subscribe('updateProject', ([name, tasks]) => { updateProject(name, tasks) });
    pubsub.subscribe('newProject', ([name, tasks]) => { displayProject(name, tasks) });

    function displayProject(title, tasks) {
        const dashTitle = title.replace(/ /g, "-");
        const projContainer = document.createElement('div');
        const projContainerHeader = document.createElement('div');
        const buttons = document.createElement('div');
        projContainerHeader.className = 'project-header';
        projContainer.className = 'project';
        projContainer.setAttribute('id', dashTitle);
        const projName = document.createElement('h1');
        projName.textContent = title;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Project';

        deleteBtn.addEventListener('click', () => {
            const project = document.querySelector('#' + dashTitle);
            projectsContainer.removeChild(project);
            pubsub.publish(title + 'deleteProject', (title));
            pubsub.publish('deleteProject', (title));
        });


        projContainerHeader.appendChild(projName);
        buttons.appendChild(deleteBtn);
        buttons.appendChild(createNewTaskButton(title))
        projContainerHeader.appendChild(buttons);

        projContainer.appendChild(projContainerHeader);
        projContainer.appendChild(renderTasks(tasks, title));
        projectsContainer.appendChild(projContainer);

    }

    function updateProject(title, tasks) {
        const dashTitle = title.replace(/ /g, "-");
        const projContainer = document.querySelector('#' + dashTitle);
        projContainer.removeChild(projContainer.querySelector('.task-container'));
        projContainer.appendChild(renderTasks(tasks, title));
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
        const taskHeader = document.createElement('div');
        taskHeader.className = 'task-header';
        const deleteBtn = document.createElement('button');
        const taskTitle = task.getTitle();
        deleteBtn.textContent = 'Delete Task';
        const completedBtn = document.createElement('input');
        completedBtn.setAttribute('type', 'checkbox');
        const moreBtn = document.createElement('button');

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
        if (task.getCompleted()) {
            completedBtn.checked = true;
            completed.textContent = 'Completed';
            completed.style.color = 'green';
        } else {
            completedBtn.checked = false;
            completed.textContent = 'Not Completed';
            completed.style.color = 'red';
        }

        if (task.getMore()) {
            more.style.display = 'flex';
            moreBtn.textContent = 'Show Less';
        } else {
            more.style.display = 'none';
            moreBtn.textContent = 'Show More';
        }

        taskDOM.className = 'task';
        taskDOM.id = taskTitle.replace(/ /g, "-");
        deleteBtn.addEventListener('click', () => {
            pubsub.publish(projTitle + 'deleteTask', (taskTitle));
        });

        completedBtn.addEventListener('change', () => {
            pubsub.publish(projTitle + 'completeTask', (taskTitle));
            if (completedBtn.checked) {
                completed.textContent = 'Completed';
                completed.style.color = 'green';
            } else {
                completed.textContent = 'Not Completed';
                completed.style.color = 'red';
            }

        });

        moreBtn.addEventListener('click', () => {
            task.changeMore();
            if (moreBtn.textContent == 'Show More') {
                moreBtn.textContent = 'Show Less';
                more.style.display = 'flex';
            } else {
                moreBtn.textContent = 'Show More';
                more.style.display = 'none';
            }
        });
        taskHeader.appendChild(title);
        taskHeader.appendChild(dueDate);
        taskHeader.appendChild(completedBtn);
        taskHeader.appendChild(moreBtn);
        taskDOM.appendChild(taskHeader);
        more.appendChild(desc);
        more.appendChild(prio);
        more.appendChild(completed);
        more.appendChild(deleteBtn);
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


const lStorage = (() => {

    pubsub.subscribe('updateProject', ([name, tasks]) => { updateStoredProject(name, tasks) });
    pubsub.subscribe('newProject', ([name, tasks]) => { storeProject(name, tasks) });
    pubsub.subscribe('deleteProject', (name) => { deleteStoredProject(name) });

    function storeProject(title, tasks) {
        localStorage.setItem(title.replace(/ /g, "-") + '-project',
            JSON.stringify({ name: title, tasks: tasks })
        );
    }

    function updateStoredProject(title, tasks) {
        let tasksJSON = [];
        for (let task of tasks) {
            tasksJSON.push(JSON.stringify({ title: task.getTitle(), desc: task.getDesc(), dueDate: task.getDueDate(), prio: task.getPrio(), completed: task.getCompleted(), more: false }));
        }
        localStorage.setItem(title.replace(/ /g, "-") + '-project',
            JSON.stringify({ name: title, tasks: tasksJSON })
        );


    }

    function getStoredProjects() {
        const entries = Object.entries(localStorage);
        entries.forEach(([key, value]) => {
            let object = JSON.parse(value)
            let title = object.name;
            let tasksJSON = object.tasks;
            let tasks = [];
            pubsub.publish('createProject', title);
            for (let task of tasksJSON) {
                let taskObject = JSON.parse(task);
                pubsub.publish(title + 'storeTask', [taskObject.title, taskObject.desc, taskObject.dueDate, taskObject.prio, taskObject.completed]);
            }
        });
    }

    function deleteStoredProject(title) {
        localStorage.removeItem(title.replace(/ /g, '-') + '-project');

    }

    getStoredProjects();


})();

