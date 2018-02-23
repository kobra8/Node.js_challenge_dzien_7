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

const fileRead = (callback, req, res, status) => {
    fs.readFile('./data/data.json', (err, data) => {
        if (!err) {
            callback(data, req, res, status);
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

const editTask = (data, req, res) => {
    const taskList = JSON.parse(data);
    const taskId = req.body.id
    const taskUpdated = { id: taskId, name: req.body.name, done: req.body.done };
    const taskIndex = taskList.findIndex(x => x.id == taskId);
    taskList[taskIndex] = taskUpdated
    const listToSave = JSON.stringify(taskList);
    fileWrite(listToSave, res);
}

const filterTasks = (data, req, res, status) => {
    const taskList = JSON.parse(data);
    const taskListFiltered = taskList.filter(x => x.done === status)
    res.send(taskListFiltered)
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

app.post('/edit', (req, res) => {
    fileRead(editTask, req, res)
})
//Filter active

app.get('/active', (req, res) => {
    fileRead(filterTasks, req, res, false)
})
//Filter completed

app.get('/completed', (req, res) => {
    fileRead(filterTasks, req, res, true)
})


//Listen
app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
})