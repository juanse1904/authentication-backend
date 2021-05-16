const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const boom = require('@hapi/boom')
const bcrypt = require('bcrypt')


const userController = require('../../../controllers/userController');


passport.use(new BasicStrategy(async function(email,password,cb){
   try{
       const user = await userController.getUser({email})
       
       if(user.data.length==0){
           return cb(boom.unauthorized(), false);
       }
       if(!(await bcrypt.compare(password,user.data.password))){
           return cb(boom.unauthorized(), false)
       }
    delete user.password;

    return cb(null, user)
   
    }catch(error){

    return cb(error)
    
   }
}))