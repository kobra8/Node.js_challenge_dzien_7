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

//Add task
app.post('/add', ((req, res) => {
    fs.readFile('./data/data.json', (err, data) => {
        if (!err) {
            const taskList = JSON.parse(data);
            const id = taskList.length + 1;
            const taskAdded = { id: id, name: req.body.name, done: req.body.done }
            taskList.push(taskAdded)
            const listToSave = JSON.stringify(taskList);
            fs.writeFile('./data/data.json', listToSave, (err => {
                if (!err) {
                    //Response to front
                    res.send(listToSave);
                }
                else {
                    console.log('Error save database file!');
                    res.send('Error save database file!');
                }
            }))
        }
        else {
            console.log('Error read database file!');
            res.send('Error read database file!');
        }
    })
}))

//Delete task

app.get('/delete/:taskId', ((req, res) => {
    const taskId = req.params.taskId
    fs.readFile('./data/data.json', (err, data) => {
        if (!err) {
            const taskList = JSON.parse(data);
            const index = taskList.findIndex(x => x.id == taskId);
            if(index !== -1) {
                taskList.splice(index);
            }
            const listToSave = JSON.stringify(taskList);
            fs.writeFile('./data/data.json', listToSave, (err => {
                if (!err) {
                    //Response to front
                    res.send(listToSave);
                }
                else {
                    console.log('Error save database file!');
                    res.send('Error save database file!');
                }
            }))
        }
            else {
                console.log('Error read database file!');
                res.send('Error read database file!');
            }
        })
    }))


app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
})