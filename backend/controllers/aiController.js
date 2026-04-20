const Transaction = require("../models/Transaction");

exports.getSuggestions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user });

    let income = 0;
    let expenses = 0;

    const categoryMap = {};

    transactions.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expenses += t.amount;

        // category tracking
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += t.amount;
      }
    });

    const savings = income - expenses;

    let suggestions = [];

    // Rule 1
    if (expenses > income) {
      suggestions.push("You are spending more than your income!");
    }

    // Rule 2
    if (savings < income * 0.2) {
      suggestions.push("Try to save at least 20% of your income.");
    }

    // Rule 3 (category-based)
    for (let category in categoryMap) {
      if (categoryMap[category] > income * 0.3) {
        suggestions.push(`High spending on ${category}. Try reducing it.`);
      }
    }

    // Default message
    if (suggestions.length === 0) {
      suggestions.push("Great job! Your finances look balanced.");
    }

    res.json({
      income,
      expenses,
      savings,
      suggestions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};