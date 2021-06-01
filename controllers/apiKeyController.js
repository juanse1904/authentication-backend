const response = require("./responses/respones");
const { ObjectId } = require("mongodb");



const apiKeyDAO = require("../infraestructure/dao/apiKeyDao"); 


/**
 * get api-keys
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.getApiKey = async (req, res , next) => {

  try {

      const result =  await apiKeyDAO.getapiKeyDAO({token:req.query.token})
        
      if (!result){
          throw new Error("can no check the token") 
      }
  
    response.success(req, res, result, 200, "OK");
  } catch (error) {
      response.error(req, res, "token not read!", 400, error.message);
  }

}



