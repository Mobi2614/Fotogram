const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { userValidations } = require("../validations");
const { UserController } = require("../controllers");

const router = express.Router();

router.route("/").get(auth(["user", "admin"]), UserController.getUsers);

router
  .route("/:userId")
  .get(auth("user", "admin"), UserController.getUser)
  .delete(
    auth(["user", "admin"]),
    validate(userValidations.getUser),
    UserController.deleteUser
  )
  .put(
    auth("consumer", "creator"),
    validate(userValidations.getUser),
    UserController.updateUser
  );

module.exports = router;
