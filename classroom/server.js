const express = require("express");
 const app = express();
 const users = require("./routes/user.js")
 const posts = require("./routes/posts.js");
 const cookieParser = require("cookie-parser");
 const session = require("express-session");

// //cookie-parser is a middleware, now all req will go through cookie parser
// app.use(cookieParser("secretcode"));

// //there are two type of cookies (i)=>signed,(ii)=>unsigned

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("mase in","india", {signed:true})
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
 

app.use(session({secret:"mysupersecretstring", resave:false,saveUninitialized:true}));

// express sessions
app.get("/test",(req,res)=>{
    res.send("test successfully");  // it will generate the id in application
})              

// IT WILL count that how much time the call is called 
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count=1;
    }

    res.send(`you sent a requesr ${req.session.count} times`);
})
 
app.listen(3030,()=>{
    console.log("server is started");
})


