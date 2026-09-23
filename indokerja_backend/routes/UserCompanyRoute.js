const { UserCompanyController } = require("../controllers");
const userCompanyRouter = require("express").Router();

userCompanyRouter.post("/login", UserCompanyController.login);
userCompanyRouter.post("/register", UserCompanyController.register);
module.exports = userCompanyRouter;
