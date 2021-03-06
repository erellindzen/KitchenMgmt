const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientsSchema = new Schema(
    {
        id: Number,
        title: String,
        unitTitle: String, 
        threshold: Number,
        price: Number,
        canExpired: Boolean
    }
);

module.exports = mongoose.model('ingredients', ingredientsSchema);