const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyns.js");
// const {listingSchema} = require("../schema.js");
// const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");


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

router
.route("/")
.get(  wrapAsync(listingController.index))
.post( isLoggedIn, validateListing,  wrapAsync(listingController.createListing)
);

//Add new listing
router.get("/new", isLoggedIn,listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,
  wrapAsync(listingController.destroyListing)) 
   
  
 
  
  
  
   //edit route
    router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm))

   
        
      
       

        module.exports=router; 


