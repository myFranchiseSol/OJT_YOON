const axios = require("axios");
const {saveToMongoFromApi} = require("../services/save_to_mongo")
const BASE_URL = "https://dev-fc-api.myfranchise.kr/api/v1/crawling";
const REG_NO = "20171254";
const VERSION = {
  LATEST: "60063",
  PREV: "58731",
};

const PAGE_SIZE = 100;
const HEADERS = { accept: "application/json" }; // URL builders
const latestUrl = () => `${BASE_URL}/${REG_NO}/latest/`;
const listUrl = `${BASE_URL}/${VERSION.LATEST}/`;
const nextUrl = (versionPk: any) => `${BASE_URL}/${REG_NO}/${versionPk}/next/`;

// 1) 최신 버전 조회: /{registrationNumber}/latest/ 가맹점 최근정보 > 일단 db에 넣을 필요없슴 
async function fetchLatestVersionPk() {
  const { data } = await axios.get(latestUrl(), { headers: HEADERS });


console.log(data)
console.log("가맹점최근정보")
console.log("명륜진사갈비")
;}

// 2.가맹점 리스트 api 조회 > 단일 버전 (3번함수가 젤 중요하고 이건 참고용)
async function fetchstorelist() {
  const { data } = await axios.get(listUrl, { headers: HEADERS });
console.log(data.results[0])
console.log("가맹점리스트,next 정보 있음")
let nextKey = data.next;

console.log(nextKey);
let nextUrl = `${listUrl}?cursor=${nextKey}&size=${PAGE_SIZE}`;
console.log("nextUrl");
console.log(nextUrl);

return nextUrl;
}

//3. nextUrl 이용해서 페이지네이션 처리 하고 데이터 저장
async function fetch_all_list_using_next(nextUrl:any){
//cursor=next 이용해서 페이지네이션 처리 

let currentUrl= nextUrl;
  let pagenumber=0

  while(currentUrl){

  pagenumber++
  console.log(pagenumber)
  const { data } = await axios.get(currentUrl, { headers: HEADERS });
  saveToMongoFromApi(data)
  
  let nextkey=data.next
  console.log(nextkey)
  currentUrl=`${listUrl}?cursor=${nextkey}&size=${PAGE_SIZE}`


  if(nextkey==null){
    break;
  }
}}



//4, 가맹점 다음정보 테스트> ojt상 3번 api
async function fetchNextVersionPk(currentPk: any) {
  const { data } = await axios.get(nextUrl(currentPk), { headers: HEADERS });
  console.log(data)
  console.log("가맹점 다음정보 테스트")
  return data?.version_pk || data?.next_version_pk || null;
}

//
// 직접 실행 시: 최신 버전 → 전체 수집 → 저장
if (require.main === module) {
  (async () => {
    try {
      console.log("=== 프로그램 시작 ===");
      console.log("listUrl:", listUrl);
      
      // 1단계: 기본 URL 테스트
      console.log("1단계: 기본 URL 테스트 시작");
      const testResponse = await axios.get(listUrl, { headers: HEADERS });
      console.log("1단계 성공:", testResponse.data.results?.length || 0, "개 결과");
      
      // 2단계: fetch_all_list_using_next 실행
      console.log("2단계: fetch_all_list_using_next 시작");
      await fetch_all_list_using_next(listUrl);
      console.log("2단계 완료");
      
      // 3단계: fetchNextVersionPk 실행
      console.log("3단계: fetchNextVersionPk 시작");
      await fetchNextVersionPk(VERSION.LATEST);
      console.log("3단계 완료");
      
    } catch (e: any) {
      console.error("=== 에러 발생 ===");
      console.error("에러:", e);
      console.log("에러메시지:", e.message);
      console.log("에러스택:", e.stack);
      if (e.response) {
        console.log("에러데이터:", e.response.data);
      }
      process.exit(1);
    }
  })();
}

module.exports = { fetchLatestVersionPk,fetchNextVersionPk,fetch_all_list_using_next };
