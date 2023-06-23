const express = require ('express');
const dbConnect = require("./config/dbConnect")
const app = express()
const dotenv = require('dotenv').config({path: "./var/.env"})
const PORT = process.env.PORT|| 4000;
const authRouter = require("./routes/authRoutes")
const productRouter = require('./routes/productRoutes')
const blogRouter = require("./routes/authRoutes")
const morgan = require('morgan');
dbConnect(process.env.MONGOOSE_URL)
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser')


app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

//Router
app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)


//Error Handlers
app.use(notFound)
app.use(errorHandler)


app.listen (PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})