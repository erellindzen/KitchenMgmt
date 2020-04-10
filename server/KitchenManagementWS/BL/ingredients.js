const ingredientsRepository = require('../repository/ingredients');
const stockBl = require('../BL/stock.js');
const KMError = require('../custom_model/KMError');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        ingredientsRepository.getAll()
            .then(data => {
                if(data.length === 0){
                    reject(new KMError(204, `Ingredients don't exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        ingredientsRepository.getById(id)
            .then(data => {
                if(!data){
                    reject(new KMError(204, "Ingredient doesn't exist."));
                }else{
                    let quantity = 0;
                    stockBl.getByIngredient(id)
                        .then(stock => {
                            quantity = (stock.length === 0) ? 0 : ((stock.length === 1) ? stock[0].quantity : stock.reduce((total, elm) => total + elm.quantity, 0));
                        })
                        .catch(err => {
                            if(err.code != 204){
                                reject(err);
                            }
                        })
                        .finally(() => {
                            let result = {
                                id: data.id,
                                title: data.title,
                                unitTitle: data.unitTitle,
                                price: data.price,
                                canExpired: data.canExpired,
                                quantity: quantity
                            };
                            resolve(result);
                        });
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.create = (title, unitTitle, price, canExpired) => {
    return new Promise((resolve, reject) => {
        if(!title || !unitTitle || !price || canExpired === undefined || canExpired === null){
            reject(new KMError(400, "Missed parameters."));
        }

        if(price <= 0){
            reject(new KMError(400, "Bad parameters 3."));
        }

        ingredientsRepository.getMaxId()
            .then(data => {
                let id = (data.length === 0) ? 1 : data[0].id + 1;
                ingredientsRepository.create(id, title, unitTitle, price, canExpired)
                    .then(data => resolve(data))
                    .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.update = (id, title, unitTitle, price, canExpired) => {
    return new Promise((resolve, reject) => {
        if(!title || !unitTitle || !price || !canExpired){
            reject(new KMError(400, "Missed parameters."));
        }

        if(price <= 0){
            reject(new KMError(400, "Bad parameters 4."));
        }

        this.getById(id)
            .then(ingredient => {
                ingredientsRepository.update(id, title, unitTitle, price, canExpired)
                    .then(data => resolve(data))
                    .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(err));
    });
};

module.exports.use = (id, quantity) => {
    return new Promise((resolve, reject) => {
        if(!id || !quantity){
            reject(new KMError(400, "Missed parameters."));
        }

        if(quantity <= 0){
            reject(new KMError(400, "Bad parameters 5."));
        }

        this.getById(id)
            .then(ingredient => {
                stockBl.useByIngredient(id, quantity)
                    .then(data => {
                        resolve(ingredient.price * quantity);
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
};

module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        ingredientsRepository.remove(id)
            .then(data => resolve(data))
            .catch(err => reject(new KMError(500, err)));
    });
};