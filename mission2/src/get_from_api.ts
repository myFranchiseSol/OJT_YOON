const {
  saveToMongoFromApi,
  saveLatestVersionPk,
} = require("../services/save_to_mongo");
const BASE_URL = "https://dev-fc-api.myfranchise.kr/api/v1/crawling";
const REG_NO = "20171254";
const VERSION = {
  LATEST: "60063",
  PREV: "58731",
};

const PAGE_SIZE = 100;
const HEADERS = { accept: "application/json" }; // URL builders
const latestUrl = () => `${BASE_URL}/${REG_NO}/latest/`;
const nextUrl = (versionPk: any) => `${BASE_URL}/${REG_NO}/${versionPk}/next/`;

//최신 Id 조회
async function fetchLatestVersionPk() {
  const { data } = await axios.get(latestUrl(), { headers: HEADERS });
  await saveLatestVersionPk(data.id);
  console.log("최신버전 저장완료");
  console.log("최신id:", data.id);
  return data.id;
}

// 2.가맹점 리스트 api 조회 > 단일 버전 (3번함수가 젤 중요하고 이건 참고용)
async function fetchstorelist() {
  const latesVersionId = await fetchLatestVersionPk();
  const latestUrl = `${BASE_URL}/${latesVersionId}/`;
  const { data } = await axios.get(latestUrl, { headers: HEADERS });
  console.log(data.results[0]);
  console.log("가맹점리스트,next 정보 있음");
  let nextKey = data.next;

  console.log(nextKey);
  let paginationUrl = `${latestUrl}?cursor=${nextKey}&size=${PAGE_SIZE}`;
  console.log("paginationUrl");
  console.log(paginationUrl);

  return { paginationUrl, latestUrl };
}

//3. nextUrl 이용해서 페이지네이션 처리 하고 데이터 저장
async function fetch_all_list_using_next(nextUrl: any) {
  //cursor=next 이용해서 페이지네이션 처리
  const latesVersionId = await fetchLatestVersionPk();
  const listUrl = `${BASE_URL}/${latesVersionId}/`;
  let currentUrl = nextUrl;
  let pagenumber = 0;

  while (currentUrl) {
    pagenumber++;
    console.log("페이지네이션 처리중:", pagenumber);
    const { data } = await axios.get(currentUrl, { headers: HEADERS });
    saveToMongoFromApi(data);

    let nextkey = data.next;
    console.log(nextkey, typeof nextkey);

    if (typeof nextkey !== "string") {
      console.log("end of iteration");
      break;
    }
    currentUrl = `${listUrl}?cursor=${nextkey}&size=${PAGE_SIZE}`;
  }
}

//
// 직접 실행 시: 최신 버전 → 전체 수집 → 저장
if (require.main === module) {
  (async () => {
    try {
      console.log("=== 프로그램 시작 ===");

      await connectMongoose();
      const { latestUrl, paginationUrl } = await fetchstorelist();
      //만약 최신버전 조회
      console.log("최신버전저장");
      await fetchLatestVersionPk();
      console.log(" fetch_all_list_using_next 시작");
      await fetch_all_list_using_next(latestUrl);
      console.log("2단계 완료");
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

module.exports = {
  fetchLatestVersionPk,
  fetch_all_list_using_next,
};
