const { UserJobSeekerController } = require("../controllers");
const userJobSeekerRouter = require("express").Router();
const { authentication } = require("../middlewares/auth");

userJobSeekerRouter.post("/login", UserJobSeekerController.login);
userJobSeekerRouter.post("/register", UserJobSeekerController.register);
userJobSeekerRouter.get("/getUserById/:id", authentication, UserJobSeekerController.getUserById);
module.exports = userJobSeekerRouter;
