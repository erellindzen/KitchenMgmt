const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/KitchenManagementApp' , {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
