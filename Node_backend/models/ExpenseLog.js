const mongoose = require("mongoose");

// Fields mirror Spring Boot Expense entity:
//   amount       → Double amount
//   description  → String description  (was "title")
//   expenseDate  → LocalDate expenseDate  (was "date")
//   categoryName → String categoryName  (from Category.categoryName)
//   userId       → Long id (FK to Spring Boot User)
const ExpenseLogSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    expenseDate: {
      type: Date,
      default: Date.now,
    },

    categoryName: {
      type: String,
      default: "Uncategorized",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpenseLog", ExpenseLogSchema);