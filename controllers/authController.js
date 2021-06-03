const boom = require('@hapi/boom');
const passport = require('passport')
const jwt = require('jsonwebtoken')

const apiKeyDAO = require("../infraestructure/dao/apiKeyDao"); 

//Basic strategy
require('../utils/auth/strategies/basic')
/**
 * get api-keys
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.postApiKey = async (req, res , next) => {


        const apiKeyToken = req.body.apiKeyToken

        if(! apiKeyToken){
            next(boom.unauthorized('apiKeyToekn is required'))
        }
        passport.authenticate('basic', function(error,user){
            try{
                if(error|| !user){
 
                    next(boom.unauthorized()) 
                }
   
                req.login(user, {session:false}, async function(error){

                    if (error){
                       next(error)
                    }
                    const apiKey= await apiKeyDAO.getApiKeyDAO({token: apiKeyToken})

    
                    if(!apiKey){
                      next(boom.unauthorized());  
                    }
                   
                    const {_id: id, name, email}=user;
    
                    const payload = {
                     sub:id,
                     name,
                     email,
                     scopes: apiKey.scopes
                    }
    
                 const token = jwt.sign(payload, process.env.AUTH_JWT_SECRET,{
                     expiresIn: '10m'
                 });
    
                 return res.status(200).json({token, user: {id,name, email}})
                })
            }catch{
    
             next(error)
            }
        })(req,res,next)

}
