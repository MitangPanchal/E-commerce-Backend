let bcrypt=require('bcryptjs');

let jwt=require('jsonwebtoken');
let SECRET="Mitang";

let setUser=(user)=>{
    return jwt.sign({user},SECRET)
}

let getUser = (token) =>{
    if(!token) return null;

    return jwt.verify(token,SECRET);

}


module.exports={
    setUser,
    getUser,
}