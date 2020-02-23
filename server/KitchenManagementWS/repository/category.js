require('../data/database');
const categorySchema = require('../model/category');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        categorySchema.find({}, {_id: 0, __v: 0}, (err, data) => {
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

        categorySchema.findOne(filter, {_id: 0, __v: 0}, (err, data) => {
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
        categorySchema.find({}).sort({id:-1}).limit(1).exec((err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.create = (id, title, image) => {
    return new Promise((resolve, reject) => {
        let newCategory = new categorySchema({
            id: id,
            title: title,
            image: image
        });
        
        newCategory.save()
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
};

module.exports.update = (id, newTitle, newImage) => {
    return new Promise((resolve, reject) => {
        const filter = { id: id };
        let objForUpdate = {}; 

        if(newTitle)
            objForUpdate.title = newTitle;
        if(newImage)
            objForUpdate.image = newImage;
        
        categorySchema.findOneAndUpdate(filter, objForUpdate, {new: true}, (err, doc) => {
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

        categorySchema.findOneAndDelete(filter, (err, res) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};