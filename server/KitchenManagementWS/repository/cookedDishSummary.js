require('../data/database');
const cookedDishSchema = require('../model/cookedDishSummary');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        cookedDishSchema.find({}, {_id: 0, __v: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const filter = {userId: userId};

        cookedDishSchema.find(filter, {_id: 0, __v: 0}, (err, data) => {
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

        cookedDishSchema.findOne(filter, {_id: 0, __v: 0}, (err, data) => {
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
        cookedDishSchema.find({}).sort({id:-1}).limit(1).exec((err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.create = (id, dishId, dishTitle, categoryId, established, cookedDate, userId, userFullName, cost) => {
    return new Promise((resolve, reject) => {
        let newCookedDish = new cookedDishSchema({
            id: id,
            dishId: dishId,
            dishTitle: dishTitle,
            categoryId: categoryId,
            established: established,
            cookedDate: cookedDate,
            userId: userId,
            userFullName: userFullName,
            cost: cost
        });
        
        newCookedDish.save()
            .then(data => resolve(data))
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
};

module.exports.update = (id, dishId, dishTitle, categoryId, established, cookedDate, userId, userFullName, cost) => {
    return new Promise((resolve, reject) => {
        const filter = { id: id };
        let objForUpdate = {}; 

        if(dishId)
            objForUpdate.dishId = dishId;
        if(dishTitle)
            objForUpdate.dishTitle = dishTitle;
        if(categoryId)
            objForUpdate.categoryId = categoryId;
        if(established)
            objForUpdate.established = established;    
        if(cookedDate)
            objForUpdate.cookedDate = cookedDate;
        if(userId)
            objForUpdate.userId = userId;
        if(userFullName)
            objForUpdate.userFullName = userFullName;
        if(cost)
            objForUpdate.cost = cost;

        cookedDishSchema.findOneAndUpdate(filter, objForUpdate, {new: true}, (err, doc) => {
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

        cookedDishSchema.findOneAndDelete(filter, (err, res) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};