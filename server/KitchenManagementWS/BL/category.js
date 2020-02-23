const categoryRepository = require('../repository/category');
const dishRepository = require('../repository/dish');
const KMError = require('../custom_model/KMError');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        categoryRepository.getAll()
            .then(data => {
                if(data.length === 0){
                    reject(new KMError(204, `Categories don't exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        categoryRepository.getById(id)
            .then(data => {
                if(!data){
                    reject(new KMError(204, `Category doesn't exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.create = (title, image) => {
    return new Promise((resolve, reject) => {
        categoryRepository.getMaxId()
            .then(data => {
                let id = (data.length === 0) ? 1 : data[0].id + 1;
                categoryRepository.create(id, title, image)
                    .then(data => resolve(data))
                    .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.update = (id, newTitle, newImage) => {
    return new Promise((resolve, reject) => {
        this.getById(id)
            .then(category => {
                categoryRepository.update(id, newTitle, newImage)
                    .then(data => resolve(data))
                    .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(err));
    });
};

module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        categoryRepository.remove(id)
            .then(data => resolve(data))
            .catch(err => reject(new KMError(500, err)));
    });
};