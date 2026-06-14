const ExpenseLog = require("../models/ExpenseLog");

// GET /api/logs  — fetch all MongoDB expense logs
exports.getAll = async (req, res) => {
  try {
    const data = await ExpenseLog.find().sort({ expenseDate: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/logs/user/:userId  — fetch logs for a specific Spring Boot user
exports.getByUser = async (req, res) => {
  try {
    const data = await ExpenseLog.find({
      userId: Number(req.params.userId),
    }).sort({ expenseDate: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/logs  — create a log entry using same attributes as Spring Boot Expense:
//   { userId, amount, description, expenseDate, categoryName }
exports.addExpense = async (req, res) => {
  try {
    const { userId, amount, description, expenseDate, categoryName } = req.body;

    const expense = await ExpenseLog.create({
      userId,
      amount,
      description,
      expenseDate: expenseDate || new Date(),
      categoryName: categoryName || "Uncategorized",
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/logs/:id  — remove a log by MongoDB _id
exports.deleteExpense = async (req, res) => {
  try {
    await ExpenseLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Log deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};