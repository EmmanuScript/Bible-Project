const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");
const commentController = require("../controllers/commentController");
const router = Router();

router.post(
  "/comments/:commentId/reply",
  requireAuth,
  commentController.postReply
);

router.post("/comments", commentController.postComments);

router.get(
  "/verse/:verseId/comments",
  requireAuth,
  commentController.getComments
);

module.exports = router;
