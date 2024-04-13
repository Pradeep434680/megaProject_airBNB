const express = require("express");
 const app = express();
 const users = require("./routes/user.js")
 const posts = require("./routes/posts.js");
 const cookieParser = require("cookie-parser");
 const path = require("path");
 const session = require("express-session");
 const flash = require("connect-flash");

 app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


 const sessionOptions = {
    secret:"mysupersecretstring", 
    resave:false,
    saveUninitialized:true
};

// //cookie-parser is a middleware, now all req will go through cookie parser
// app.use(cookieParser("secretcode"));

// //there are two type of cookies (i)=>signed,(ii)=>unsigned

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("mase in","india", {signed:true})//==>signed cookie
//     res.send("signed cookie send"); 

// })
// //verify
// // app.get("/verify",(req,res)=>{
// //     console.log(req.cookies);   // ==> {}  it will not show the sended cookie
// //     res.send("verified");       // if i individiual write in application then it will show
// //                             //req.cookies ==> prints unsigned cookies
// // })

// // to print the signed cookies
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);  //==>[Object: null prototype] { 'mase in': 'india' }
//     res.send("verified"); // if i changes in application in signed cookies 
//     //,(i)=>whole change output =>{} (ii)=>minor changes (india is replaced by US) then {made in : false}
// })
 
// //cookies is used for to remember something to browser
// // if once a cookie save in the browser then it will be for all router and pages

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namste") // in the form of key value pair
//     res.cookie("Made in","india")
//    res.send("there is some cookies for you");
// })

// // extract data from cookies
// app.get("/greet",(req,res)=>{
//     let {name = "varsha"} = req.cookies;
//     res.send(` nameste ${name}`)
// })
//  app.get("/",(req,res)=>{
//     console.dir(req.cookies);   // =>undifined ,not possible to excess the cookies from req directly
//     res.send("Hi , i am root path");//use cookie-parser
//  })

//  app.use("/users",users);
//  app.use("/posts",posts);
 

app.use(session(sessionOptions));
app.use(flash());

// express sessions
app.get("/test",(req,res)=>{
    res.send("test successfully");  // it will generate the id in application
})              

// IT WILL count that how much time the call is called 
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }

//     res.send(`you sent a requesr ${req.session.count} times`);
// })

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next()
}) 

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;//now it will store info in req.session 
   console.log(req.session.name);
   if(name ==="anonymous"){
        req.flash("error","user not registered")
   }
   else{

       req.flash("success","user registered successfully"); // to give a alert send the session.flash() to page.ejs
   }
   res.redirect("/hello")
})    

app.get("/hello",(req,res)=>{
    // console.log( req.session.name);  // we can excess it here also
    // res.send(`hello ${ req.session.name}`);
    // console.log(req.flash('success')); //==> [ 'user registered successfully' ]
    // res.render("page.ejs",{name: req.session.name,msg:req.flash("success")}); // flash message is one time message

    // res.locals.successMsg = req.flash("success");  // these are doing the work of{ msg:req.flash("success")}
    // res.locals.errorMsg = req.flash("error");     // ye data ko page.ejs tk pahucha rhe hai
    
    ///at the place of these we will make middlewares upperside
    res.render("page.ejs",{name: req.session.name})
})
 

app.listen(3030,()=>{
    console.log("server is started");
})


