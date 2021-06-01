var commands = require("../commands/commands")

let apiKey
const COLLECTION_NAME_DAO = "api-keys"
const DAO_NAME = "apiKeyDAO"


exports.injectdb = async (conn) => {
  if (apiKey) {
    return
  }
  try {
    apiKey = await conn.db(process.env.NAME_DB).collection(COLLECTION_NAME_DAO)
  } catch (e) {
    console.error(
      `Unable to establish a collection handle in ${DAO_NAME}: ${e}`,
    )
  }
}

  exports.getApiKeyDAO = async (filter) => {
    try {

      return await commands.getDocument(COLLECTION_NAME_DAO,filter)
    } catch (error) {
      throw new Error(error)
    }
  }

  
  
 