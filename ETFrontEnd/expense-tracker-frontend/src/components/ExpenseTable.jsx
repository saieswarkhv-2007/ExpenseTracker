function ExpenseTable({ expenses, onExpenseDeleted }) {
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹0.00";
    return `₹${parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="glass-card" style={{ marginTop: "24px" }}>
      <h2 style={{ marginBottom: "16px" }}>Expense List</h2>
      
      <div className="table-container">
        <table className="expense-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses && expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                    #{expense.id}
                  </td>
                  <td style={{ fontWeight: "500" }}>
                    {expense.description}
                  </td>
                  <td style={{ fontWeight: "600", color: "#38bdf8" }}>
                    {formatCurrency(expense.amount)}
                  </td>
                  <td>
                    {formatDate(expense.expenseDate)}
                  </td>
                  <td>
                    <span className="category-badge">
                      {expense.category?.categoryName || "Uncategorized"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn-danger-outline"
                      onClick={() => onExpenseDeleted && onExpenseDeleted(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "var(--text-dim)", padding: "30px" }}>
                  No expenses found. Add your first expense above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseTable;