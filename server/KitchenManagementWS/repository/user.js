require('../data/database');
const userSchema = require('../model/user');

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        const filter = {id: id};

        userSchema.findOne(filter, {_id: 0, __v: 0, password: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getByUser = (username) => {
    return new Promise((resolve, reject) => {
        const filter = {username: username};

        userSchema.find(filter, {_id: 0, __v: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getByRole = (roles) => {
    return new Promise((resolve, reject) => {
        userSchema.find({_id: 0, __v: 0, password: 0})
            .where('role')
            .in(roles)
            .exec((err, data) => {
                if(err){
                    console.error(err);
                    reject(err);
                }else{
                    resolve(data);
                }
             });
    });
};

module.exports.getByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const filter = {username: username};

        userSchema.findOne(filter, {_id: 0, __v: 0, password: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getByRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        const filter = {refreshToken: refreshToken};

        userSchema.findOne(filter, {_id: 0, __v: 0, password: 0}, (err, data) => {
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
        userSchema.find({}).sort({id:-1}).limit(1).exec((err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.getByRole = (role) => {
    return new Promise((resolve, reject) => {
        const filter = {role: role};

        userSchema.find(filter, {_id: 0, __v: 0, username: 0, password: 0, role: 0, refreshToken: 0}, (err, data) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports.create = (id, username, firstName, lastName, password, role, refreshToken) => {
    return new Promise((resolve, reject) => {
        let newUser = new userSchema({
            id: id,
            firstName: firstName, 
            lastName: lastName,
            username: username,
            password: password,
            role: role,
            refreshToken: refreshToken
        });
        
        newUser.save()
            .then(data => resolve("OK"))
            .catch(err => reject(err));
    });
};

module.exports.update = (id, password, role, refreshToken) => {
    return new Promise((resolve, reject) => {
        const filter = { id: id };
        let objForUpdate = {}; 

        if(password)
            objForUpdate.password = password;
        if(role)
            objForUpdate.role = role;
        if(refreshToken)
            objForUpdate.refreshToken = refreshToken;
        
        userSchema.findOneAndUpdate(filter, objForUpdate, {new: true}, (err, doc) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve("OK");
            }
        });
    });
};

module.exports.remove = (id) => {
    return new Promise((resolve, reject) => {
        const filter = {id: id};

        userSchema.findOneAndDelete(filter, (err, res) => {
            if(err){
                console.error(err);
                reject(err);
            }else{
                resolve("OK");
            }
        });
    });
};