const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const{listingSchema}=require("./schema.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

main().then((res)=>{
  console.log("Connection established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/",(req,res)=>{
  res.send("working");
})

function validateListing(req, res, next) {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next(); // proceed if validation passes
  }
}


//index route
app.get("/listings",async (req,res)=>{
  let allListings=await Listing.find({});
  res.render("listing/index.ejs",{allListings});
})

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  res.render("listing/show.ejs",{listing});
}));

//Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res,next) => {
  let result=listingSchema.validate(req.body);
   const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",  validateListing,wrapAsync(async (req, res,next) => {
  if(!req.body.listing){
    next(new ExpressError(400,"Bad Request"));
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

  res.redirect(`/listings/${id}`);
}));

// //Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err,req,res,next)=>{
  let {status=500,message="Something went wrong"}=err;
  res.status(status).render("error.ejs",{err});
})

app.listen(8080,(req,res)=>{
  console.log("Server started")
})