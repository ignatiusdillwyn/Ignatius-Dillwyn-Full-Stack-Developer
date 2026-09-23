const { Applications, sequelize, ApplicationHistories } = require("../models");
const { Op } = require("sequelize");
const { encryptPwd, decryptPwd } = require("../helpers/bcrypt");
const { tokenGeneratorUserJobSeeker } = require("../helpers/jwt");
const { Sequelize } = require("sequelize");

class ApplicationsController {
  static async addApplication(req, res) {
    try {
      let { job_id, status } = req.body;
      let user_jobseeker_id = req.userData.id;

      let data = null
      data = await sequelize.query(`
        select * from "Applications" a 
        where job_id = :job_id and user_jobseeker_id = :user_jobseeker_id;
        `, {
        replacements: { job_id: job_id, user_jobseeker_id: user_jobseeker_id },
        type: Sequelize.QueryTypes.SELECT
      });

      if (data.length > 0) {
        return res.status(409).json({
          status: 409,
          message: "User has already applied to this job",
        });
      }

      let dataJob = await sequelize.query(`
        select * from "Jobs" j 
        where id = :id
        `, {
        replacements: { id: job_id },
        type: Sequelize.QueryTypes.SELECT
      });

      if (dataJob.length == 0) {
        return res.status(404).json({
          status: 404,
          message: "Job not found",
        });
      }

      const application = await Applications.create({
        job_id,
        user_jobseeker_id,
        status,
      });

      res.status(201).json({
        status: 201,
        message: "Application added successfully",
        data: {
          job_id: application.job_id,
          user_jobseeker_id: application.user_jobseeker_id,
          status: application.status,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllApplicationsByUserCompanyId(req, res) {
    try {
      let user_company_id = req.userData.id;
      let applications = await sequelize.query(`
        select * from Applications a 
        join Jobs j on j.id = a.job_id
        where j.user_company_id  = :user_company_id;
        `, {
        replacements: { user_company_id: user_company_id },
        type: Sequelize.QueryTypes.SELECT
      });

      res.status(201).json({
        status: 201,
        message: "Get all applications successfully",
        data: applications
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllApplicationsByJobSeekerId(req, res) {
    try {
      let user_jobseeker_id = req.userData.id;
      let applications = await sequelize.query(`
        select * from Applications a 
        where a.user_jobseeker_id = :user_jobseeker_id
        `, {
        replacements: { user_jobseeker_id: user_jobseeker_id },
        type: Sequelize.QueryTypes.SELECT
      });

      res.status(201).json({
        status: 201,
        message: "Get all applications successfully",
        data: applications
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getApplicationById(req, res) {
    try {
      // let user_jobseeker_id = req.userData.id;
      let application = await Applications.findByPk(req.params.id);

      res.status(201).json({
        status: 201,
        message: "Get application successfully",
        data: application
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateApplication(req, res) {
    try {
      const application = await Applications.findByPk(req.params.id);
      if (!application) return res.status(404).json({ message: "Application not found" });

      let application_id = application.dataValues.id;
      let previous_status = application.dataValues.status;

      await application.update(req.body);

      let current_status = req.body.status;

      const applicationHistory = await ApplicationHistories.create({
        application_id,
        previous_status,
        current_status,
      });

      res.status(201).json({
        status: 201,
        message: "Application updated successfully",
        data: application
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ApplicationsController;
