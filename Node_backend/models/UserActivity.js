const mongoose = require("mongoose");

const UserActivitySchema =
  new mongoose.Schema(
    {
      userId: Number,

      action: String,

      description: String,
    },
    { timestamps: true }
  );

module.exports = mongoose.model(
  "UserActivity",
  UserActivitySchema
);