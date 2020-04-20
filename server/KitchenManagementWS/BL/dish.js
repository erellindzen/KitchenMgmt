const dishRepository = require('../repository/dish');
const ingredientRepository = require('../repository/ingredients');
const ingredientsBl = require('../BL/ingredients');
const categoryBL = require('../BL/category');
const KMError = require('../custom_model/KMError');

module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        dishRepository.getAll()
            .then(data => {
                if(data.length === 0){
                    reject(new KMError(204, `Dishes don't exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        dishRepository.getById(id)
            .then(data => {
                if(!data){
                    reject(new KMError(204, "Dish doesn't exist."));
                }else{
                    let promises = [];
                    for(let i = 0; i < data.ingerdients.length; i++){
                        promises.push(ingredientsBl.getById(data.ingerdients[i].id));        
                    }
                    Promise.all(promises)
                        .then(ingredients => resolve(formatDishWithAvailableStock(data, ingredients)))
                        .catch(err => reject(err));
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getByCategoryId = (caegoryId) => {
    return new Promise((resolve, reject) => {
        dishRepository.getByCategoryId(caegoryId)
            .then(data => {
                if(!data || data.length === 0){
                    reject(new KMError(204, `Dishes don't exist.`));
                }else{
                    resolve(data);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.create = (title, preperationSteps, duration, ingredients, numberOfDines, imageUrl, categoryId) => {
    return new Promise((resolve, reject) => {
        if(!title || !preperationSteps || !duration || !ingredients || !numberOfDines || !imageUrl || !categoryId){
            reject(new KMError(400, " Missed parameters."));
        }

        if(preperationSteps.length === 0 || duration <= 0 || ingredients.length === 0 || numberOfDines <= 0){
            reject(new KMError(400, "Bad parameters 1."));
        }

        ingredientRepository.getGroup(ingredients.map(ingredient => ingredient.id))
            .then(ingredientsFromRep => {
                if(ingredientsFromRep.length === ingredients.length){
                    categoryBL.getById(categoryId)
                    .then(category => {
                        dishRepository.getMaxId()
                        .then(data => {
                            let id = (data.length === 0) ? 1 : data[0].id + 1;
                            dishRepository.create(id, title, preperationSteps, duration, ingredients, numberOfDines, imageUrl, categoryId)
                                .then(data => resolve(data))
                                .catch(err => reject(new KMError(500, err)));
                        })
                        .catch(err => reject(new KMError(500, err)));
                    })
                    .catch(err => reject(new KMError(err.code, err.msg)));
                }
                else{
                    reject(new KMError(400, "Ingredient doesn't exist"));
                }
            })
            .catch(err => new KMError(500, err));
    });
};

module.exports.update = (id, title, preperationSteps, duration, ingredients, numberOfDines, imageUrl, categoryId) => {
    return new Promise((resolve, reject) => {
        if(!title || !preperationSteps || !duration || !ingredients || !numberOfDines || !imageUrl || !categoryId){
            reject(new KMError(400, "Missed parameters."));
        }

        if(preperationSteps.length === 0 || duration <= 0 || ingredients.length === 0 || numberOfDines <= 0){
            reject(new KMError(400, "Bad parameters 2."));
        }

        ingredientRepository.getGroup(ingredients.map(ingredient => ingredient.id))
            .then(ingredientsFromRep => {
                if(ingredientsFromRep.length === ingredients.length){
                    categoryBL.getById(categoryId)
                        .then(category => {
                            this.getById(id)
                                .then(dish => {
                                    dishRepository.update(id, title, preperationSteps, duration, ingredients, numberOfDines, imageUrl, categoryId)
                                        .then(data => resolve(data))
                                        .catch(err => reject(new KMError(500, err)));
                                })
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(new KMError(err.code, err.msg)));
                }
                else{
                    reject(new KMError(400, "Ingredient doesn't exist"));
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        dishRepository.remove(id)
            .then(data => resolve(data))
            .catch(err => reject(new KMError(500, err)));
    });
};

function formatDishWithAvailableStock(dish, ingredients){
    newIngredientsList = [];

    if(!dish || !ingredients){
        return dish;
    }

    dish.ingerdients.forEach(ing => {
        ingredient = (ingredients.filter(x => x.id == ing.id))[0];
        let existInStock = ingredient.quantity >= ing.quantity;
        let belowThreshold = existInStock && ing.quantity < ingredient.threshold;
        let newItem = {
            id: ing.id,
            quantity: ing.quantity,
            title: ingredient.title,
            unitTitle: ingredient.unitTitle,
            existInStock: existInStock,
            belowThreshold: belowThreshold
        };
        newIngredientsList.push(newItem);
    });

    let result = {
        preperationSteps: dish.preperationSteps,
        id: dish.id,
        title: dish.title,
        duration: dish.duration,
        ingerdients: newIngredientsList,
        numberOfDines: dish.numberOfDines,
        imageUrl: dish.imageUrl,
        categoryId: dish.categoryId
    };

    return result;
}