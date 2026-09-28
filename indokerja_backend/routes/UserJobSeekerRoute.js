const { UserJobSeekerController } = require("../controllers");
const userJobSeekerRouter = require("express").Router();
const { authentication } = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: UserJobSeeker
 *   description: Autentikasi & profil user pencari kerja
 */

/**
 * @swagger
 * /api/users/jobseeker/register:
 *   post:
 *     summary: Registrasi pencari kerja baru
 *     description: Membuat akun user job seeker baru dengan email, password, dan username.
 *     tags: [UserJobSeeker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: yourmail@gmail.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: yourpassword
 *               username:
 *                 type: string
 *                 example: your_username
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
 *                   example: User job seeker registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: yourmail@gmail.com
 *                     username:
 *                       type: string
 *                       example: your_username
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
userJobSeekerRouter.post("/register", UserJobSeekerController.register);

/**
 * @swagger
 * /api/users/jobseeker/login:
 *   post:
 *     summary: Login user pencari kerja
 *     description: Autentikasi user job seeker dan mengembalikan JWT token.
 *     tags: [UserJobSeeker]
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
 *                     username:
 *                       type: string
 *                       example: dillwyn
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
userJobSeekerRouter.post("/login", UserJobSeekerController.login);

/**
 * @swagger
 * /api/users/jobseeker/getUserById/{id}:
 *   get:
 *     summary: Ambil data user job seeker berdasarkan ID
 *     description: Mengembalikan data profil user job seeker (tanpa password). Endpoint ini membutuhkan autentikasi.
 *     tags: [UserJobSeeker]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user job seeker
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       201:
 *         description: Data user berhasil diambil
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
 *                   example: Get user with id 1 successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: dillwyn@example.com
 *                     username:
 *                       type: string
 *                       example: dillwyn
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Token tidak valid / tidak ada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */
userJobSeekerRouter.get(
  "/getUserById/:id",
  authentication,
  UserJobSeekerController.getUserById
);

module.exports = userJobSeekerRouter;