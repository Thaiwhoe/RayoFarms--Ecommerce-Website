const express = require ('express');
const dbConnect = require("./config/dbConnect")
const app = express()
const dotenv = require('dotenv').config({path: "./var/.env"})
const PORT = process.env.PORT|| 4000;
const authRouter = require("./routes/authRoutes")
dbConnect(process.env.MONGOOSE_URL)
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

//Router
app.use('/api/user', authRouter)

//Error Handlers
app.use(notFound)
app.use(errorHandler)


app.listen (PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})