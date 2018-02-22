//Twój kod
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public/zadanieDnia'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

//Get list
app.get('/getList', (req, res) => {
    fs.readFile('./data/data.json', (err, data) => {
        res.send(data);
    })

})

//File module

const fileRead = (callback, req, res) => {
    fs.readFile('./data/data.json', (err, data) => {
        if (!err) {
            callback(data, req, res);
        }

        else {
            console.log('Error read database file!');
            res.send('Error read database file!');
        }
    })
}

const fileWrite = (dataToSave, res) => {
    fs.writeFile('./data/data.json', dataToSave, (err => {
        if (!err) {
            //Response to front
            res.send(dataToSave);
        }
        else {
            console.log('Error save database file!');
            res.send('Error save database file!');
        }
    }))
}

//Task methods

const addTask = (data, req, res) => {
    const taskList = JSON.parse(data);
    let maxId = 0;
    taskList.filter(x => {
        maxId = Math.max(x.id)
        return maxId
    })
    let id = maxId + 1;
    const taskAdded = { id: id, name: req.body.name, done: req.body.done }
    taskList.push(taskAdded)
    const listToSave = JSON.stringify(taskList);
    fileWrite(listToSave, res);
}

const deleteTask = (data, req, res) => {
    const taskId = req.params.taskId
    const taskList = JSON.parse(data);
    const taskListFiltered = taskList.filter(x => x.id != taskId)
    const listToSave = JSON.stringify(taskListFiltered);
    fileWrite(listToSave, res);
}

//Add task

app.post('/add', ((req, res) => {
    fileRead(addTask, req, res)
}))

//Delete task

app.get('/delete/:taskId', ((req, res) => {
    fileRead(deleteTask, req, res)
}))

//Edit task

app.post('/edit', (req, res)=> {
    console.log(req.body.id);
    console.log(req.body.name);
})


app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
})