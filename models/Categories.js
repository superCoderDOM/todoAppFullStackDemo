const mongoose = require('mongoose');
      Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {type: String, required: true, unique: true},
    color: {type: String, required: true, unique: true},
});

const CategoryModel = mongoose.model('Categories', categorySchema);

module.exports=CategoryModel;