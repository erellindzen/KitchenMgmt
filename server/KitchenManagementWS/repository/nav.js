require('../data/database');
const navSchema = require('../model/nav');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        navSchema.find({}, {_id: 0, __v: 0}, (err, data) => {
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};


module.exports.getMaxId = () => {
    return new Promise((resolve, reject) => {
        navSchema.find({}).sort({id:-1}).limit(1).exec((err, data) => {
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.create = (id, title, roles, navigation) => {
    return new Promise((resolve, reject) => {
        let newNav = new navSchema({
            id: id,
            title: title,
            roles: [],
            navigation: navigation
        });
        roles.forEach(role => newNav.roles.push(role));
        
        newNav.save()
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
};

module.exports.update = (id, title, roles, navigation) => {
    return new Promise((resolve, reject) => {
        const filter = { id: id };
        let objForUpdate = {}; 

        if(title)
            objForUpdate.title = title;
        if(roles){
            objForUpdate.roles = [];
            roles.forEach(role => objForUpdate.roles.push(role));
        }
        if(navigation)
            objForUpdate.navigation = navigation;
        
        navSchema.findOneAndUpdate(filter, objForUpdate, {new: true}, (err, doc) => {
            if(err){
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

        navSchema.findOneAndDelete(filter, (err, res) => {
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
};