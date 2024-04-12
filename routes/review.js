const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsyns.js");
const ExpressError= require("../utils/ExpressError.js");
const Review = require("../models/review.js")



// validation for review schema

const validateReview = (req,res,next)=>{
  
    let {error} = reviewSchema.validate(req.body)   // it will check out Joi schema
    if( error){
      let errorMsg = error.details.map((el)=>el.message.join(","));//there are many type of errors to show all type of erros
      throw new ExpressError(404,errorMsg)                                                            //now we will send errorMsg
      // throw new ExpressError(404, error)  // error have a lot info  
    }                                       
    else{
      next()
    }
  }


//Review route
 //when we go on /listings/:id ==> we reach on show.ejs
 // And we will see all reviews on the show.ejs so the route will /listings/:id/reviews
 router.post(
    "/",
    validateReview,
    wrapAsync( async(req,res)=>{
    let listing =await  Listing.findById(req.params.id); //extract the listing by id
    let newReview = new Review(req.body.review);  //info from form store i=in newReview
     
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
   
    res.redirect( `/listings/${listing._id}`);
  }))
   
  
  
  //review delete route
  
  router.delete(
    "/:reviewId",
    wrapAsync( async(req,res)=>{
      let {id , reviewId} = req.params;
      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) // it will pull the whole object form the reviews array and delete it from database.
      await Review.findByIdAndDelete(reviewId);  //it will delete card
      res.redirect(`/listings/${id}`);
    }));
     
  

  module.exports = router;
   