const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const boom = require('@hapi/boom')
const bcrypt = require('bcrypt')


const userDAO = require('../../../infraestructure/dao/userDao');


passport.use(
    new BasicStrategy(async function(email,password,cb){
   try{
       console.log("this is the email by param of the function", email)
       const user = await (await userDAO.getUserDAO({email})).data[0]

 console.log("the user on the srategy", user)
       if(!user){
        console.log("there is a problem with the user", email)
           return cb(boom.unauthorized(), false);
       }
       if(!(await bcrypt.compare(password,user.password))){
        console.log("there is a error with the password")
           return cb(boom.unauthorized(), false)
       }
    delete user.password;

    return cb(null, user)
   
    }catch(error){

    return cb(error)
    
   }
})
);