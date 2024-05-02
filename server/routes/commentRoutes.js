const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");
const commentController = require("../controllers/commentController");
const router = Router();

router.post(
  "/comments/:commentId/replies",
  requireAuth,
  commentController.postReply
);

router.patch(
  "/comments/:commentId/replies/:replyId",
  requireAuth,
  commentController.editReply
);

router.delete(
  "/comments/:commentId/replies/:replyId",
  requireAuth,
  commentController.deleteReply
);

router.post("/comments", commentController.postComments);

router.get(
  "/verse/:verseId/comments",
  requireAuth,
  commentController.getComments
);

router.patch("/comments/:id", requireAuth, commentController.editComment);

router.delete("/comments/:id", requireAuth, commentController.deleteComment);

module.exports = router;
