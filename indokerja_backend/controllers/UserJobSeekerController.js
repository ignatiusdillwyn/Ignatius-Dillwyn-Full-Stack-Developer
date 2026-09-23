const { UserJobSeekers } = require("../models");
const { Op } = require("sequelize");
const { encryptPwd, decryptPwd } = require("../helpers/bcrypt");
const { tokenGeneratorUserJobSeeker } = require("../helpers/jwt");
const { Sequelize } = require("sequelize");

class UserJobSeekerController {
  static async register(req, res) {
    try {
      let { email, password, username } = req.body;
      password = encryptPwd(password);

      const user = await UserJobSeekers.create({
        email,
        password,
        username,
      });

      res.status(201).json({
        status: 201,
        message: "User job seeker registered successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserJobSeekers.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Wrong email" });
      }

      let decrtyptPass = decryptPwd(password, user.password);

      if (!decrtyptPass) {
        return res.status(401).json({ message: "Wrong password" });
      } else {
        let token = tokenGeneratorUserJobSeeker(user);
        console.log('user ', user)
        res.json({
          status: 200,
          message: "Login success",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            token: token
          },
        });
      }

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserJobSeekers.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) return res.status(404).json({ message: "User not found" });
      
      res.status(201).json({
        status: 201,
        message: `Get user with id ${req.params.id} successfully`,
        data: user
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserJobSeekerController;
