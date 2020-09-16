const database = require("../database")
const util = require("util")
<<<<<<< HEAD
const { body } = require("express-validator")

module.exports={
    asyncQuery: util.promisify(database.query).bind(database),
=======

module.exports={
    // query for asynchronous
    asyncQuery: util.promisify(database.query).bind(database),
    // query for edit
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
    generateQuery: (body)=>{
        let setQuery = ""
        for(let key in body){
            setQuery += `${key} = ${database.escape(body[key])},`
        }
        return setQuery.slice(0,-1)
    }
}