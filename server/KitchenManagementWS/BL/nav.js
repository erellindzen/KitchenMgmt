const navRepository = require('../repository/nav');
const KMError = require('../custom_model/KMError');

module.exports.getByRole = (role) => {
    return new Promise((resolve, reject) => {
        navRepository.getAll()
            .then(data => {
                if(data.length === 0){
                    reject(new KMError(204, `Navs don't exist.`));
                }else{
                    resolve(data.filter(nav => nav.roles.includes(role)).map(nav => {
                        return {id: nav.id, title: nav.title, navigation: nav.navigation};
                    }));
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        navRepository.getById(id)
            .then(data => {
                if(!data){
                    reject(new KMError(204, `Nav doesn't exist.`));
                }else{
                    const newNav = {id: data.id, title: data.title, navigation: data.navigation};
                    resolve(newNav);
                }
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.create = (title, roles, navigation) => {
    return new Promise((resolve, reject) => {
        navRepository.getMaxId()
            .then(data => {
                let id = (data.length === 0) ? 1 : data[0].id + 1;
                navRepository.create(id, title, roles, navigation)
                    .then(data => resolve(data))
                    .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(new KMError(500, err)));
    });
};

module.exports.update = (id, title, roles, navigation) => {
    return new Promise((resolve, reject) => {
        this.getById(id)
            .then(nav => {
                navRepository.update(id, title, roles, navigation)
                    .then(data => resolve(data))
                    .catch(err => reject(new KMError(500, err)));
            })
            .catch(err => reject(err));
    });
};

module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        navRepository.remove(id)
            .then(data => resolve(data))
            .catch(err => reject(new KMError(500, err)));
    });
};