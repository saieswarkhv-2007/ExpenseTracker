import { useState, useEffect } from "react";
import API, { NODE_API } from "../services/api";

function ExpenseForm({ onExpenseAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultCategories = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Others"];

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
      if (res.data && res.data.length > 0) {
        setSelectedCategory(res.data[0].id.toString());
      } else {
        setSelectedCategory("Food");
      }
    } catch {
      // Fallback if the endpoint is not ready
      setCategories([]);
      setSelectedCategory("Food");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !expenseDate) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let categoryObj = null;

      // Handle category resolution
      if (isCustom) {
        const trimmedCustom = customCategory.trim();
        if (!trimmedCustom) {
          setError("Please specify a category name.");
          setLoading(false);
          return;
        }

        // Check if category already exists in loaded categories
        const existing = categories.find(
          (c) => c.categoryName.toLowerCase() === trimmedCustom.toLowerCase()
        );

        if (existing) {
          categoryObj = existing;
        } else {
          // Save the new category on the backend first
          const catRes = await API.post("/categories", {
            categoryName: trimmedCustom,
          });
          categoryObj = catRes.data;
          // Refresh local categories list
          setCategories([...categories, categoryObj]);
        }
      } else {
        // Dropdown selection (could be existing ID or a default string)
        const isNumeric = /^\d+$/.test(selectedCategory);
        if (isNumeric) {
          const found = categories.find((c) => c.id.toString() === selectedCategory);
          categoryObj = found || null;
        } else {
          // If it was a fallback default string, create it or resolve it
          const existing = categories.find(
            (c) => c.categoryName.toLowerCase() === selectedCategory.toLowerCase()
          );

          if (existing) {
            categoryObj = existing;
          } else {
            // Save it
            const catRes = await API.post("/categories", {
              categoryName: selectedCategory,
            });
            categoryObj = catRes.data;
            setCategories([...categories, categoryObj]);
          }
        }
      }

      const userId = localStorage.getItem("userId");
      const userObj = userId ? { id: parseInt(userId) } : null;

      const expensePayload = {
        amount: parseFloat(amount),
        description,
        expenseDate,
        category: categoryObj,
        user: userObj,
      };

      const res = await API.post("/expenses", expensePayload);

      // ── Mirror to MongoDB (Node backend port 5001) ────────────────────────
      // Uses same Spring Boot attributes: userId, amount, description, expenseDate, categoryName
      await NODE_API.post("/api/logs", {
        userId:       parseInt(userId) || 0,
        amount:       parseFloat(amount),
        description,
        expenseDate,
        categoryName: categoryObj?.categoryName || selectedCategory || "Uncategorized",
      });

      // Reset form on success
      setDescription("");
      setAmount("");
      setCustomCategory("");
      setIsCustom(false);
      setError("");
      
      // Callback to refresh sibling components/table
      if (onExpenseAdded) {
        onExpenseAdded(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (val) => {
    if (val === "NEW") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSelectedCategory(val);
    }
  };

  return (
    <div className="glass-card form-card">
      <h2>Add New Expense</h2>
      
      {error && (
        <div style={{ color: "#ef4444", fontSize: "14px", marginBottom: "5px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row" style={{ marginBottom: "16px" }}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              className="form-input"
              placeholder="e.g. Weekly Groceries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: "20px" }}>
          <div className="form-group">
            <label htmlFor="date">Expense Date</label>
            <input
              id="date"
              type="date"
              className="form-input"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            {!isCustom ? (
              <select
                id="category"
                className="form-input"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))
                ) : (
                  defaultCategories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))
                )}
                <option value="NEW">+ Create New Category...</option>
              </select>
            ) : (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="New Category Name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-danger-outline"
                  onClick={() => setIsCustom(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Expense"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;