const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");

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
app.get("/listings/:id",async (req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  res.render("listing/show.ejs",{listing});
})

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

  res.redirect(`/listings/${id}`);
});

// //Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});


app.listen(8080,(req,res)=>{
  console.log("Server started")
})