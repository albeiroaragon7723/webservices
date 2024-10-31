const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    TaskId: Number,
    Name: String,
    Deadline: Date,
});

module.exports = mongoose.model(
    'task',
    TaskSchema,
    'Tasks'
);