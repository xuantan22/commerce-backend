const UserSchema = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

module.exports.Register = async (req,res) =>{
    const {name,email,password}=req.body;
    let check = await UserSchema.findOne({email:email});
    if(check){
        return res.status(400).json({success:false, error:"user already exists"});
    }
    let cart={};
    for(let i=0;i<300;i++){
        cart[i] = 0;
    }
    const passwordhash = await  bcrypt.hash(password,10);
    console.log(passwordhash);
    const user = await UserSchema.create({
        name:name,
        email:email,
        password:passwordhash,
        cartData:cart
    })
    await user.save();
    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_token' );
    res.json({success:true,token});
}


module.exports.Login = async (req,res) =>{
    const {email,password} = req.body;
    let user = await UserSchema.findOne({email:email});
    if(user){
        let passwordCompare =await  bcrypt.compare(password,user.password);
        if(passwordCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,"secret_token");
            res.json({success:true,token});
        }else{
            res.json({success:false,error:"Wrong Password"});
        }
    }else{
        res.json({success:false,error:"email is not exist"});
    }
}



module.exports.AddToCart=async (req,res)=>{
    // console.log(req.body);
    let userData = await UserSchema.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await UserSchema.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.json({message:"Added"});
}

module.exports.RemoveFromCart=async (req,res)=>{
    // console.log(req.body);
    let userData = await UserSchema.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId] -=1;
    }
    await UserSchema.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.json({message:"Removed"});
}

module.exports.GetCart = async (req,res) => {
    let userData = await UserSchema.findOne({_id:req.user.id});
    res.json(userData.cartData);
}


module.exports.GetAllUsers = async(req,res) => {
    try {
        let allUsers = await UserSchema.find();
        if(allUsers < 0){
            res.status(201).json({error:"userdatabase is empty"})
        }else{
            res.json(allUsers);
        }
    } catch (error) {
        res.status(500).json({error:"database is not exist"})
    }
}


module.exports.RemoveUser = async(req,res) =>{
    try {
        const user = await UserSchema.findOneAndDelete({_id:req.body.id});
        if(user){
            console.log("user deleted:", user);
            res.status(200).json({message:"User is deleted",user});
        }else{
            res.status(404).json({error:"User not found "});
        }
    } catch (error) {
        console.error('Error deleting user',error);
        res.status(500).json({error:"An error occurred while deleting the user"})
    }
};

