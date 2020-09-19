const util = require('util')
const database = require('../database')

module.exports = {
    generateQuery: (body) => {
  
        let result = ''
        for(let key in body){
            result += `${key} = '${body[key]}',`
        }
        return result.slice(0, -1)
    },
    asyncQuery: util.promisify(database.query).bind(database)
}