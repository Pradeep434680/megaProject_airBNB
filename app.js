const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyns.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
  }).catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
 

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
//validate for schema
const validateListing = (req,res,next)=>{
   
  let {error} = listingSchema.validate(req.body)   // it will check out Joi schema
   if( error){
    let errorMsg = error.details.map((el)=>el.message.join(","));//there are many type of errors to show all type of erros
     throw new ExpressError(404,errorMsg)                                                            //now we will send errorMsg
    // throw new ExpressError(404, error)   /// error have a lot info  
  }                   // details object  is an object
  else{
    next()
  }
}

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
  const allListings= await Listing.find({}) ;
  res.render("listings/index.ejs",{allListings})
}))


//Add new listing
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

// Show in detail
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const listing= await Listing.findById(id)
    res.render("listings/show.ejs",{listing})
}))

app.post("/listings",validateListing,  wrapAsync(async(req,res,next)=>{
  // if(!req.body.listing){
  //   throw new ExpressError(400,"please send valid data for listing")
  // }
  // it will call validateListing function then moving forward 
  const newListing= new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
    })
  );
    
     
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
  let {id} =req.params;
  const listing= await Listing.findById(id)
  res.render("listings/edit.ejs",{listing});
}))

app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
  // if(!req.body.listing){
  //   throw new ExpressError(400,"please send valid data for listing")
  // }
    // it will call validateListing function then moving forward 

  let {id} =req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`)
}))

//delete route
 app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  let {id} =req.params;
   const deletedListing= await Listing.findByIdAndDelete(id);
   
   res.redirect("/listings")
 }))

 //Review route
 //when we go on /listings/:id ==> we reach on show.ejs
 // And we will see all reviews on the show.ejs so the route will /listings/:id/reviews
app.post("/listings/:id/reviews",async(req,res)=>{
  let listing =await  Listing.findById(req.params.id); //extract the listing by id
  let newReview = new Review(req.body.review);  //info from form store i=in newReview
  console.log(newReview);
  console.log(listing._id);
  listing.reviews.push(newReview);


  await newReview.save();
  await listing.save();
  console.log("review is added");
  res.redirect( `/listings/${listing._id}`);
})
 
 // it will be call if above route is not matched
 app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found"))
  })
  app.use((err,req,res,next)=>{
   let {statusCode=500,message="error"}=err;
   res.render("error.ejs",{message});
  // res.status(statusCode).send(message);
 })
//  app.use((err,req,res,next)=>{
//   res.send("Something went wrong");
//  })
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});







// it is the dbs of addings review

// [
//   {
//     _id: ObjectId('660bd33605a48d373a4e9ec0'),
//     title: 'Modern Loft in Downtown',
//     description: 'Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!',
//     image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
//     price: 1500,
//     location: 'New York City',
//     country: 'United States',
//     __v: 1,
//     reviews: [ ObjectId('661580e9e62702530d2b6b30') ]
//   }
// ]
///////////////////////////////////////////////////////////
// here the only  id of the reviews collection sacve in listings collection
// [
//   {
//     _id: ObjectId('661580e9e62702530d2b6b30'),
//     comment: 'excellend exprerience',
//     rating: 3,
//     createdAt: ISODate('2024-04-09T17:53:01.924Z'),
//     __v: 0
//   }
// ]