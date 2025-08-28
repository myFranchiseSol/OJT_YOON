const {
  branches,
  galbiplace,
  api_data,
  latest_version_pk,
} = require("../utils/mongoose");
const Franchise = require("../models/branches_crawling");
// 설빙/미소야 크롤링 모델
async function saveToMongo(data: any[]) {
  // await connectMongoose(); //몽구스 연결 함수 호출
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

  const result = await branches.insertMany(data, { ordered: false });
  console.log(`MongoDB 저장 완료: ${result.length}건`);
}
