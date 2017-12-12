const mongoose = require('mongoose');
      Schema = mongoose.Schema;

// create todo schema
const todoSchema = new Schema({
    text: {type: String, required: true, unique: true},
    done: {type: Boolean, required: true},
    created: {type: Date, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Categories'},
});

// create todo model
const TodoModel = mongoose.model('Todos', todoSchema);

module.exports = TodoModel;