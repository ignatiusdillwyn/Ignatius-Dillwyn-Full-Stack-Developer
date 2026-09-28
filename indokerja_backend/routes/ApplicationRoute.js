const { ApplicationsController } = require("../controllers");
const { authentication } = require("../middlewares/auth");
const applicationRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Manajemen lamaran kerja
 */

/**
 * @swagger
 * /api/application/add:
 *   post:
 *     summary: Lamar pekerjaan
 *     description: Jobseeker melamar sebuah lowongan. Tidak boleh melamar job yang sama dua kali.
 *     tags: [Applications]
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *               - status
 *             properties:
 *               job_id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [Applied, Reviewing, Shortlisted, Rejected, Accepted]
 *                 example: Applied
 *     responses:
 *       201:
 *         description: Lamaran berhasil dibuat
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
 *                   example: Application added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     job_id:
 *                       type: integer
 *                       example: 1
 *                     user_jobseeker_id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: Applied
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Job tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Job not found
 *       409:
 *         description: Sudah pernah melamar job ini
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: User has already applied to this job
 */
applicationRouter.post(
  "/add",
  authentication,
  ApplicationsController.addApplication
);

/**
 * @swagger
 * /api/application/getAllbyUserCompanyId:
 *   get:
 *     summary: Ambil semua lamaran untuk perusahaan yang login
 *     description: Mengembalikan semua lamaran yang masuk ke lowongan milik perusahaan yang sedang login.
 *     tags: [Applications]
 *     security:
 *       - accessToken: []
 *     responses:
 *       201:
 *         description: Daftar lamaran
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
 *                   example: Get all applications successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       job_id:
 *                         type: integer
 *                         example: 2
 *                       user_jobseeker_id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: Applied
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       job_title:
 *                         type: string
 *                         example: Developer PHP
 *                       company:
 *                         type: string
 *                         example: PT ABC
 *                       location:
 *                         type: string
 *                         example: Jakarta
 *                       salary:
 *                         type: integer
 *                         example: 8000000
 *                       job_type:
 *                         type: string
 *                         example: Contract
 *       400:
 *         description: Gagal memuat data
 *       401:
 *         description: Token tidak valid
 */
applicationRouter.get(
  "/getAllbyUserCompanyId",
  authentication,
  ApplicationsController.getAllApplicationsByUserCompanyId
);

/**
 * @swagger
 * /api/application/getAllbyJobSeekerId:
 *   get:
 *     summary: Ambil semua lamaran milik jobseeker yang login
 *     description: Mengembalikan semua lamaran yang pernah dikirim oleh jobseeker yang sedang login.
 *     tags: [Applications]
 *     security:
 *       - accessToken: []
 *     responses:
 *       201:
 *         description: Daftar lamaran
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
 *                   example: Get all applications successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       job_id:
 *                         type: integer
 *                         example: 2
 *                       user_jobseeker_id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: Applied
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Gagal memuat data
 *       401:
 *         description: Token tidak valid
 */
applicationRouter.get(
  "/getAllbyJobSeekerId",
  authentication,
  ApplicationsController.getAllApplicationsByJobSeekerId
);

/**
 * @swagger
 * /api/application/getById/{id}:
 *   get:
 *     summary: Ambil detail lamaran berdasarkan ID
 *     description: Mengembalikan detail satu lamaran berdasarkan ID.
 *     tags: [Applications]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID lamaran
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       201:
 *         description: Detail lamaran
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
 *                   example: Get application successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     job_id:
 *                       type: integer
 *                       example: 2
 *                     user_jobseeker_id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: Applied
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Gagal memuat data
 *       401:
 *         description: Token tidak valid
 */
applicationRouter.get(
  "/getById/:id",
  authentication,
  ApplicationsController.getApplicationById
);

/**
 * @swagger
 * /api/application/update/{id}:
 *   post:
 *     summary: Update status lamaran
 *     description: Perusahaan mengubah status lamaran. Setiap perubahan otomatis dicatat di ApplicationHistories.
 *     tags: [Applications]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID lamaran
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Applied, Reviewing, Shortlisted, Rejected, Accepted]
 *                 example: Reviewing
 *     responses:
 *       201:
 *         description: Status berhasil diubah
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
 *                   example: Application updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     job_id:
 *                       type: integer
 *                       example: 1
 *                     user_jobseeker_id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: Reviewing
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Lamaran tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application not found
 */
applicationRouter.post(
  "/update/:id",
  authentication,
  ApplicationsController.updateApplication
);

module.exports = applicationRouter;