const { ObjectId } = require("mongodb");



const adChangeLogDTO = (
    type,
    collection,
    recordID,
    oldDocument,
    newDocument,
 ) => {


    var types = ["INSERT","UPDATE","DELETE"];
    if( types.includes(type) === false )
        throw new Error('type is not valid');

    if ( collection == undefined || collection === '' || collection == null )
        throw new Error('collection is not valid');
    
    if(!ObjectId.isValid(recordID)){
        throw new Error('recordID is not valid');
    } 
    
    if(!(typeof oldDocument === "object")){
        throw new Error('oldDocument is not valid');
    }

    if(!(typeof newDocument === "object")){
        throw new Error('newDocument is not valid');
    }

    if(type==='UPDATE'){
        return {
        
            type,
            collection,
            recordid:recordID,
            olddocument:oldDocument,
            newdocument:newDocument,
     
        };
    }

    return {
        
        type,
        collection,
        recordid:recordID,
 
    };
};
module.exports = adChangeLogDTO;