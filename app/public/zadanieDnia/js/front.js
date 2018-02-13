// Twój kod
$(document).ready(function () {

    const nameInput = $('.new-todo');
    const addButton = $('.add-button');
    const list = $('.todo-list');

    addButton.on('click', () => {
        const name = nameInput.val();
        addTask(name);
    })

    const refreshList = (response) => {
        response.forEach(element => {
            const checkedBox = element.done ? "checked" : "";
            const listItem = document.createElement('li');
            $(`<input class="toggle" type="checkbox" ${checkedBox}> <label>${element.name}</label> <button class="destroy"></button>`).appendTo(listItem);
            list[0].appendChild(listItem);
        })
    }

    const getList = () => {
        fetch('/getList')
            .then(resp => resp.json())
            .then(response => {
                refreshList(response)
            }
            )
            .catch(err => console.log(err));
    }

    getList();

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
                getList()
            }
            )
            .catch(error => console.error('Error:', error))
    }
});