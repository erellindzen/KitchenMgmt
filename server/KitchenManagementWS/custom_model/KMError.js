class KMError{
    constructor(code, msg){
        this.code = code;
        this.msg = msg;
    }
}

module.exports.getKMError = (obj) => {
    if(Object(obj).length === 2 && Object.keys(obj).includes('code') && Object.keys(obj).includes('msg')){
        return obj;
    }
    return new KMError(500, String(obj));
};

module.exports = KMError;
