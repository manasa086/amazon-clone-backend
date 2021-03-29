const express = require('express');
const path = require('path');
const cors=require('cors');
const bcrypt=require('bcryptjs');
const Razorpay = require('razorpay')
var mongodb=require("mongodb");
var MongoClient=mongodb.MongoClient;
var url=process.env.url;
const app = express();
const PORT = process.env.PORT || 4000; 
var dbname="testdata";
const nodemailer=require("nodemailer");
const jwt = require("jsonwebtoken");


const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.post("/insert",(req,res)=>{
    MongoClient.connect(url, async function(err, client) {
        if(err) {
             console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        }
        try{
            var db=client.db(dbname);
            console.log(req.body)
            var findData=await db.collection("user").find({email:req.body.email}).toArray();
            console.log(findData)
            if(findData.length>0)
            {
                client.close();
                res.json({
                    message:"Email Already Exists  Provide new Email"
                })
            }
            else{
            var cursor=await db.collection("user").insertOne(req.body);

            client.close();
            res.json({
                message:"Data SuccessFully Inserted"
            })
        }
            
        }
        catch(error)
        {
            client.close();
            res.json({
                message:"Error while inserting to database"
            })
        }

     });
})
app.post("/login",(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        if(err){
            console.log("Error while connecting to MongoDB Atlas",err);
        }
        var db=client.db(dbname);
        var cursor=db.collection("user").findOne({email:req.body.email});
        cursor.then(function(user){
            if(user){
                if(user.password.toString()==req.body.password.toString()){
                    client.close();
                    res.json({
                        message:"Success"
                    })
                }
                else{
                    client.close();
                    res.json({
                        message:"Email or password incorrect"
                    })
                }
            }
            else{
                client.close();
                res.json({
                    message:"User does not exits"
                })
            }
        })
    })
})
app.post("/survey",(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        if(err){
            console.log("Error while connecting to MongoDB Atlas",err);
        }
        try{
            var db=client.db(dbname);
            let data=await db.collection("survey").insertOne(req.body);
            client.close();
            res.json({
                message:"Inserted"
            })
        }
        catch(error){
            client.close();
            res.json({
                message:"Error while inserting data into database"
            })
        }
    })
})
app.get("/getSurveyDetails/:id",(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        if(err)
        {
            console.log("Error")
        }
        var db=client.db(dbname);
        try{
            let getData=await db.collection("survey").find({email:req.body.id}).toArray();
            if(getData.length<0)
            {
                client.close();
                res.json({
                    message:"no survey",
                    data:[]
                })
            }
            else{
                client.close();
                res.json({
                    message:"survey",
                    data:getData
                })
            }
        }
        catch(error){
            client.close();
            res.json({
                message:"error",
                data:[]
            })
        }
    })
})
app.listen(PORT, console.log(`Server is starting at ${PORT}`));