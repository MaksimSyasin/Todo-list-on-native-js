const popupBg = document.querySelector('.popup__bg'),
    popup = document.querySelector('.popup'),
    modalTask = document.querySelector('.modal_task'),
    modalTaskContent = modalTask.querySelector('.modal_task-window'),
    closeModalBtn = modalTaskContent.querySelector('.close-modal'),
    openPopupButtons = document.querySelectorAll('.open-popup'),
    closePopupButton = document.querySelector('.close-popup'),
    taskSection = document.querySelector('.tasks'),
    taskDone = document.querySelector('.task_done .tasks'),
    contentTask = document.querySelector('.modal_task-content'),
    clearBtn = document.querySelector('.clearbtn');

clearBtn.addEventListener('click', () => {
    let keys = Object.keys(localStorage);

    for (let key of keys) {
        const taskItem = JSON.parse(localStorage.getItem(key));

        if (taskItem.isDone == true) {
            deleteTask(taskItem);
        }

    }
})

openPopupButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        popupBg.classList.add('active');
        popup.classList.add('active');
    })
});

function closeModal(modal) {
    modal.classList.remove('active');
}

closePopupButton.addEventListener('click', () => {
    closeModal(popupBg);
});

closeModalBtn.addEventListener('click', () => {
    closeModal(modalTask);
});

document.addEventListener('click', (e) => {
    if (e.target) {
        closeModal(e.target);
    }
});

class Task {
    constructor(title, description, date, isDone = false) {
        this.id = date;
        this.title = title;
        this.description = description;
        this.isDone = isDone;
    }
}

popup.addEventListener('submit', (e) => {
    e.preventDefault();
    target = e.target;

    const title = target.querySelector('input[name="title"]').value,
        description = target.querySelector('textarea[name="description"]').value;

    const task = new Task(title, description, Date.now());
    localStorage.setItem(task.id, JSON.stringify(task));

    renderOneTask(task);
    closeModal(popupBg);

    target.reset();
})


function renderOneTask(task) {
    const elem = document.createElement('div');
    elem.classList.add('task-item');
    elem.setAttribute('id', task.id);

    let substrdescription = '';

    if (task.description.length > 15) {
        substrdescription = `${task.description.substring(0, 40).replace(/\n\r?/g, '<br />')}...`;
    } else {
        substrdescription = task.description.replace(/\n\r?/g, '<br />');
    }

    elem.innerHTML = `
        <div class="task-delete">
            <img src="images/delete-icon.png"> 
        </div>
        <h3>
            ${task.title}
        </h3>
        
        <p class="description">
            ${substrdescription}
        </p>
    `
    const deleteBtn = elem.querySelector('.task-delete');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderDeleteTaskModal(task);
    })

    elem.addEventListener('click', () => {
        showModalTask(task);
    })

    if (task.isDone == true) {
        taskDone.append(elem);
    } else {
        taskSection.append(elem);
    }
}

function renderAllTask() {
    taskSection.innerHTML = '';
    taskDone.innerHTML = '';

    let keys = Object.keys(localStorage);

    for (let key of keys) {
        const taskItem = JSON.parse(localStorage.getItem(key));
        renderOneTask(taskItem);
    }
}

function deleteTask(task) {
    localStorage.removeItem(task.id);
    renderAllTask();
}

function renderDeleteTaskModal(task) {
    modalTask.classList.add('active');

    contentTask.innerHTML = `
        <div class='delete-modal'>
            <h2>
                Do you really want to delete the task "<span>${task.title}</span>" ?
            </h2>
            <div class='delete-modal_btns'>
                <div class='delete_task-btn'>
                    Delete the task
                </div>
                <div class='cancel_task-btn'>
                    Cancel
                </div>
            </div>

        </div>
    `
    const deleteBtn = document.querySelector('.delete_task-btn'),
        cancelBtn = document.querySelector('.cancel_task-btn');

    deleteBtn.addEventListener('click', () => {
        deleteTask(task);
        closeModal(modalTask);
    })

    cancelBtn.addEventListener('click', () => {
        closeModal(modalTask);
    })

}

function showModalTask(task) {
    modalTask.classList.add('active');
    renderModalTaskContent(task);
}

function changeValueIsDone(task) {
    task.isDone = !task.isDone;
    localStorage.setItem(task.id, JSON.stringify(task));
    renderAllTask();
}

function renderModalTaskContent(task) {
    contentTask.innerHTML = '';

    if (task.title) {
        const div = document.createElement('div');
        div.classList.add('modal_task-content_title');
        div.innerHTML = `
            <h3>
                ${task.title}
            </h3>
        `
        contentTask.append(div);
    }

    if (task.description) {
        const div = document.createElement('div');
        div.classList.add('modal_task-content_description');
        div.innerHTML = `
            <p> 
                ${task.description.replace(/\n\r?/g, '<br />')}
            </p>
        `
        contentTask.append(div);
    }

    const btnDoneOrReturn = document.createElement('div');

    if (task.isDone == false) {
        btnDoneOrReturn.classList.add('btn-done');
        btnDoneOrReturn.innerHTML = `
            Done!
        `
    } else {
        btnDoneOrReturn.classList.add('btn-return');
        btnDoneOrReturn.innerHTML = `
            Return
        `
    }

    contentTask.append(btnDoneOrReturn);
    btnDoneOrReturn.addEventListener('click', () => {
        changeValueIsDone(task);
        closeModal(modalTask);
    })
}

renderAllTask();