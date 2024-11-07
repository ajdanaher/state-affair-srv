import express from "express";

const router = express.Router({ mergeParams: true });
import { getComments, postComments } from "../handlers/CommentsHandler.js";

router.route("/:id").get(getComments);
router.route("/:id").post(postComments);

export default router;
