const database = require("../database")
const util = require("util")
const { body } = require("express-validator")

module.exports={
    asyncQuery: util.promisify(database.query).bind(database),
    generateQuery: (body)=>{
        let setQuery = ""
        for(let key in body){
            setQuery += `${key} = ${database.escape(body[key])},`
        }
        return setQuery.slice(0,-1)
    }
}