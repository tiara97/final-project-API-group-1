const database = require("../database")
const util = require("util")

module.exports={
    // query for asynchronous
    asyncQuery: util.promisify(database.query).bind(database),
    // query for edit
    generateQuery: (body)=>{
        let setQuery = ""
        for(let key in body){
            setQuery += `\`${key}\` = ${database.escape(body[key])},`
        }
        return setQuery.slice(0,-1)
    },
    getClosestWarehouse:(body)=>{
         // compare all warehouse distance from user address using haversine method
         let R = 6371e3
         let φ1 = 0
         let φ2 = 0
         let Δφ = 0
         let Δλ = 0
         let a = 0
         let c =0
         let d = 0
         let lat1 = body.latitude
         let lat2 = 0
         let lon1 = body.longitude
         let lon2 = 0
         let jarak = []
         let wareHouseID = null
         let distance = 0

         
         body.warehouse.forEach((item)=>{
                 lat2 = item.latitude
                 lon2 = item.longitude
                 φ1 =lat1 * Math.PI/180 // φ, λ in radians
                 φ2 = lat2 * Math.PI/180
                 Δφ = (lat2-lat1) * Math.PI/180
                 Δλ = (lon2-lon1) * Math.PI/180
                 a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                         Math.cos(φ1) * Math.cos(φ2) *
                         Math.sin(Δλ/2) * Math.sin(Δλ/2),
                 c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
                 d = Math.round(R * c) // in metres
                 d === 0 ? null : jarak.push({id: item.id, distance: d}) 
                //  d === Math.min(...jarak) && d !== 0? (warehouseID = item.id, distance = d): null
                 
             })
        let result = jarak.sort((a,b)=>a.distance - b.distance)
        console.log(result)
        return {nearest: result[0],result}
    }
}