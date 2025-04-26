import mysql from "mysql2"

const db = mysql.createPool({
    host: '127.0.0.1', 
    user: 'root',
    password: 'Austin05?!',
    database: 'proj'
  }).promise()

//   const result = await db.query("SELECT * FROM users")
//     console.log(result)

async function getUsers() {
    const [rows] = await db.query("SELECT * FROM users")
    return rows
}
async function getUserById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id])
    return rows[0]
}
async function createUser(User_Name, User_Password, Email, Phone_number) {
    const User_ID = Math.floor(Math.random() * 1000000) // Generate a random user ID
    // Check if the user ID already exists in the database
    const [existingUser] = await db.query("SELECT * FROM users WHERE User_ID = ?", [User_ID])
    if (existingUser.length > 0) {
        // If the user ID already exists, generate a new one and check again
        return createUser(User_Name, User_Password, Email, Phone_number)
    }
    const [result] = await db.query("INSERT INTO users (User_ID, User_Name, User_Password, Email, Phone_number) VALUES (?, ?, ?, ?, ?)",
         [User_ID, User_Name, User_Password, Email, Phone_number])
    return result.insertId
}
// const result = await createUser("Austin", "Donut", "austinjaxbch@gmail.com", "(904)-234-0645")
export { createUser };