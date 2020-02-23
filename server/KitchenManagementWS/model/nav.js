const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const navSchema = new Schema(
    {
        id: Number,
        title: String,
        roles: [String],
        navigation: String
    }
);

module.exports = mongoose.model('nav', navSchema);