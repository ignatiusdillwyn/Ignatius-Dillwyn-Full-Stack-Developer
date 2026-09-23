const { ApplicationsController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const applicationRouter = require("express").Router();

applicationRouter.post(
  "/add",
  authentication,
  ApplicationsController.addApplication
);
applicationRouter.get(
  "/getAllbyUserCompanyId",
  authentication,
  ApplicationsController.getAllApplicationsByUserCompanyId
);
applicationRouter.get(
  "/getAllbyJobSeekerId",
  authentication,
  ApplicationsController.getAllApplicationsByJobSeekerId
);
applicationRouter.get(
  "/getById/:id",
  authentication,
  ApplicationsController.getApplicationById
);
applicationRouter.post(
  "/update/:id", 
  authentication,
  ApplicationsController.updateApplication
);

module.exports = applicationRouter;