const { ObjectId} = require("mongodb");
const changeLogController = require("../../controllers/adChangeLogController");



let client;
const USER_COLLECTION = "user"
const CURRENT_VERSION="1"

/**
 * injectdb; Bring database client to commands
 * @param {} conn mongodb client
 */

exports.injectdb = async (conn) => {
    if (client) {
      return
    }
    try {
      client = conn;
    } catch (e) {
      console.error(
        `Unable to send a client to commands: ${e}`,
      )
    }
  }

/**
 * createOrUpdateValidation: generate created or updated object used to be introduced in some collection
 * @param {ObjectId} user
 * @return {Object} 
 */  

exports.createOrUpdateValidation = async (user) => {

  const userValid = ObjectId.isValid(user);
    if (!userValid){
      throw new Error("user id received is not an objectid");
    }
  return {
    user: user,
    date: new Date()
  }
} 

/**
 * createNewDocument: insert new document in a database's collection
 * @param {string} collectionName 
 * @param {Object} data
 * @param {ObjectId} User
 * @return {Object} 
 */ 

exports.createNewDocument = async (collectionName, data, user, session) => {
  try {
    let status = false;

    //created data for JSON
    const created = await this.createOrUpdateValidation(user);

    data.created = created;
    data.schema_version = CURRENT_VERSION;

    //validate if userId received exists
    var userCollection = client.db(process.env.NAME_DB).collection(USER_COLLECTION);
    const resultFindUser = await userCollection.findOne({ _id: user });
    if (resultFindUser === null) {
      throw new Error("User ID received not exist");
    };

    //insert data into collection received
    
    var collection = client.db(process.env.NAME_DB).collection(collectionName);

    const resultInsert = await collection.insertOne(data, session ? {session}: null );


    if (!resultInsert.insertedId) {
      return {
        status: false,
      };
    }else{
      //insert changeLog register
      const insertedID = resultInsert.insertedId;
      await changeLogController.createADChangeLog("INSERT", collectionName, insertedID, null, null, user );
      status=true;
      return [{
        status: status,
        _id: insertedID,
      }];
    }
 
  } catch (error) {
    throw error.message;
  };
}

/**
 * updateDocument: updated a document in a database's collection
 * @param {string} collectionName
 * @param {ObjectId} idToUpdate
 * @param {ObjectId} User
 * @param {Object} data
 * @param {Object} projection
 * @return {Object} 
 */
exports.updateDocument = async (collectionName, idToUpdate, user, data, projection) => {
    try {

      let status = false

       //create updated document 
       const updated = await this.createOrUpdateValidation(user) 
       data.updated = updated;
       data.schema_version = "1"

      //validate if userId received exist
      var userCollection = client.db(process.env.NAME_DB).collection(USER_COLLECTION);
      const resultFindUser = await userCollection.findOne({ _id: user });
      if (resultFindUser == null) {
        throw new Error("User ID received is not valid");
      }
      
      //update original document with data received. 
      let resultUpdate;
      var collection = client.db(process.env.NAME_DB).collection(collectionName);

      //validate if idToUpdate received exist
      const resultFindIdToUpdate = await collection.findOne({ _id: idToUpdate });
      if (resultFindIdToUpdate == null) {
        throw new Error(`idToUpdate received not exist in collection ${collectionName}`);
      }


      if(!projection){

        resultUpdate = await collection.findOneAndUpdate({_id: idToUpdate},{ $set: data})

      }else{
         resultUpdate = await collection.findOneAndUpdate({_id: idToUpdate},{ $set: data},{projection})
      }
      
      if (!resultUpdate.value) {
        throw new Error ('idToUpdate is not valid')

      }else{
        //insert changeLog register
        await changeLogController.createADChangeLog("UPDATE", collectionName, idToUpdate, resultUpdate.value , data , user );
        status=true;
        return [{
          status: status,
          _id: idToUpdate,
        }];
      }
   
    } catch (error) {
      throw error.message;
    };
  }; 
  
  /**
 * deleteDocument: delete a document from a database's collection
 * @param {string} collectionName
 * @param {ObjectId} idToDelete
 * @param {ObjectId} User
 * @return {Object} 
 */
  exports.deleteDocument = async (collectionName, idToDelete, user) => {
    try {

      const userValid = ObjectId.isValid(user)
        if (!userValid){
        throw new Error("userid received is not an objectid")
        }

      //validate if userId received exist
      var userCollection = client.db(process.env.NAME_DB).collection(USER_COLLECTION);
      const resultFindUser = await userCollection.findOne({ _id: user });
        if (resultFindUser == null) {
        throw new Error("User ID received is not valid");
        }
      
      //validate id received is an objectid
      const idToDeleteValid = ObjectId.isValid(idToDelete)
      if (!idToDeleteValid){
      throw new Error("idToDelete received is not an objectid")
      }

      //call collection
      var collection = client.db(process.env.NAME_DB).collection(collectionName);

      //validate if idToDelete exist or not
      const validIdToDelete = await collection.findOne({_id: idToDelete})
      if(!validIdToDelete){
        throw new Error ('idToDelete received not exist')
      }

      const resultDelete = await collection.deleteOne({_id: idToDelete});
  
      if (resultDelete.deletedCount == 0) {
        throw new Error(
          "there was an error with the deletion of the record"
        );
      }else{
        await changeLogController.createADChangeLog("DELETE", collectionName, idToDelete, null, null, user );
      }
      return {
       status: "true",
       _idDeleted: idToDelete 
      }
      
    } catch (error) {
      throw error;
    };
    }

  
/**
 * getDocument: Get documents from a database's collection
 * @param {string} collectionName
 * @param {Object} filter
 * @param {object} projection
 */
exports.getDocument = async (collectionName, filter,projection) => {
  let status = false;
  try {
    var result=[]

    var collection = client.db(process.env.NAME_DB).collection(collectionName)

    //VALIDATE IF THE DATA HAS INFO AND IF IT IS AN OJBJECT
    const value = filter === null || filter === undefined ? {}: filter

    const validationData = typeof filter === 'object'
    if(!validationData){
      throw new Error("data received is not valid");
    }

    //VALIDATE THE KIND OF DATA IN THE FILTERS
    let specialCase=["year", "menuposition"]
    Object.keys(value).forEach( key=>
      specialCase.forEach( scase =>
        scase==key? value[scase]=parseInt(value[scase]):null
      )
    )

    let cursor

    //GENEARATE THE CURSOR OF THE QUERY
    if(Object.keys(value).length===0) {

      if(projection){
        cursor= collection.find({}).project(projection)
      } else{
        cursor=collection.find({})
      }

    } else {
      if(projection) {
        cursor=collection.find(value).project(projection)
      } else {
        cursor=collection.find(value)
      }
    }

    await cursor.forEach(function(item){
      result.push(item)
    })

    status=true;

    return {
      status: status,
      data: result
    };
  } catch (error) {
  throw {
    status:status,
    error:error.message
    };
  };
}