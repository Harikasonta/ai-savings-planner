import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);

  // form states
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // fetch AI data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/ai/suggestions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      alert("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // add transaction
  const addTransaction = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/transactions/add",
        {
          type,
          amount: Number(amount),
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // clear inputs
      setAmount("");
      setCategory("");

      // refresh dashboard data
      fetchData();

    } catch (err) {
      alert("Error adding transaction");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1>Dashboard</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* FORM */}
      <div style={styles.form}>
        <h3>Add Transaction</h3>

        <select
          style={styles.input}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Category (salary, food, etc)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button style={styles.addBtn} onClick={addTransaction}>
          Add
        </button>
      </div>

      {/* DATA */}
      {data && (
        <>
          {/* CARDS */}
          <div style={styles.cards}>
            <div style={styles.card}>
              <h3>Income</h3>
              <p>₹{data.income}</p>
            </div>

            <div style={styles.card}>
              <h3>Expenses</h3>
              <p>₹{data.expenses}</p>
            </div>

            <div style={styles.card}>
              <h3>Savings</h3>
              <p>₹{data.savings}</p>
            </div>
          </div>

          {/* AI */}
          <div style={styles.suggestions}>
            <h2>AI Suggestions</h2>
            <ul>
              {data.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutBtn: {
    padding: "8px 15px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  form: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    margin: "20px auto",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    color: "black",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  addBtn: {
    width: "100%",
    padding: "10px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "150px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    color: "black",
  },

  suggestions: {
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    color: "black",
  },
};

export default Dashboard;