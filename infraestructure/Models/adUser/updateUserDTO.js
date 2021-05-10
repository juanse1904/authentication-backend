const { ObjectId } = require("mongodb");

const updateUserDTO = (
    name,
    email,
    password,
    bio,
    picture,
    post
    ) => {


    
    if (name == undefined || name === '' || name == null || typeof name != "string")
        throw new Error('name is not valid');

    
    if (email == undefined || email === '' || email == null || typeof email != "string" || !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)))
        throw new Error('the email is not valid');



    return {
        password,
        bio,
        picture,
        post
    };
}

module.exports = updateUserDTO ;