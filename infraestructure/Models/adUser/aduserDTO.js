const { ObjectId } = require("mongodb");
const {isEmpty} = require("../../../common/common")
const createUserDTO = (
    name,
    email,
    phonenumber,
    isactive,
    isverified,
    language,
    client,
    role
    ) => {


    
    if (name == undefined || name === '' || name == null || typeof name != "string")
        throw new Error('name is not valid');
    
    if (role == undefined || role === '' || role == null)
        throw new Error('role not inserted');

    
    if (email == undefined || email === '' || email == null || typeof email != "string" || !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)))
        throw new Error('the email is not valid');

    
    if (isactive == undefined || isactive === '' || isactive == null || typeof isactive != "boolean")
        throw new Error('the value of isactive is not valid');

    if (isverified == undefined || isverified === '' || isverified == null || typeof isverified != "boolean")
        throw new Error('the value of isverified is not valid');
    
    if (!ObjectId.isValid(language))
        throw new Error('the id of language is not valid');
        
    if (!ObjectId.isValid(client))
        throw new Error('the id of client is not valid');

    if (!Array.isArray(role))
        throw new Error('the role must be an array');
    
    role=role.map(function(id){
        return ObjectId(id)
    })

    return {
        name,
        email,
        ...(!isEmpty(phonenumber) ? { phonenumber } : {}),
        isactive,
        isverified,
        language,
        client,
        role
    };
}

module.exports = createUserDTO;
