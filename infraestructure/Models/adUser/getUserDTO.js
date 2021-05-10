const { ObjectId } = require("mongodb");


const getUserDTO = (
    
    _id,
    name,
    email,
 ) => {

    //change the type of data if in the filter there is an id
    if(_id){
        _id= ObjectId(_id)
    }

    return {
        ... (_id ? {_id} : {}),
        ... (name ? {name:{ $regex: `^${name}$`, $options : "i"}} : {}),
        ... (email ? {email} : {}),

    };
}

module.exports = getUserDTO;