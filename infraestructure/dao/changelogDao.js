let changeLog
const COLLECTION_NAME_DAO = "changelog"
const DAO_NAME = "changeLogDAO"


exports.injectdb = async (conn) => {
  if (changeLog) {
    return
  }
  try {
    changeLog = await conn.db(process.env.NAME_DB).collection(COLLECTION_NAME_DAO)
  } catch (e) {
    console.error(
      `Unable to establish a collection handle in ${DAO_NAME}: ${e}`,
    )
  }
}

  exports.createAdChangeLog = async (record) => {
    try {
      
      return await changeLog.insertOne(record)

    } catch (error) {

      throw new Error(error.message)
      
    }
  }