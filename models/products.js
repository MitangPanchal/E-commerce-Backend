const mongoose=require('mongoose');

let productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter A Price"],
        maxLength:[8,"Price Can Not Be Greater Then 8 Figure"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLength:[4,"Stock Length Is Greater Than 4 Figure"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }


})

module.exports=mongoose.model('Product',productSchema);