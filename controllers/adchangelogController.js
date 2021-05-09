/*
 Controller used to create  a adchangeLog
 v 0.1
 POST /smchangeLog 
 */

 const adChangeLogDao = require("../infraestructure/dao/ChangeLogDao");
 const adChangeLogDTO = require("../infraestructure/Models/adChangeLog/adChangeLogDTO");
 
 exports.createADChangeLog = async (type, collection, recordid, oldDocument, newDocument) => {
     try{
         const record = adChangeLogDTO(
             type,
             collection,
             recordid,
             oldDocument,
             newDocument,
         );
         record.schema_version = "1"; 
         const adChangeLogID = await adChangeLogDao.createAdChangeLog(record);
     } catch (error) {
         throw new Error(error.message);
     }
 } 