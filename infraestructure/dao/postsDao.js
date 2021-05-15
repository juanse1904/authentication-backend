var commands = require("../commands/commands")

let user
const COLLECTION_NAME_DAO = "posts"
const DAO_NAME = "postsDAO"


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

  exports.createNewPostDAO = async (record, user, session) => {
    try {
     
      const result =  await commands.createNewDocument(COLLECTION_NAME_DAO, record, user, session)

      return result 
    } catch (error) {
      throw new Error(error)
    }
  }

  exports.deletePostDAO = async(idToDelete) => {
    try {

      return await commands.deleteDocument(COLLECTION_NAME_DAO, idToDelete)
    } catch (error) {
      throw new Error(error)
    }
  }



  exports.getPostDAO = async (filter) => {
    try {

      return await commands.getDocument(COLLECTION_NAME_DAO,filter)
    } catch (error) {
      throw new Error(error)
    }
  }

