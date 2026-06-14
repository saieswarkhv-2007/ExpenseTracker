const mongoose = require("mongoose");

const ExpenseEmbeddingSchema =
  new mongoose.Schema({
    expenseId: String,

    text: String,

    embedding: [Number],
  });

module.exports = mongoose.model(
  "ExpenseEmbedding",
  ExpenseEmbeddingSchema
);