// Twój kod
$(document).ready(function () {

    const nameInput = $('.new-todo');
    const addButton = $('.add-button');
    const list = $('.todo-list');

    addButton.on('click', () => {
        const name = nameInput.val();
        addTask(name);
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
            $(`<input class="toggle" type="checkbox" ${checkedBox}> <label>${element.name}</label> <button class="destroy" id="${element.id}"></button>`).appendTo(listItem);
            list[0].appendChild(listItem);
            if (element.done) {
                listItem.className = "completed"
            }
        })
        const deleteButtons = $('.destroy');
        deleteButtons.each(function(index, value) {
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
                getList()
            }
            )
            .catch(error => console.error('Error:', error))
    }

    getList();
});