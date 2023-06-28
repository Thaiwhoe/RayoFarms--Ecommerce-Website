const express = require ('express');
const dbConnect = require("./config/dbConnect")
const app = express()
const dotenv = require('dotenv').config({path: "./var/.env"})
const PORT = process.env.PORT|| 4000;

//Routes
const authRouter = require("./routes/authRoutes")
const productRouter = require('./routes/productRoutes')
const blogRouter = require("./routes/blogRoutes")
const categoryRouter = require('./routes/productCategoryRoutes');
const blogCategoryRouter = require('./routes/blogCategoryRoutes');
const brandNameRouter = require('./routes/brandCategoryRoutes');
const couponRouter = require('./routes/couponRoutes');



const morgan = require('morgan');
dbConnect(process.env.MONGOOSE_URL)
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser')


app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

//Routers
app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRouter)
app.use('/api/blog-category', blogCategoryRouter);
app.use('/api/brand-name', brandNameRouter);
app.use('/api/coupon', couponRouter);


//Error Handlers
app.use(notFound)
app.use(errorHandler)


app.listen (PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})