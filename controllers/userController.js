const response = require("./responses/respones");
const { ObjectId } = require("mongodb");

const userDAO = require("../infraestructure/dao/userDao");
const createUserDTO = require("../infraestructure/Models/adUser/aduserDTO");
const updateUserDTO = require("../infraestructure/Models/adUser/updateUserDTO"); 
const getUserDTO = require("../infraestructure/Models/adUser/getUserDTO"); 

/**
 * create user
 * @param {Object} req 
 */

exports.createUserLocal = async (req, session, transaction) => {
  try {
    const name = req.name;
    const email = req.email;
    const password = req.password;
    const bio = req.bio;
    const posts=req.posts
    

    const exist = await userDAO.getUserDAO({email:email})

    if(exist.data.length>0){
      throw new Error (`the email ${email} is already in use`)
    }
   
    const data = await createUserDTO(name,email,password, bio, posts)
    
    return  await userDAO.createNewUserDAO(data, session);

  } catch (error) {
    throw error
  }
};

/**
 * create user
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createUser = async (req, res , next) => {
  try {

    const result = await this.createUserLocal(req.body)

    response.success(req, res, result, 201, `user ${req.body.name} created successfully`);
  } catch (error) {

    response.error(req, res, "user not created!", 400, error.message);
  } 
 
} 

/**
 * update User
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.updateUser = async (req, res, next) => {
  try {

    const idToUpdate = ObjectId(req.query._id);
    const userToUpdate = await userDAO.getUserDAO({_id:idToUpdate})
        
    if(userToUpdate.data.length == 0){
      throw new Error ("id of the user received not exist")
    }
      
      const name = req.body.name !== undefined ? req.body.name: userToUpdate.data[0].name
      const email = req.body.email !== undefined ? req.body.email: userToUpdate.data[0].email
      const phonenumber = req.body.phonenumber !== undefined ? req.body.phonenumber : userToUpdate.data[0].phonenumber
      const posts = req.body.posts !== undefined ? req.body.posts: userToUpdate.data[0].posts
 
    //verificate if the data to put in the document exist

    
      const data = await updateUserDTO(name, email,phonenumber, posts)
      
      const result = await userDAO.updateUserDAO(idToUpdate, data); 

    response.success(req, res, result, 201, "User updated successfully");
  } catch (error) {
    response.error(req, res, "User not updated!", 400, error.message);
  }
};

/**
 * get user
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.getUser = async (req, res , next) => {

  try {
      const filter = getUserDTO(
        req.query._id,
        req.query.name,
        req.query.email,
        req.query.phonenumber,
        req.query.isactive,
        req.query.isverified,
        req.query._idlanguage,
        req.query._idclient,
        req.query._idrole,
      )

      const result =  await userDAO.getUserDAO(filter)
        
      if (!result){
          throw new Error("can not read the user") 
      }
  
    response.success(req, res, result, 200, "the product was read");
  } catch (error) {
      response.error(req, res, "User not read!", 400, error.message);
  }

}


/**
 * validate if an user exist, is active and is verified
 * @param {string} email 
 */

exports.getADUserValidate = async (req, res, next) => {
  try {
    const email = req.query.email;

    //validate if exist an User with Email received
    const validEmail = await userDAO.getUserDAO({ email:{ $regex: `^${email}$`, $options : "i"} });
    let result = "";

    if (validEmail.data.length > 0) {
      result = {
        exist: true,
        isactive: validEmail.data[0].isactive,
        isverified: validEmail.data[0].isverified,
      };
    } else {
      result = {
        exist: false,
      };
    }

    response.success(req, res, result, 200);
  } catch (error) {
    response.error(req, res, "Error with user validation", 400, error.message);
  }
};

exports.getUserCount = async (req, res, next) => {
  try {

      const email = req.query.email

      if(!email){
      throw new Error ("There are no user records associated with email received")
      }
      
      //validate if exist an User with Email received
      const validEmail = await userDAO.getUserDAO({email: { $regex: `^${email}$`, $options : "i"}});
      const clientId = validEmail.data.length > 0 ? validEmail.data[0].client : undefined

      const usersByClient = await userDAO.getUserDAO({ client: clientId }, {_id:1});

      response.success(req, res, usersByClient.data.length, 200, "Users associated with client");
  } catch (error) {
      response.error(req, res, "adUser not exists!", 400, error.message);
  }
}

/**
 * Function that returns count of users by module
 * @param {*} _idclient 
 * @param {*} _idmodule 
 */
exports.getUserCountByModule = async (_idclient, _idmodule) => {
  try {

    //Validate that _idclient and _idmodule is not undefined
    if (_idclient === undefined || _idclient === null)
      throw new Error ('there is not an _idclient received as a parameter')

    if (_idmodule === undefined || _idmodule === null)
      throw new Error ('there is not an _idmodule received as a parameter')

    //initialize ObjectId params
    const clientID = ObjectId(_idclient)
    const moduleID = ObjectId(_idmodule)

    //Return role that match with moduleID and ClientID
    let { data: roles } = await roleDao.getRoleDAO({ module: moduleID, client: clientID }, { _id: 1 })
    //If roles aren't returned, then return 0
    if(roles.length === 0)
      return 0;

    //Transform roles[i]._id array to roles array with ObjectId values
    roles = roles.map(item => (item._id))

    //Return all users with the filter sent
    const { data: user } = 
      await userDAO.getUserDAO({ isactive: true, client: clientID, role: { $in: roles}})

    return user.length;
    
  } catch (error) {
    throw new Error("error getting user count by module: " + error.message)
  }
}