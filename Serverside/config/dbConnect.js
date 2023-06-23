const mongoose = require('mongoose');


const dbConnect = (url) => {
    try{
        const conn = mongoose.connect(url);
        console.log("database connection successful")
    }
    catch(err){
        console.log('Database error')
    }
}

module.exports = dbConnect