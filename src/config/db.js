const mongoose = require('mongoose');

function connectToDb(){

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server is connnected to DB");
    }).catch((err)=>{
        console.log("Error connecting to DB", err.message)
        process.exit(1)
    })

}

module.exports = connectToDb