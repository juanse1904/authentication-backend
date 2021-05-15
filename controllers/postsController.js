const response = require("./responses/respones");
const { ObjectId } = require("mongodb");

const postDAO = require("../infraestructure/dao/postsDao");
const userDAO = require("../infraestructure/dao/userDao");
const createPostDTO = require("../infraestructure/Models/adPosts/adpostDTO");
const deletePostsDTO= require("../infraestructure/Models/adPosts/deletePostDTO"); 

/**
 * create posts
 * @param {Object} req 
 */

exports.createPostLocal = async (req, session, transaction) => {
  try {
    const content = req.content;
    const link = req.link;
    const user= req._iduser;

    user=ObjectId(user);

    const exist = await userDAO.getUserDAO({_id:user})

    if(exist.data.length==0){
      throw new Error (`the user does not exist`)
    }
   
    const data = await createPostDTO(content,link,user)
    
    return  await postDAO.createNewUserDAO(data, session);

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
exports.createPost = async (req, res , next) => {
  try {

    const result = await this.createPostLocal(req.body)

    response.success(req, res, result, 201, `user ${req.body.name} created successfully`);
  } catch (error) {

    response.error(req, res, "user not created!", 400, error.message);
  } 
 
} 

/**
 * get post
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.getPost = async (req, res , next) => {

  try {
      const filter = getPostDTO(
        req.query._id,
        req.query.content,
        req.query.date,
        req.query.link
      )

      const result =  await postDAO.getPostDAO(filter)
        
      if (!result){
          throw new Error("can not read the post") 
      }
  
    response.success(req, res, result, 200, "the post was read");
  } catch (error) {
      response.error(req, res, "post not read!", 400, error.message);
  }

}


exports.deletePost = async (req, res, next) => {
  try {
    const idToDelete = ObjectId(req.query._id);

    
    if(allcountries.length==0){
      throw new Error ("the post to delete does not exist")
    }

    const isValid = await  deletePostsDTO(idToDelete)

    if(!isValid){
      throw new Error ("there is something wrong with the data")
    }
    
    const result = await postDAO.deletePostDAO(idToDelete);
    
    response.success(req, res, result, 201, "post deleted successfully");
  } catch (error) {
    response.error(req, res, "Post not deleted", 400, error.message);
  }
};
