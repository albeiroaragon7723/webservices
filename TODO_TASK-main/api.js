var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var TaskModel = require('./task_schema');

let environment = null;

if (!process.env.ON_RENDER) {
    console.log("Cargando variables de entorno desde archivo");
    const { configDotenv } = require('dotenv');

    configDotenv()
}

// environment = {
//     DBMONGOUSER: process.env.DBMONGOUSER,
//     DBMONGOPASS: process.env.DBMONGOPASS,
//     DBMONGOSERV: process.env.DBMONGOSERV,
//     DBMONGO: process.env.DBMONGO,
// };

environment = {
    MONGO_URI: process.env.MONGO_URI
}

// var query = 'mongodb+srv://' + environment.DBMONGOUSER + ':' + environment.DBMONGOPASS + '@' + environment.DBMONGOSERV + '/' + environment.DBMONGO + '?retryWrites=true&w=majority&appName=Cluster0';

const query = environment.MONGO_URI

//var query = "mongodb+srv://stevfoun:V8Hgx4iY6fvl10w0@cluster0.tfi8n.mongodb.net/taskBD?retryWrites=true&w=majority&appName=Cluster0"
const db = (query);

mongoose.Promise = global.Promise;
mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        if (error) {
            console.log("Error! " + error);
        } else {
            console.log("Se ha conectado con la base de datos exitosamente");
        }
    }
);

//Create a task
router.post('/tasks/', (req, res) => {
    const { task_id, name, deadline } = req.body;

    if (!task_id || !name || !deadline) {
        return res.status(400).json({
            message: "does not create a task"
        })
    }

    let task = {
        TaskId: task_id,
        Name: name,
        Deadline: deadline
    }

    var newTask = new TaskModel(task)

    newTask.save((err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal error\n");
        }

        else {
            res.status(200).send("OK\n");
        }
    });

});

//search task

router.get('/tasks/', (req, res) => {
    TaskModel.find((error, data) => {
        if (!error) {
            return res.status(500).send("Internal error\n");
        }

        return res.status(200).json({
            data
        })
    });
});

router.get("/tasks/:taskId", (req, res) => {
    const { taskId: TaskId } = req.params

    TaskModel.findOne({ TaskId }, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error\n");
        }

        return res.status(200).json({
            data
        })
    })

})

//update task

router.put('/tasks/:taskId', (req, res) => {

    const { taskId: TaskId } = req.params
    const { name: Name, deadline: Deadline } = req.body

    TaskModel.updateOne(
        { TaskId },
        {
            Name,
            Deadline
        },
        (error, data) => {
            if (error) {
                return res.status(500).send("Internal error\n");
            }

            return res.status(200).json({
                data
            })
        });
});

//Delete task

router.delete('/tasks/:taskId', (req, res) => {

    const { taskId: TaskId } = req.params

    TaskModel.deleteOne({ TaskId }, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error\n");
        }

        return res.status(200).json({
            data
        })
    });
});
module.exports = router;