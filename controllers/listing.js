const Listing = require("../models/listing");


module.exports.index = async(req,res)=>{
    const allListings= await Listing.find({}) ;
     
    res.render("listings/index.ejs",{allListings})
  }
  module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
  }

  module.exports.showListing = async(req,res)=>{
    let {id} =req.params;
     
    let listing= await Listing.findById(id)
    .populate({path:"reviews", populate:{
      path:"author"
    },
  })
    .populate("owner") ;
    
    if(!listing){
      req.flash("error","Listing you requested for does not exist !");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing})
}
   

module.exports.createListing = async(req,res,next)=>{
  if(!req.body.listing){
    throw new ExpressError(400,"please send valid data for listing")
  }
  // it will call validateListing function then moving forward 
  const newListing= new Listing(req.body.listing);
  newListing.owner = req.user._id; //it will tell new owner of new listing
      await newListing.save();
      req.flash("success","New Listing Created");
      res.redirect("/listings");
    }

    module.exports.renderEditForm = async(req,res)=>{
      let {id} =req.params;
      const listing = await Listing.findById(id) 
      if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
      } 
      res.render("listings/edit.ejs",{ listing });
    }

    module.exports.updateListing = async (req,res)=>{
      // if(!req.body.listing){
      //   throw new ExpressError(400,"please send valid data for listing")
      // }
        // it will call validateListing function then moving forward 
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","  Listing Updated ");
      res.redirect(`/listings/${id}`)
      }


      module.exports.destroyListing = async(req,res)=>{
        let {id} =req.params;
         
        const deletedListing= await Listing.findByIdAndDelete(id); //when it will call for any listing then the review middleware will work
        req.flash("success","  Listing Deleted");
         res.redirect("/listings");
       } 
 