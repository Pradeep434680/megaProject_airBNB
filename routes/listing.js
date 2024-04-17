const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyns.js");
const {listingSchema} = require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");



//validate for Listing schema
// const validateListing = (req,res,next)=>{
   
//     let {error} = listingSchema.validate(req.body)   // it will check out Joi schema
//     if( error){
//       let errorMsg = error.details.map((el)=>el.message.join(","));//there are many type of errors to show all type of erros
//        throw new ExpressError(404,errorMsg)                                                            //now we will send errorMsg
//       // throw new ExpressError(404, error)  // error have a lot info  
//     }                                       
//     else{
//       next()
//     }
//   }


//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({}) ;
    res.render("listings/index.ejs",{allListings})
  }))
  
  
  //Add new listing
  router.get("/new", isLoggedIn,(req,res)=>{
   
      res.render("listings/new.ejs");
  })
  
  // Show in detail
  router.get("/:id",wrapAsync(async(req,res)=>{
      let {id} =req.params;
       
      let listing= await Listing.findById(id).populate("reviews").populate("owner") ;
      
      if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
      }
      console.log(listing);
      res.render("listings/show.ejs",{listing})
  }))
  
  router.post("/",isLoggedIn, validateListing,  wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
      throw new ExpressError(400,"please send valid data for listing")
    }
    // it will call validateListing function then moving forward 
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id; //it will tell new owner of new listing
        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
      })
    );
   //edit route
    router.get("/:id/edit",isLoggedIn,isOwner,  wrapAsync(async(req,res)=>{
        let {id} =req.params;
        const listing = await Listing.findById(id) 
        if(!listing){
          req.flash("error","Listing you requested for does not exist !");
          res.redirect("/listings");
        } 
        res.render("listings/edit.ejs",{ listing });
      }))

      // update route
    router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
        // if(!req.body.listing){
        //   throw new ExpressError(400,"please send valid data for listing")
        // }
          // it will call validateListing function then moving forward 
          await Listing.findByIdAndUpdate(id,{...req.body.listing});
          req.flash("success","  Listing Updated ");
        res.redirect(`/listings/${id}`)
        }))
        
      
         
      //delete route

       router.delete(
        "/:id",isLoggedIn,isOwner,
        wrapAsync( async(req,res)=>{
        let {id} =req.params;
         
        const deletedListing= await Listing.findByIdAndDelete(id); //when it will call for any listing then the review middleware will work
        req.flash("success","  Listing Deleted");
         res.redirect("/listings");
       })) 




       module.exports=router; 