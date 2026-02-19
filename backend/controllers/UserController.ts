import { Request, Response } from "express";
import User from "../models/User.model.ts";

export const signUpController = async( req : Request , res :Response): Promise<void>=>{
    try{
        const {name, phoneNumber, password }= req.body;
         
        if(!name || !phoneNumber || !password){
            res.status(400).json({
                success: false,
                message: "All filds Are required"   
            });

            return;
        }

        const isUser = await User.findOne({phoneNumber});

        if(isUser){
            res.status(409).json({
                success: false,
                message: "User already Exists"
            });

            return;
        }

        const user = await User.create({
            name,
            phoneNumber,
            password,
            about: "Hey there! I am using ChatMe",
            profilePhoto:"",
            lastSeen: null,
        });

        res.status(201).json({
            success: true,
            message : "User registered Successfully",
            data:{
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
            },
        });
    }catch (error){
        console.error("Signup Error: ",  error);

        res.status(500).json({
            success: false,
            message: "Internal Server Problem"
        })
    }
}