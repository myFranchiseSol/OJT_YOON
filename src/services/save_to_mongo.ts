require("dotenv").config();

const mongoose = require("mongoose");
const { connectMongoose, branches, galbiplace } = require("../utils/mongoose");

// 설빙/미소야 크롤링 모델
async function saveToMongo(data: any[]) {
  await connectMongoose(); //몽구스 연결 함수 호출
  //기존 db데이터 id와 새로들어올 데이터id를 비교하기 위한 id 추출
  const newDataIds = data.map((item) => item.id);
  const existingdataids = await branches.find({}, "_id");
  console.log(existingdataids);
  console.log(typeof existingdataids);
  //새로 들어올 데이터와 현재 db데이터를 비교해서 새 데이터에는 없는 정보 삭제
  const idtodelete = existingdataids.filter(
    (id: any) => !newDataIds.includes(id)
  );
  await branches.deleteMany((id: any) => idtodelete.includes(id));

  //새로들어올 데이터와 현재 dB데이터를 비교해서 현재 db에 없는 데이터만 추가
  const idtoadd = data.filter((id: any) => !existingdataids.includes(id));
  await branches.insertMany((id: any) => idtoadd.includes(id));

  try {
    const result = await branches.insertMany(data, { ordered: false });
    console.log(`MongoDB 저장 완료: ${result.length}건`);
  } finally {
    await mongoose.disconnect();
  }
}

// 마이프차 API 활용

async function saveToMongoFromApi(docs: any) {
  const collection = mongoose.connection.collection("api_Data");
  await collection.insertMany(docs.results);
}

async function saveLatestVersionPk(latestVersionPk: any) {
  const collection = mongoose.connection.collection("latest_version_pk");
  await collection.insertOne({ latestVersionPk });
}

module.exports = { saveToMongo, saveToMongoFromApi, saveLatestVersionPk };
