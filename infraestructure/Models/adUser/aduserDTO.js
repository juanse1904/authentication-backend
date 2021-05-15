
const createUserDTO = (
    name,
    email,
    password,
    ) => {


    
    if (name == undefined || name === '' || name == null || typeof name != "string")
        throw new Error('name is not valid');
    
   
    if (email == undefined || email === '' || email == null || typeof email != "string" || !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)))
        throw new Error('the email is not valid');

    
    if (password == undefined || password === '' || password == null)
        throw new Error('the value of password is not valid');

    

    return {
        name,
        email,
        password
    };
}

module.exports = createUserDTO;
