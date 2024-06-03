const app=require('./app');

const connectDatabase =require('./config/database');

const cloudinary=require('cloudinary');

const dotenv=require('dotenv');
// config
dotenv.config({path:"backend/config/config.env"});

// Connecting to database
connectDatabase();

cloudinary.config({
    cloud_name: "diojn02d6",
    api_key: "344629619848785",
    api_secret: "foyZqAdypUgIYsGcxwf5Ey25VNA"
})



app.listen(process.env.PORT,()=>{
    console.log(`Server Is Running On http://localhost:${process.env.PORT}`);
})