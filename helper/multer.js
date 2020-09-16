const multer = require('multer')
const path = require('path')

module.exports = {
    upload: (folder) => {
        const storage = multer.diskStorage({
            destination: folder,
            filename: (req, file, callback) => {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        })
        return multer({storage: storage}).single('IMG')
    },
}