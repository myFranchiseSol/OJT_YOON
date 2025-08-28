import type { Request, Response } from "express";
const Franchise = require("../models/branches_from_api");
const connectMongoose = require("../../utils/mongoose");

class FranchiseController {
  async GetFranchiseList_UsingRegisterNumber(req: Request, res: Response) {
    await connectMongoose();
    const { registerNumber } = req.params; // 확장성 고려하여 registernumber( 회사코드) 파라미터로 받음
    const franchise = await Franchise.find({}); //현재 db에 명륜진사갈비 데이터 밖에 없기에 Find에 조건 없음 (전제데이터조회)
    res.send(franchise);
  }
}

module.exports = { FranchiseController };
