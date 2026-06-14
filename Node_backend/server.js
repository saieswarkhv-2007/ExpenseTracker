require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const connectDB = require("./config/db");

// Only expenselogs is active — other collections removed
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ── Only active route ─────────────────────────────────────────────────────────
app.use("/api/logs", expenseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Node/MongoDB Service Running on port 5001" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});