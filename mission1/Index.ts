require("dotenv").config();
import mongoose = require("mongoose");

// 서비스들 import
const { crawlMisoya } = require("./src/services/misoya_crawl");
const { crawlSulbing } = require("./src/services/sulbing_crawl");
const { saveToMongo } = require("./src/repository/save_to_mongo");

// 메인 실행 함수
async function main() {
  try {
    console.log("🚀 Mission1 프로그램 시작");
    console.log("📊 크롤링 시작...");

    // 설빙 크롤링
    console.log("🍧 설빙 크롤링 중...");
    const sulbingData = await crawlSulbing();
    console.log(`설빙 데이터 수집 완료: ${sulbingData.length}건`);

    // 미소야 크롤링
    console.log("🍜 미소야 크롤링 중...");
    const misoyaData = await crawlMisoya();
    console.log(`미소야 데이터 수집 완료: ${misoyaData.length}건`);

    // 3. 데이터 저장
    console.log("💾 MongoDB 저장 중...");

    saveToMongo(sulbingData, "sulbing");
    saveToMongo(misoyaData, "misoya");
    console.log("✅ 모든 작업 완료!");
  } catch (error) {
    console.error("❌ 프로그램 실행 중 오류 발생:", error);
    process.exit(1);
  } finally {
    // MongoDB 연결 종료
    await mongoose.disconnect();
    console.log("🔌 MongoDB 연결 종료");
  }
}

// 직접 실행 시에만 main 함수 실행
if (require.main === module) {
  main();
}

module.exports = { main };
