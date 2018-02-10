// Twój kod
$(function () { 

    const nameInput = $('.new-todo');
    const addButton = $('.add-button');

    addButton.on('click', () => {
        console.log(nameInput.val());
        const name = nameInput.val();
        addTask(name);
    })


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
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    }
});