import express from "express";

const router = express.Router({ mergeParams: true });
import { getNews, postNews, fetchNews } from "../handlers/NewsHandler.js";

router.route("/").get(getNews);
router.route("/fetch").post(fetchNews);
router.route("/").post(postNews);

export default router;
