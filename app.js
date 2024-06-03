const express=require('express');
const app=express();

let cookieParser=require('cookie-parser');
let bodyParser=require('body-parser');
const fileUpload=require("express-fileupload");

const product=require('./routes/product');
const user=require('./routes/user');
const order=require('./routes/order');
const cors=require('cors')

const errorMiddleware=require('./middleware/error')

app.use(cors({credentials:true,origin:"http://localhost:5173"}));
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());


app.use("/",product);
app.use("/",user);
app.use("/",order)



// Middleware For Error
app.use(errorMiddleware);

module.exports=app;