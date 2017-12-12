// Server depedencies
const express = require('express'),
      app     = express(),
      PORT    = 8080;
const cors = require('cors');
const mongoose = require('mongoose');
const moment = require('moment');

// Middleware registration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Import MongoDB models
const Category = require('./models/Categories');
const Todo = require('./models/Todos');

// connection settings
const MONGO_CONNECTION_STRING = 'mongodb://localhost:27017/data/db';

// start MongoDB server
mongoose.connect(MONGO_CONNECTION_STRING);

const connection = mongoose.connection;

connection.on('open', ()=>{ 
    console.log('We are connected to mongo ^_^');

    // start HTTP server
    app.listen(PORT, ()=>{
        console.log(`Server listening on Port ${PORT}\nUse Ctrl-C to exit`)
    });
});

/*=============================================
    TODOS ROUTE ENDPOINTS & CRUD OPERATIONS
=============================================*/

// CREATE NEW to-do item
app.post('/todos', (req, res)=>{

    // code to check if request is valid

    Todo({
        text: req.body.text,
        done: false,
        created: moment(),
        category: req.body.category,
    })
    .save()
    .then(savedTodo => {
        return res.status(200).json(savedTodo);
    })
    .catch(error => {
        return res.status(500).json(error);
    });
});

// RETRIEVE single to-do item
app.get('/todos/:todoId', (req, res)=>{

    // code to check if request is valid

    Todo.findById(req.params.todoId)
    .then(todo=>{
        return res.status(200).json(todo);
    })
    .catch(error=>{
        return res.status(500).json(error);
    });
});

// RETRIEVE ALL to-do items
app.get('/todos', (req, res)=>{

    // code to check if request is valid

    Todo.find({})
    .then(allTodos=>{
        return res.status(200).json(allTodos);
    })
    .catch(error=>{
        return res.status(500).json(error);
    });
});

// UPDATE single to-do item
app.put('/todos/:todoId', (req, res)=>{

    // code to check if request is valid

    Todo.findOneAndUpdate(
        {_id: req.params.todoId},
          req.body.update
    )
    .then(previousTodoVersion=>{
        // returns previous version of object
        return res.status(200).json(previousTodoVersion);
    })
    .catch(error=>{
        return res.status(500).json(error);
    });    
});

// DELETE ALL completed to-do items
app.delete('/todos/:todoId', (req, res)=>{

    // code to check if request is valid

    // loop through list of ids and delete items
    Todo.remove({ _id: { $in: req.params.todoId.split(",") } })
    .then(removedTodo=>{
        return res.status(200).json(removedTodo);
    })
    .catch(error=>{
        return res.status(500).json(error);
    });
});


/*=================================================
    CATEGORIES ROUTE ENDPOINTS & CRUD OPERATIONS
=================================================*/

// CREATE NEW category entry
app.post('/categories', (req, res)=>{
    
        // code to check if request is valid
    
        Category({ 
            name: req.body.name,
            color: req.body.color,
        })
        .save()
        .then(savedCategory => {
            return res.status(200).json(savedCategory);
        })
        .catch(error => {
            return res.status(500).json(error);
        });
    });
    
// RETRIEVE ALL category entries
app.get('/categories', (req, res)=>{

    // code to check if request is valid

    Category.find({})
    .then(allCategories=>{
        res.status(200).json(allCategories);
    })
    .catch(error=>{
        res.status(500).json(error);
    });
});
    
// UPDATE single category entry
app.put('/categories/:categoryId', (req, res)=>{

    // code to check if request is valid

    Category.findOneAndUpdate(
        { _id: req.params.categoryId },
        req.body.update
    )
    .then(previousCategory=>{
        // returns previous version of object
        return res.status(200).json(previousCategory);
    })
    .catch(error=>{
        return res.status(500).json(error);
    });    
});

// DELETE single category entry
app.delete('/categories/:categoryId', (req, res)=>{

    // code to check if request is valid
    // refuse to delete default category
    if (req.params.categoryId === '5a125e76c987ea8fc948b089'){
        return res.status(403).json({msg: 'Default category cannot be deleted'})
    }

    Category.findOneAndRemove({ _id: req.params.categoryId })
    .then(removedCategory=>{
        return res.status(200).json(removedCategory);
    })
    .catch(error=>{
        return res.status(500).json(error);
    });
});