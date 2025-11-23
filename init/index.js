require("dotenv").config({ path: "../.env" })

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// MAPBOX
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

main()
  .then(() => console.log("Seed DB connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({}); // clear old data

  const listingsWithGeo = [];

  // Loop through each seed item
  for (let item of initData.data) {
    // 1️⃣ Get real coordinates from Mapbox
    const geoResponse = await geocodingClient
      .forwardGeocode({
        query: item.location,   // item.location must be city/place name
        limit: 1,
      })
      .send();

    const geoData = geoResponse.body.features[0].geometry;

    // 2️⃣ Add geometry + owner
    listingsWithGeo.push({
      ...item,
      owner: "6918f270667ef4a4aa7948be", // your user ID
      geometry: geoData,                 // REAL coordinates
    });
  }

  // 3️⃣ Save into database
  await Listing.insertMany(listingsWithGeo);
  console.log("Seed data added with REAL COORDINATES!");
};

initDB();
