import express from 'express';
//const mysql = require('mysql2');
import cors from 'cors';
// import bodyParser from 'body-parser';
// import path from 'path';
import { createUser } from './database.js'; // Import the createUser function from database.js
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// ✅ MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Austin05?!',
//   database: 'proj'
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log('✅ Connected to MySQL database!');
// });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'register.html'));
// });

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

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});