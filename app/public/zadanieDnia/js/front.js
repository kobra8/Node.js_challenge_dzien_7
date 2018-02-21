// Twój kod
$(document).ready(function () {

    const nameInput = $('.new-todo');
    const addButton = $('.add-button');
    const cancelButton = $('.cancel-button');
    const list = $('.todo-list');

    addButton.on('click', () => {
        const name = nameInput.val();
        addTask(name);
    })

    cancelButton.on('click', () => {
        nameInput.val('');
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
        response.forEach(element => {
            const checkedBox = element.done ? "checked" : "";
            const listItem = document.createElement('li');
            $(`<div class="view">
            <input class="toggle" type="checkbox" ${checkedBox}> <label>${element.name}</label> <button class="destroy" id="${element.id}"></button>
            </div>
            <input class="edit"> <button class="add-button">Save</button> <button class="exit-button">Exit</button>
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
        const deleteButtons = $('.destroy');
        deleteButtons.each(function (index, value) {
            let x = $(this).attr('id');
            $(this).on('click', (x) => {
                let taskId = x.target.id;
                console.log("Delete Id",taskId);
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

    getList();
});