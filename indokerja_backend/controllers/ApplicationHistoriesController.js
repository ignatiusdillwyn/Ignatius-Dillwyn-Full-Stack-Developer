const { ApplicationHistories } = require("../models");
const { Op } = require("sequelize");
const { encryptPwd, decryptPwd } = require("../helpers/bcrypt");
const { tokenGeneratorUserJobSeeker } = require("../helpers/jwt");
const { Sequelize } = require("sequelize");

class ApplicationHistoriesController {
  static async addApplicationHistory(req, res) {
    try {
      let { application_id, previous_status, current_status } = req.body;

      const applicationHistory = await ApplicationHistories.create({
        application_id,
        previous_status,
        current_status,
      });

      res.status(201).json({
        status: 201,
        message: "Application History added successfully",
        data: {
          application_id: applicationHistory.application_id,
          previous_status: applicationHistory.previous_status,
          current_status: applicationHistory.current_status,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ApplicationHistoriesController;
