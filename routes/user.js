const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyns = require("../utils/wrapAsyns");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",wrapAsyns(async(req,res)=>{
    try{
        let {username, email,password}= req.body;
        const newUser = new User({email,username});
        let registeredUser =await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings")
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post("/login",saveRedirectUrl,
passport.authenticate("local",
{failureRedirect:"/login",failureFlash:true},
 ),
async(req,res)=>{
 req.flash("success","welcome to wanderlust");
 let redirectUrl = res.locals.redirectUrl || "/listings";
 res.redirect(redirectUrl);
})
//logout router
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
})
module.exports= router;