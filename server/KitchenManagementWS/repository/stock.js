require('../data/database');
const stockSchema = require('../model/stock');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        stockSchema.find({}, {_id: 0, __v: 0}, (err, data) => {
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

        stockSchema.findOne(filter, {_id: 0, __v: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getByIngredient = (ingredientId, canExpired) => {
    return new Promise((resolve, reject) => {
        let filter =  
            {
                ingredientId: ingredientId,
            };
        if(canExpired){
            filter.expirationDate = {"$gte": new Date()};
        }

        stockSchema.find(filter, {_id: 0, __v: 0}, (err, data) => {
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
        stockSchema.find(filter, {_id: 0, __v: 0}, (err, data) => {
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
        stockSchema.find({}).sort({id:-1}).limit(1).exec((err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.create = (id, ingredientId, quantity, expirationDate, arrivalDate) => {
    return new Promise((resolve, reject) => {
        let newShipping = new stockSchema({
            id: id,
            ingredientId: ingredientId,
            quantity: quantity, 
            expirationDate: expirationDate,
            arrivalDate: arrivalDate
        });
        
        newShipping.save()
            .then(data => resolve(data))
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
};

module.exports.update = (id, ingredientId, quantity, expirationDate) => {
    return new Promise((resolve, reject) => {
        const filter = { id: id };
        let objForUpdate = {}; 

        if(ingredientId)
            objForUpdate.ingredientId = ingredientId;
        if(quantity != null && quantity != undefined)
            objForUpdate.quantity = quantity;
        objForUpdate.expirationDate = expirationDate;
        
        stockSchema.findOneAndUpdate(filter, objForUpdate, {new: true}, (err, doc) => {
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

        stockSchema.findOneAndDelete(filter, (err, res) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};