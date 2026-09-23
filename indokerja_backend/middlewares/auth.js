const { Jobs, sequelize } = require("../models/");
const { tokenVerifier } = require("../helpers/jwt");
const { Sequelize } = require("sequelize");

const authentication = (req, res, next) => {
  console.log("Authentication");
  const { access_token } = req.headers;
  if (access_token) {
    const decoded = tokenVerifier(access_token);
    console.log("Decoded Token:", decoded); 
    req.userData = decoded;
    // console.log("Access token >, ", decoded);
    next();
  } else {
    res.status(401).json({
      message: "Token not found",
  });
  }
};

const authorizationGetAllJob = async (req, res, next) => {
  console.log("Authorization");
  try {
    // const id = +req.params.id;
    const user_company_id = req.userData.id;
    // const job = await Jobs.findOne({
    //   where: { id },
    // });

    const jobs = await sequelize.query(`
      select * from "Jobs" j
      where user_company_id = :id
    `, {
      replacements: { user_company_id: user_company_id },
      type: Sequelize.QueryTypes.SELECT
    });
    console.log('jobs ', jobs)
    if (jobs) {
      if (job.user_company_id === UserId) {
        next();
      } else {
        throw {
          message: "You are not allowed.",
        };
      }
    } else {
      throw {
        message: "Job not found",
      };
    }
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  authentication,
  authorizationGetAllJob,
};
