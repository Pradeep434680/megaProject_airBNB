const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyns.js");
const {listingSchema} = require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



//validate for Listing schema
const validateListing = (req,res,next)=>{
   
    let {error} = listingSchema.validate(req.body)   // it will check out Joi schema
    if( error){
      let errorMsg = error.details.map((el)=>el.message.join(","));//there are many type of errors to show all type of erros
       throw new ExpressError(404,errorMsg)                                                            //now we will send errorMsg
      // throw new ExpressError(404, error)  // error have a lot info  
    }                                       
    else{
      next()
    }
  }


//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({}) ;
    res.render("listings/index.ejs",{allListings})
  }))
  
  
  //Add new listing
  router.get("/new",(req,res)=>{
      res.render("listings/new.ejs");
  })
  
  // Show in detail
  router.get("/:id",wrapAsync(async(req,res)=>{
      let {id} =req.params;
      const listing= await Listing.findById(id).populate("reviews");
      if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
      }
      res.render("listings/show.ejs",{listing})
  }))
  
  router.post("/", validateListing,  wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
      throw new ExpressError(400,"please send valid data for listing")
    }
    // it will call validateListing function then moving forward 
    const newListing= new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
      })
    );

    router.get("/:id/edit", wrapAsync(async(req,res)=>{
        let {id} =req.params;
        const listing = await Listing.findById(id) 
        if(!listing){
          req.flash("error","Listing you requested for does not exist !");
          res.redirect("/listings");
        } 
        res.render("listings/edit.ejs",{ listing });
      }))


    router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
        // if(!req.body.listing){
        //   throw new ExpressError(400,"please send valid data for listing")
        // }
          // it will call validateListing function then moving forward 
      
        let {id} =req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","  Listing Updated ");
      res.redirect(`/listings/${id}`)
      }))
      
      //delete route

       router.delete(
        "/:id",
        wrapAsync( async(req,res)=>{
        let {id} =req.params;
         
        const deletedListing= await Listing.findByIdAndDelete(id); //when it will call for any listing then the review middleware will work
        req.flash("success","  Listing Deleted");
         res.redirect("/listings");
       })) 




       module.exports=router; 