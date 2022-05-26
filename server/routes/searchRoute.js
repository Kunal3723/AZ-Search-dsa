import express from "express";
import {get_search_result } from "../Controller/search.js";
const router = express.Router();

router.get("/", get_search_result);

export default router;
