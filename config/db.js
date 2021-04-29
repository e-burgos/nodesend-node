const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false, 
            useCreateIndex: true
        });
        console.log("Mongo DB connected");
        
    } catch (error) {
        console.log('Hubo un error en en servidor');
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;