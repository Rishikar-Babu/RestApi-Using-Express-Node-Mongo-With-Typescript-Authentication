import User from '../modules/users'
import { NextFunction,Request,Response } from 'express'
import { JWT_SECRET } from '../config/config';

import asyncHandler from "express-async-handler"
import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'
import { error } from 'console';
import mongoose from 'mongoose';


const creteUser=asyncHandler(async(req:Request,res:Response)=>{
    const {name,email,password}=req.body
    if(!name || !email || !password){
        res.status(500).json({msg:"All the details should enter compulsury..!"})
    }
    const userAvailable=await User.findOne({email})
    if(userAvailable){
        res.send(404).json({msg:"user already registered..!"})
    }

    // hashed password ==>
    const hashedPAssword=await bcrypt.hash(password,10)
    console.log("hashed password",hashedPAssword);

    const user= await User.create({
      
        name,
        email,
        password:hashedPAssword,
        password1:password
    });
    console.log(`user created ${user}`);
        if(user){
            res.status(201).json({id:user.id,email:user.email})
        }else{
        throw new Error("Data is not valid..!")
        }
        res.status(200).json({msg:"Registerd the user.."})
     

})

const readUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return User.findById(userId)
        .then((user) => (user ? res.status(200).json({ user }) : res.status(404).json({ message: 'Not Found the User..!' })))
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const readAllUsers = (req: Request, res: Response, next: NextFunction) => {
   
    return User.find()
        .then((user) => (user ? res.status(200).json({ user }) : res.status(404).json({ message: 'Not Found the User..!' })))
        .catch((error) => {
            res.status(500).json({ error });
        });
};



const loginUser=async(req:Request,res:Response)=>{
  const { email, password } = req.body;

try {
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log(error)
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const token = jwt.sign({ userId: user.id,email:user.email,name:user.name }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
} catch (error) {
  res.status(500).json({ error: 'An error occurred' });
}

}




export default {creteUser,readUser,readAllUsers,loginUser}