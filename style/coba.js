const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const UNDO_EVENT = 'undo-todo';
const DONE_EVENT = 'done-todo';
const REMOVE_EVENT = 'remove-todo';
const STORAGE_KEY = 'TODO_APPS';

function addTodo() {
    const textTodo = document.getElementById('title').value;
    const textTodoa = document.getElementById('titlea').value;
    const year = document.getElementById('year').value;
    const timestamp = document.getElementById('date').value;

    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo,textTodoa,year, timestamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(SAVED_EVENT);
}

function generateId() {
    return +new Date();
}

function generateTodoObject(id, task,taska, year, timestamp, isCompleted) {
    return {
        id,
        task,
        taska,
        year,
        timestamp,
        isCompleted
    }
}

function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData(type) {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(type));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;
    
    const textTitlea = document.createElement('h3');
    textTitlea.innerText = todoObject.taska;

    const year = document.createElement('h3');
    year.innerText = todoObject.year;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTitlea, year, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');

            undoButton.addEventListener('click', function () {
                undoTaskFromCompleted(todoObject.id);
        });
        
            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');
            
            trashButton.addEventListener('click', function () {
                removeTaskFromCompleted(todoObject.id);
            });
        
        container.append(undoButton, trashButton);
    } else {

        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
            
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');
            
            trashButton.addEventListener('click', function () {
                removeTaskFromCompleted(todoObject.id);
            });
        
        container.append(checkButton, trashButton);
    }
        
        return container;
}

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(DONE_EVENT);
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(REMOVE_EVENT);
}

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(UNDO_EVENT);
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
        submitForm.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    alert('Buku Disimpan.');
});

document.addEventListener(DONE_EVENT, () => {
    alert('Buku Dipindahkan ke Rak Selesai Dibaca!');
});

document.addEventListener(UNDO_EVENT, () => {
    alert('Buku Dipindahkan ke Rak Belum Selesai Dibaca!');
});

document.addEventListener(REMOVE_EVENT, () => {
    alert('Buku Dihapus Dari Rak!');
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('todos');
    const listCompleted = document.getElementById('completed-todos');

    // clearing list item
    uncompletedTODOList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (todoItem.isCompleted) {
        listCompleted.append(todoElement);
        } else {
        uncompletedTODOList.append(todoElement);
        }
    }
});