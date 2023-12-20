const userController = require("../controllers/userController");
const regController = require("../controllers/regController");
const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.post("/signup", regController.signup_post);

router.post("/login", regController.login_post);

router.get("/log-out", regController.logout_get);

router.get("/get-users", requireAuth, userController.get_users);

router.get(
  "/get-group-users/:groupId",
  requireAuth,
  userController.get_group_users
);

router.put("/update-user/:userId", requireAuth, userController.update_user);

router.get(
  "/get-user-score/:userId",
  requireAuth,
  userController.get_user_score
);

router.patch(
  "/update-user-score/:userId",
  requireAuth,
  userController.update_user_score
);

module.exports = router;
