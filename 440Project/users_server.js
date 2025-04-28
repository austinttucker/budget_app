import express from 'express';
import cors from 'cors';
import { createUser, getUser } from './database.js'; // Import the createUser function from database.js
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
  const { userName, password } = req.body;
  try{
    const userID = await getUser(userName, password);
    if (!userID) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    res.json({ message: "Login successful!", userID });
  }
 catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed." });
  }
});
app.post('/transaction', async (req, res) => {
  const { transactionCost, transactionName, TransactionCategory } = req.body;
  try{
    const transaction = getTransaction(transactionCost, transactionName, TransactionCategory);
    if(!transaction) {
      return res.status(400).json({ message: "Invalid transaction." });
    }
    res.json({ message: "Transaction successful!", transaction });
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({ message: "Transaction failed." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});