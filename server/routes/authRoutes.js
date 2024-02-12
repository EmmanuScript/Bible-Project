const userController = require("../controllers/userController");
const regController = require("../controllers/regController");
const { Router } = require("express");
const { requireAuth } = require("../middleware/auth");
const groupController = require("../controllers/groupController");

const router = Router();

router.post("/signup", regController.signup_post);

router.post("/login", regController.login_post);

router.get("/log-out", regController.logout_get);

router.get("/get-user/:userId", requireAuth, userController.get_user);

router.get("/get-users", requireAuth, userController.get_users);

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

router.get("/quiz-taken/:userId", requireAuth, userController.quiz_taken);

router.patch("/update-quiz/:id", requireAuth, userController.update_quiz);

router.patch(
  "/update-streak/:userId",
  requireAuth,
  userController.update_streak
);

router.get("/top-users", requireAuth, userController.get_highest_score_users);

router.patch(
  "/calculate-points/:userId",
  requireAuth,
  userController.calculate_points
);

router.post("/forgot-password", userController.forgot_password);

router.patch("/update-otp", userController.update_otp);

router.patch("/check-otp", userController.check_otp);

router.patch("/reset-password", regController.update_password);

module.exports = router;
