const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Austin05?!',
  database: 'proj'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL database!');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// ✅ Register route
app.post('/register', (req, res) => {
  const { userID, password, email, phoneNumber, confirmPassword } = req.body;

  if (password !== req.body["confirmPassword"]) {
    return res.send("Passwords do not match.");
  }

  const query = `
    INSERT INTO users (User_ID, User_password, Email, Phone_number)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [userID, password, email, phoneNumber], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Registration failed' });
    }
    res.json({ message: 'User registered successfully!' });
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});