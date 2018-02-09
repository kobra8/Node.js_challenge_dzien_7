// Twój kod
$(function () {



    const addTask = function () {
        //Send task to server
        fetch('/add', {
            method: 'POST',
            body: JSON.stringify({
                id: 1,
                name: '',
                done: false
            }),
            headers: {
                'Content-Type': 'application/json',
            }
            //Action after server response
        }).than(res => res.json())
            .than(res => {
                console.log(res);
            })
    }
});