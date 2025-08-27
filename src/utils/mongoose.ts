require("dotenv").config();
import mongoose = require("mongoose");
const uri = process.env.MONGODB_URI as string;

const branchschema = new mongoose.Schema({
  data: {
    id: String,
    brandName: String,
    branchName: String,
    address: String,
    location: {
      coordinates: [Number, Number],
      type: String,
    },
  },
});

branchschema.path("id");

const branches = mongoose.model("branches", branchschema);

async function connectMongoose() {
  await mongoose.connect(uri);
  console.log("connected to mongodb");
}

module.exports = { connectMongoose, branches };
