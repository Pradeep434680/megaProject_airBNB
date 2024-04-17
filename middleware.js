const Listing = require("./models/listing.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError= require("./utils/ExpressError.js");



module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be login to add listing");
        res.redirect("/login");
      }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}
module.exports.isOwner = async(req,res,next)=>{
    let {id} =req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
          req.flash("error","You are not the owner of this listing");
          return res.redirect(`/listings/${id}`);
        }
        next()
}
module.exports.validateListing = async(req,res,next)=>{
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

 module.exports.validateReview = async(req,res,next)=>{
  
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