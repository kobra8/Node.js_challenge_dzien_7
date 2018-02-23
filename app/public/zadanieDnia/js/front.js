// Twój kod
$(document).ready(function () {

    const nameInput = $('.new-todo');
    const addButton = $('.add-button');
    const cancelButton = $('.cancel-button');
    const list = $('.todo-list');

    const active = $('.active')
    const selected = $('.selected')
    const completed = $('.completed')

    addButton.on('click', () => {
        const name = nameInput.val();
        addTask(name);
    })

    cancelButton.on('click', () => {
        nameInput.val('');
    })

    active.on('click', ()=> {
        filterActive();
    })
    completed.on('click', ()=> {
        filterCompleted();
    })

    selected.on('click', ()=> {
        list.empty();
        getList();
    })


    //Get list from serwer
    const getList = () => {
        fetch('/getList')
            .then(resp => resp.json())
            .then(response => {
                refreshList(response)
            }
            )
            .catch(err => console.log(err));
    }


    //Render DOM elements by response object
    const refreshList = (response) => {
        const taskList = response;
        response.forEach(element => {
            const checkedBox = element.done ? "checked" : "";
            const listItem = document.createElement('li');
            $(`<div class="view">
            <input class="toggle" id="${element.id}" type="checkbox" ${checkedBox}> <label>${element.name}</label> <button class="destroy" id="${element.id}"></button>
            </div>
            <input class="edit"> <button class="edit-button" id="${element.id}">Save</button> <button class="exit-button">Exit</button>
            `).appendTo(listItem);
            list[0].appendChild(listItem);
            if (element.done) {
                listItem.className = "completed"
            }
            const exitBtns = $('.exit-button')
            exitBtns.each(function (index, value) {
                $(this).on('click', (x) => {
                    $(this)[0].parentElement.className = "";
                })
            })
        })
        const editButtons = $('.edit-button');
        const editInput = $('.edit');
        const doneInput = $('.toggle');
        editButtons.each(function (index, value) {
            let x = $(this).attr('id');
            $(this).on('click', (x) => {
                let taskId = x.target.id;
                const name = editInput[index].value;
                const done = doneInput[index].defaultChecked;
                editTask(taskId, name, done);
            })
        });

        doneInput.each(function(index, value) {
            let x = $(this).attr('id');
            $(this).on('click', (x)=> {
                let taskId = x.target.id;
                const name = taskList[index].name;
                const doneStatus = doneInput[index].defaultChecked; 
                const doneStatusUpdated = !doneStatus;
                editTask(taskId, name, doneStatusUpdated);
            })
        })

        const deleteButtons = $('.destroy');
        deleteButtons.each(function (index, value) {
            let x = $(this).attr('id');
            $(this).on('click', (x) => {
                let taskId = x.target.id;
                fetch(`delete/${taskId}`)
                    .then(resp => resp.json())
                    .then(response => {
                        list.empty();
                        refreshList(response)
                    }
                    )
                    .catch(err => console.log(err));
            })
        });

        const taskLabels = $('.todo-list').find('li');
        taskLabels.each(function (index, value) {
            $(this).on('dblclick', (x) => {
                let editedId = index + 1;
                let tasklabel = $(this).find('label')[0].outerText;
                $(this)[0].className = 'editing';
                $(this).find('.edit').val(tasklabel);

            })
        })

    }

    const addTask = (task) => {
        //Send task to server
        fetch('/add', {
            method: 'POST',
            body: JSON.stringify({
                name: task,
                done: false
            }),
            headers: {
                'Content-Type': 'application/json',
            }
            //Action after server response
        })
            .then(res => res.json())
            .then(response => {
                list.empty();
                refreshList(response)
                nameInput.val('');
            }
            )
            .catch(error => console.error('Error:', error))
    }

    const editTask = (id, task, done) => {
        //Send task to server
        fetch('/edit', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                name: task,
                done: done
            }),
            headers: {
                'Content-Type': 'application/json',
            }
            //Action after server response
        })
            .then(res => res.json())
            .then(response => {
                list.empty();
                refreshList(response)
            }
            )
            .catch(error => console.error('Error:', error))
    }

    //Filter list

    const filterActive = () => {
        fetch('/active')
            .then(resp => resp.json())
            .then(response => {
                list.empty();
                refreshList(response)
            }
            )
            .catch(err => console.log(err));
    }

    const filterCompleted = () => {
        fetch('/completed')
            .then(resp => resp.json())
            .then(response => {
                list.empty();
                refreshList(response)
            }
            )
            .catch(err => console.log(err));
    }


    getList();
});