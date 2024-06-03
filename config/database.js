const mongoose=require('mongoose');

const connectDatabase=()=>{

    mongoose.connect("mongodb://localhost:27017/Fullecommerce").then((data)=>{
        console.log(`MongoDB Connected with server ${data.connection.host}`);
    }).catch((err)=>{
        console.log(err)
    });

}

module.exports=connectDatabase;



