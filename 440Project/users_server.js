import express from 'express';
import cors from 'cors';
import { createUser, getUser, createBudget, createCategories, getCategories, createTransaction } from './database.js'; // Import the createUser function from database.js
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ✅ Register route
app.post('/register', async (req, res) => {
  const { userName, password, email, phoneNumber, confirmPassword } = req.body;

  try{
    const userID = await createUser(userName, password, email, phoneNumber);
    res.json({ message: "Registration successful!", userID });
  }
 catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed." });
  }
});
app.post('/login', async (req, res) => {
  const { user_ID, userName, password } = req.body;
  try{
    const userID = await getUser(user_ID, userName, password);
    if (userID === "P") {
      return res.status(401).json({ message: "Invalid password." });
    }
    if(userID ==="U"){
      return res.status(401).json({ message: "User not found." });
    }
    res.json({ message: "Login successful!", userID, userName });
  }
 catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed." });
  }
});
app.post('/budget', async (req, res) => {
  const { totalDollars, categoriesAmount, budgetLength, userID } = req.body;
  try{
    const budgetID = await createBudget(totalDollars, categoriesAmount, budgetLength, userID);
    if (!budgetID) {
      return res.status(401).json({ message: "Budget data invalid." });
    }
    res.json({ message: "Budget created successfully!", budgetID });
  }
 catch (err) {
    console.error(err);
    res.status(500).json({ message: "Budget creation failed." });
  }
});
app.post('/category', async (req, res) => {
  const { categoryData, budgetID } = req.body;
  try{
    await createCategories(budgetID, categoryData);
    if (!categoryData) {
      return res.status(401).json({ message: "Category data invalid." });
    }
    res.json({ message: "Category created successfully!", categoryData });
  }
 catch (err) {
    console.error(err);
    res.status(500).json({ message: "Category creation failed." });
  }
});
app.get('/categories', async (req, res) => {
  try {
    //console.log(await getCategories());
    res.json(await getCategories());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
});
app.post('/transaction', async (req, res) => {
  const { transactionAmount, transactionName, category } = req.body;
  try{
    const transaction = await createTransaction(transactionAmount, transactionName, category);
    if(!transaction) {
      return res.status(400).json({ message: "Invalid transaction." });
    }
    res.json({ message: "Transaction successful!", transaction });
  }
  catch(err)
  {
    console.error("Transaction error: " + err);
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});