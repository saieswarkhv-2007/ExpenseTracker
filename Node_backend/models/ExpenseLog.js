const mongoose = require("mongoose");

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