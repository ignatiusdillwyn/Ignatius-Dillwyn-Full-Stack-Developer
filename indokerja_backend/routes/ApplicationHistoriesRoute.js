const { ApplicationHistoriesController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const applicationHistoryRouter = require("express").Router();

applicationHistoryRouter.post(
  "/add",
  authentication,
  ApplicationHistoriesController.addApplicationHistory
);

module.exports = applicationHistoryRouter;