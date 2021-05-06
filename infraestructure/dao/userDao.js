var commands = require("../commands/commands")

let user
const COLLECTION_NAME_DAO = "user"
const DAO_NAME = "userDAO"


exports.injectdb = async (conn) => {
  if (user) {
    return
  }
  try {
    user = await conn.db(process.env.NAME_DB).collection(COLLECTION_NAME_DAO)
  } catch (e) {
    console.error(
      `Unable to establish a collection handle in ${DAO_NAME}: ${e}`,
    )
  }
}

  exports.createNewUserDAO = async (record, user, session) => {
    try {
     
      const result =  await commands.createNewDocument(COLLECTION_NAME_DAO, record, user, session)

      return result 
    } catch (error) {
      throw new Error(error)
    }
  }

  exports.deleteUserDAO = async(idToDelete, user) => {
    try {

      return await commands.deleteDocument(COLLECTION_NAME_DAO, idToDelete, user)
    } catch (error) {
      throw new Error(error)
    }
  }



  exports.getUserDAO = async (filter) => {
    try {

      return await commands.getDocument(COLLECTION_NAME_DAO,filter)
    } catch (error) {
      throw new Error(error)
    }
  }

  exports.updateUserDAO = async (idToUpdate,user, data) => {
    try {

      return await commands.updateDocument(COLLECTION_NAME_DAO,idToUpdate,user, data)
    } catch (error) {
      throw new Error(error)
    }


  }
  
 