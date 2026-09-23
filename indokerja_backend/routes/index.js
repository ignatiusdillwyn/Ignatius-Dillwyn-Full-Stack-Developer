const router = require("express").Router();
const base = "api";

router.get(`/${base}`, (req, res) => {
  res.json({ message: "WEB API" });
});

const userCompanyRouters = require("./UserCompanyRoute");
const userJobSeekerRouters = require("./UserJobSeekerRoute");
const jobRouters = require("./JobRoute");
const applicationRouters = require("./ApplicationRoute");
const applicationHistoryRouters = require("./ApplicationHistoriesRoute");

router.use(`/${base}/users/company`, userCompanyRouters);
router.use(`/${base}/users/jobseeker`, userJobSeekerRouters);
router.use(`/${base}/job`, jobRouters);
router.use(`/${base}/application`, applicationRouters);
router.use(`/${base}/application-history`, applicationHistoryRouters);

module.exports = router;
