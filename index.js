const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require('dotenv')

const app = express()
dotenv.config()

app.use(cors())
app.use(bodyParser.json())
<<<<<<< HEAD
app.use(express.static('./public'))
=======
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496

app.get('/', (req, res)=>{
    res.status(200).send("Final Project API")
})

<<<<<<< HEAD
=======
// export database
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
const database = require('./database')
database.connect((err)=>{
    if(err){
        return console.error("error connecting : " + err.stack)
    }

    console.log("Connected as id : ", database.threadId)
})

<<<<<<< HEAD
const {userRouter, orderRouter, profileRouter, carouselRouter, transactionRouter, warehouseRouter} = require("./router")
=======
// export router
const {userRouter, orderRouter, profileRouter, carouselRouter, categoryRouter} = require("./router")
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)
app.use("/api/profiles", profileRouter)
app.use("/api/carousel", carouselRouter)
<<<<<<< HEAD
app.use("/api/transaction", transactionRouter)
app.use("/api/warehouse", warehouseRouter)

const PORT = 2000
app.listen(PORT, ()=> console.log(`Server is running at port ${PORT}`))
=======
app.use("/api/category", categoryRouter)

// create localhost port
const PORT = 2000
app.listen(PORT, ()=> console.log(`Server is running at port ${PORT}`))

// test upload
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
