require("dotenv").config();
import mongoose = require("mongoose");
const uri = process.env.MONGODB_URI as string;

//크롤링 데이터 몽구스 스키마 정의
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

const sulbing = mongoose.model("sulbing", branchschema);
const misoya = mongoose.model("misoya", branchschema);

async function connectMongoose() {
  await mongoose.connect(uri);
  console.log("connected to mongodb");
}

module.exports = { sulbing, misoya };
