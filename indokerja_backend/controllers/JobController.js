const { Jobs, sequelize } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const { encryptPwd, decryptPwd } = require("../helpers/bcrypt");
const { tokenGeneratorUserJobSeeker } = require("../helpers/jwt");

class JobController {
  static async addJob(req, res) {
    try {
      let { job_title, location, salary, job_type, job_description } = req.body;
      let user_company_id = req.userData.id;

      const companyData = await sequelize.query(`
        select company from UserCompanies uc
        where id = :id
      `, {
        replacements: { id: user_company_id },
        type: Sequelize.QueryTypes.SELECT
      });
      let company = companyData[0].company;

      const job = await Jobs.create({
        user_company_id,
        job_title,
        company,
        location,
        salary,
        job_type,
        job_description
      });

      res.status(201).json({
        status: 201,
        message: "Job added successfully",
        data: {
          user_company_id: job.user_company_id,
          job_title: job.email,
          company: job.username,
          location: job.location,
          salary: job.salary,
          job_type: job.job_type,
          job_description: job.job_description
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllJobs(req, res) {
    try {
      const jobs = await Jobs.findAll();
      res.status(201).json({
        status: 201,
        message: "Get all jobs successfully",
        data: jobs
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllJobsByUserCompanyId(req, res) {
    try {
      let user_company_id = req.userData.id;
      const jobs = await sequelize.query(`
        select * from Jobs j
        where j.user_company_id = :user_company_id;
      `, {
        replacements: { user_company_id: user_company_id },
        type: Sequelize.QueryTypes.SELECT
      });
      res.status(201).json({
        status: 201,
        message: "Get all jobs by user company id successfully",
        data: jobs
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getJobById(req, res) {
    try {
      const job = await Jobs.findByPk(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.status(201).json({
        status: 201,
        message: `Get job with id ${req.params.id} successfully`,
        data: job
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = JobController;
