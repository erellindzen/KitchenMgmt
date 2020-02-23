const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        id: Number,
        title: String,
        image: String
    }
);

module.exports = mongoose.model('categories', categorySchema);