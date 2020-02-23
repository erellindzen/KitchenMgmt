const stockRepository = require('../repository/stock');
const ingredientRepository = require('../repository/ingredients');
const ingredientsBL = require('../BL/ingredients');
const KMError = require('../custom_model/KMError');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        stockRepository.getAll()
            .then(data => {
                if(data.length === 0){
                    reject(new KMError(204, `Stock is empty.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        stockRepository.getById(id)
            .then(data => {
                if(!data){
                    reject(new KMError(204, `Shipping doesn't exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getByIngredient = (ingredientId) => {
    return new Promise((resolve, reject) => {
        ingredientRepository.getById(ingredientId)
            .then(ingredient => {
                stockRepository.getByIngredient(ingredientId, ingredient.canExpired)
                    .then(data => {
                    if(data.length === 0){
                        reject(new KMError(204, `There are no shippings for ingredient.`));
                    }else{
                        resolve(data);
                    }
                })
                .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(KMError(404, `There is no such ingredient.`)));
    });
};

module.exports.create = (ingredientId, quantity, expirationDate) => {
    return new Promise((resolve, reject) => {
        if(!ingredientId || !quantity){
            reject(new KMError(400, "Missed parameters."));
        }

        if(quantity <= 0){
            reject(new KMError(400, "Bad parameters 6."));
        }

        ingredientsBL.getById(ingredientId)
            .then(data => {
                if((data.canExpired && !expirationDate) || (Date.parse(expirationDate) - Date.parse(new Date()) < 0)){
                    reject(new KMError(400, "Expiration date not valid"));
                }else{
                    stockRepository.getMaxId()
                        .then(data => {
                            let id = (data.length === 0) ? 1 : data[0].id + 1;
                            stockRepository.create(id, ingredientId, quantity, expirationDate, new Date())
                                .then(data => resolve(data))
                                .catch(err => reject(new KMError(500, err)));
                    })
                    .catch(err => reject(new KMError(500, err)));
                }
            })
            .catch(err => reject(err));
    });
};

module.exports.update = (id, ingredientId, quantity, expirationDate) => {
    return new Promise((resolve, reject) => {
        if(!ingredientId || quantity === null || quantity === undefined){
            reject(new KMError(400, "Missed parameters."));
        }

        if(quantity < 0){
            reject(new KMError(400, "Bad parameters 7."));
        }

        ingredientsBL.getById(ingredientId)
            .then(data => {
                if((data.canExpired && !expirationDate) || (Date.parse(expirationDate) - Date.parse(new Date()) < 0)){
                    reject(new KMError(400, "Expiration date not valid"));
                }
                else{
                    this.getById(id)
                        .then(data => {
                            stockRepository.update(id, ingredientId, quantity, expirationDate, new Date())
                                .then(data => resolve(data))
                                .catch(err => reject(new KMError(500, err)));
                        })
                        .catch(err => reject(err));
                }
            })
            .catch(err => reject(err));
    });
};

module.exports.useByIngredient = (ingredientId, quantity) => {
    return new Promise((resolve, reject) => {
        if(!ingredientId || !quantity){
            reject(new KMError(400, "Missed parameters."));
        }

        if(quantity <= 0){
            reject(new KMError(400, "Bad parameters 8."));
        }

        this.getByIngredient(ingredientId)
            .then(shippings => {
                let stockQuantity = (shippings.length === 0) ? 0 : ((shippings.length === 1) ? shippings[0].quantity : shippings.reduce((x, y) => x.quantity + y.quantity));
                if(stockQuantity < quantity){
                    reject(new KMError(403, "Not enough quantity"));
                }
                else{
                    let promises = [];
                    shippings.forEach(shipping => {
                        if(quantity > shipping.quantity){
                                promises.push(this.update(shipping.id, shipping.ingredientId, 0, shipping.expirationDate));
                                quantity -= shipping.quantity;
                            }else{
                                promises.push(this.update(shipping.id, shipping.ingredientId, shipping.quantity - quantity, shipping.expirationDate));
                        }
                    });
                    Promise.all(promises)
                        .then(data => resolve(data))
                        .catch(err => reject(new KMError(500, err)));
                }
                })
            .catch(err => reject(err));
        });
}

module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        stockRepository.remove(id)
            .then(data => resolve(data))
            .catch(err => reject(new KMError(500, err)));
    });
};