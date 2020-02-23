const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cookedDishSummarySchema = new Schema(
    {
        id: Number,
        dishId: Number,
        categoryId: Number,
        dishTitle: String,
        established: Date,
        cookedDate: Date,
        userId: Number,
        userFullName: String,
        cost: Number
    }
);

module.exports = mongoose.model('cookedDishSummary', cookedDishSummarySchema);