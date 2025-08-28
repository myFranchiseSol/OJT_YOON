// 마이프차 API 활용

export async function saveToMongoFromApi(docs: any) {
  const collection = api_data;
  await collection.insertMany(docs.results);
}

export async function saveLatestVersionPk(latestVersionPk: any) {
  const collection = latest_version_pk;
  await collection.insertOne({ latestVersionPk });
}

module.exports = { saveToMongo, saveToMongoFromApi, saveLatestVersionPk };
