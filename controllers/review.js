const Listing = require("../models/listing");
const Review = require("../models/review.js")
module.exports.createReview =async(req,res)=>{
    let listing =await  Listing.findById(req.params.id); //extract the listing by id
    let newReview = new Review(req.body.review);  //info from form store i=in newReview
     newReview.author = req.user._id; // it will store the user id
     console.log(newReview.author);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect( `/listings/${listing._id}`);
  }

  module.exports.destroyReview =  async(req,res)=>{
       
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) // it will pull the whole object form the reviews array and delete it from database.
    await Review.findByIdAndDelete(reviewId);  //it will delete card
    req.flash("success","Review Deleted ");
    res.redirect(`/listings/${id}`);
  }