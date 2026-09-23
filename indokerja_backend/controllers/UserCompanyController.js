const { UserCompanies } = require("../models");
const { Op } = require("sequelize");
const { encryptPwd, decryptPwd } = require("../helpers/bcrypt");
const { tokenGeneratorUserCompany } = require("../helpers/jwt");
const { Sequelize } = require("sequelize");

class UserCompanyController {
  static async register(req, res) {
    try {
      let { email, password, company } = req.body;
      password = encryptPwd(password);

      const user = await UserCompanies.create({
        email,
        password,
        company,
      });

      res.status(201).json({
        status: 201,
        message: "User company registered successfully",
        user: {
          id: user.id,
          email: user.email,
          company: user.company,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserCompanies.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Wrong email" });
      } 
      
      let decrtyptPass = decryptPwd(password, user.password);

      if (!decrtyptPass) {
        return res.status(401).json({ message: "Wrong password" });
      } else {
        let token = tokenGeneratorUserCompany(user);
        console.log('user ', user)
        res.json({
          status: 200,
          message: "Login success",
          user: {
            id: user.id,
            company: user.company,
            email: user.email,
            token: token
          },
        });
      }

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserCompanyController;
