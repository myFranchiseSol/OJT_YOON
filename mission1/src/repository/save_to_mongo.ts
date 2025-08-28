require("dotenv").config();
const uri = process.env.MONGODB_URI as string;

import mongoose = require("mongoose");

//몽구스 연결 함수
async function connectMongoose() {
  await mongoose.connect(uri);
  console.log("connected to mongodb");
}

// 설빙/미소야 크롤링 시작
const { branches } = require("../model/mongoose");

//branche type 정의
type Branch = {
  id: string;
  brandName: string;
  branchName: string;
  address: string;
  location: { coordinates: [number, number]; type: string };
};

async function saveToMongo(data: Branch[], collectionname: string) {
  await connectMongoose();
  // await connectMongoose(); //몽구스 연결 함수 호출
  //db collection 선택
  const collection = mongoose.connection.collection(collectionname);
  //만약 collection이 없으면 생성
  if (!collection) {
    await mongoose.connection.createCollection(collectionname);
    await collection.insertMany(data);
    return;
  }

  //기존 db데이터 id와 새로들어올 데이터id를 비교하기 위한 id 추출

  const newDataIds = data.map((item: any) => item.id);
  const existingdataids = await collection.find({}, "_id");

  //새로 들어올 데이터와 현재 db데이터를 비교해서 새 데이터에는 없는 정보 삭제
  const idtodelete = existingdataids.filter(
    (id: any) => !newDataIds.includes(id)
  );
  await branches.deleteMany((id: any) => idtodelete.includes(id));

  //새로들어올 데이터와 현재 dB데이터를 비교해서 현재 db에 없는 데이터만 추가
  const idtoadd = data.filter((id: any) => !existingdataids.includes(id));
  await branches.insertMany((id: any) => idtoadd.includes(id));

  const result = await branches.insertMany(data, { ordered: false });
  console.log(`MongoDB 저장 완료: ${result.length}건`);
}
