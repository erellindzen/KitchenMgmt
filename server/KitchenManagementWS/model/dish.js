const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema(
    {
        id: Number,
        title: String,
        preperationSteps: [String],
        duration: Number,
        ingerdients: [{
            id: Number,
            quantity: Number
        }],
        numberOfDines: Number,
        imageUrl: String,
        categoryId: Number
    }
);

module.exports = mongoose.model('dishes', dishSchema);