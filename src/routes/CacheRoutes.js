import express from "express";

const router = express.Router({ mergeParams: true });
import { getData, setData } from "../handlers/CacheHandler.js";

router.route("/get").get(getData);
router.route("/set").post(setData);

export default router;
