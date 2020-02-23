require('../data/database');
const dishSchema = require('../model/dish');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        dishSchema.find({}, {_id: 0, __v: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        const filter = {id: id};

        dishSchema.findOne(filter, {_id: 0, __v: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getByCategoryId = (categoryId) => {
    return new Promise((resolve, reject) => {
        const filter = {categoryId: categoryId};

        dishSchema.find(filter, {_id: 0, __v: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getMaxId = () => {
    return new Promise((resolve, reject) => {
        dishSchema.find({}).sort({id:-1}).limit(1).exec((err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.create = (id, title, preperationSteps, duration, ingerdients, numberOfDines, imageUrl,categoryId) => {
    return new Promise((resolve, reject) => {
        let newDish = new dishSchema({
            id: id,
            title: title,
            preperationSteps: preperationSteps,
            duration: duration,
            ingerdients: ingerdients,
            numberOfDines: numberOfDines,
            imageUrl: imageUrl,
            categoryId: categoryId
        });
        
        newDish.save()
            .then(data => resolve(data))
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
};

module.exports.update = (id, title, preperationSteps, duration, ingerdients, numberOfDines, imageUrl,categoryId) => {
    return new Promise((resolve, reject) => {
        const filter = { id: id };
        let objForUpdate = {}; 

        if(title)
            objForUpdate.title = title;
        if(preperationSteps)
            objForUpdate.preperationSteps = preperationSteps;
        if(duration)
            objForUpdate.userId = duration;
        if(ingerdients)
            objForUpdate.ingerdients = ingerdients;
        if(numberOfDines)
            objForUpdate.numberOfDines = numberOfDines;
        if(imageUrl)
            objForUpdate.imageUrl = imageUrl;
        if(categoryId)
            objForUpdate.categoryId = categoryId;

        dishSchema.findOneAndUpdate(filter, objForUpdate, {new: true}, (err, doc) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(doc);
            }
        });
    });
};

module.exports.remove = (id) => {
    return new Promise((resolve, reject) => {
        const filter = {id: id};

        dishSchema.findOneAndDelete(filter, (err, res) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};