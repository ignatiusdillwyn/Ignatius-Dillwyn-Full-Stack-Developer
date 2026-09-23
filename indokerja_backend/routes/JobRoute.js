const { JobController } = require("../controllers");
const { authentication, authorizationGetAllJob } = require("../middlewares/auth");
const jobRouter = require("express").Router();

jobRouter.post(
  "/add",
  authentication,
  JobController.addJob
);
jobRouter.get(
  "/getAll",
  authentication,
  JobController.getAllJobs
);
jobRouter.get(
  "/getAllByUserCompanyId",
  authentication,
  JobController.getAllJobsByUserCompanyId
);
jobRouter.get(
  "/getById/:id", 
  authentication,
  JobController.getJobById
);

module.exports = jobRouter;