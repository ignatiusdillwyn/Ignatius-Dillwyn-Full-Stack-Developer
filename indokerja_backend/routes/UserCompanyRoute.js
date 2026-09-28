const { UserCompanyController } = require("../controllers");
const userCompanyRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: UserCompany
 *   description: Autentikasi & registrasi user perusahaan
 */

/**
 * @swagger
 * /api/users/company/register:
 *   post:
 *     summary: Registrasi perusahaan baru
 *     description: Membuat akun user company baru dengan email, password, dan nama perusahaan.
 *     tags: [UserCompany]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - company
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: your_mail@gmail.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: your_password
 *               company:
 *                 type: string
 *                 example: PT ABC
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: User company registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: your_mail@gmail.com
 *                     company:
 *                       type: string
 *                       example: your_password
 *       400:
 *         description: Data tidak valid / email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is already registered
 */
userCompanyRouter.post("/register", UserCompanyController.register);

/**
 * @swagger
 * /api/users/company/login:
 *   post:
 *     summary: Login user perusahaan
 *     description: Autentikasi user company dan mengembalikan JWT token.
 *     tags: [UserCompany]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: andi@gmail.com
 *               password:
 *                 type: string
 *                 example: andi12345
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login success
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     company:
 *                       type: string
 *                       example: PT ABC
 *                     email:
 *                       type: string
 *                       example: andi@gmail.com
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Email atau password salah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Wrong email
 *       500:
 *         description: Internal server error
 */
userCompanyRouter.post("/login", UserCompanyController.login);

module.exports = userCompanyRouter;