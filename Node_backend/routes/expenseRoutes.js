const express = require("express");

const router = express.Router();

const controller = require("../controllers/expenseLogController");

// GET  /api/logs              → all expense logs
router.get("/", controller.getAll);

// GET  /api/logs/user/:userId → logs for one Spring Boot user
router.get("/user/:userId", controller.getByUser);

// POST /api/logs              → create a log (same attributes as Spring Boot Expense)
router.post("/", controller.addExpense);

// DELETE /api/logs/:id        → delete a log by MongoDB _id
router.delete("/:id", controller.deleteExpense);

module.exports = router;