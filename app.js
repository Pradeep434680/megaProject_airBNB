const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
 
const ExpressError= require("./utils/ExpressError.js");
 
const Review = require("./models/review.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

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
 
const sessionOptions = {
  secret:"mysupersecretstring", 
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,   // it will give a another option in application
    maxAge: 7 *24*60*60*1000
  }
};

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());
//initialized for possport
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate())); //authenticate() Generates a function that is used in Passport's LocalStrategy
passport.serializeUser(User.serializeUser());//serializeUser() Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser());//deserializeUser() Generates a function that is used by Passport to deserialize users into the session


//  res.locals.success 
//
app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
  //  console.log(res.locals.success);// if i do not create a new listing the the value of this wil be empty array
   next();                          // so in flash.ejs we well also creck the arrat.length
 })

 //user demo
//  app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"pradeep kumar"
//   })
//  let registeredUser = await User.register(fakeUser,"helloworld"); //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is
// //  console.log(registeredUser);
//  res.send(registeredUser);
// })
  

//after this next() will call the "/listings" (ejs file is index.ejs)
//so we will display the message at index.ejs
  

app.use("/listings",listingRouter); //it will use /listings route of listings.js
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



// it will be call if above route is not matched
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found I" ))
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




 














