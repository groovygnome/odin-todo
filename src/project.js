export class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    addTask(newTask) {
        this.tasks.push(newTask);
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
    }

    displayProject() {
        console.log(this.name);
        for (let task of this.tasks) {
            task.display();
        }
    }
}

export class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }

    changeCompleted() {
        this.completed = !this.completed;
    }

    display() {
        console.log('Title: ' + this.title + ' Description: ' + this.description + ' Due: ' + this.dueDate + ' Priority: ' + this.priority + ' Completed: ' + this.completed);
    }
}
