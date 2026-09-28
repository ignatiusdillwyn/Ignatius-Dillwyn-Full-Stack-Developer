const { JobController } = require("../controllers");
const { authentication, authorizationGetAllJob } = require("../middlewares/auth");
const jobRouter = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Manajemen lowongan kerja
 */

/**
 * @swagger
 * /api/job/add:
 *   post:
 *     summary: Tambah lowongan kerja baru
 *     description: Menambahkan lowongan kerja baru. Hanya user company yang sudah login yang bisa menambahkan.
 *     tags: [Jobs]
 *     security:
 *       - accessToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_title
 *               - location
 *               - salary
 *               - job_type
 *               - job_description
 *             properties:
 *               job_title:
 *                 type: string
 *                 example: Developer Java
 *               location:
 *                 type: string
 *                 example: Jakarta
 *               salary:
 *                 type: integer
 *                 example: 8000000
 *               job_type:
 *                 type: string
 *                 enum: [Full-time, Part-time, Contract]
 *                 example: Contract
 *               job_description:
 *                 type: string
 *                 example: Membuat dan memelihara aplikasi berbasis Java
 *     responses:
 *       201:
 *         description: Lowongan berhasil ditambahkan
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
 *                   example: Job added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_company_id:
 *                       type: integer
 *                       example: 1
 *                     job_title:
 *                       type: string
 *                       example: Developer Java
 *                     company:
 *                       type: string
 *                       example: PT ABC
 *                     location:
 *                       type: string
 *                       example: Jakarta
 *                     salary:
 *                       type: integer
 *                       example: 8000000
 *                     job_type:
 *                       type: string
 *                       example: Contract
 *                     job_description:
 *                       type: string
 *                       example: Membuat dan memelihara aplikasi berbasis Java
 *       400:
 *         description: Data tidak valid / gagal menambahkan
 *       401:
 *         description: Token tidak valid / tidak ada
 */
jobRouter.post("/add", authentication, JobController.addJob);

/**
 * @swagger
 * /api/job/getAll:
 *   get:
 *     summary: Ambil semua lowongan
 *     description: Mengembalikan seluruh data lowongan dari semua perusahaan.
 *     tags: [Jobs]
 *     security:
 *       - accessToken: []
 *     responses:
 *       201:
 *         description: Daftar semua lowongan
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
 *                   example: Get all jobs successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_company_id:
 *                         type: integer
 *                         example: 1
 *                       job_title:
 *                         type: string
 *                         example: Developer Java
 *                       job_description:
 *                         type: string
 *                         example: description
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Gagal memuat data
 *       401:
 *         description: Token tidak valid / tidak ada
 */
jobRouter.get("/getAll", authentication, JobController.getAllJobs);

/**
 * @swagger
 * /api/job/getAllByUserCompanyId:
 *   get:
 *     summary: Ambil semua lowongan milik perusahaan yang login
 *     description: Mengembalikan semua lowongan yang dibuat oleh perusahaan yang sedang login (berdasarkan token).
 *     tags: [Jobs]
 *     security:
 *       - accessToken: []
 *     responses:
 *       201:
 *         description: Daftar lowongan milik perusahaan
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
 *                   example: Get all jobs by user company id successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_company_id:
 *                         type: integer
 *                         example: 1
 *                       job_title:
 *                         type: string
 *                         example: Developer Java
 *                       job_description:
 *                         type: string
 *                         example: description
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
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Gagal memuat data
 *       401:
 *         description: Token tidak valid / tidak ada
 */
jobRouter.get(
  "/getAllByUserCompanyId",
  authentication,
  JobController.getAllJobsByUserCompanyId
);

/**
 * @swagger
 * /api/job/getById/{id}:
 *   get:
 *     summary: Ambil detail lowongan berdasarkan ID
 *     description: Mengembalikan detail satu lowongan berdasarkan ID.
 *     tags: [Jobs]
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID lowongan
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       201:
 *         description: Detail lowongan
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
 *                   example: Get job with id 1 successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_company_id:
 *                       type: integer
 *                       example: 1
 *                     job_title:
 *                       type: string
 *                       example: Developer Java
 *                     job_description:
 *                       type: string
 *                       example: description
 *                     company:
 *                       type: string
 *                       example: PT ABC
 *                     location:
 *                       type: string
 *                       example: Jakarta
 *                     salary:
 *                       type: integer
 *                       example: 8000000
 *                     job_type:
 *                       type: string
 *                       example: Contract
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Lowongan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job not found
 *       401:
 *         description: Token tidak valid / tidak ada
 *       500:
 *         description: Internal server error
 */
jobRouter.get("/getById/:id", authentication, JobController.getJobById);

module.exports = jobRouter;