const database = require('../database')
const { asyncQuery, generateQuery } = require('../helper/queryHelper')

module.exports={
    getProfile: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            // get profile data
            const getProfile = `SELECT * FROM user_profiles WHERE user_id = ${database.escape(Id)}`
            const result = await asyncQuery(getProfile)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    editProfile: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            // check user_id
            const checkId = `SELECT * FROM user_profiles WHERE user_id = ${database.escape(Id)}`
            const resultCheck = await asyncQuery(checkId)

            if(resultCheck.length === 0){
                return res.status(400).send(`Profiles with user_id : ${Id} doesn't exists`)
            }

            const editQuery = `UPDATE user_profiles SET ${generateQuery(req.body)}
                                WHERE user_id = ${database.escape(Id)}`
            const result = await asyncQuery(editQuery)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // user upload foto profil
    picUpload: async (req, res) => {
        const Id = parseInt(req.params.id)
        console.log(req.file)
        if (req.file === undefined) {
            return res.status(400).send('No image')
        }
        try {
            const query = `UPDATE user_profiles SET image = 'image/${req.file.filename}' WHERE user_id = ${database.escape(Id)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getFavoriteData: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            // get favorite data
            const getFavorite = `SELECT * FROM favorite WHERE user_id = ${database.escape(Id)}`
            const result = await asyncQuery(getFavorite)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}