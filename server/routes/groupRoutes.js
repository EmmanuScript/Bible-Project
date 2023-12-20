const groupController = require("../controllers/groupController");
const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.get("/group", requireAuth, groupController.get_group);

router.put(
  "/update-group-score/:groupId",
  requireAuth,
  groupController.update_group_score
);

router.get("/highest-score", requireAuth, groupController.highest_score);

router.get(
  "/user-highest-score",
  requireAuth,
  groupController.user_highest_score
);

module.exports = router;
