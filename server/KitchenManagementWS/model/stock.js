const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema(
    {
        id: Number,
        ingredientId: Number,
        quantity: Number,
        expirationDate: Date,
        arrivalDate: Date
    }
);

module.exports = mongoose.model('stock', stockSchema);