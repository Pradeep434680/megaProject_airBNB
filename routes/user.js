const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyns = require("../utils/wrapAsyns");
const passport = require("passport");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",wrapAsyns(async(req,res)=>{
    try{
        let {username, email,password}= req.body;
        const newUser = new User({
            email,username
        })
        let registeredUser =await User.register(newUser,password);
        
        req.flash("success","Welcome to wanderlust");
        res.redirect("/listings")
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post("/login",
passport.authenticate("local",
{failureRedirect:"/login",failureFlash:true},
 ),
async(req,res)=>{
 req.flash("success","welcome to wanderlust");
 res.redirect("/listings");
})
module.exports= router;