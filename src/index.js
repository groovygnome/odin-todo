import './styles.css';
import { createProject, createTodo } from './project.js';
import { createDOM } from './dom.js';

window.createProject = createProject;
window.createTodo = createTodo;
window.createDOM = createDOM;

let pubsub = {
    pubsub: {},
    subscribe: function(event, fn) {
        this.pubsub[event] = this.pubsub[event] || [];
        this.pubsub[event].push(fn);
    },
    unsubscribe: function(event, fn) {
        if (this.pubsub[event]) {
            for (let i = 0; i < this.pubsub[event].length; i++) {
                if (this.pubsub[event][i] === fn) {
                    this.pubsub[event].splice(i, 1);
                }
            };
        }
    },
    publish: function(event, data) {
        if (this.pubsub[event]) {
            this.pubsub[event].forEach(function(fn) {
                fn(data);
            });
        }
    }
};

pubsub.subscribe('newTask', () => { alert('hi') });
