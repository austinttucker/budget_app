import express from 'express';
import cors from 'cors';
import { createUser, getUser, createBudget, createCategories, getCategories, createTransaction, refreshBudget, getBudget, deleteCategories, changeBudgetCap } from './database.js'; // Import the createUser function from database.js
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ✅ Register route
app.post('/register', async (req, res) => {
  const { User_ID, userName, password, email, phoneNumber, confirmPassword } = req.body;

  try{
    const userID = await createUser(User_ID, userName, password, email, phoneNumber);
    res.json({ message: "Registration successful!", userID });
  }
 catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed." });
  }
});
app.post('/login', async (req, res) => {
  const { userID, userName, password } = req.body;
  try{
    const user_ID = await getUser(userID, userName, password);
    if(user_ID === "P" || user_ID === "U"){
      return res.status(401).json({ message: "Invalid credentials." });
    }
    if(user_ID){
      await refreshBudget(userID);
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
app.get('/budget', async (req, res) => { 
  const userID = req.query.userID;
  try {
    const Budget = await getBudget(userID);
    res.json({ message: "Budget fetched successfully!", Budget});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch budget." });
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
  const budgetID = req.query.budgetID;
  try {
    res.json(await getCategories(budgetID));
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
app.delete('/deletecategories', async (req, res) => {
  const { categoryIDs } = req.body;
  try {
    await deleteCategories(categoryIDs);
    res.json({ message: "Category deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete category." });
  }
});
app.post('/budgetcap', async (req, res) => {
  const { User_ID, budgetCap } = req.body;
  try {
    await changeBudgetCap(User_ID, budgetCap);
    res.json({ message: "Budget cap changed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to change budget cap." });
  }
});
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});