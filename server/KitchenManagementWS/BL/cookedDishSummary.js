const cdsRepository = require('../repository/cookedDishSummary');
const dishBl = require('../BL/dish');
const ingredientsBl = require('../BL/ingredients');
const userBl = require('../BL/user');
const KMError = require('../custom_model/KMError');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        cdsRepository.getAll()
            .then(data => {
                if(data.length === 0){
                    reject(new KMError(204, `Summary is empty.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getByDate = (from, to) => {
    return new Promise((resolve, reject) => {
        cdsRepository.getAll()
            .then(data => {
                if(data.length === 0){
                    reject(new KMError(204, `Summary is empty.`));
                }else{
                    const fromDate = new Date(from);
                    const toDate = new Date(to).setHours(23, 59, 59);
    
                    let result = data.filter(cds => {
                        if(cds.cookedDate){
                            if(cds.cookedDate >= fromDate && cds.cookedDate <= toDate){
                                return true;
                            }
                        }
                        return false;
                    });
                    resolve(result);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getNotReadyByUser = async (userName) => {
    let user;
    let dishes;
    
    try {
        user = await userBl.getByUsername(userName);
    } catch (error) {
        throw KMError.getKMError(error);
    }

    try {
        if(user.role === 'admin'){
            dishes = await cdsRepository.getAll();
        }else{
            dishes = await cdsRepository.getByUserId(user.id);
        }
        if(!dishes || dishes.length === 0){
            throw new KMError(204, `List is empty.`);
        }

    } catch (error) {
        throw KMError.getKMError(error);
    }

    return dishes;
}

/*
module.exports.getNotReadyByUser = (userName) => {
    return new Promise((resolve, reject) => {
        userBl.getByUsername(userName)
            .then(user => {
                if(user){
                    cdsRepository.getByUserId(user.id)
                        .then(data => {
                            if(data.length === 0){
                                reject(new KMError(204, `List is empty.`));
                            }else{
                                resolve(data);
                            }
                        })
                        .catch(err => reject(new KMError(500, err)));
                }else{
                    reject(new KMError(500, "user is not exist"));
                }
            })
            .catch(err => reject(err));
    });
};*/

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        cdsRepository.getById(id)
            .then(data => {
                if(!data){
                    reject(new KMError(204, `Dish doesn't exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.create = async (dishId, userId) => {
    let result = [];
    
    if(!dishId || !userId){
        throw new KMError(400, "Missed parameters.");
    }

    try {
        const dishToAdd = await dishBl.getById(dishId);
        const userToAdd = await userBl.getById(userId);
        const maxIdData = await cdsRepository.getMaxId();
        const maxId = (maxIdData.length === 0) ? 1 : maxIdData[0].id + 1;
        const ingredientsStatus = await ingredientsBl.getIngredientsStatus();
        result = ingredientsStatus.filter(ing => {
            let res = false;
            dishToAdd.ingerdients.forEach(dishIng => {
                if(dishIng.id === ing.ingredient.id){
                    res = true;
                }
            })
            return res;
        });
        await cdsRepository.create(maxId, dishId, dishToAdd.title, dishToAdd.categoryId, new Date(), null, userToAdd.id, `${userToAdd.firstName} ${userToAdd.lastName}`, 0);
    } catch (error) {
        throw KMError.getKMError(error);
    }

    return result;
};

module.exports.setCookedDate = (id) => {
    return new Promise((resolve, reject) => {
        if(!id){
            reject(new KMError(400, "Missed parameters."));
        }

        cdsRepository.getById(id)
            .then(cds => {
                if(!cds){
                    reject(new KMError(404, "Item is not exist"));
                }else{
                    dishBl.getById(cds.dishId)
                        .then(dish => {
                            let itemsNotInStock = dish.ingerdients.filter(x => !x.existInStock);
                            if(itemsNotInStock.length > 0){
                                reject(new KMError(204, "items not in stock"));
                            }
                            else{
                                let promises = [];
                                
                                dish.ingerdients.forEach(ingredient => {
                                    promises.push(ingredientsBl.use(ingredient.id, ingredient.quantity));
                                });

                                Promise.all(promises)
                                    .then(ingredientsResult => {
                                        let cost = 0;
                                        cost = ingredientsResult.reduce((x, y) => x+y);
                                        
                                        cdsRepository.update(id, null, null, null, null, new Date(), null, null, cost)
                                            .then(data => resolve(data))
                                            .catch(err => reject(new KMError(500, err)));
                                    })
                                    .catch(err => reject(err));
                            }
                        })
                        .catch(err => reject(err));
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};
