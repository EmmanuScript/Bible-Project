const groupController = require("../controllers/groupController");
const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.get("/group", requireAuth, groupController.get_group);
router.get("/groups/:id", requireAuth, groupController.get_group_by_id);
router.get("/group_leader/:id", requireAuth, groupController.get_group_leader);

router.get(
  "/group-highest-score",
  requireAuth,
  groupController.group_highest_score
);

router.get(
  "/user-highest-score",
  requireAuth,
  groupController.user_highest_score
);

router.put(
  "/update-group-score/:groupId",
  requireAuth,
  groupController.get_group
);

router.get(
  "/group-score/:groupId",
  requireAuth,
  groupController.get_group_score
);

module.exports = router;
