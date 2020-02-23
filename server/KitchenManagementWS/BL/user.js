var aesjs = require('aes-js');
const userRepository = require('../repository/user');
const KMError = require('../custom_model/KMError');
const authParams = require('../custom_model/auth_params');

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        userRepository.getById(id)
            .then(data => {
                if(!data){
                    reject(new KMError(204, "User doesn't exist."));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getByUserPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        userRepository.getByUser(username)
            .then(data => {
                if(!data){
                    reject(new KMError(204, `Username is wrong.`));
                }else{
                    let found = false;
                    data.forEach(user => {
                        if(decryptPassword(user.password) === password){
                            found = true;
                            let resUser = {
                                id: user.id,
                                username: user.username,
                                role: user.role,
                                refreshToken: user.refreshToken
                            };
                            resolve(resUser);
                        }
                    });
                    if(!found){
                        reject(new KMError(204, `Password is wrong.`));
                    }
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getByUsername = (username) => {
    return new Promise((resolve, reject) => {
        userRepository.getByUsername(username)
            .then(data => {
                if(!data){
                    reject(new KMError(204, `Username does not exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getByRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        userRepository.getByRefreshToken(refreshToken)
            .then(data => {
                if(!data){
                    reject(new KMError(204, `Refreshtoken does not exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getCooks = () => {
    return new Promise((resolve, reject) => {
        userRepository.getByRole(['cook', 'admin'])
            .then(data => {
                if(!data){
                    reject(new KMError(204, `No cooks in the system`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.create = (username, firstName, lastName, password, role, refreshToken) => {
    return new Promise((resolve, reject) => {
        userRepository.getByUsername(username)
            .then(user => {
                if(!user){
                    userRepository.getMaxId()
                    .then(data => {
                        let id = (data.length === 0) ? 1 : data[0].id + 1;
                        userRepository.create(id, username, firstName, lastName, encryptPassword(password), role, refreshToken)
                            .then(data => resolve(data))
                            .catch(err => reject(new KMError(500, err)));
                    })
                    .catch(err => reject(new KMError(500, err)));
                }else{
                    reject(new KMError(400, "user already exist"));
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.update = (id, password, role) => {
    return new Promise((resolve, reject) => {
        this.getById(id)
            .then(user => {
                userRepository.update(id, encryptPassword(password), role, null)
                    .then(data => resolve(data))
                    .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(err));
    });
};

module.exports.updateRefreshToken = (id, refreshToken) => {
    return new Promise((resolve, reject) => {
        this.getById(id)
            .then(user => {
                userRepository.update(id, null, null, refreshToken)
                    .then(data => resolve(data))
                    .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(err));
    });
};

module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        userRepository.remove(id)
            .then(data => resolve(data))
            .catch(err => reject(new KMError(500, err)));
    });
};

function encryptPassword(password){
    const textBytes = aesjs.utils.utf8.toBytes(password);
 
    const aesCtr = new aesjs.ModeOfOperation.ctr(authParams.key, new aesjs.Counter(11));
    const encryptedBytes = aesCtr.encrypt(textBytes);
 
    return aesjs.utils.hex.fromBytes(encryptedBytes);
}

function decryptPassword(password){
    const encryptedBytes = aesjs.utils.hex.toBytes(password);
 
    const aesCtr = new aesjs.ModeOfOperation.ctr(authParams.key, new aesjs.Counter(11));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
 
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
}