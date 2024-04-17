const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
// const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsyns.js");
const ExpressError= require("../utils/ExpressError.js");
const Review = require("../models/review.js")
 const { validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
 const reviewController = require("../controllers/review.js");



// // validation for review schema

// const validateReview = (req,res,next)=>{
  
//     let {error} = reviewSchema.validate(req.body)   // it will check out Joi schema
//     if( error){
//       let errorMsg = error.details.map((el)=>el.message.join(","));//there are many type of errors to show all type of erros
//       throw new ExpressError(404,errorMsg)                                                            //now we will send errorMsg
//       // throw new ExpressError(404, error)  // error have a lot info  
//     }                                       
//     else{
//       next()
//     }
//   }


//Review route
 //when we go on /listings/:id ==> we reach on show.ejs
 // And we will see all reviews on the show.ejs so the route will /listings/:id/reviews
 router.post("/",isLoggedIn,validateReview,
    wrapAsync(reviewController.createReview))
   
  
  
  //review delete route
  
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.destroyReview));
     
  

  module.exports = router;
   