const database = require("../database")
const util = require("util")

module.exports={
    // query for asynchronous
    asyncQuery: util.promisify(database.query).bind(database),
    // query for edit
    generateQuery: (body)=>{
        let setQuery = ""
        for(let key in body){
            setQuery += `${key} = ${database.escape(body[key])},`
        }
        return setQuery.slice(0,-1)
    }
}