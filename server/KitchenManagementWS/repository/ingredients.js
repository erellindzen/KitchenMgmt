require('../data/database');
const ingredientsSchema = require('../model/ingredients');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        ingredientsSchema.find({}, {_id: 0, __v: 0}, (err, data) => {
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

        ingredientsSchema.findOne(filter, {_id: 0, __v: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getGroup = (groupOfIds) => {
    return new Promise((resolve, reject) => {
        const filter = {id: { $in: groupOfIds}};
        ingredientsSchema.find(filter, {_id: 0, __v: 0}, (err, data) => {
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
        ingredientsSchema.find({}).sort({id:-1}).limit(1).exec((err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.create = (id, title, unitTitle, threshold, price, canExpired) => {
    return new Promise((resolve, reject) => {
        let newIngredients = new ingredientsSchema({
            id: id,
            title: title,
            unitTitle: unitTitle, 
            threshold: threshold,
            price: price,
            canExpired: canExpired
        });

        newIngredients.save()
            .then(data => resolve(data))
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
};

module.exports.update = (id, title, unitTitle, threshold, price, canExpired) => {
    return new Promise((resolve, reject) => {
        const filter = { id: id };
        let objForUpdate = {}; 

        if(title)
            objForUpdate.title = title;
        if(unitTitle)
            objForUpdate.unitTitle = unitTitle;
        if(threshold)
            objForUpdate.threshold = threshold;
        if(price)
            objForUpdate.price = price;
        if(canExpired)
            objForUpdate.canExpired = canExpired;
        
        ingredientsSchema.findOneAndUpdate(filter, objForUpdate, {new: true}, (err, doc) => {
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

        ingredientsSchema.findOneAndDelete(filter, (err, res) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};