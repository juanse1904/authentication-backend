const response = require("./responses/respones");
const boom = require('@hapi/boom');
const passport = require('passport')
const jwt = require('jsonwebtoken')

const apiKeyDAO = require("../infraestructure/dao/apiKeyDao"); 

//Basic strategy

/**
 * get api-keys
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.postApiKey = async (req, res , next) => {

  try {

    const apiKeyToken = req.body.apiKeyToken

    if(! apiKeyToken){
        next(boom.unauthorized('apiKeyToekn is required'))
    }

    passport.authenticate('basic', function(error,user){
        try{
            if(error|| !user){
               next(boom.unauthorized()) 
            }
            req.login(user, {session:false},async function(error){
                if (error){
                    next(error)
                }

                const apiKey= await apiKeyDAO.getApiKeyDAO({token: apiKeyToken})
            })
        }catch{
         next(error)
        }
    })(req,res,next);
      const result =  await apiKeyDAO.getapiKeyDAO({token:req.query.token})
        
      if (!result){
          throw new Error("can no check the token") 
      }
  
    response.success(req, res, result, 200, "OK");
  } catch (error) {
      response.error(req, res, "token not read!", 400, error.message);
  }

}
