require("dotenv").config();
import mongoose = require("mongoose");
const uri = process.env.MONGODB_URI as string;

//마이프차 api 데이터 몽구스 스키마 정의
const api_data_schema = new mongoose.Schema({
  data: {
    id: String,
    name: String,
    addr: String,
    tel: String,
    period: String,
  },
});

const api_data = mongoose.model("api_data", api_data_schema);

async function connectMongoose() {
  await mongoose.connect(uri);
  console.log("connected to mongodb");
}

module.exports = { connectMongoose, misoya, sulbing, api_data };
