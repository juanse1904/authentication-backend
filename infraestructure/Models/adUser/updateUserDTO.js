const updateUserDTO = (
    name,
    email,
    phonenumber,
    posts,
    bio,
    picture
    ) => {


    
    if (name == undefined || name === '' || name == null || typeof name != "string")
        throw new Error('name is not valid');

    
    if (email == undefined || email === '' || email == null || typeof email != "string" || !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)))
        throw new Error('the email is not valid');
    



    return {
        name,
        email,
        ...(picture?{picture}:{}),
        ...(bio?{bio}:{}),
        ...(phonenumber?{phonenumber}:{}),
        ...(posts?{posts}:{}),
    };
}

module.exports = updateUserDTO ;